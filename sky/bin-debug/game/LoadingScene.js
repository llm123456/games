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
    var LoadingScene = (function (_super) {
        __extends(LoadingScene, _super);
        function LoadingScene() {
            return _super.call(this, "Loading") || this;
        }
        LoadingScene.prototype.Init = function () {
            var _this = this;
            var ball = paper.GameObject.create("ball", "", this.scene);
            var mesh = ball.addComponent(egret3d.MeshFilter);
            mesh.mesh = egret3d.DefaultMeshes.CONE;
            var render = ball.addComponent(egret3d.MeshRenderer);
            var martical = egret3d.DefaultMaterials.MESH_BASIC;
            render.materials = [martical];
            ball.addComponent(game.RotateBehaviour);
            var text = new eui.Label("Loading...");
            text.horizontalCenter = 0;
            text.verticalCenter = 0;
            this.uiLayer.addChild(text);
            this.progress = new eui.Label();
            this.progress.horizontalCenter = 100;
            this.progress.verticalCenter = 0;
            this.uiLayer.addChild(this.progress);
            var timer = new egret.Timer(10, 100);
            var progress = 0;
            timer.addEventListener(egret.TimerEvent.TIMER, function (e) {
                progress += 1;
                _this.progress.text = progress.toString();
            }, this);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function (e) {
                base.API.Init("http://127.0.0.1:8000/api/");
                base.API.call("get_user_level", { user_name: "a" }).then(function (response) {
                    console.log(response);
                    var scene = new game.MainScene(response['level']);
                    _this.Switch(scene);
                }).catch(function (err) {
                    console.log(err);
                });
            }, this);
            timer.start();
        };
        return LoadingScene;
    }(base.BaseScene));
    game.LoadingScene = LoadingScene;
    __reflect(LoadingScene.prototype, "game.LoadingScene");
})(game || (game = {}));
//# sourceMappingURL=LoadingScene.js.map