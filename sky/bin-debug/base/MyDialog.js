var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 对话框
*/
var MyDialog = (function (_super) {
    __extends(MyDialog, _super);
    function MyDialog(wenzi) {
        var _this = _super.call(this) || this;
        _this.wenzi = wenzi;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addToStage, _this);
        return _this;
    }
    MyDialog.prototype.addToStage = function (e) {
        // 蒙版
        var mengban = new egret.Shape();
        // 创建对话框
        var duihuakuang = new egret.Shape();
        duihuakuang.graphics.beginFill(0x222d42, 1);
        duihuakuang.graphics.lineStyle(2, 0x9dffff, 1);
        duihuakuang.graphics.drawRoundRect(0, 0, this.stage.stageWidth - 40, 200, 20, 20);
        duihuakuang.graphics.endFill();
        this.addChild(duihuakuang);
        // 添加文字
        var wenzi = new egret.TextField;
        wenzi.text = this.wenzi;
        wenzi.x = 0;
        wenzi.y = 60;
        wenzi.size = 32;
        wenzi.background = true;
        wenzi.backgroundColor = 0x394255;
        wenzi.width = this.stage.stageWidth - 44;
        this.addChild(wenzi);
        // 创建色块
        this.picture = new egret.Shape();
        this.picture.graphics.beginFill(0x45aaf2, 1);
        this.picture.graphics.lineStyle(2, 0xffffff, 1);
        this.picture.graphics.drawRect(20, -25, 50, 50);
        this.picture.graphics.endFill();
        this.addChild(this.picture);
    };
    return MyDialog;
}(egret.DisplayObjectContainer));
__reflect(MyDialog.prototype, "MyDialog");
//# sourceMappingURL=MyDialog.js.map