const db = require("../connection");

exports.fetchComments = (reviewId) => {
   let sqlQuery = `
      SELECT *
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC;
      `;
    return db.query(sqlQuery, [reviewId]).then((response) => {
    
      return response.rows;
  });
}