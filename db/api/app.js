const express = require('express');
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('../Controllers/errors.controller');
const { getCategories } = require('../Controllers/category.controller')
const { getReview, getReviews, patchReview } = require('../Controllers/reviews.controller')
const { getComments, postComment, deleteComment } = require("../Controllers/comments.controller");
const {getUsers} = require("../Controllers/users.controller")
const cors = require('cors')


const app = express();

app.use(cors())
app.use(express.json());
//Categories
app.get('/api/categories', getCategories);
//Users
app.get('/api/users', getUsers);
//Reviews
app.get('/api/reviews/:reviewID',getReview)
app.get('/api/reviews', getReviews);
app.patch('/api/reviews/:reviewID',patchReview)
//Comments
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.delete('/api/comments/:comment_id', deleteComment);
//Errors
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid Path" });
});

module.exports = {app};