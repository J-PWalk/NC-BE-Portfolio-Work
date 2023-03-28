const { app } = require("../db/api/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { toBeSortedBy } = require("jest-sorted");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/invalid-endpoint", () => {
  it("404: when given an invalid enpoint respond with error message", () => {
    return request(app)
      .get("/api/incorrect-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Path");
      });
  });
});

describe("/api/categories", () => {
  describe("METHOD: GET", () => {
    it("GET 200: should respond with all categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toBeInstanceOf(Array);
          expect(body.categories.length).toBeGreaterThan(0);
          body.categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("METHOD: GET", () => {
    it("GET: 200 should respond with status 200 and array of reviews sorted by descending date", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          console.log(reviews);
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(testData.reviewData.length);
          expect(reviews).toBeSortedBy("created_at", { descending: true });

          reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              review_id: expect.any(Number),
              comment_count: expect.any(String),
            });
          });
        });
    });
  });
});
