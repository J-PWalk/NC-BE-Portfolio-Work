const { fetchAllReviews } = require("../Models/reviews.model")

exports.getReviews = (req,res, next) => {
    fetchAllReviews()
    .then((reviews)=>{
        res.status(200)
        .send({reviews:reviews})
    })
    .catch((err)=>{
        next(err)
    })
}
