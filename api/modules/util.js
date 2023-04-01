// if the user is authenticated
const util = {

	passwordSecret: 'd3^2hSdf23^%$s4sh@$!ad3',

	isAuthenticated: function (req, res, next) {
		//console.log(req.user.userID);  
		//console.log(req.isAuthenticated());
		if (req.isAuthenticated())
	    	return next();
		res.sendStatus(401);
		//res.redirect("#!login");
	},

	isAuthenticatedAdmin: function (req, res, next) {
		if (req.isAuthenticated() && (req.user.type === 'Admin'))
	    	return next();
		res.sendStatus(401);
	},

	isAuthenticatedAPI: function (req, res, next) {
		//console.log(req);  
		if (req.isAuthenticated())
	    	return next();
		res.sendStatus(401);
	},

	spoofAuthenticated: function (req, res, next) {
		  return next();
  	},

	spoofNotAuthenticated: function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.sendStatus(401);
	},

}

module.exports = util;