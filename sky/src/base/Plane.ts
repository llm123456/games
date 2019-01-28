class Plane extends egret.Sprite {

    private _x: number = 0;
    private _y: number = 0;
    private _r: number = 50;
    private _touchIs:boolean=false;
    // 鼠标点击时，全局坐标与飞机坐标的位置差
    private _distinct:egret.Point = new egret.Point();

    // 飞机生命值
    public _planeBloom:number=100;
    // 发射子弹间隔
    private _fireDelay:number;
    // 定时开火
    private _fireTimer:egret.Timer; 
    // 屏幕宽度
    private _stageW:number;
    // 屏幕高度
    private _stageH:number;
    //飞机
    private _plane:egret.Bitmap;
    // 左侧翼
    private _leftPlane:egret.Bitmap;
    // 右侧翼
    private _rightPlane:egret.Bitmap;
    // 光柱
    private _guangzhu:egret.Bitmap;
    // 设置尾部光柱中的星茫点数组
    private _starImg:egret.Bitmap[];
    // 设置星茫点数量
    private _starNum:number=20;
    // 设置星茫点运动速度
    private _starSpeed:number=2;
    // 初始化时星茫点的创建时间
    private _starTime:number=100;

    // 技能形态
    public _skillStatus:string; 

    constructor (fireDelay:number) {
        super();
        this._fireDelay = fireDelay;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onAddToStage():void{

        // 获取屏幕的高度和宽度
        this._stageH = this.stage.stageHeight;
        this._stageW = this.stage.stageWidth;

        // 创建飞机
        this._plane = game.createBitmapByName('Space04-14-05_png');
        // var img:egret.Bitmap = game.createBitmapByName('Space04-14_png');
        this._plane.width = 120;
        this._plane.height = 90;
        this.addChild(this._plane);
        
        //创建尾部光柱
        for(var i=0;i<2;i++){
            var guangzhu = game.createBitmap("Space04-16_png", i==0?this._plane.x+15:this._plane.x+100, this._plane.y+65, 5, 100);
            // guangzhu.anchorOffsetX = 30;
            // guangzhu.anchorOffsetY = 50;
            this.addChild(guangzhu);
        }
        
        var guangzhu = game.createBitmap("Space04-16_png", this._plane.x+52, this._plane.y+75, 15, 100);
        // guangzhu.anchorOffsetX = 30;
        // guangzhu.anchorOffsetY = 50;
        this._guangzhu = guangzhu;
        this.addChild(this._guangzhu);

        this.setChildIndex(this._plane,this.getChildIndex(this._guangzhu));

        // 飞机侧翼
        this._leftPlane = game.createBitmap('Space04-14-05-03_png',this._plane.x+40,this._plane.y+5,15,74);
        this._rightPlane = game.createBitmap('Space04-14-05-04_png',this._plane.x+65,this._plane.y+5,15,74);
        this.addChild(this._leftPlane);
        this.addChild(this._rightPlane);

        this._starImg = [];
        
        // this._starTime.addEventListener(egret.TimerEvent.TIMER,)
        // 设置星茫点的数量
        for(var i:number=0;i<this._starNum;i++){
            var star:egret.Bitmap = game.createBitmapByName("Space04-18_png");
            star.width = 10
            star.height = 10
            // 设置星茫点位移
            star['shift'] = 0;
            star.x = this._guangzhu.x+this.getRandom();
            star.y = this._guangzhu.y;
            this._starImg.push(star);
        }
        // 监听星茫点移动
        this.addEventListener(egret.Event.ENTER_FRAME, this.addStar, this);

        this._fireTimer = new egret.Timer(this._fireDelay);
        this._fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        
        
        this.anchorOffsetX = this._plane.width/2;
        this.anchorOffsetY = this._plane.height/2;

        // // 尾焰
        // var system = new particle.GravityParticleSystem(RES.getRes("weiyan_png"),RES.getRes("weiyan_json"));
        // console.log(system)
        // this.addChild(system);
        // system.start();
        // system.y = this._plane.x
        // system.x = this._plane.y+50
        // system.emitterX = 0
        // system.emitterY = 0
    }

    /**开火
     *  fireDelay:开火间隔
    */
    public fire():void{
        this._fireTimer.start()
    }
    /**停火*/
    public stopFire():void{
        this._fireTimer.stop()
    }
    /**创建外部子弹*/
    private createBullet(e:egret.TimerEvent):void{
        this.dispatchEventWith("createBullet");
    }
    private addStar():void{
        //是星茫点运动起来
        for(var i:number=0;i<this._starImg.length-1;i++){
            // 获取每个对象的相对位移
            this._starImg[i].y += this._starSpeed;
            this._starImg[i]['shift'] += this._starSpeed;
            this.addChildAt(this._starImg[i],this.numChildren-1);
            if(this._starImg[i]['shift']>=200){
                this.removeChild(this._starImg[i]);
                this._starImg[i]['shift'] = 0;
                this._starImg[i].x = this._guangzhu.x+this.getRandom();
                this._starImg[i].y = this._guangzhu.y;
                this._starImg.splice(this._starImg.indexOf(this._starImg[i]),1)
                this._starImg.push(this._starImg[i])
            }
        }
    }

    private reclaim(){
        
    }
    
    /**
     * 创建随机函数
    */
    public getRandom():number{
        // var fuhao = "";
        // var number = Math.round(Math.random()*10)
        // if(Math.random()<0.5){
        //     fuhao = "-";
        //     number = parseInt(fuhao+Math.round(Math.random()*30))
        // }
        // return number;
        return Math.round(Math.random()*50)
    }

    public start():void{
        this.touchEnabled =true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchDown, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchUp, this);
    }

    public stop():void{
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchDown, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchUp, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.addStar, this);
    }
    /**
     * 鼠标按下时
    */
    private touchDown(e:egret.TouchEvent):void{
        this._touchIs = true;
        this._distinct.x = e.stageX - this.x;
        this._distinct.y = e.stageY - this.y;
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
    }

    /**
     * 鼠标抬起时
    */
    private touchUp(e:egret.TouchEvent):void{
        this._touchIs = false;
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
    }


    /**
     * 鼠标移动时
    */
    private onMove(e:egret.TouchEvent):void{
        if(this._touchIs){
            this.x = e.stageX - this._distinct.x;
            this.y = e.stageY - this._distinct.y;
        }
    }
    // 创建光球
    private lightPie:egret.Bitmap;
    // 创建激光
    private lightBar:egret.Bitmap;
    
    // 光圈
    private guangquan:egret.Shape;
    // 光圈半径
    private guang_radius:number = 10;
    // 光圈2
    private guangquan2:egret.Shape;
    // 光圈半径2
    private guang_radius2:number = 150;

     private guang_radius3:number=100;
    private guangquan3:egret.Shape;

    // 延迟时间
    private latetime:egret.Timer = new egret.Timer(1400);

    // 延迟时间1
    private lasttime1:egret.Timer = new egret.Timer(100);

    // 延迟时间2
    private lasttime2:egret.Timer = new egret.Timer(700,1);
    // 延迟时间3
    private lasttime3:egret.Timer = new egret.Timer(100);

    // 延迟时间4
    private lasttime4:egret.Timer = new egret.Timer(1000,1);

    /**技能1*/
    public skill_one():void{
        this.stopFire();
        this._skillStatus = 'skill1'
        // 放射光环，机翼上升
        this.guangquan = new egret.Shape();
        this.guangquan.graphics.beginFill(0xffffff,0);
        this.guangquan.graphics.lineStyle(3,0xffffff);
        this.guangquan.graphics.drawCircle(this._plane.x+this._plane.width/2,this._plane.y+this._plane.height/2,this.guang_radius);
        this.guangquan.graphics.endFill();
        this.addChild(this.guangquan);

        this.lasttime1.addEventListener(egret.TimerEvent.TIMER, this.fashe, this);
        this.lasttime1.start();
        
        // 机翼合并
        egret.Tween.get(this._leftPlane).to({y:this._plane.y-10},500).to({x:this._leftPlane.x+5},300);
        egret.Tween.get(this._rightPlane).to({y:this._plane.y-10},500).to({x:this._rightPlane.x-5},300);
        
        // 光环回收
        this.guangquan2 = new egret.Shape();
        this.guangquan2.graphics.beginFill(0xffffff,0);
        this.guangquan2.graphics.lineStyle(5,0xffffff);
        this.guangquan2.graphics.drawCircle(this._plane.x+this._plane.width/2,this._plane.y+this._plane.height/2,this.guang_radius2);
        this.guangquan2.graphics.endFill();
        
        this.lasttime2.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.huishou, this);
        this.lasttime2.start()

        

        this.guangquan3 = new egret.Shape();
        this.guangquan3.graphics.beginFill(0xffffff,1);
        this.guangquan3.graphics.lineStyle(2,0xffffff);
        this.guangquan3.graphics.drawCircle(this._rightPlane.x,this._rightPlane.y,this.guang_radius3);
        this.guangquan3.graphics.endFill();

        // 光圈收缩
        this.lasttime4.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.changePieToBig, this);
        this.lasttime4.start()
        
        // 创建蒙版
        this.lightPie = game.createBitmap("zhezhao_png",this._rightPlane.x-10,this._plane.y+50,10,0);
        this.addChildAt(this.lightPie,this.getChildIndex(this._plane));
        this.lightPie.alpha = 0.60;
        // 创建光柱
        this.lightBar = game.createBitmap("whitebar_png",this._rightPlane.x-10,this._plane.y+50,10,0);
        this.addChildAt(this.lightBar,this.getChildIndex(this._plane));

        // 创建延迟时间
        this.latetime.addEventListener(egret.TimerEvent.TIMER,this.skillRun,this);
        this.latetime.start()
        // egret.Tween.get(this._guangzhu).to({x:this._guangzhu.x+20,width:20},800)
    }

    /**光环进行扩张*/
    private fashe(e:egret.TimerEvent):void{
        if(this.guangquan.alpha<=0){
            this.removeChild(this.guangquan)
            this.lasttime1.removeEventListener(egret.TimerEvent.TIMER,this.fashe,this);
            this.lasttime1.stop();
        }else{
            this.guangquan.graphics.clear();
            this.guang_radius += 50;
            this.guangquan.graphics.beginFill(0xffffff,0);
            this.guangquan.graphics.lineStyle(2,0xffffff);
            this.guangquan.graphics.drawCircle(this._plane.x+this._plane.width/2,this._plane.y+this._plane.height/2,this.guang_radius);
            this.guangquan.alpha -= 0.3;
            this.guangquan.graphics.endFill();
        }
    }

    /**光环在5s后回收*/
    private huishou(e:egret.TimerEvent):void{
        this.lasttime2.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.huishou, this);
        this.lasttime2.stop();

        this.addChild(this.guangquan2);

        this.lasttime1.addEventListener(egret.TimerEvent.TIMER, this.huishouRun, this);
        this.lasttime1.start();
    }
    /**光环回收时改变重画光圈*/
    private huishouRun(e:egret.TimerEvent):void{
        if(this.guang_radius2<=0){
            this.removeChild(this.guangquan2)
            this.lasttime1.removeEventListener(egret.TimerEvent.TIMER,this.huishouRun,this);
            this.lasttime1.stop()
        }else{
            this.guangquan2.graphics.clear();
            this.guang_radius2 -= 50;
            this.guangquan2.graphics.beginFill(0xffffff,0);
            this.guangquan2.graphics.lineStyle(5,0xffffff);
            this.guangquan2.graphics.drawCircle(this._plane.x+this._plane.width/2,this._plane.y+this._plane.height/2,this.guang_radius2);
            this.guangquan2.graphics.endFill();
        }
    }

   
    /**
     * 光圈收缩把shape画出的图形变成圆
    */
    private changePieToBig(e:egret.TimerEvent):void{
        this.lasttime4.removeEventListener(egret.TimerEvent.TIMER_COMPLETE,this.changePieToBig,this);
        this.lasttime4.stop();

        this.addChild(this.guangquan3);

        this.lasttime3.addEventListener(egret.TimerEvent.TIMER, this.shousuo, this);
        this.lasttime3.start();
    }

    /**光圈收缩*/
    private shousuo(e:egret.TimerEvent):void{
        if(this.guang_radius3<=30){
            this.removeChild(this.guangquan3);
            this.lasttime3.removeEventListener(egret.TimerEvent.TIMER,this.shousuo,this);
            this.lasttime3.stop();
        }else{
            this.guangquan3.graphics.clear();
            this.guang_radius3 -= 35;
            this.guangquan3.graphics.beginFill(0xffffff,1);
            this.guangquan3.graphics.lineStyle(5,0xffffff);
            this.guangquan3.graphics.drawCircle(this._rightPlane.x,this._rightPlane.y,this.guang_radius3);
            this.guangquan3.graphics.endFill();
        }
    }
    
    private yanchi:egret.Timer = new egret.Timer(300)
    /**监听技能1光柱运动*/
    private skillRun(e:egret.TimerEvent):void{
        console.log("光柱技能")
        this.latetime.removeEventListener(egret.TimerEvent.TIMER,this.skillRun,this);
        this.latetime.stop()
        egret.Tween.get(this.lightPie).to({width:50,height:1000,x:this._rightPlane.x-25,y:this._plane.y-950},1000);
        egret.Tween.get(this.lightBar).to({width:30,height:1000,x:this._rightPlane.x-15,y:this._plane.y-950},1000);
        
        this.yanchi.addEventListener(egret.TimerEvent.TIMER,this.skillMove,this);
        this.yanchi.start()
    }
    private skillMove(e:egret.TimerEvent):void{
        if(this.lightPie.width==50){
            egret.Tween.get(this.lightPie).to({width:40,x:this._rightPlane.x-20},300);
            egret.Tween.get(this.lightBar).to({width:20,x:this._rightPlane.x-10},300);
        }else{
            egret.Tween.get(this.lightPie).to({width:50,x:this._rightPlane.x-25},300);
            egret.Tween.get(this.lightBar).to({width:30,x:this._rightPlane.x-15},300);
        }
    }
}