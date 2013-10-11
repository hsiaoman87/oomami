var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    server = http.createServer(app),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('connectionString', process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/my_database');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var db = mongoose.connect(app.get('connectionString'), { server: {
    auto_reconnect: true,
    socketOptions: { keepAlive: 1 }
}});

db.connection.on('error', function (err) {
    console.log("DB connection Error: "+err);
});
db.connection.on('open', function () {
    console.log("DB connected");
});
db.connection.on('close', function (str) {
    console.log("DB disconnected: "+str);
});

var categorySchema = new Schema({
    decisionPath: {
        type: String,
        required: true
    },
    images: [{ type: Schema.Types.ObjectId, ref: 'CategoryImage' }],
    yelpCategories: [{ type: Schema.Types.ObjectId, ref: 'YelpCategory' }]
});
var Category = mongoose.model('Category', categorySchema);

var categoryImageSchema = new Schema({
    imageLocation: {
        type: String,
        required: true
    }
});
var CategoryImage = mongoose.model('CategoryImage', categoryImageSchema);

var yelpCategorySchema = new Schema({
    yelpCategory: {
        type: String,
        required: true
    }
});
var YelpCategory = mongoose.model('YelpCategory', yelpCategorySchema);

// View start
app.get('/data', function (req, res, next) {
    Category.find().populate('images yelpCategories').exec(function (err, categories) {
        if (err) {
            next(err);
        }
        else {
            res.send(categories);   
        }
    });
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});