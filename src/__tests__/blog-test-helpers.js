"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = void 0;
const supertest_1 = __importDefault(require("supertest"));
const settings_1 = require("../src/settings");
const createBlog = (data) => {
    return (0, supertest_1.default)(settings_1.app)
        .post('/blogs')
        .auth('admin', 'qwerty')
        .send(data);
};
exports.createBlog = createBlog;
