namespace game {
    export class LoadingScene extends base.BaseScene {

        constructor () {
            super("Loading");
        }

        progress: eui.Label;

        protected Init() {
            let ball = paper.GameObject.create("ball", "", this.scene);
            let mesh = ball.addComponent(egret3d.MeshFilter);
            mesh.mesh = egret3d.DefaultMeshes.CONE;
            var render = ball.addComponent(egret3d.MeshRenderer)
            var martical = egret3d.DefaultMaterials.MESH_BASIC;
            render.materials = [martical];

            ball.addComponent(game.RotateBehaviour);
            
            let text = new eui.Label("Loading...");
            text.horizontalCenter = 0;
            text.verticalCenter = 0;
            this.uiLayer.addChild(text);

            this.progress = new eui.Label();
            this.progress.horizontalCenter = 100;
            this.progress.verticalCenter = 0;
            this.uiLayer.addChild(this.progress);


            let timer = new egret.Timer(10, 100);
            let progress = 0;
            timer.addEventListener(egret.TimerEvent.TIMER, (e) => {
                progress += 1;
                this.progress.text = progress.toString();
            }, this);

            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, (e) => {
                base.API.Init("http://127.0.0.1:8000/api/")
                base.API.call("get_user_level",{user_name:"a"}).then(response=>{
                    console.log(response)
                    let scene = new MainScene(response['level']);
                    this.Switch(scene);
                }).catch(err=>{
                    console.log(err)
                })
                

            }, this);

            timer.start();
        }
    }
}


