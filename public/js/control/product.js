HH.AddControlBase('product', function(objProduct){
    var product_short_title = objProduct.ItemAttributes.Title

    if(product_short_title.length > 50){
        product_short_title = product_short_title.substr(0, 40) + '...';
    }
    var sizes = ['medium cat-3','large cat-4','large cat-1', 'medium cat-2', 'medium cat-2', 'medium cat-2'];

    var _this = new HHControlBase({
        product:objProduct,
        tpl_loc:'product',
        product_short_title:product_short_title,
        size:sizes[Math.floor(Math.random() * sizes.length)],
        bindEvents:function(){
            var _this = this;
            this.jEle.find('.btn-view-more-interest').click(function(){
                HH.Search(
                    $(this).attr('data-interest-name'),
                    "Blended"
                );
            });
            $('#product-board').masonry();
        }
    });
    return _this;
});
