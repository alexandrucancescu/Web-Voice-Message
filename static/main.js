new Vue({
    el:"#app",
    data:{
        message: "Record message",
        canRecord: false,
        isRecording: false,
        hasRecording: false,
        recMessage: "",
        recStartTime: 0,
        recTimeInterval: 0,
        recorder: null,
        recording: {
            buffer: null,
            blob: null,
        },
        isSending:false,
    },
    methods:{
        updateInterval(){
            this.recMessage = this.recTimeFormatted();
        },

        toggleRecording(){
            if(this.isSending){
                return;
            }
            if(this.isRecording){
                this.endRecording();
            }else{
                this.startRecording();
            }
        },

        async startRecording(){
            this.recorder = new MicRecorder({
                bitRate: 128
            });

            try{
                await this.recorder.start();
            }catch (e) {
                console.error(e);
                this.message="Error on recording";
                return;
            }

            this.recStartTime = Date.now();
            this.isRecording = true;
            this.message = "Recording";
            this.recMessage = this.recTimeFormatted();
            this.recTimeInterval = setInterval(this.updateInterval.bind(this),1000);
        },
        async endRecording(){

            try{
                const recResult = await this.recorder.stop().getMp3();
                this.recording.buffer = recResult[0];
                this.recording.blob = recResult[1];

                this.recMessage = `Recording done ${this.recTimeFormatted()}`;
                this.message = "Recording done";

                this.hasRecording = true;
            }catch (e) {
                this.recMessage = "";
                this.message = "Error on recording"
            }finally {
                this.isRecording = false;
                clearInterval(this.recTimeInterval);
            }

        },
        async sendRecording(){
            this.message = "Sending recording....";
            this.isSending=true;

            try{
                await sendRecording(this.recording.blob);
                this.message="Recording sent successfully! ✅";
                this.reset();
            }catch (e) {
                console.error(e);
                this.message="Could not send recording!";
            }finally {
                this.isSending=false;
            }

        },

        reset(){
            this.isRecording = false;
            this.isSending = false;
            this.hasRecording = false;
            this.recorder = null;
            this.recording.blob = null;
            this.recording.buffer = null;
            this.recMessage = "";
            // this.message = "Record a message";
        },
        cancel(){
            this.reset();
            this.message = "Record a message";
        },
        recTimeFormatted(){
            const time = Date.now() - this.recStartTime;
            return `${Math.floor(time/60000)}m ${Math.floor((time%60000)/1000)}s`;
        },
    },
    computed:{

    },
    async mounted(){
        this.canRecord = await hasMicrophonePermission();
    }
});

async function hasMicrophonePermission(){
    try{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true, video:false});
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
        return true;
    }catch (e) {
        console.error(e);
        return false;
    }
}

async function sendRecording(blob){
    const formData = new FormData();

    formData.append("recording",blob);

    const request = new XMLHttpRequest();

    request.open("POST","/audio-message");

    return new Promise((res,rej)=>{
       request.onload = function(){
           console.log("onload",...arguments);
           res();
       }

        request.onerror = function(){
            console.log("onerror",...arguments);
            rej();
        }

        request.send(formData);
    });
}