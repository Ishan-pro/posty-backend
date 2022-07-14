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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = new express_1.Router();
app.get('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Allposts = yield prisma.post.findMany();
    res.send(Allposts);
}));
app.post('/byuser/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    console.log(req.user.username);
    if (username) {
        const userposts = yield prisma.post.findMany({
            where: {
                authorname: username
            }
        });
        res.send(userposts);
    }
    else {
        res.status(404).send("Invalid Request");
    }
}));
app.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    if (req.user && content) {
        const post = yield prisma.post.create({
            data: {
                content,
                authorname: req.user.username
            }
        });
        res.send(post);
    }
    else {
        res.status(404).send('Invalid Request');
    }
}));
app.delete('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postid } = req.body;
    if (postid && req.user) {
        yield prisma.post.delete({
            where: {
                id: postid,
                authorname: req.user.username
            }
        });
        res.send("Deleted");
    }
    else {
        res.status(404).send("invalid request");
    }
}));
exports.default = app;
