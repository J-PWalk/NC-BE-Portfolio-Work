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

exports.fetchAllReviews = () => {
  let queryString =  `
  SELECT 
  reviews.review_id, 
  owner, 
  title, 
  designer, 
  review_img_url, 
  category, 
  reviews.created_at, 
  reviews.votes, 
  COUNT(comments.comment_id) AS comment_count 
  FROM reviews 
  LEFT JOIN comments 
  ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id 
  ORDER BY reviews.created_at DESC`;

  return db
    .query(queryString)
    .then(({ rows }) => {
      return rows;
    });
};

