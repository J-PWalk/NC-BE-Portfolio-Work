const db = require("../connection");

exports.fetchReview = (review_id) => {
  let sqlQuery =
   `SELECT * FROM reviews WHERE review_id = $1;`
    ;

  return db.query(sqlQuery, [review_id]).then((review) => {
    if (!review.rows[0]) {
      return Promise.reject({
        status: 404,
        msg: "No review found",
      });
    }
    return review.rows[0];
  });
};

