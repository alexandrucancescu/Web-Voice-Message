"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const path = require("path");
const multer = require("multer");
const Play_1 = require("./Play");
const fs_extra_1 = require("fs-extra");
const TEMP_DIR = path.join(__dirname, "../temp");
fs_extra_1.emptyDirSync(TEMP_DIR);
fs_extra_1.ensureDirSync(TEMP_DIR);
const app = express();
const upload = multer({
    storage: multer.diskStorage({
        destination: TEMP_DIR,
        filename: (ignoredReq, ignoredFile, callback) => {
            callback(null, `${Math.ceil(Math.random() * 10000)}_${Date.now()}.mp3`);
        }
    }),
    limits: {
        fileSize: 200 * 1000 * 1000
    }
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.get("/", (req, res, ignored_next) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});
app.post("/audio-message", (req, res, next) => {
    upload.single("recording")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error("Upload error", err);
            res.status(500).json({ ok: false, error: err });
        }
        else {
            console.log("Upload success");
            console.log(req.file);
            res.status(200).json({ ok: true });
            console.log("File", req.file);
            try {
                const playback = new Play_1.default(req.file.path);
                yield playback.play();
            }
            catch (e) {
                console.error("Error at playback");
            }
            finally {
                fs_extra_1.unlink(req.file.path).catch(e => console.error(e));
            }
        }
    }));
});
app.use(express.static(path.join(__dirname, "../static")));
const server = http_1.createServer(app);
const PORT = 3000;
server.listen(PORT)
    .on("error", console.error)
    .on("listening", () => console.log("Listening on", PORT));
//# sourceMappingURL=Application.js.map