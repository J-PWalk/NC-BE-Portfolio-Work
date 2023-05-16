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
