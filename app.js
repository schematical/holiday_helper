var path = require('path');
var express = require('express');
var app = express();
var http = require('http');

function pop_interest_results(interest, options){
    if(!interest.category_list){
        return;
    }
    interest.category_list.push({
        id:interest.id,
        name:interest.name
    });
    for(var ii in interest.category_list){

        var objSearch = {
            ResponseGroup:'Images,ItemAttributes',
            SearchIndex: "Blended",//"Books",
            Keywords:interest.category_list[ii].name
        }
        console.log('In:' + interest.name);
        var objDeferred = {
            interest:interest,
            _done:function(data, interest){

                options.results.push({
                    Items:data.Items,
                    interest: interest
                });
                options.arrDeferred.pop();
                if(options.arrDeferred.length == 0){
                    var arrReturn = [];
                    for(var i in options.results){

                        if(options.results[i].Items.Item){
                            for(var ii in options.results[i].Items.Item){
                                if(options.results[i].Items.Item[ii].ItemAttributes){
                                    options.results[i].Items.Item[ii].interest = options.results[i].interest;
                                    console.log(options.results[i].interest.name);
                                    arrReturn.push(
                                        options.results[i].Items.Item[ii]
                                    );
                                }
                            }
                        }
                    }

                    options.done(shuffle(arrReturn));
                }
            },
            _error:function(err){
                options.arrDeferred.pop();
                if(options.arrDeferred.length == 0){

                    options.done(shuffle(arrReturn));

                }
            }
        };
        prodAdv.call("ItemSearch", objSearch, function(err, result) {
            if(err){
                objDeferred._error(err);
            }else{
                objDeferred._done(result, interest);
            }
        });
        options.arrDeferred.push(objDeferred);
    }
}
//TODO: Move this
function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

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
        var interests = shuffle(data.data);
        var options = {
            arrDeferred:[],
            results:[],
            done:function(data){
                res.end(JSON.stringify(data));
            }
        };

        for(var i = 0; i < 10; i++){

            if(interests[i]){
                pop_interest_results(interests[i], options);

            }
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