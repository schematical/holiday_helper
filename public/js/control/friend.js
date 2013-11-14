HH.Controls.friend = function(objFriend){
    var _this = new HHControlBase({
        friend:objFriend,
        tpl_loc:'friend'
    });

    //var sizes = ['medium cat-3','large cat-4','large cat-1', 'medium cat-2'];
    _this.size = 'medium cat-3';//sizes[Math.floor(Math.random() * sizes.length)];
    _this.bindEvents = function(){
        var _this = this;
        this.jEle.find('.div-friend').click(function(){
            HH.PopFriendSugestion(_this.friend);
        });
        $('#product-board').masonry();
    }
    return _this;
};