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
};

exports.fetchComment = (review_id, commentObj) => {
  const params = [commentObj.username, commentObj.body, review_id]
  let sqlQuery = `INSERT INTO comments (author, body, review_id) VALUES ($1,$2,$3) RETURNING *;`
  return db.query(sqlQuery, params ).then(({rows})=>{
    console.log(rows)
    return rows 
  })
  }



