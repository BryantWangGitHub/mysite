
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var settings = require('./settings');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//var MongoStore = require('connect-mongo');
var MongoStore =  require('connect-mongo')(express);;
var sessionStore = new MongoStore({
    db : settings.db
}, function() {
    console.log('connect mongodb success...');
});
var partials = require('express-partials' );

var app = express();

var flash = require('connect-flash');
app.use(flash());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './temp' }));
// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
            secret: settings.cookieSecret,
            store: new MongoStore({
                          db: settings.db
                        })
}));
app.use(function (req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
});


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
routes(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
