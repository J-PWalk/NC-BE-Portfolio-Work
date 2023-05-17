const { fetchReview, fetchAllReviews, updateReview } = require("../Models/reviews.model")




exports.getReview = (req ,res, next) => {
    const {reviewID} = req.params
    fetchReview(reviewID).then((review)=>{
        res.status(200).send({review})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  fetchAllReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { reviewID } = req.params;
  const newVotes = req.body.inc_votes;
  updateReview(reviewID, newVotes)
    .then(([review]) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
