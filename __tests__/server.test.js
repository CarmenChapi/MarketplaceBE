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
    })})})