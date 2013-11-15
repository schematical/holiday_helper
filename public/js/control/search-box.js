HH.AddControlBase('search-box', function(){
    var _this = new HHControlBase({
        tpl_loc:'search-box'
    });
    _this.bindEvents = function(){
        var _this = this;
        this.jEle.find('.btn-search').click(function(){
            HH.Search(
                _this.jEle.find('.txt-search').val(),
                "Books"
            );
        });
    }
    return _this;
});