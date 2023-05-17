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
    });
  });
});
describe('/api/reviews', () => {
  describe('GET', () => {
    it('should respond with all reviews by default', async () => {
      const response = await request(app).get('/api/reviews');
      expect(response.status).toBe(200);
      expect(response.body.reviews).toBeInstanceOf(Array);
      expect(response.body.reviews.length).toBeGreaterThan(0);
    });

    it('should respond with reviews filtered by category when category query is provided', async () => {
      const response = await request(app).get('/api/reviews?category=hidden-roles');
      expect(response.status).toBe(200);
      expect(response.body.reviews).toBeInstanceOf(Array);
      response.body.reviews.forEach((review) => {
        expect(review.category).toBe('hidden-roles');
      });
    });

    it('should respond with reviews sorted by a valid column when sort_by query is provided', async () => {
      const response = await request(app).get('/api/reviews?sort_by=votes');
      expect(response.status).toBe(200);
      expect(response.body.reviews).toBeInstanceOf(Array);
      let prevVotes = Infinity;
      response.body.reviews.forEach((review) => {
        expect(review.votes).toBeLessThanOrEqual(prevVotes);
        prevVotes = review.votes;
      });
    });

    it('should respond with reviews sorted in ascending order when order=asc query is provided', async () => {
      const response = await request(app).get('/api/reviews?order=asc');
      expect(response.status).toBe(200);
      expect(response.body.reviews).toBeInstanceOf(Array);
      response.body.reviews.forEach((review) => {
        expect(new Date(review.created_at).getTime()).toBeGreaterThanOrEqual(0);
      });
    });
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
          });
          expect(comment.review_id).toBe(3);
        });
      });
  });
});
it("GET:400 should send an appropriate error message when given an invalid id'", () => {
  return request(app)
    .get("/api/reviews/notvalid/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid Input");
    });
});
it("GET 404: should when given id with no value responds with message 'no review found'", () => {
  return request(app)
    .get("/api/reviews/999/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No review found");
    });
});
it("should return a status 200 and empty comments array for a valid Review ID with no comments", () => {
  return request(app)
    .get("/api/reviews/1/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toEqual([]);
    });
});

describe("METHOD: POST", () => {
  it(".postComment should post a comment with status 201", () => {
    const commentPost = {
      username: "mallionaire",
      body: "please work",
    };
    return request(app)
      .post("/api/reviews/8/comments")
      .send(commentPost)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "mallionaire",
          body: "please work",
          review_id: 8,
        });
      });
  });
  it("POST 400: invalid review_id error", () => {
    const commentObj = {
      username: "Haz",
      body: "oops not valid input",
    };
    return request(app)
      .post("/api/reviews/invalid_input/comments")
      .send(commentObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "Invalid Input",
        });
      });
  });
  it("POST 400 should respond with a 400 bad request for missing required comment properties", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({ username: "Haz" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incomplete body");
      });
  });
  it("POST 404 should respond with 404 status message for an Invalid User", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({ username: "Jp", body: "do i exist" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid username");
      });
  });
  it("POST 201 with extra properties should ignore extra properties and post to valid endpoints", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({
        username: "dav3rid",
        body: "nice lunch!",
        slogan: "hooray for food!",
      })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.comment_id).toBe(7);
        expect(comment.review_id).toBe(5);
        expect(comment.author).toBe("dav3rid");
        expect(comment.body).toBe("nice lunch!");
      });
  });
});
describe("PATCH", () => {
  it("PATCH 200: should respond with updated review after votes +1", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: expect.any(String),
          votes: 6,
        });
      });
  });
  it("PATCH 200: should respond with updated review after votes -1", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          title: "Dolor reprehenderit",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
          review_body: expect.any(String),
          category: "social deduction",
          created_at: expect.any(String),
          votes: 6,
        });
      });
  });
  it("PATCH 200: should e proprties and return status 200 with an updated review", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 4, publication: "Wibbly Wobbly magazine" })
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: expect.any(String),
          votes: 9,
        });
      });
  });
  it("PATCH 400: if no votes given respond with error message ", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ NotAVote: 0 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No votes found");
      });
  });
  it("PATCH 400: if inc_votes uses invalid input from user respond with error message", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  it("PATCH 400: should responds with revlevant error message when incorrect path input for review id endpoint", () => {
    return request(app)
      .patch("/api/reviews/not_an_id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  it("PATCH 404: shouod respond with custom error message when correct format used but no review found", () => {
    return request(app)
      .patch("/api/reviews/0")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review found with this ID");
      });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("METHOD: DELETE", () => {
    it("DELETE 204: should delete a comment by id and respond with status 204", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("DELETE 404: should respond with status 404 when trying to delete a non-existing comment", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment does not exist");
        });
    });
    it("DELETE 400: should respond with status 400 when given a non-numeric comment id", () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Input");
        });
    });
  });
});
describe("/api/users", () => {
  describe("METHOD: GET", () => {
    it("GET 200: should respond with all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users.length).toBeGreaterThan(0);
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });

    it("404: when given an invalid endpoint respond with error message", () => {
      return request(app)
        .get("/api/incorrect-path")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid Path");
        });
    });
  });
});
