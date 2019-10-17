// security middleware.js

const jwt = require('jsonwebtoken');
const keys = require('../config/authKeys');

const withAuth = function(req, res, next) {
  //checking the token in all the possible ways, we can accept it
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'] || 
    (req.cookies && req.cookies.token);
    
  if (!token) {
    //token isn't provided in the request in any of the above forms
    res.status(401).send('Unauthorized: No access token found');
  } else {

    jwt.verify(token, keys.sessionSecret, function(err, decoded) {
      if (err) {
        //something went wrong with the token, or maybe someone trying to hack it or it's already expired
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        //set the variables in the request pipeline which will be used later to fetch respective data
        req.userEmail = decoded.email;
        req.userId=decoded.id;
        req.userType= decoded.type;
        req.PersonRole = decoded.PersonRole;

        next();
      }
    });
  }
}
module.exports = withAuth;