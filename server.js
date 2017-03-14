var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('dotenv').config({
    silent: true
});

var searchHistorySchema = new Schema({
    term: String,
    when: String
});

var SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

mongoose.connect(process.env.MONGO_DB);

var routes = require('./app/routes.js');

var port = process.env.PORT || 8080;

routes(app, SearchHistory);

app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
})