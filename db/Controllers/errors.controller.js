
  exports.handleCustomErrors = (err, req, res, next) => {
      if (err.status && err.msg) {
          res.status(err.status).send({ msg: err.msg });
        } else next(err);
  }
exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
      res.status(400).send({ msg: 'Invalid Input' });
    } else if (err.code === '23502' && err.column === 'votes'){
      res.status(400).send({msg: 'No votes found'})
    } else if (err.code === '23502') {
      res.status(400).send({msg: 'Incomplete body'})  
    } else if (err.code === '23503') {
      res.status(404).send({msg: 'Invalid username' })
    } else next(err);
}

exports.handleServerErrors = (err,req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: 'Server Error' });
}

