(function(window){
    function _error(error){
        console.error(error);
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
        Search:function(strSearch, strCatigory){
            api(
                '/search',
                'get',
                {
                    search:strSearch,
                    cat:strCatigory
                }
            ).done(function(data){
                if(data.Items.Item){
                    for(var i in data.Items.Item){
                        var ctlProduct = new HH.Controls.product(
                            data.Items.Item[i]
                        );
                        HH.AddControl(ctlProduct);
                    }
                }
            }).fail(_error);
        }
    };

})(window);
$(function(){ HH.Init(); });