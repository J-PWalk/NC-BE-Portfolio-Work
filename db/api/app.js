const express = require('express');
const { handleCustomErrors, handlePSQLErrors } = require('../Controllers/errors.controller');
const { getCategories } = require('../Controllers/category.controller')
const { getReview } = require('../Controllers/reviews.controller')

const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews/:reviewID',getReview)


app.use(handleCustomErrors);
app.use(handlePSQLErrors);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid Path" });
});



module.exports = {app};