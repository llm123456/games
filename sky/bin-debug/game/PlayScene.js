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
    var PlayScene = (function (_super) {
        __extends(PlayScene, _super);
        function PlayScene() {
            return _super.call(this, "play") || this;
        }
        PlayScene.prototype.Init = function () {
            var bg = new Bg();
            bg.width = this.uiLayer.width;
            bg.height = this.uiLayer.height;
            this.uiLayer.addChild(bg);
        };
        return PlayScene;
    }(base.BaseScene));
    game.PlayScene = PlayScene;
    __reflect(PlayScene.prototype, "game.PlayScene");
})(game || (game = {}));
//# sourceMappingURL=PlayScene.js.map