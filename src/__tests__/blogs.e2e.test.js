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
const blog_test_helpers_1 = require("./blog-test-helpers");
const db_1 = require("../src/db/db");
const routerPaths_1 = require("../src/routerPaths");
const getRequest = () => {
    return (0, supertest_1.default)(settings_1.app);
};
describe('tests for /blogs', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .delete('/testing/all-data');
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        input_validation_middleware_1.authorizationValidation;
    }));
    it("should return 200 and blog", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .get(routerPaths_1.RouterPaths.blogs)
            .expect(send_status_1.sendStatus.OK_200);
    }));
    it("should return 404 for not existing blog", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .get(`${routerPaths_1.RouterPaths.blogs}/9999999`)
            .expect(send_status_1.sendStatus.NOT_FOUND_404);
    }));
    it("shouldn't create a new blog without auth", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest().post(routerPaths_1.RouterPaths.blogs).send({}).expect(send_status_1.sendStatus.UNAUTHORIZED_401);
        yield getRequest().post(routerPaths_1.RouterPaths.blogs).auth('login', 'password').send({}).expect(send_status_1.sendStatus.UNAUTHORIZED_401);
    }));
    it("shouldn't create a new blog with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            id: '',
            name: '',
            description: '',
            websiteUrl: '',
            createdAt: '',
            isMembership: false
        };
        yield getRequest()
            .post(routerPaths_1.RouterPaths.blogs)
            .send(data)
            .expect(send_status_1.sendStatus.UNAUTHORIZED_401);
        yield getRequest()
            .get(routerPaths_1.RouterPaths.blogs)
            .expect(send_status_1.sendStatus.OK_200);
    }));
    let createdBlog1;
    it("should create a new blog with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const countOfBlogsBefore = yield db_1.blogsCollection.countDocuments();
        expect(countOfBlogsBefore).toBe(0);
        const inputModel = {
            name: 'new blog',
            description: 'blabla',
            websiteUrl: 'www.youtube.com',
        };
        const createResponse = yield (0, blog_test_helpers_1.createBlog)(inputModel);
        expect(createResponse.status).toBe(send_status_1.sendStatus.CREATED_201);
        const createdBlog = createResponse.body;
        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: inputModel.name,
            description: inputModel.description,
            websiteUrl: inputModel.websiteUrl,
            isMembership: false,
            createdAt: expect.any(String),
        });
        const countOfBlogsAfter = yield db_1.blogsCollection.countDocuments();
        expect(countOfBlogsAfter).toBe(1);
        const getByIdRes = yield getRequest().get(`${routerPaths_1.RouterPaths.blogs}/${createdBlog.id}`);
        expect(getByIdRes.status).toBe(send_status_1.sendStatus.OK_200);
        expect(getByIdRes.body).toEqual(createdBlog);
        createdBlog1 = createdBlog;
        expect.setState({ blog1: createdBlog });
    }));
    //let createdBlog2: BlogViewModel
    it("should create one more blog with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const inputModel = {
            name: 'new blog',
            description: 'blabla',
            websiteUrl: 'www.youtube.com',
        };
        const createResponse = yield (0, blog_test_helpers_1.createBlog)(inputModel);
        expect.setState({ blog2: createResponse.body });
    }));
    it("shouldn't update a new blog with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const { blog1 } = expect.getState();
        const emptyData = {
            name: '',
            description: '',
            websiteUrl: '',
        };
        const errors = {
            errorsMessages: expect.arrayContaining([
                { message: expect.any(String), field: 'name' },
                { message: expect.any(String), field: 'description' },
                { message: expect.any(String), field: 'websiteUrl' },
            ])
        };
        const updateRes1 = yield getRequest()
            .put(`${routerPaths_1.RouterPaths.blogs}/${blog1.id}`)
            .auth('admin', 'qwerty')
            .send({});
        expect(updateRes1.status).toBe(send_status_1.sendStatus.BAD_REQUEST_400);
        expect(updateRes1.body).toStrictEqual(errors);
        const updateRes2 = yield getRequest()
            .put(`${routerPaths_1.RouterPaths.blogs}/${blog1.id}`)
            .auth('admin', 'qwerty')
            .send(emptyData);
        expect(updateRes2.status).toBe(send_status_1.sendStatus.BAD_REQUEST_400);
        expect(updateRes2.body).toStrictEqual(errors);
    }));
    it("shouldn't update blog that not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            id: '34456',
            name: 'new blog',
            description: 'blabla',
            websiteUrl: 'www.youtube.com',
            createdAt: '30.06.2014',
            isMembership: false
        };
        yield getRequest()
            .put(`${routerPaths_1.RouterPaths.blogs}/${-234}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(send_status_1.sendStatus.NOT_FOUND_404);
    }));
    it("should update a new blog with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const { blog1 } = expect.getState();
        const inputModel = {
            name: 'updated blog',
            description: 'upd description',
            websiteUrl: 'updwww.youtube.com',
        };
        yield getRequest()
            .put(`${routerPaths_1.RouterPaths.blogs}/${blog1.id}`)
            .auth('admin', 'qwerty')
            .send(inputModel)
            .expect(send_status_1.sendStatus.NO_CONTENT_204);
        const updatedBlog = yield getRequest().get(`${routerPaths_1.RouterPaths.blogs}/${blog1.id}`);
        expect(updatedBlog.status).toBe(send_status_1.sendStatus.OK_200);
        expect(updatedBlog.body).not.toBe(blog1);
        expect(updatedBlog.body).toEqual({
            id: blog1.id,
            name: inputModel.name,
            description: inputModel.description,
            websiteUrl: inputModel.websiteUrl,
            isMembership: blog1.isMembership,
            createdAt: blog1.createdAt,
        });
    }));
    it("should delete both blogs", () => __awaiter(void 0, void 0, void 0, function* () {
        const { blog1, blog2 } = expect.getState();
        yield getRequest()
            .delete(`${routerPaths_1.RouterPaths.blogs}/${blog1.id}`)
            .auth('admin', 'qwerty')
            .expect(send_status_1.sendStatus.NO_CONTENT_204);
        yield getRequest()
            .get(`${routerPaths_1.RouterPaths.blogs}/${blog1.id}`)
            .expect(send_status_1.sendStatus.NOT_FOUND_404);
        yield getRequest()
            .delete(`${routerPaths_1.RouterPaths.blogs}/${blog2.id}`)
            .auth('admin', 'qwerty')
            .expect(send_status_1.sendStatus.NO_CONTENT_204);
        yield getRequest()
            .get(`${routerPaths_1.RouterPaths.blogs}/${blog2.id}`)
            .expect(send_status_1.sendStatus.NOT_FOUND_404);
        yield getRequest()
            .get(routerPaths_1.RouterPaths.blogs)
            .expect(send_status_1.sendStatus.OK_200, []);
    }));
});
