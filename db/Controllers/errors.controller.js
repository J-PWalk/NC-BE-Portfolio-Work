exports.handlePSQLErrors = (err, req, res, next) => {
  // console.log(err);
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid Input' });
      } else next(err);
}
exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err);
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
      } else next(err);
}


exports.handleServerErrors = (err,req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: 'Server Error' });
}