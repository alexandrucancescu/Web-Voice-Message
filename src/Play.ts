import {ChildProcess, execFile} from "child_process"
import {pathExists} from "fs-extra"

export default class Play{
	private readonly audioFile:string;
	private child_process:ChildProcess;

	constructor(audioFile){
		this.audioFile=audioFile;
	}

	public async play(){
		if(!await pathExists(this.audioFile)){
			throw new Error(`File ${this.audioFile} does not exists`);
		}

		return new Promise<void>((resolve, reject) => {
			this.child_process=execFile("ffplay",["-autoexit","-nodisp",this.audioFile]);

			this.child_process.on("error",err=>{
				reject(err);
			})

			this.child_process.on("exit",(code,signal)=>{
				if(code===0){
					resolve();
				}else{
					reject(new Error(`Exit code of ffplay ${code}, signal ${signal}`));
				}
			})
		})

	}
}