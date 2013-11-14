var path = require('path');
var express = require('express');
var app = express();
var http = require('http');

var _aws = require('./_aws');



var config = {
    amazon:{
        access_key_id:'AKIAIWAM5VQTMEM73MFA',
        secret_access_key:'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',
        assoc_tag:'holiday_helper-20'
    },
    facebook:{
        appId: '321092171365778',
        secret: '40d3849f6a9eedb6ef7edc2571993d60'
    }
}
var partials = {

    header_nav:'partials/header_nav',
    footer_nav:'partials/footer_nav'

}

var aws = require("aws-lib");

prodAdv = aws.createProdAdvClient(
    config.amazon.access_key_id,
    config.amazon.secret_access_key,
    config.amazon.assoc_tag
);

var Facebook = require('facebook-node-sdk');





app.configure(function () {
    app.set('port', 3000);
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
    partials.main = 'partials/product_board';
    return res.render(
        'index',
        {
            partials: partials
        }
    );
});
app.get('/start', Facebook.loginRequired({ scope: 'friends_likes, friends_interests' /*, email' */ }), function (req, res) {
    req.facebook.api('/me/friends', function(err, data) {
        partials.main = 'partials/product_board';
        return res.render(
            'index',
            {
                friends: data,
                friends_json: JSON.stringify(data),
                partials: partials
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
                    'name':interests[i].category + ' ' + strAppend,
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
                            'name':cat.name + ' ' + strAppend,
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
        console.log(cats_array);


        for(var i in cats_array){

            _aws.pop_interest_results(cats_array[i], options);

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
            //console.log(result);
            res.end(JSON.stringify(result));
        }
    })
});

app.listen(3000);
console.log('Listening on port 3000');