HH.AddControlBase('friend',function(objFriend){
    var _this = new HHControlBase({
        friend:objFriend,
        tpl_loc:'friend',
        bindEvents:function(){
            var _this = this;
           /* this.jEle.click(function(){
                HH.PopFriendSugestion(_this.friend);
                document.location.href = '#/friend/' + _this.friend.id;
            });
            $('#product-board').masonry();*/
        },
        size:'medium cat-3'//sizes[Math.floor(Math.random() * sizes.length)];
    });



    return _this;
});