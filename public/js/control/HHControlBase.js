var HHControlBase = function(objConfig){
    jQuery.extend(this, objConfig);
    var _this = this;
    this.jEle = $('<div></div>');

    _this.Render();


}
HHControlBase.prototype.Render = function(){
    var _this = this;
    if(!HH.Tpls[this.tpl_loc]){
        $(window).one(this.tpl_loc + '-view-loaded', function(){
            _this.Render();
        });
        return;
    }
    var strHtml = HH.Tpls[this.tpl_loc](this);
    var _fillerEle = this.jEle;
    this.jEle = $(strHtml);
    _fillerEle.replaceWith(this.jEle);

    if(this.bindEvents){
        this.bindEvents();
    }
}