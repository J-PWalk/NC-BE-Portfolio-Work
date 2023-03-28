const db = require("../connection");

exports.fetchAllReviews = () => {
  return db
    .query(
      `SELECT 
        reviews.review_id, 
        owner, 
        title, 
        designer, 
        review_img_url, 
        category, 
        reviews.created_at, 
        reviews.votes, 
        COUNT(comments.comment_id) AS comment_count 
        FROM reviews LEFT JOIN comments 
        ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC; `
    )
    .then(({ rows }) => {
      return rows;
    });
};

