const db = require('../connection');

exports.removeCommentById = (comment_id) => {
  const queryString = `
    DELETE FROM comments 
    WHERE comment_id = $1
    RETURNING *;
  `;
  return db.query(queryString, [comment_id])
    .then(({ rows }) => {
      if(rows.length === 0){
        return Promise.reject({status:404, msg: 'Comment does not exist'})
      }
    });
};

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
    return rows 
  })
  }
