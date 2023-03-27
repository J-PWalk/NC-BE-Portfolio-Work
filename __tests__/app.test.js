const {app} = require("../db/api/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/categories", () => {
  describe("METHOD: GET", () => {
    it("GET 200: should respond with all categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toBeInstanceOf(Array);
          body.categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    it("404: when given an invalid enpoint respond with error message", () => {
        return request(app)
          .get("/api/incorrect-path")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("Invalid Path");
          });
      });
    });
  });
