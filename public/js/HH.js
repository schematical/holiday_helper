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
            var ctlSearch = new HH.Controls['search-box']();
            $('#product-board').append(ctlSearch.jEle);
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
                alert("Success:". data.length);
                if(data.Items.Item){
                    for(var i in data.Items.Item){}
                }
            }).fail(_error);
        }
    };

})(window);
$(function(){ HH.Init(); });