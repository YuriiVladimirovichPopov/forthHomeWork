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
const supertest_1 = __importDefault(require("supertest"));
const settings_1 = require("../src/settings");
const input_validation_middleware_1 = require("../src/middlewares/input-validation-middleware");
const send_status_1 = require("../src/routers/send-status");
const crypto_1 = require("crypto");
const getRequest = () => {
    return (0, supertest_1.default)(settings_1.app);
};
describe('tests for /posts', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .delete('/all-data')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        input_validation_middleware_1.authorizationValidation;
    }));
    it("should return 200 and post", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .get('/blogs')
            .expect(send_status_1.sendStatus.OK_200);
    }));
    it("should return 404 for not existing post", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .get('/posts/9999999')
            .expect(send_status_1.sendStatus.NOT_FOUND_404);
    }));
    it("shouldn't create a new post with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            id: '',
            title: '',
            shortDescription: '',
            content: '',
            blogId: '',
            blogName: '',
            createdAt: ''
        };
        yield getRequest()
            .post('/posts')
            .send(data)
            .expect(send_status_1.sendStatus.UNAUTHORIZED_401);
    }));
    it("should create a new post with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const blog = {
            id: (0, crypto_1.randomUUID)(),
            name: 'Ananasia',
            description: 'blablabla1',
            websiteUrl: 'it-incubator.com',
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const createResponse = yield getRequest()
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(blog)
            .expect(send_status_1.sendStatus.CREATED_201);
        const data = {
            id: '34456',
            title: 'new blog',
            shortDescription: 'blabla',
            content: 'i love you',
            blogId: createResponse.body.id,
            blogName: 'Ananasia',
            createdAt: '30.06.14',
        };
        yield getRequest()
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(data)
            .expect(send_status_1.sendStatus.CREATED_201);
    }));
});
