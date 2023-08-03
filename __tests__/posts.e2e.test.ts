import request from "supertest";
import {app,} from "../src"

describe("Router", () => {
    beforeAll(async() => {
        await app.delete('/__tests__/allData')
    })
})

