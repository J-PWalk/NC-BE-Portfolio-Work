const { fetchReview } = require("../Models/reviews.model")


exports.getReview = (req ,res, next) => {
    const {reviewID} = req.params
    fetchReview(reviewID).then((review)=>{
        res.status(200).send({review})
    })
    .catch((err)=>{
        next(err)
    })
}