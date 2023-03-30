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
          expect(body.categories.length).toBeGreaterThan(0)
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
  
describe("/api/reviews/:review_id", () => {
    describe("METHOD: GET", () => {
      it("should using ID send a single review to client", () => {
        return request(app)
          .get("/api/reviews/7")
          .expect(200)
          .then(({ body }) => {
            const { review } = body;
            expect(review).toMatchObject({
            review_id: 7,
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          });
          });
      });
    })
    describe("Errors for ReviewID", () => {
      it("GET:404 should send an appropriate error message when given an invalid integer id", () => {
        return request(app)
          .get("/api/reviews/1234567")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("No review found");
          });
      });
  
      it("GET:400 should send an appropriate error message when given an invalid id", () => {
        return request(app)
          .get("/api/reviews/not-a-review")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Input");
          });
      });
    })
  })
 