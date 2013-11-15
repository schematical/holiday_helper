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
        pageSize: 50,
        product_page:-1,
        product_data:[],
        messages:{
            product:
                [
                    'Elves working...',
                    'Hand selecting the very best...',
                    'Oh they stopped for hot chocolate',
                    'Okay they are back on it!',
                    'Almost there...'
                ],
            friends:[
                ''
            ]
        }
    }
    var api = function(strEndpoint,strMethod, objData, messages){
        var objDefered = $.Deferred();
        if(typeof(objData) == 'undefined'){
            var objData = {};
        }
        if(messages){
            HH.ShowLoader(messages);
        }
        $.ajax({
            'dataType':'json',
            'url': strEndpoint,
            'data':objData,
            'type':strMethod
        }).done(
            function(objResponse){
                if(messages){
                    HH.HideLoader();
                }
                objDefered.resolve(objResponse);
            }
        ).fail(
            function(objError){
                if(messages){
                    HH.HideLoader();
                }
                objDefered.reject(objError);
            }
        );
        return objDefered.promise();
    }

    window.HH = HH = {
        Tpls:{

        },
        Controls:{

        },
        Init:function(){
            /*var ctlSearch = new HH.Controls['search-box']();
            HH.AddControl(ctlSearch);*/
           /* _hh.davis = Davis(function () {
                this.get('/', function (req) {

                })
            });

            _hh.davis.start();
            if(document.location.pathname == '/'){
                setTimeout(function(){
                    document.location.href = '#';
                }, 500);
            }*/



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
                },
                _hh.messages.product
            ).done(function(data){
                    HH.EmptyControls();
                    _hh.product_page = -1;
                    _hh.product_data = data;
                    HH.PopulateProducts();
            }).fail(_error);
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
            for(var i = _hh.friend_page  * _hh.pageSize; i < (_hh.friend_page  + 1) * _hh.pageSize; i++){
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
                },
                _hh.messages.product
            ).done(function(data){
                HH.EmptyControls();
                _hh.product_page = -1;
                _hh.product_data = data;
                HH.PopulateProducts();

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
        },
        ShowLoader:function(messages){
            $('#div-loading').modal('show');
            $('#div-loading').find('.progress-bar').finish().css('width','0%').animate(
                {width:'100%'},
                15000,
                function(){
                    $('#div-loading').find('#myModalLabel').html('Sorry something must have gone wrong on our end. Please try again or contact us at <a href="mailto:mlea@schematical.com">mlea@schematical.com</a>');
                    clearTimeout(_hh.modal_timeout);
                }
            );
            var i_message = 0;
            $('#div-loading').find('#myModalLabel').text(messages[i_message]);
            function updateText() {
                i_message = i_message + 1;
                if(i_message > messages.length){
                    i_message = 0;
                }
                $('#div-loading').find('#myModalLabel').text(messages[i_message]);
                _hh.modal_timeout = setTimeout(updateText, 3000);
            }
            _hh.modal_timeout = setTimeout(updateText, 3000);
        },
        HideLoader:function(){
            $('#div-loading').find('.progress-bar').finish();
            $('#div-loading').modal('hide');
            clearTimeout(_hh.modal_timeout);
        },
        AddControlBase:function(name, fun){
            HH.Controls[name] = fun;
            $.Mustache.load('/js/view/' + name + '.html').done(function(tpl){

                HH.Tpls[name] = Mustache.compile(tpl);
                $(window).trigger(name + '-view-loaded');

            });
        }
    };

})(window);
$(function(){ HH.Init(); })