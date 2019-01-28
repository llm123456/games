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
 * 摇杆
*/
var RockerBar = (function (_super) {
    __extends(RockerBar, _super);
    function RockerBar() {
        var _this = _super.call(this) || this;
        // 设置圆环半径
        _this._circleRadius = 100;
        // 设置中心点坐标
        _this._centerX = 0;
        _this._centerY = 0;
        // 判断是否点击
        _this._touchIs = false;
        // 鼠标点击与摇杆的位置差
        _this._distinct = new egret.Point();
        // 触摸移动小球位置
        _this.p1 = new egret.Point();
        _this.p2 = new egret.Point();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    RockerBar.prototype.onAddToStage = function () {
        this._ball = game.createBitmap("ball_png", 424, this.stage.stageHeight - 123, 50, 50);
        this._centerX = this._ball.x;
        this._centerY = this._ball.y;
        console.log("中心位置", this._centerX, this._centerY);
        // 设置小球的锚点
        this._ball.anchorOffsetX = this._ball.width / 2;
        this._ball.anchorOffsetY = this._ball.height / 2;
        this._ballRadius = this._ball.width / 2;
        this.addChild(this._ball);
    };
    /**
     * 游戏开始是创建摇杆
    */
    RockerBar.prototype.start = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    };
    /**
     * 游戏结束时销毁摇杆监听
     * */
    RockerBar.prototype.stop = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    };
    // 触摸开始
    RockerBar.prototype.touchBegin = function (e) {
        console.log("touchBegin");
        this._touchIs = true;
        this._touchID = e.touchPointID;
        console.log(this._touchID);
        this._distinct.x = e.stageX - this._centerX;
        this._distinct.y = e.stageY - this._centerY;
        this.dispatchEvent(new egret.Event("vj_start"));
    };
    // 触摸结束
    RockerBar.prototype.touchEnd = function (e) {
        console.log("touchEnd");
        this._touchIs = false;
        this._ball.x = this._centerX;
        this._ball.y = this._centerY;
        this.dispatchEvent(new egret.Event("vj_end"));
    };
    RockerBar.prototype.touchMove = function (e) {
        if (this._touchIs) {
            console.log("touchMove");
            // 获取手指和虚拟摇杆的距离
            this.p1.x = this._centerX;
            this.p1.y = this._centerY;
            this.p2.x = e.stageX;
            this.p2.y = e.stageY;
            var dist = egret.Point.distance(this.p1, this.p2); //获取位移
            var angle = Math.atan2(e.stageY - this._centerY, e.stageX - this._centerX); //获取角度
            console.log(angle);
            // 判断圆球是否在圆环内
            if (dist <= (this._circleRadius - this._ballRadius)) {
                console.log(1111111);
                this._ball.x = e.stageX - this._distinct.x;
                this._ball.y = e.stageY - this._distinct.y;
            }
            else {
                console.log(2222222);
                this._ball.x = Math.cos(angle) * (this._circleRadius - this._ballRadius) + this._centerX;
                this._ball.y = Math.sin(angle) * (this._circleRadius - this._ballRadius) + this._centerY;
                console.log(Math.cos(angle));
                console.log(Math.sin(angle));
            }
            this.dispatchEventWith("vj_move", false, angle);
        }
    };
    return RockerBar;
}(egret.DisplayObjectContainer));
__reflect(RockerBar.prototype, "RockerBar");
//# sourceMappingURL=RockerBar.js.map