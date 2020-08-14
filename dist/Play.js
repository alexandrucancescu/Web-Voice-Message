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
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
class Play {
    constructor(audioFile) {
        this.audioFile = audioFile;
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield fs_extra_1.pathExists(this.audioFile))) {
                throw new Error(`File ${this.audioFile} does not exists`);
            }
            return new Promise((resolve, reject) => {
                this.child_process = child_process_1.execFile("ffplay", ["-autoexit", "-nodisp", this.audioFile]);
                this.child_process.on("error", err => {
                    reject(err);
                });
                this.child_process.on("exit", (code, signal) => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`Exit code of ffplay ${code}, signal ${signal}`));
                    }
                });
            });
        });
    }
}
exports.default = Play;
//# sourceMappingURL=Play.js.map