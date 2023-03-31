const db = require("../connection");
const { fetchComments } = require("../Models/comments.model");
const { fetchComment } = require("../Models/comments.model");
const { fetchReview } = require("../Models/reviews.model");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  console.log

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
console.log("in controller")
console.log(body)
  fetchComment(review_id, body).then(([comment])=>{
    res.status(201).send({comment})
  }).catch((err)=>{
    next(err)
  })
}