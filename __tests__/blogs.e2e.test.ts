import {Request} from "supertest"
import { app  } from "../src"
import { request } from "express"

describe("Request, Response", () => {
    it("should return 200 and empty array", async () => {
         await request(app)
            .get('/blogs')
            .expect(200, [])
    })
})
        
