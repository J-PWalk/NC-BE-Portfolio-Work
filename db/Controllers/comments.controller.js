const db = require("../connection");
const { fetchComments } = require("../Models/comments.model");
const { fetchComment } = require("../Models/comments.model");
const { fetchReview } = require("../Models/reviews.model");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  return fetchReview(review_id)
    .then(() => {
      return fetchComments(review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    }).catch((err) => {
      next(err)
    })
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req
  fetchComment(review_id, body).then(([comment])=>{
    res.status(201).send({comment})
  }).catch((err)=>{
    next(err)
  })
}

const { removeCommentById } = require("../Models/comments.model");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

