namespace base {

    export class BaseScene {

        name: string;
        scene: paper.Scene;
        camera: paper.GameObject;
        uiLayer: eui.UILayer;

        dispatcher: egret.EventDispatcher;
        listeners: Array<Object>;

        constructor(name) {
            this.name = name;
        }

        public Create(): void {
            this.scene = paper.Application.sceneManager.createScene(this.name, true);
            this.dispatcher = new egret.EventDispatcher();
            this.listeners = [];

            let ui = paper.GameObject.create("ui", "", this.scene);
            let renderer = ui.addComponent(egret3d.Egret2DRenderer);
            const stageSize = egret3d.stage.size;
            const adapter = new egret3d.MatchWidthOrHeightAdapter();
            adapter.setResolution(stageSize.w, stageSize.h);
            renderer.screenAdapter = adapter;

            this.camera = paper.GameObject.create("camera", "", this.scene);
            this.camera.addComponent(egret3d.Camera);
            this.camera.transform.setPosition(egret3d.Vector3.create(0, 0, 4));
            this.camera.transform.lookAt(egret3d.Vector3.create(0, 0, 0));

            const theme = new eui.Theme("resource/2d/default.thm.json", renderer.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);

            function onThemeLoadComplete() {
                this.uiLayer = new eui.UILayer();
                this.uiLayer.width = stageSize.w;
                this.uiLayer.height = stageSize.h;
                this.Init();
                renderer.root.addChild(this.uiLayer);
            }
        }

        public Switch(scene: BaseScene) {
            scene.Create();
            this.scene.destroy();
            for (let listener in this.listeners) {
                this.dispatcher.removeEventListener(listener['name'], listener['callback'], this);
            }

            this.Destroy();
        }

        protected Init():void {

        }

        protected Destroy(): void {

        }

        protected Trigger(name: string, data: any): void {
            this.dispatcher.dispatchEventWith(name, false, data, data);
        }

        protected On(name: string, listener: Function): void {
            let callback = (e) => {
                listener.apply(this, [e.data]);
            };
            this.dispatcher.addEventListener(name, callback, this);
            this.listeners.push({ name: name, callback: callback });
        }
    }

}