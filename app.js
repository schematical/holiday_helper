var path = require('path');
var express = require('express');
var app = express();
var http = require('http');

var Facebook = require('facebook-node-sdk');

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

app.configure(function () {
    app.set('port', 3000);
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'foo bar' }));


    app.use(Facebook.middleware(config.facebook));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.errorHandler());
});

app.get('/start', Facebook.loginRequired({ scope: 'friends_likes, friends_interests' /*, email' */ }), function (req, res) {
    req.facebook.api('/me/friends', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        console.log(data);
        req.facebook.api('/' + data.data[2].id + '/likes', function(err, _data){
            if(err){
                res.end(JSON.stringify(err));
            }else{
                res.end(JSON.stringify(_data));
            }
        });

        //res.end(JSON.stringify(data));
        /*games
        books
        likes*/
    });
});


app.get('/amazon', function(req, res){
    var aws = require("aws-lib");

    prodAdv = aws.createProdAdvClient(
        config.amazon.access_key_id,
        config.amazon.secret_access_key,
        config.amazon.assoc_tag
    );

    prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: "Javascript"}, function(err, result) {
        if(err){
            console.log(err);
            res.end(JSON.stringify(err));
        }else{
            console.log(result);
            res.end(JSON.stringify(result));
        }
    })
});

app.listen(3000);
console.log('Listening on port 3000');