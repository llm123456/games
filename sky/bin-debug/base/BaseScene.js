var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var base;
(function (base) {
    var BaseScene = (function () {
        function BaseScene(name) {
            this.name = name;
        }
        BaseScene.prototype.Create = function () {
            this.scene = paper.Application.sceneManager.createScene(this.name, true);
            this.dispatcher = new egret.EventDispatcher();
            this.listeners = [];
            var ui = paper.GameObject.create("ui", "", this.scene);
            var renderer = ui.addComponent(egret3d.Egret2DRenderer);
            var stageSize = egret3d.stage.size;
            var adapter = new egret3d.MatchWidthOrHeightAdapter();
            adapter.setResolution(stageSize.w, stageSize.h);
            renderer.screenAdapter = adapter;
            this.camera = paper.GameObject.create("camera", "", this.scene);
            this.camera.addComponent(egret3d.Camera);
            this.camera.transform.setPosition(egret3d.Vector3.create(0, 0, 4));
            this.camera.transform.lookAt(egret3d.Vector3.create(0, 0, 0));
            var theme = new eui.Theme("resource/2d/default.thm.json", renderer.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);
            function onThemeLoadComplete() {
                this.uiLayer = new eui.UILayer();
                this.uiLayer.width = stageSize.w;
                this.uiLayer.height = stageSize.h;
                this.Init();
                renderer.root.addChild(this.uiLayer);
            }
        };
        BaseScene.prototype.Switch = function (scene) {
            scene.Create();
            this.scene.destroy();
            for (var listener in this.listeners) {
                this.dispatcher.removeEventListener(listener['name'], listener['callback'], this);
            }
            this.Destroy();
        };
        BaseScene.prototype.Init = function () {
        };
        BaseScene.prototype.Destroy = function () {
        };
        BaseScene.prototype.Trigger = function (name, data) {
            this.dispatcher.dispatchEventWith(name, false, data, data);
        };
        BaseScene.prototype.On = function (name, listener) {
            var _this = this;
            var callback = function (e) {
                listener.apply(_this, [e.data]);
            };
            this.dispatcher.addEventListener(name, callback, this);
            this.listeners.push({ name: name, callback: callback });
        };
        return BaseScene;
    }());
    base.BaseScene = BaseScene;
    __reflect(BaseScene.prototype, "base.BaseScene");
})(base || (base = {}));
//# sourceMappingURL=BaseScene.js.map