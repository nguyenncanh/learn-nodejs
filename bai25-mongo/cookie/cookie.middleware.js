var count = 0;

module.exports.countCookie = function(req, res, next) {
  if (req.cookies === undefined) {
    res.cookie('id: ', '123');
  } else {
     if (count === 0) {
        console.log(req.cookies);
      } else {
        console.log('cookie:', count);
      }
      count+=1;
  }
  next();
}