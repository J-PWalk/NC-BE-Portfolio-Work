const express = require('express');
const { getCategories } = require('../Controllers/category.controller')
const { getReviews } = require('../Controllers/reviews.controller');

const app = express();

app.get('/api/categories', getCategories);
app.get("/api/reviews", getReviews);



app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid Path" });
});

module.exports = app;


module.exports = {app};