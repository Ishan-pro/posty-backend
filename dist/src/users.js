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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authcheck = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = new express_1.Router();
app.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const Allusers = yield prisma.user.findMany();
    console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a.username);
    res.send(Allusers);
}));
app.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expiration = 60 * 60 * 24 * 7 * 1000 + Date.now();
    const userdata = req.body;
    try {
        const accesstoken = jsonwebtoken_1.default.sign({
            username: userdata.username,
            email: userdata.email,
        }, process.env.SECRET, {
            expiresIn: expiration,
        });
        const refreshtoken = jsonwebtoken_1.default.sign({
            username: userdata.username,
            email: userdata.email,
        }, process.env.SECRET);
        const user = yield prisma.user.create({
            data: Object.assign({ refreshtoken, accesstoken }, userdata),
            select: {
                username: true,
                email: true,
                refreshtoken: true,
                accesstoken: true
            }
        });
        res.send(user);
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Invalid Credentials");
    }
}));
app.post("/login/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (email && password) {
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (user && user.password === password) {
            const { username } = user;
            const expiration = 60 * 60 * 24 * 7 * 1000 + Date.now();
            const accesstoken = jsonwebtoken_1.default.sign({ username, email }, process.env.SECRET, {
                expiresIn: expiration,
            });
            const refreshtoken = jsonwebtoken_1.default.sign({ username, email }, process.env.SECRET);
            yield prisma.user.update({
                where: { username },
                data: { accesstoken, refreshtoken },
            });
            res.send({
                accesstoken,
                refreshtoken
            });
        }
        else {
            res.status(404).send("Credentials don't match");
        }
    }
    else {
        res.send("Bad Request");
    }
}));
function authcheck(req, res, next) {
    var _a;
    const authToken = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (authToken) {
        try {
            const { username, id } = jsonwebtoken_1.default.verify(authToken, process.env.SECRET);
            req.user = { username };
        }
        catch (err) {
            console.log(err);
        }
    }
    next();
}
exports.authcheck = authcheck;
exports.default = app;
