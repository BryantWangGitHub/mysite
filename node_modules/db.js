var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection; 9 var Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_ PORT, {}));
