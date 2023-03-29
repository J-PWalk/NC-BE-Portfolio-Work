const express = require('express');
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('../Controllers/errors.controller');
const { getCategories } = require('../Controllers/category.controller')
const { getReview } = require('../Controllers/reviews.controller')
const { getReviews } = require('../Controllers/reviews.controller');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews/:reviewID',getReview)
app.get('/api/reviews', getReviews);


app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);



app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid Path" });
});



module.exports = {app};