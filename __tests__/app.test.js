const { app } = require("../db/api/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { toBeSortedBy } = require("jest-sorted");

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
          expect(body.categories.length).toBeGreaterThan(0);
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
  });
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
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
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
    })
  });
});

describe("/api/reviews/:review_id/comments", () => {
  it("GET 200: should respond with array of comments for review_id requetsed", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(body.comments.length).toBe(3);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          })
        })
      });
    });
   })
   it("GET:400 should send an appropriate error message when given an invalid id'", () => {
    return request(app)
      .get("/api/reviews/not_a_num/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  it("GET 404: should when given id with no value responds with message 'no comments found'", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comments found");
      });
  });
//   it('should return a status 200 and empty comments array for a valid Review ID with no comments', () => {
//     return request(app)
//     .get('/api/reviews/8/comments')
//     .expect(200)
//     .then(({body})=>{
//       console.log(body.comments)
//       expect(body.comments).toEqual([])
//     })
// });
