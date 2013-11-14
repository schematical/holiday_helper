module.exports = _aws = {
    //TODO: Move this
    shuffle:function(array) {
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
    },
    pop_interest_results:function(interest, options){
        var objSearch = {
            ResponseGroup:'Images,ItemAttributes',
            SearchIndex: "Blended",
            Keywords:interest.name
        }
        function _finish(){
            options.arrDeferred.pop();
            if(options.arrDeferred.length == 0){
                var arrReturn = [];
                for(var i in options.results){

                    if(options.results[i].Items.Item){
                        for(var ii in options.results[i].Items.Item){
                            if(options.results[i].Items.Item[ii].ItemAttributes){
                                options.results[i].Items.Item[ii].interest = options.results[i].interest;
                                arrReturn.push(
                                    options.results[i].Items.Item[ii]
                                );
                            }
                        }
                    }
                }
                options.done(_aws.shuffle(arrReturn));
            }
        }
        var objDeferred = {
            _done:function(data, interest){

                options.results.push({
                    Items:data.Items,
                    interest: interest
                });
               _finish();
            },
            _error:function(err){

                _finish();
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