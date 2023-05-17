const db = require("../connection");

  exports.fetchUsers = () => {
    let sqlQuery = `
    SELECT *
    FROM users;
    `;
    return db.query(sqlQuery).then((response) => {
        return response.rows
    })
  }