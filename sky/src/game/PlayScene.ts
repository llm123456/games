namespace game{
    export class PlayScene extends base.BaseScene{
        constructor(){
            super("play");
        }

        protected Init(){
            var bg = new Bg()
            bg.width = this.uiLayer.width;
            bg.height = this.uiLayer.height;
            this.uiLayer.addChild(bg);
        }
    }
}