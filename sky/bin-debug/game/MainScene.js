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
var game;
(function (game) {
    var MainScene = (function (_super) {
        __extends(MainScene, _super);
        function MainScene(index) {
            if (index === void 0) { index = null; }
            var _this = _super.call(this, "Main") || this;
            // 关卡
            _this._level = [];
            // 索引
            _this.index = 0;
            /**拖动距离*/
            _this.distinct = 0;
            if (index)
                _this.index = index;
            return _this;
        }
        MainScene.prototype.Init = function () {
            this._width = this.uiLayer.width;
            this._height = this.uiLayer.height;
            // base.API.Init("http://127.0.0.1:8000/api/")
            // base.API.call("get_user_plot",{user_name:"a",level:this.index}).then(response=>{
            //     console.log(response)
            // }).catch(err=>{
            //     console.log(err)
            // })
            // 背景创建
            // 获取纹理图片
            var bgImg = game.createBitmapByName("Space04-03_jpg");
            bgImg.height = this._height;
            bgImg.width = this._width;
            this.uiLayer.addChild(bgImg);
            // 标题
            var title = game.createBitmap("title_png", (this._width - 400) / 2, 80, 400, 200);
            this.uiLayer.addChild(title);
            // 创建关卡
            // this._level = game.createBitmapByName("earth03_png");
            // this._level.width = 650;
            // this._level.height = 500;
            // this._level.x = (this.stage.stageWidth-this._level.width)/2;
            // this._level.y = 200;
            // this.addChild(this._level);
            var img1 = game.createBitmap('5_png', (this._width - 500) / 2, 250, 500, 450);
            var img2 = game.createBitmap('6_png', (this._width - 500) / 2, 250, 500, 450);
            var img3 = game.createBitmap('7_png', (this._width - 500) / 2, 250, 500, 450);
            this._level.push(img1);
            this._level.push(img2);
            this._level.push(img3);
            this.uiLayer.addChild(this._level[this.index]);
            this.touchgg();
            //创建下图片
            this._bottomimage = game.createBitmap("earth02_png", 0, this._height - 900, this._width, 1000);
            this.uiLayer.addChild(this._bottomimage);
            // 飞机仓库创建
            this._planeStage = game.createBitmap("tag01_png", 0, 500, 200, 100);
            this._planeStage.touchEnabled = true;
            this.uiLayer.addChild(this._planeStage);
            // this._planeStage.addEventListener(egret.TouchEvent.TOUCH_TAP, GameScene.instance.openPlane, this);
            // 广告创建
            this.ad = game.createBitmap("ad_png", 20, this._height - 220, 200, 200);
            this.ad.touchEnabled = true;
            this.uiLayer.addChild(this.ad);
            this.ad.addEventListener(egret.TouchEvent.TOUCH_TAP, this.StoryTouch, this);
            // this.ad.addEventListener(egret.TouchEvent.TOUCH_TAP, GameScene.instance.toStoryScene, this);
            // 开始按钮
            this._btnStart = game.createBitmapByName("play_png"); // 开始按钮
            this._btnStart.width = 300;
            this._btnStart.height = 300;
            this._btnStart.x = 250;
            this._btnStart.y = this._height - this._btnStart.height;
            this._btnStart.touchEnabled = true; //开启碰触
            this.uiLayer.addChild(this._btnStart); //添加到场景中
            // 点击开始按钮背景滚动
            this._btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toPlay, this);
            // this._btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, GameScene.instance.toPlay, this);
            // $.ajax({
            //     url:'/index.html',
            //     type:"GET",
            //     success:function(data){
            //         console.log('ajax success!!!');
            //     }
            // });
            // let loading = new eui.Image("bg_jpg");
            // loading.horizontalCenter = -100;
            // loading.verticalCenter = 100;
            // this.uiLayer.addChild(loading);
            // loading.touchEnabled = true;
            // let text = new eui.Label("main");
            // text.horizontalCenter = 0;
            // text.verticalCenter = 0;
            // this.uiLayer.addChild(text);
        };
        MainScene.prototype.StoryTouch = function (e) {
            var story = new game.StoryScene(this.index);
            this.Switch(story);
        };
        MainScene.prototype.touchgg = function () {
            this.uiLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.uiLayer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
            this.uiLayer.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        };
        MainScene.prototype.removetouch = function () {
            this.uiLayer.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.uiLayer.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
            this.uiLayer.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        };
        /**拖动开始*/
        MainScene.prototype.touchBegin = function (e) {
            console.log('拖动开始');
            this.jilu = e.stageX;
            this.distinct = 0;
        };
        /**拖动中*/
        MainScene.prototype.touchMove = function (e) {
            console.log('拖动中');
            console.log(e.stageX);
            this.distinct = e.stageX - this.jilu;
            if (this.distinct < 0) {
                console.log("向左拖动" + this.distinct);
                if (this.index >= 2) {
                    this.distinct = 0;
                    return;
                }
                if (!this._level[this.index + 1].parent) {
                    this.uiLayer.addChildAt(this._level[this.index + 1], 1);
                }
                this._level[this.index].x = this.distinct * 2;
                this._level[this.index + 1].x = this._height + this.distinct * 2;
            }
            else {
                console.log("向右拖动" + this.distinct);
                if (this.index <= 0) {
                    this.distinct = 0;
                    return;
                }
                if (!this._level[this.index - 1].parent) {
                    this.uiLayer.addChildAt(this._level[this.index - 1], 1);
                }
                this._level[this.index].x = this.distinct * 2;
                this._level[this.index - 1].x = -this._width + this.distinct * 2;
            }
        };
        /** 拖动结束*/
        MainScene.prototype.touchEnd = function (e) {
            console.log('拖动结束');
            if (this.distinct < 0 && this.distinct * 4 > -this._width) {
                egret.Tween.get(this._level[this.index]).to({ x: (this._width - 500) / 2 }, 300);
                egret.Tween.get(this._level[this.index + 1]).to({ x: this._width }, 300);
                this.uiLayer.removeChild(this._level[this.index + 1]);
            }
            else if (this.distinct < 0 && this.distinct * 4 < -this._width) {
                egret.Tween.get(this._level[this.index]).to({ x: -this._width }, 300);
                egret.Tween.get(this._level[this.index + 1]).to({ x: (this._width - 500) / 2 }, 300);
                this.uiLayer.removeChild(this._level[this.index]);
                this.index += 1;
            }
            else if (this.distinct > 0 && this.distinct * 4 < this._width) {
                egret.Tween.get(this._level[this.index]).to({ x: (this._width - 500) / 2 }, 300);
                egret.Tween.get(this._level[this.index - 1]).to({ x: this._width }, 300);
                this.uiLayer.removeChild(this._level[this.index - 1]);
            }
            else if (this.distinct > 0 && this.distinct * 4 > this._width) {
                egret.Tween.get(this._level[this.index]).to({ x: -this._width }, 300);
                egret.Tween.get(this._level[this.index - 1]).to({ x: (this._width - 500) / 2 }, 300);
                this.uiLayer.removeChild(this._level[this.index]);
                this.index -= 1;
            }
            // if(this.jilu>e.stageX){
            //     if(this.index>=2){
            //         return
            //     }
            //     this.removeChild(this._level[this.index])
            //     this.index += 1;
            //     this.addChild(this._level[this.index])
            // }else{
            //     if(this.index<=0){
            //         return
            //     }
            //     this.removeChild(this._level[this.index])
            //     this.index -= 1;
            //     this.addChild(this._level[this.index])
            // }
            console.log(this.index);
        };
        /**游戏页面*/
        MainScene.prototype.toPlay = function () {
            var play = new game.PlayScene();
            this.Switch(play);
        };
        return MainScene;
    }(base.BaseScene));
    game.MainScene = MainScene;
    __reflect(MainScene.prototype, "game.MainScene");
})(game || (game = {}));
//# sourceMappingURL=MainScene.js.map