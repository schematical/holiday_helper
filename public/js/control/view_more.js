HH.Controls.view_more = function(options){
    options.tpl_loc = 'view_more';
    var _this = new HHControlBase(options);

    _this.bindEvents = function(){
        var _this = this;
        this.jEle.click(function(){
            _this.callback();
            _this.jEle.remove();
        });
    }
    return _this;
};