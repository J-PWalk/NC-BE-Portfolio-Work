const db = require("../connection");

exports.fetchReview = (review_id) => {
  let sqlQuery = `SELECT * FROM reviews WHERE review_id = $1;`;
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


exports.fetchAllReviews = (sort_by = 'created_at', order = 'desc', category) => {
  // Define the valid columns for sorting
  const validColumns = ['review_id', 'title', 'category', 'created_at', 'votes'];
  
  // Define valid orders
  const validOrder = ['asc', 'desc'];

  // Check if provided sort_by column is valid
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
  }

  // Check if provided order is valid
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order' });
  }

  let queryString = `
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
  ON comments.review_id = reviews.review_id `;

  const queryParams = [];

  if (category) {
    queryParams.push(category);
    queryString += `WHERE category = $${queryParams.length} `;
  }

  queryString += `GROUP BY reviews.review_id 
  ORDER BY ${sort_by} ${order}`;

  return db.query(queryString, queryParams).then(({ rows }) => {
    return rows;
  });
};


exports.updateReview = (review_id, votes) => {
  return db
    .query(
      `UPDATE reviews SET votes = CASE 
      WHEN votes + $1 < 0 
      THEN 0 
      ELSE votes + $1 
      END WHERE review_id = $2 
      RETURNING*;`,
      [votes, review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No review found with this ID" });
      }
      return rows;
    });
};
