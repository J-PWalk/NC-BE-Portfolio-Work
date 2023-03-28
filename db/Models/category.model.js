const db = require('../connection');

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories;`)
    .then((data)=> {
        return data.rows
    })
}

