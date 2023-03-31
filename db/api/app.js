const express = require('express');
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('../Controllers/errors.controller');
const { getCategories } = require('../Controllers/category.controller')
const { getReview } = require('../Controllers/reviews.controller')
const { getReviews } = require('../Controllers/reviews.controller');
const { getComments, postComment } = require("../Controllers/comments.controller");


const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews/:reviewID',getReview)
app.get('/api/reviews', getReviews);

app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);


app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);



app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid Path" });
});



module.exports = {app};