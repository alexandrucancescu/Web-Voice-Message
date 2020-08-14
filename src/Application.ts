import * as express from "express"
import {createServer} from "http"
import * as path from "path";
import * as multer from "multer";
import Play from "./Play";
import {unlink, emptyDirSync, ensureDirSync} from "fs-extra";

const TEMP_DIR = path.join(__dirname,"../temp");

emptyDirSync(TEMP_DIR);
ensureDirSync(TEMP_DIR);

const app = express();
const upload = multer({
	storage: multer.diskStorage({
		destination: TEMP_DIR,
		filename: (ignoredReq, ignoredFile, callback)=>{
			callback(null,`${Math.ceil(Math.random()*10000)}_${Date.now()}.mp3`);
		}
	}),
	limits: {
		fileSize:200*1000*1000
	}
});

app.use((req,res,next)=>{
	console.log(`${req.method} ${req.path}`);
	next();
});

app.get("/",(req,res,ignored_next)=>{
	res.sendFile(path.join(__dirname,"../index.html"));
});

app.post("/audio-message",(req,res,next)=>{
	upload.single("recording")(req,res,async err=>{
		if(err){
			console.error("Upload error",err);
			res.status(500).json({ok:false,error:err});
		}else{
			console.log("Upload success");
			console.log(req.file);
			res.status(200).json({ok:true});



			console.log("File",req.file);
			try{
				const playback = new Play(req.file.path);
				await playback.play();
			}catch (e) {
				console.error("Error at playback")
			}finally {
				unlink(req.file.path).catch(e=>console.error(e));
			}
		}
	});
});

app.use(express.static(path.join(__dirname,"../static")));

const server = createServer(app);

const PORT = 3000;

server.listen(PORT)
	.on("error",console.error)
	.on("listening",()=>console.log("Listening on",PORT));