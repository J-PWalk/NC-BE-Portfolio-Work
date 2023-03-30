const db = require("../connection");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchComments(review_id)
    .then((comments) => {
      console.log(comments)
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};