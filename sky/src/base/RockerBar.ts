/**
 * 摇杆
*/
class RockerBar extends egret.DisplayObjectContainer{
    // 设置小球
    private _ball:egret.Bitmap;
    // 设置圆环半径
    private _circleRadius:number=100;
    // 设置小球半径
    private _ballRadius:number;
    // 设置中心点坐标
    private _centerX:number = 0;
    private _centerY:number = 0;
    // 设置触摸ID
    private _touchID:number;
    // 判断是否点击
    private _touchIs:boolean = false;
    // 鼠标点击与摇杆的位置差
    private _distinct:egret.Point = new egret.Point();
    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        
    }
    
    public onAddToStage():void{
        this._ball = game.createBitmap("ball_png", 424, this.stage.stageHeight-123, 50, 50)
        this._centerX = this._ball.x;
        this._centerY = this._ball.y;
        console.log("中心位置",this._centerX,this._centerY);
        // 设置小球的锚点
        this._ball.anchorOffsetX = this._ball.width/2;
        this._ball.anchorOffsetY = this._ball.height/2;
        this._ballRadius = this._ball.width/2;
        this.addChild(this._ball);
    }
    /**
     * 游戏开始是创建摇杆
    */
    public start():void{
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    }
    /**
     * 游戏结束时销毁摇杆监听
     * */
    public stop():void{
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);

    }
    // 触摸开始
    private touchBegin(e:egret.TouchEvent):void{
        console.log("touchBegin")
        this._touchIs = true;
        this._touchID = e.touchPointID;
        console.log(this._touchID);
        this._distinct.x = e.stageX - this._centerX;
        this._distinct.y = e.stageY - this._centerY;
        this.dispatchEvent(new egret.Event("vj_start"));
    }
    // 触摸结束
    private touchEnd(e:egret.TouchEvent):void{
        console.log("touchEnd")
        this._touchIs = false;
        this._ball.x = this._centerX;
        this._ball.y = this._centerY;
        this.dispatchEvent(new egret.Event("vj_end"));
    }
    // 触摸移动小球位置
    private p1:egret.Point = new egret.Point();
    private p2:egret.Point = new egret.Point();
    private touchMove(e:egret.TouchEvent):void{
        if(this._touchIs){
            console.log("touchMove")
            // 获取手指和虚拟摇杆的距离
            this.p1.x = this._centerX;
            this.p1.y = this._centerY;
            this.p2.x = e.stageX;
            this.p2.y = e.stageY;
            var dist:number = egret.Point.distance(this.p1,this.p2);//获取位移
            var angle:number = Math.atan2(e.stageY-this._centerY,e.stageX-this._centerX);//获取角度
            console.log(angle)
            // 判断圆球是否在圆环内
            if(dist<=(this._circleRadius-this._ballRadius)){
                console.log(1111111)
                this._ball.x = e.stageX - this._distinct.x;
                this._ball.y = e.stageY - this._distinct.y;
            }else{
                console.log(2222222)
                this._ball.x = Math.cos(angle) * (this._circleRadius - this._ballRadius) + this._centerX;
                this._ball.y = Math.sin(angle) * (this._circleRadius - this._ballRadius) + this._centerY;
                console.log(Math.cos(angle))
                console.log(Math.sin(angle))
            }
            this.dispatchEventWith("vj_move", false , angle);
        }
    }
}