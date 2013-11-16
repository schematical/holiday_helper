HH.AddControlBase('product', function(objProduct){

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
