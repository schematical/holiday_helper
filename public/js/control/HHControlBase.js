var HHControlBase = function(objConfig){
    jQuery.extend(this, objConfig);
    var _this = this;
    this.jEle = $('<div></div>');
    if(objConfig.tpl_loc){
        $.Mustache.load('/js/view/' + objConfig.tpl_loc + '.html').done(function(tpl){
            _this.tpl = Mustache.compile(tpl);

            _this.Render();
        });
    }

}
HHControlBase.prototype.Render = function(){

   /* var strHtml = $.Mustache.render(
        this.tpl,
        this
    );*/
    var strHtml = this.tpl(this);

    this.jEle.html(strHtml);
    if(this.bindEvents){
        this.bindEvents();
    }
}