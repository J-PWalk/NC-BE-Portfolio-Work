const express = require('express');
const { getCategories } = require('../Controllers/category.controller')

const app = express();

app.get('/api/categories', getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid Path" });
});

module.exports = app;


module.exports = {app};