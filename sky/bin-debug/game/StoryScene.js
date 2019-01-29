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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var game;
(function (game) {
    var StoryScene = (function (_super) {
        __extends(StoryScene, _super);
        function StoryScene(level) {
            var _this = _super.call(this, "story") || this;
            //图片数组
            _this.images = [];
            // 图片索引
            _this.index = 0;
            console.log(level);
            _this.index = level;
            return _this;
        }
        StoryScene.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    console.log("init");
                    this._width = this.uiLayer.width;
                    this._height = this.uiLayer.height;
                    base.API.Init("http://127.0.0.1:8000/api/");
                    base.API.call("get_plot", { user_name: "a", level: 1 }).then(function (response) {
                        console.log(response);
                        var bgImg = game.createBitmapByName("Space04-03_jpg");
                        bgImg.height = _this._height;
                        bgImg.width = _this._width;
                        bgImg.x = 0;
                        bgImg.y = 0;
                        _this.uiLayer.addChild(bgImg);
                        console.log(bgImg);
                        var beijing = new egret.Shape();
                        beijing.graphics.beginFill(0xff0000, 1);
                        beijing.graphics.drawRect(0, 0, _this._width, 50);
                        beijing.graphics.endFill();
                        _this.uiLayer.addChild(beijing);
                        _this.text1 = new egret.TextField();
                        _this.text1.text = '返回';
                        _this.text1.touchEnabled = true;
                        _this.uiLayer.addChild(_this.text1);
                        _this.text1.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.return, _this);
                        var datalength = response['imgs'].length;
                        for (var i = 0; i < datalength; i++) {
                            var img1 = game.createBitmap(response['imgs'][i]["name"], 0, 50, _this._width, _this._height - 50);
                            _this.images.push(img1);
                        }
                        // var img1 = game.createBitmap("mh1_jpg",0,50,this._width,this._height-50);
                        // var img2 = game.createBitmap("mh2_jpg",0,50,this._width,this._height-50);
                        // var img3 = game.createBitmap("mh3_jpg",0,50,this._width,this._height-50);
                        // this.images.push(img1);
                        // this.images.push(img2);
                        // this.images.push(img3);
                        // // this.addChild(img1);
                        // console.log(img1)
                        // console.log(img2)
                        // console.log(img3)
                        console.log(_this.images);
                        _this.rightCon = new egret.DisplayObjectContainer();
                        _this.rightCon.height = _this._height;
                        _this.rightCon.width = _this._width;
                        _this.rightCon.x = 0;
                        _this.rightCon.y = 0;
                        _this.rightCon.touchEnabled = true;
                        _this.rightCon.addChild(_this.images[0]);
                        _this.uiLayer.addChild(_this.rightCon);
                        console.log(_this.rightCon);
                        _this.rightCon.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.point, _this);
                    }).catch(function (err) {
                        console.log(err);
                    });
                    return [2 /*return*/];
                });
            });
        };
        StoryScene.prototype.point = function (e) {
            var _this = this;
            // this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.point,this);
            console.log("x轴：" + e.stageX, "Y轴" + e.stageY);
            var imglength = this.images.length;
            if (e.stageX > this._width * 0.5) {
                if (this.index >= imglength - 1) {
                    return;
                }
                this.index += 1;
                this.rightCon.addChild(this.images[this.index]);
                this.images[this.index].x = this._width;
                egret.Tween.get(this.images[this.index - 1]).to({ x: -this._width }, 1000);
                egret.Tween.get(this.images[this.index]).to({ x: 0 }, 1000);
                setTimeout(function () {
                    _this.rightCon.removeChild(_this.images[_this.index - 1]);
                }, 1000);
            }
            else {
                console.log('左边');
                if (this.index <= 0) {
                    return;
                }
                this.index -= 1;
                this.rightCon.addChild(this.images[this.index]);
                this.images[this.index].x = -this._width;
                egret.Tween.get(this.images[this.index]).to({ x: 0 }, 1000);
                egret.Tween.get(this.images[this.index + 1]).to({ x: this._width }, 1000);
                setTimeout(function () {
                    _this.rightCon.removeChild(_this.images[_this.index + 1]);
                }, 1000);
            }
        };
        StoryScene.prototype.return = function (e) {
            var main = new game.MainScene(this.index);
            this.Switch(main);
        };
        return StoryScene;
    }(base.BaseScene));
    game.StoryScene = StoryScene;
    __reflect(StoryScene.prototype, "game.StoryScene");
})(game || (game = {}));
//# sourceMappingURL=StoryScene.js.map