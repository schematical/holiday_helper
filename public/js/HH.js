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
        friend_page:-1,
        friend_data:[],
        pageSize: 20,
        product_page:-1,
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
        EmptyControls:function(){
            $('#product-board').empty();
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
                _hh.friend_page = -1;
                _hh.friend_data = data;
                HH.AppendFriends();

            }
        },
        AppendFriends:function(intPage){
            if(intPage){
                _hh.friend_page = intPage;
            }else{
                _hh.friend_page = _hh.friend_page + 1;
            }
            for(var i = _hh.friend_page  * _hh.pageSize; i < (_hh.friend_page  + 1 * _hh.pageSize); i++){
                if(_hh.friend_data[i]){
                    var ctlFriend = new HH.Controls.friend(
                        _hh.friend_data[i]
                    );
                    HH.AddControl(ctlFriend);

                    console.log(i);
                }else{
                    return;
                }
            }
            var ctlFriend = new HH.Controls.view_more({
                callback:HH.AppendFriends
            });
            HH.AddControl(ctlFriend);

        },
        PopFriendSugestion:function(objFriend){
            api(
                '/suggest',
                'get',
                {
                    'fbuid': objFriend.id
                }
            ).done(function(data){
                HH.EmptyControls();
                _hh.product_page = 0;
                _hh.product_data = data;
                HH.PopulateProducts(0);

            }).fail(_error);
        },
        PopulateProducts:function(intPage){
            if(intPage){
                _hh.product_page = intPage;
            }else{
                _hh.product_page = _hh.product_page + 1;
            }
            for(var i = _hh.product_page * _hh.pageSize; i < (_hh.product_page + 1) *_hh.pageSize; i++){
                if(_hh.product_data[i]){
                    var ctlProduct = new HH.Controls.product(
                        _hh.product_data[i]
                    );
                    HH.AddControl(ctlProduct);
                }else{
                    return;
                }
            }
            var ctlFriend = new HH.Controls.view_more({
                callback:HH.PopulateProducts
            });
            HH.AddControl(ctlFriend);
        }
    };

})(window);
$(function(){ HH.Init(); });