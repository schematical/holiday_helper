(function(window){
    function _error(error){
        console.error(error);
    }

    /**
     * PRivate vars
     * @type {{}}
     * @private
     */
    var _hh = {
        friend_data:[],
        pageSize: 20,
        product_data:[]
    }
    var api = function(strEndpoint,strMethod, objData){
        var objDefered = $.Deferred();
        if(typeof(objData) == 'undefined'){
            var objData = {};
        }
        $.ajax({
            'dataType':'json',
            'url': strEndpoint,
            'data':objData,
            'type':strMethod
        }).done(
            function(objResponse){
                objDefered.resolve(objResponse);
            }
        ).fail(
            function(objError){
                objDefered.reject(objError);
            }
        );
        return objDefered.promise();
    }
    _PopulateProducts  = function(data){
        _hh.product_data = data;
        for(var i = 0; i < _hh.pageSize; i++){
            var ctlProduct = new HH.Controls.product(
                _hh.product_data[i]
            );
            HH.AddControl(ctlProduct);
        }
    }
    window.HH = HH = {
        Controls:{

        },
        Init:function(){
            /*var ctlSearch = new HH.Controls['search-box']();
            HH.AddControl(ctlSearch);*/
            var ctlHello = new HH.Controls.hello();
            HH.AddControl(ctlHello)

        },
        AddControl:function(ctl){
            if(!ctl.jEle){
                return console.err("Invalid Control Passed in");
            }
            $('#product-board').append(ctl.jEle);
        },
        Search:function(strSearch, strCatigory){
            api(
                '/search',
                'get',
                {
                    search:strSearch,
                    cat:strCatigory
                }
            ).done(_PopulateProducts).fail(_error);
        },
        SetFriendData:function(data){

            if(data){
                if(data.data){
                    data = data.data;
                }
                _hh.friend_data = data;
                HH.AppendFriends(0);

            }
        },
        AppendFriends:function(intPage){
            for(var i = intPage * _hh.pageSize; i < (intPage + 1 * _hh.pageSize); i++){
                if(_hh.friend_data[i]){
                    var ctlFriend = new HH.Controls.friend(
                        _hh.friend_data[i]
                    );
                    HH.AddControl(ctlFriend);

                    console.log(i);
                }
            }
        },
        PopFriendSugestion:function(objFriend){
            api(
                '/suggest',
                'get',
                {
                    'fbuid': objFriend.id
                }
            ).done(
                _PopulateProducts
            ).fail(_error);
        }
    };

})(window);
$(function(){ HH.Init(); });