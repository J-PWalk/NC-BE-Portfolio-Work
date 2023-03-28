const db = require('../connection')

exports.fetchReview = (review_id) => {
    let sqlQuery = `
      SELECT reviews.*, COUNT(comment_id) AS comment_count
      FROM reviews LEFT JOIN comments
      ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;
    `;
  
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