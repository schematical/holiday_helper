HH.Controls.product = function(objProduct){
    var _this = new HHControlBase({
        product:objProduct,
        tpl_loc:'product'
    });
    _this.product_short_title = objProduct.ItemAttributes.Title;
    if(_this.product_short_title.length > 50){
        _this.product_short_title = _this.product_short_title.substr(0, 40) + '...';
    }
    var sizes = ['medium cat-3','large cat-4','large cat-1', 'medium cat-2'];
    _this.size = sizes[Math.floor(Math.random() * sizes.length)];
    _this.bindEvents = function(){
       /* var _this = this;
        this.jEle.find('.btn-search').click(function(){
            HH.Search(
                _this.jEle.find('.txt-search').val(),
                "Books"
            );
        });*/
        $('#product-board').masonry();
    }
    return _this;
};