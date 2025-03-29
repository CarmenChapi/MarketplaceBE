const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("Project Marketplace Test Suite", () => {
  describe("Test Users", () => {
    test("200 get all  users", () => {
      return request(app)
      .get("/api/users")
      .expect(200)
      .then((data) => {
        console.log(data.body)
        expect(Array.isArray(data.body.users)).toBe(true);
        expect(data.body.users.length === 6).toBe(true);
        data.body.users.forEach((user) => {
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("email");
        });
      });
    })})})