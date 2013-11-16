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
});*/



app.configure(function () {
    app.set('port', config.port);
    app.set('views', __dirname + '/views');
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
        config.partials.main = 'partials/landing';
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
        config.partials.main = 'partials/product_board';
        return res.render(
            'index',
            {
                friends: data,
                friends_json: JSON.stringify(data),
                partials: config.partials
            }
        );


    });
});


app.get('/suggest', Facebook.loginRequired({ scope: 'friends_likes, friends_interests' /*, email' */ }), function (req, res) {
    if(!req.query.fbuid){
        res.end({ 'error':'missing query parameter of "' + req.query.fbuid + '"'});
    }
    req.facebook.api('/' + req.query.fbuid + '/likes', function(err, data){
        var interests = data.data;
        var options = {
            arrDeferred:[],
            results:[],
            done:function(data){
                res.end(JSON.stringify(data));
            }
        };
        var cats = {};
        for(var i in interests){
            var strAppend = interests[i].name.split(' ')[0];
            if(!cats[interests[i].id]){
                cats[interests[i].id] = {
                    'id':interests[i].id,
                    'name':interests[i].name,
                    'count':0
                }
            }
            cats[interests[i].id].count += 1;
            if(interests[i].category){
                cats[interests[i].category] = {
                    'id':interests[i].category,
                    'name':interests[i].category,// + ' ' + strAppend,
                    'count':0,
                    'parent':{
                        'name':interests[i].name,
                        'id':interests[i].id
                    }
                };
                cats[interests[i].category].count += 1;
            }
            if(interests[i].category_list){
                for(var ii in interests[i].category_list){
                    var cat = interests[i].category_list[ii];
                    if(!cats[cat.id]){
                        cats[cat.id] = {
                            'id':cat.id,
                            'name':cat.name,// + ' ' + strAppend,
                            'count':0,
                            'parent':{
                                'name':interests[i].name ,
                                'id':interests[i].id
                            }
                        }
                    }
                    cats[cat.id].count += 1;
                }
            }
        }
        var cats_array = [];
        for(var i in cats){
            cats_array.push(cats[i]);
        }
        cats_array.sort(function(a,b){
            var a = a.count;
            var b = b.count;
            return a>b?-1:a<b?1:0;
        });


        var search_cats = cats_array.slice(0, 20);
        console.log(search_cats);
        for(var i in search_cats){
            _aws.pop_interest_results(search_cats[i], options);

        }
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

    config.partials.main = 'partials/about';
    return res.render(
        'index',
        {
            partials: config.partials
        }
    );
});
app.listen(config.port);
console.log('Listening on port ' + config.port);