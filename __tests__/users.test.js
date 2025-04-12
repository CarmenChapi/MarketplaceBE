const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("Project Marketplace Test Suite : Users", () => {
  describe("Test Users GET", () => {
    test("200 : /api/users -> Get all users", () => {
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
    })

    test("200 : /api/users/:user_id -> Get an user by id provided", () => {
      return request(app)
      .get("/api/users/1")
      .expect(200)
      .then((data) => {
        console.log(data.body.user)
        expect(data.body.user.id === 1).toBe(true);
        expect(data.body.user.email === "maria@gmail.com").toBe(true);
        expect(data.body.user.name === "M Smith").toBe(true);
   
      });
    })
    test("201 : /api/users/register -> Add a new user row in users", () => {
      return request(app)
      .post("/api/users/register")
      .send({email : "janice@gmail.com",
        name: "Janice Colleman",
        password_hash: "123456",
        image_url: "https://images.unsplash.com/photo-1741732311526-093a69d005d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
      })
      .expect(201)
      .then((data) => {
        console.log(data.body.user)
        expect(data.body.user.email === "janice@gmail.com").toBe(true);
        expect(data.body.user.name === "Janice Colleman").toBe(true);
      });
    })
  
  })})