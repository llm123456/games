var game;
(function (game) {
    /**创建图片
     * name: 图片名称
    */
    function createBitmapByName(name) {
        var img = new egret.Bitmap();
        var texture = RES.getRes(name);
        img.texture = texture;
        return img;
    }
    game.createBitmapByName = createBitmapByName;
    /**创建图片
     * name: 图片名称
     * x: 舞台x轴位置
     * y: 舞台y轴位置
     * width: 图片宽度
     * height: 图片高度
    */
    function createBitmap(name, x, y, width, height) {
        var img = new egret.Bitmap();
        var texture = RES.getRes(name);
        img.texture = texture;
        img.width = width;
        img.height = height;
        img.x = x;
        img.y = y;
        return img;
    }
    game.createBitmap = createBitmap;
    /**
     * 矩形检测碰撞区域
    */
    function testHit(obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj1.y;
        return rect1.intersects(rect2);
    }
    game.testHit = testHit;
})(game || (game = {}));
//# sourceMappingURL=GameUtils.js.map