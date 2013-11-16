var path = require('path');
var express = require('express');
var app = express();
var http = require('http');

var _aws = require('./_aws');


var config = require('./_config')();



var aws = require("aws-lib");

var Facebook = require('facebook-node-sdk');

prodAdv = aws.createProdAdvClient(
    config.amazon.access_key_id,
    config.amazon.secret_access_key,
    config.amazon.assoc_tag
);


/*process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
    //res.end(JSON.stringify(err));
});*/



app.configure(function () {
    app.set('port', config.port);
    app.set('views', __dirname + '/public/js/view');
    app.set('view engine', 'hjs');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'foo bar' }));

    app.use(Facebook.middleware(config.facebook));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.errorHandler());
});

app.get('/', function(req, res){

    req.facebook.getUser(function(err, user) {
        console.log(user);
        if(user != 0){
            res.redirect(302, '/start');
        }
        config.partials.main = 'landing';
        return res.render(
            'index',
            {
                partials: config.partials
            }
        );
    });
});
app.get('/start', Facebook.loginRequired({ scope: 'friends_likes, friends_interests' /*, email' */ }), function (req, res) {
    req.facebook.api('/me/friends', function(err, data) {
        config.partials.main = 'friend_board';
        return res.render(
            'index',
            {
                friends: data.data,
                friends_json: JSON.stringify(data),
                partials: config.partials
            }
        );


    });
});


app.get('/suggest', Facebook.loginRequired({ scope: 'friends_likes, friends_interests' /*, email' */ }), function (req, res) {
    if(!req.query.fbuid){
        res.end({ 'error':'missing query parameter of "fbuid"'});
    }
    _aws.suggestByFriend(req, req.query.fbuid, function(data){
        res.end(JSON.stringify(data));
    });
});
app.get('/friend/:fbuid', Facebook.loginRequired({ scope: 'friends_likes, friends_interests' /*, email' */ }), function (req, res) {
    console.log(req.params);
    if(!req.params.fbuid){
        res.end({ 'error':'missing query parameter of "fbuid"'});
    }
    var fbuid = req.params.fbuid;
    _aws.suggestByFriend(req, fbuid, function(data){
        config.partials.main = 'product_board';
        return res.render(
            'index',
            {
                friend:{
                    id:fbuid
                },
                products: data,
                product_json: JSON.stringify(data),
                partials: config.partials,
                req:req,
                config:config
            }
        );
    },function(){
        config.partials.main = 'error';
        return res.render(
            'index',
            {
                partials: config.partials
            }
        );
    });
});

app.get('/search', function(req, res){

    if(!(req.query.search && req.query.cat)){
        res.end(JSON.stringify({
            'error':'invalid search parameters'
        }));

    }
    var objSearch = {
        ResponseGroup:'Images,ItemAttributes',
        SearchIndex: req.query.cat,//"Books",
        Keywords: req.query.search//"Javascript"
    }

    prodAdv.call("ItemSearch", objSearch, function(err, result) {
        if(err){
            //console.log(err);
            res.end(JSON.stringify(err));
        }else{
            var arrReturn  =[];
            if(result.Items.Item){
                for(var i in result.Items.Item){
                    if(result.Items.Item[i].ItemAttributes){
                        arrReturn.push(result.Items.Item[i]);
                    }
                }
            }
            res.end(JSON.stringify(arrReturn));
        }
    })
});
app.get('/about', function (req, res) {

    config.partials.main = 'about';
    return res.render(
        'index',
        {
            partials: config.partials
        }
    );
});
app.listen(config.port);
console.log('Listening on port ' + config.port);