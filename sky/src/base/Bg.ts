/**
 * 创建可滚动的图片
 */
class Bg extends egret.DisplayObjectContainer{
    // 设置图片数组
    private _imgArr: egret.Bitmap[];
    // 设置图片数量
    private _bgNum: number;
    // stage高
    private _stageH:number;
    // stage宽
    private _stageW:number;
    // 本身纹理的高度
    private _textureHeight:number;
    // 屏幕滚动的速度
    private _speed:number = 2;

    // 设置血层
    private _bloomFloor:egret.Shape;
    //设置血量
    private _bloomNum:egret.TextField;
    
    // 定时器
    private _gameRunTime:egret.Timer;
    // 定时器运行次数
    private _gameTimeCount:number=0;
    // 运行时间
    private _timer:egret.TextField;
    // 初始化天体的运动速度
    private _starSpeed:number = 2;
    // 设置天体数组
    private starImgArr:egret.Bitmap[] = [];
    // 设置天体数组2
    private starImgArr2:egret.Bitmap[] = [];
    // 设置摇杆控制器
    private _rocker:RockerBar;
    // 设置雷达扫描器
    private _randar:egret.Bitmap;

    private _plane: Plane; //飞机
    private _planeSpeed:number = 10;//飞机速度
    private _planeAngle:number = 0;//飞机飞行的角度
    private _planeSpeedX:number = 0;//飞机x轴移动速度
    private _planeSpeedY:number = 0;//飞机y轴移动速度

    // 技能1
    private skillImg1:egret.Bitmap;


    // 我的子弹
    private myBullet:Bullet[] = [];
    private _lastTimer:number;
    

    /**敌机*/
    private _enemy:Enemy[] = [];
    /**敌机子弹*/
    private _enemybullet:Bullet[] = [];
    /**出发创建敌机间隔时间*/
    private createEnemyTimer:egret.Timer = new egret.Timer(1000);
    // 设置触摸状态
    private _touchIs:boolean=false;
    // 鼠标点击时，全局坐标与飞机坐标的位置差
    private _distinct:egret.Point = new egret.Point();

    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    // 初始化
    protected onAddToStage(e:egret.Event){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        // 设置舞台的宽高
        this._stageH = this.stage.stageHeight;
        this._stageW = this.stage.stageWidth;

        // 创建多张纹理图片到数组中
        this.starImgArr2.push(game.createBitmapByName('Space04-09_png'))
        this.starImgArr2.push(game.createBitmapByName('Space04-10_png'))
        this.starImgArr2.push(game.createBitmapByName('Space04-11_png'))
        this.starImgArr2.push(game.createBitmapByName('Space04-12_png'))
        this.starImgArr2.push(game.createBitmapByName('Space04-13_png'))
        
        // 获取纹理图片
        var texture:egret.Texture = RES.getRes("Space04-03_jpg");
        this._textureHeight = texture.textureHeight;//获取纹理的高度用于后续计算
        this._bgNum = Math.ceil(this._stageH/this._textureHeight)+1;// 计算当前屏幕中需要的图片数量
        this._imgArr = [];
        // 创建这些图片，让他们的Y轴连起来
        for(var i=0; i<this._bgNum; i++){
            var bgImg:egret.Bitmap = game.createBitmapByName("Space04-03_jpg");
            bgImg.y = this._textureHeight*i - (this._textureHeight*this._bgNum - this._stageH);
            this._imgArr.push(bgImg);
            this.addChild(bgImg);
        }
        
        var bulletMateImg:egret.Bitmap = game.createBitmap("Space04-03_png", 10, 500, 50 ,50);
        this.addChild(bulletMateImg);
        
        //设置背景图层运动体(月球、陨石)
        var moon:egret.Bitmap = game.createBitmap("Space04-08_png", this._stageW*0.2, this._stageH*0.3, 150, 150);
        this.addChild(moon);
        var star1:egret.Bitmap = game.createBitmap("Space04-04_png", this._stageW*0.1, this._stageH*0.1, 50, 50);
        this.addChild(star1);
        var star2:egret.Bitmap = game.createBitmap("Space04-05_png", this._stageW*0.8, this._stageH*0.4, 150, 200);
        this.addChild(star2);
        this.starImgArr.push(moon);
        this.starImgArr.push(star1);
        this.starImgArr.push(star2);

        // 设置顶部控制器图层
        var upImg:egret.Bitmap = game.createBitmap("Space04-21_png", 0, 0, this._stageW, 90);
        this.addChild(upImg);
        // 设置暂停和照相图层
        var PauseAndCamera:egret.Bitmap = game.createBitmap("Space04-22_png", 10, 15, this._stageW*0.25, 50);
        this.addChild(PauseAndCamera);
        PauseAndCamera.touchEnabled = true;
        // PauseAndCamera.addEventListener(egret.TouchEvent.TOUCH_TAP,GameScene.createGameScene,this)

        // 设置时间图层
        var timeImg:egret.Bitmap = game.createBitmap("Space04-23_png", this._stageW*0.35, 15, 50, 30);
        this.addChild(timeImg);
        // 设置时间文本
        this._timer = new egret.TextField();
        this._timer.text = "00:00";
        this.addChild(this._timer);
        this._timer.bold = true;
        this._timer.textColor = 0x000000;
        this._timer.width = 120;
        this._timer.size = 40;
        this._timer.x = this._stageW*0.35+40;
        this._timer.y = 20;

        //设置秒的图层
        var secondImg:egret.Bitmap = game.createBitmap("Space04-24_png", this._stageW*0.56, 40, 30, 30);
        this.addChild(secondImg);


        //设置底部控制器图层
        var downImg:egret.Bitmap = game.createBitmap("Space05-201_png", 0, this._stageH-250, this._stageW, 250);
        this.addChild(downImg);

        //设置主控板图层
        var childImg1:egret.Bitmap = game.createBitmap("Space05-202_png", 0, this._stageH-250, this._stageW, 250);
        this.addChild(childImg1);
        
        //设置血条图层
        var bloomImg1:egret.Bitmap = game.createBitmap("Space04-26_png", 20, this._stageH-220, 10, 200);
        this.addChild(bloomImg1);
        var bloomImg2:egret.Bitmap = game.createBitmap("Space04-242_png", 65, this._stageH-210, 40, 20);
        this.addChild(bloomImg2);

        // 设置血层颜色及高度
        this._bloomFloor = new egret.Shape();
        this._bloomFloor.graphics.beginFill(0x00ff00,1);
        this._bloomFloor.graphics.drawRect(21,this._stageH-220,8,200);
        this._bloomFloor.graphics.endFill();
        this.addChild(this._bloomFloor)

        // 设置血量
        this._bloomNum = new egret.TextField();
        this._bloomNum.text = "100";
        this.addChild(this._bloomNum);
        this._bloomNum.textColor = 0x3fcca5;
        this._bloomNum.width = 70;
        this._bloomNum.x = 30;
        this._bloomNum.y = this._stageH - 220;

        //设置技能图层1
        this.skillImg1 = game.createBitmap("Space04-27_png", 95, this._stageH-205, 60, 60);
        this.addChild(this.skillImg1);
        this.skillImg1.touchEnabled = true;
        this.skillImg1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getSkill, this)

        //设置技能图层2
        var skillImg2:egret.Bitmap = game.createBitmap("Space04-28_png", 160, this._stageH-240, 60, 60);
        this.addChild(skillImg2);

        //设置技能图层3
        var skillImg3:egret.Bitmap = game.createBitmap("Space04-29_png", 230, this._stageH-240, 60, 60);
        this.addChild(skillImg3);

        // 设置遥感控制器
        this._rocker = new RockerBar();
        this.addChild(this._rocker);
        this._rocker.touchEnabled = true;
        this._rocker.start();
        this._rocker.addEventListener("vj_start",this.planeStart, this);
        this._rocker.addEventListener("vj_move",this.planeMove, this);
        this._rocker.addEventListener("vj_end",this.planeEnd, this);

        // 设置雷达扫描器
        // this._randar = game.createBitmap("Space04-33_png",222, this._stageH-98, 190, 190);
        // this.addChild(this._randar);
        // this._randar.anchorOffsetX = this._randar.width/2;
        // this._randar.anchorOffsetY = this._randar.height/2;
        // this.addEventListener(egret.Event.ENTER_FRAME,this.randarScan,this);
        // 设置雷达探索显示图(自己)
        var randarSelf:egret.Bitmap = game.createBitmap("Space04-30_png", 205, this._stageH-110, 30, 30);
        this.addChild(randarSelf);

        // 设置雷达探索显示图(友军)
        var randarMate:egret.Bitmap = game.createBitmap("Space04-31_png", 160, this._stageH-110, 20, 20);
        this.addChild(randarMate);

        // 设置雷达探索显示图(敌军)
        var randarEnemy:egret.Bitmap = game.createBitmap("Space04-32_png", 220, this._stageH-120, 20, 20);
        this.addChild(randarEnemy);

        // 设置子弹导向图(友军)
        var bulletMate:egret.Bitmap = game.createBitmap("Space04-192_png", 25, 525, 50, 50);
        // 设置对象的锚点(也就是图片对象相对于自身的初始点)
        bulletMate.anchorOffsetX = 25;
        bulletMate.anchorOffsetY = 25;
        bulletMate.rotation = -90;
        this.addChild(bulletMate);
        var bullteHu1:egret.Bitmap = game.createBitmap("Space04-19_png", 25, 525, 50 ,50);
        bullteHu1.anchorOffsetX = 25;
        bullteHu1.anchorOffsetY = 25;
        bullteHu1.rotation = -45;
        this.addChild(bullteHu1);

        // 设置子弹导向图(敌军)
        var bulletEnemy:egret.Bitmap = game.createBitmap("Space04-201_png", this._stageW-50, 460, 50 ,50);
        this.addChild(bulletEnemy);
        var bullteHu2:egret.Bitmap = game.createBitmap("Space04-191_png", this._stageW-50, 460, 50 ,50);
        this.addChild(bullteHu2);
        var bulletEnemyImg:egret.Bitmap = game.createBitmap("Space04-25_png", this._stageW-10, 460, 50, 50);
        this.addChild(bulletEnemyImg);

        
        // 创建飞机
        this._plane = new Plane(100);
        this.addChildAt(this._plane,4);
        this._plane.x = this._stageW/2;
        this._plane.y = this._stageH/2;
        this._plane.start();

        // 定时器启动
        this._gameRunTime = new egret.Timer(1000,0);
        this._gameRunTime.addEventListener(egret.TimerEvent.TIMER, this.getTime, this);
        this._gameRunTime.start()

        this._plane.fire();
        this._plane.addEventListener("createBullet",this.createBullet, this);
        
        /**创建敌机*/
        this.createEnemyTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemy, this);
        this.createEnemyTimer.start();
        
        this.start();

        // 创建对话层
        var duihua1 = new MyDialog("士兵们，今天要进行我们的第一次任务，你们准备好了么？");
        duihua1.x = 20;
        duihua1.y = this._stageH/2;
        this.addChild(duihua1);
    }

    /**技能变身*/
    private getSkill(e:egret.TouchEvent):void{
        if(e.target==this.skillImg1){
            if(this._plane._skillStatus=='skill1'){
                return
            }
            console.log("飞机变身了")
            this._plane.skill_one()
        }
    }

    /**创建敌机*/
    private createEnemy(e:egret.TimerEvent):void{
        var enemy:Enemy = Enemy.produce("ship1-01_png",1000)
        enemy.x = Math.random()*(this._stageW-enemy.width);
        enemy.y = -enemy.height-Math.random()*300;
        enemy.fire();
        this.addChildAt(enemy,4);
        this._enemy.push(enemy);
        enemy.addEventListener("createBullet",this.createBullet,this);
    }
    /**创建子弹*/
    private createBullet(e:egret.Event):void{
        var bullet:Bullet;
        if(e.target == this._plane){
            for(var i:number=0;i<2;i++){
                bullet = Bullet.produce("b1_png");
                bullet.x = (i==0)?(this._plane.x-20):(this._plane.x+10)
                bullet.y = this._plane.y-30;
                this.addChildAt(bullet,4);
                this.myBullet.push(bullet);
            }
        }else{
            var enemy:Enemy = e.target;
            bullet = Bullet.produce("b2_png");
            bullet.x = enemy.x + 40;
            bullet.y = enemy.y + 80;
            this.addChildAt(bullet,4);
            this._enemybullet.push(bullet);
        }
    }
    /**
     * 雷达扫描，监听敌军和友军活动情况
    */
    private randarScan(e:egret.Event):void{
        this._randar.rotation += 2;
        // e.target
    }

    /**
     * 飞机开始运动
    */
    private planeStart():void{
        this.addEventListener(egret.Event.ENTER_FRAME, this.planeRun, this)
    }
    /**
     * 飞机运动
    */
    private planeMove(e:egret.Event):void{
        this._planeAngle = 180*e.data/Math.PI+90;
        this._planeSpeedX = Math.cos(e.data)*this._planeSpeed;
        this._planeSpeedY = Math.sin(e.data)*this._planeSpeed;
    }
    /**
     * 飞机结束运动
    */
    private planeEnd():void{
        this.removeEventListener(egret.Event.ENTER_FRAME, this.planeRun, this);
    }
    /**
     * 
    */
    private planeRun():void{
        // console.log(this._planeSpeedX,this._planeSpeedY)
        this._plane.rotation = this._planeAngle;
        // if(this._plane.x>=50&&this._plane.x<=this._stageW-50){
        //     this._plane.x += this._planeSpeedX;
        // }else if(this._plane.x<50){
        //     this._plane.x = 50
        // }else{
        //     this._plane.x = this._stageW-50
        // }
            
        // if(this._plane.y>=100&&this._plane.y<=this._stageH-300){
        //     this._plane.y += this._planeSpeedY;
        // }else if(this._plane.y<100){
        //     this._plane.y = 100
        // }else{
        //     this._plane.y = this._stageH-300
        // }
            
        
    }
    /** 监听所有物体的运动*/
    public start():void{
        // 监听天体的运动
        this.removeEventListener(egret.Event.ENTER_FRAME, this.starRun, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.starRun, this);
        // this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        // this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        //监听敌机和子弹的运动
        this.removeEventListener(egret.Event.ENTER_FRAME, this.gameRun, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.gameRun, this);
    }
    /**停止所有物体的运动*/
    public stop():void{
        this.removeEventListener(egret.Event.ENTER_FRAME, this.starRun, this);
        // this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        // this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        //监听敌机和子弹的运动
        this.removeEventListener(egret.Event.ENTER_FRAME, this.gameRun, this);
    }
    /**
     * 敌机和子弹的运动
    */
    private gameRun(e:egret.Event):void{
        // 为了防止fps下降造成回收慢，生成快，导致DRAW数量时空，需要一个计算系数，当fps下降时，让运动加快
        var nowTimer:number = egret.getTimer();
        var fps:number = 1000/(nowTimer-this._lastTimer);
        this._lastTimer = nowTimer;
        var speedOffset:number = 60/fps;
        //我的子弹运动
        var i:number = 0;
        var bullet:Bullet;
        var myBulletCount:number = this.myBullet.length;
        for(;i<myBulletCount;i++){
            bullet = this.myBullet[i];
            if(bullet.y<-bullet.height){
                this.removeChild(bullet);
                Bullet.recliam(bullet);
                this.myBullet.splice(i,1);
                i--;
                myBulletCount--;
            }
            bullet.y -= 12*speedOffset;
        }
        // 敌机运动
        var enemy:Enemy;
        var enemyCount:number = this._enemy.length;
        for(i=0;i<enemyCount;i++){
            enemy = this._enemy[i];
            if(enemy.y>this._stageH){
                this.removeChild(enemy)
                Enemy.reclaim(enemy,"ship1-01_png");
                enemy.removeEventListener("createBullet",this.createBullet,this)
                enemy.stopfire();
                this._enemy.splice(i,1);
                i--;
                enemyCount--;
            }
            enemy.y += 4*speedOffset;
        }
        // 敌机子弹运动
        var enemybulletCount:number = this._enemybullet.length;
        for(i=0;i<enemybulletCount;i++){
            bullet = this._enemybullet[i];
            if(bullet.y>this._stageH){
                this.removeChild(bullet);
                Bullet.recliam(bullet);
                this._enemybullet.splice(i,1);
                i--;
                enemybulletCount--;
            }
            bullet.y += 8*speedOffset;
        }

        this.hitTest()
    }
    /**碰撞检测*/
    private hitTest():void{
        var i:number,j:number;
        var bullet:Bullet;
        var enemy:Enemy;
        var myBulletCount:number = this.myBullet.length;
        var EnemyCount:number = this._enemy.length;
        var EnemyBulletCount:number = this._enemybullet.length;
        // 将消失的飞机和子弹记录
        var delplane:Enemy[] = [];
        var delBullet:Bullet[] = [];
        /**我的子弹可以消灭敌人*/
        for(i=0;i<myBulletCount;i++){
            bullet = this.myBullet[i];
            for(j=0;EnemyCount;j++){
                enemy = this._enemy[j];
                if(enemy==undefined){
                    break;
                }
                if(game.testHit(bullet,enemy)){
                    enemy.enemyBloom -= 10;
                    if(delBullet.indexOf(bullet)==-1)
                        delBullet.push(bullet)
                    if(enemy.enemyBloom<=0&&delplane.indexOf(enemy))
                        delplane.push(enemy)
                }
            }
        }
        // 敌人的子弹可以让我减血
        for(i=0;i<EnemyBulletCount;i++){
            bullet = this._enemybullet[i];
            if(game.testHit(bullet,this._plane)){
                this._plane._planeBloom -= 10;
                if(delBullet.indexOf(bullet)==-1)
                    delBullet.push(bullet)
            }
        }
        // 敌人的撞击可以消灭我
        // for(i=0;i<EnemyCount;i++){
        //     enemy = this._enemy[i];
        //     if(game.testHit(enemy,this._plane)){
        //         this._plane._planeBloom -= 100
        //     }
        // }
        console.log(this._plane._planeBloom)
        if(this._plane._planeBloom<=0){
            // 游戏结束
            this.gameStop()
        }else{
            console.log(delBullet.length)
            while(delBullet.length>0){
                bullet = delBullet.pop();
                this.removeChild(bullet);
                if(bullet.textureName=="b1_png")
                    this.myBullet.splice(this.myBullet.indexOf(bullet),1)
                else
                    this._enemybullet.splice(this._enemybullet.indexOf(bullet),1)
                Bullet.recliam(bullet)
            }

            while(delplane.length>0){
                enemy = delplane.pop();
                enemy.stopfire();
                enemy.removeEventListener("createBullet",this.createBullet,this);
                this.removeChild(enemy);
                this._enemy.splice(this._enemy.indexOf(enemy),1)
                Enemy.reclaim(enemy,"ship1-01_png")
            }
        }
        this._bloomNum.text = ''+this._plane._planeBloom;
        
        // 重置血条
        this._bloomFloor.graphics.clear();
        this._bloomFloor.graphics.beginFill(0x00ff00,1);
        this._bloomFloor.graphics.drawRect(21,this._stageH-20-this._plane._planeBloom*2,8,this._plane._planeBloom*2);
        this._bloomFloor.graphics.endFill();
    }

    /**游戏结束*/
    private gameStop():void{
        //移除摇杆的监听事件
        this._rocker.removeEventListener("vj_start",this.planeStart, this);
        this._rocker.removeEventListener("vj_move",this.planeMove, this);
        this._rocker.removeEventListener("vj_end",this.planeEnd, this);
        this._rocker.stop();

        // 移除雷达监听事件
        this.removeEventListener(egret.Event.ENTER_FRAME,this.randarScan,this);

        // 移除飞机的监听事件
        this._plane.stop();

        this._plane.stopFire();
        this._plane.removeEventListener("createBullet",this.createBullet, this);

        // 移除敌机的监听事件
        this.createEnemyTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemy, this);
        this.createEnemyTimer.stop();
        // 移除所有物体的监听
        this.stop();

        // 清理子弹
        var i:number = 0;
        var bullet:Bullet;
        var BulletCount:number = this.myBullet.length;
        while(this.myBullet.length>0){
            bullet = this.myBullet.pop()
            this.removeChild(bullet)
            Bullet.recliam(bullet)
        }
        while(this._enemybullet.length>0){
            bullet = this._enemybullet.pop()
            this.removeChild(bullet)
            Bullet.recliam(bullet)
        }
        // 清理飞机
        var enemy:Enemy;
        while(this._enemy.length>0){
            enemy = this._enemy.pop();
            enemy.stopfire();
            enemy.removeEventListener('createBullet',this.createBullet,this);
            this.removeChild(enemy);
            Enemy.reclaim(enemy,'ship1-01_png');
        }
        // 显示成绩
        

    }

    /**
     * 天体运动
    */
    private starRun(e:egret.Event):void{
        var starCount:number = this.starImgArr.length;
        for(var i:number=0;i<starCount;i++){
            var star = this.starImgArr[i];
            star.x -= this._planeSpeedX;
            star.y -= this._planeSpeedY;
            var img ;
            if(star!=undefined){
            if(star.x>this._stageH+star.width){
                img = this.getObjByArr(this.starImgArr2);
                this.starImgArr.push(img)
                this.addChildAt(img,this.getChildIndex(star))
                this.removeChild(star);
                this.starImgArr.splice(this.starImgArr.indexOf(star),1)
                this.starImgArr2.push(star)
                img.x = -img.width;
                img.y = Math.random()*(this._stageH-300);
                break;
            }

            if(star.x<-star.width){
                img = this.getObjByArr(this.starImgArr2);
                this.starImgArr.push(img)
                this.addChildAt(img,this.getChildIndex(star))
                this.removeChild(star);
                this.starImgArr.splice(this.starImgArr.indexOf(star),1)
                this.starImgArr2.push(star)
                img.x = this._stageW+img.width;
                img.y = Math.random()*(this._stageH-300);
                break;
            }
            
            if(star.y>this._stageH){
                img = this.getObjByArr(this.starImgArr2);
                this.starImgArr.push(img)
                this.addChildAt(img,this.getChildIndex(star))
                this.removeChild(star);
                this.starImgArr.splice(this.starImgArr.indexOf(star),1)
                this.starImgArr2.push(star)
                img.x = Math.random()*(this._stageH-300);
                img.y = -img.height;
                break;
            }

            if(star.y<-star.height){
                img = this.getObjByArr(this.starImgArr2);
                this.starImgArr.push(img)
                this.addChildAt(img,this.getChildIndex(star))
                this.removeChild(star);
                this.starImgArr.splice(this.starImgArr.indexOf(star),1)
                this.starImgArr2.push(star)
                img.x = Math.random()*(this._stageH-300);
                img.y = this._stageH;
                break;
            }
            }
        }
    }

    

    // 逐帧运动
    private enterFrameHandler(e:egret.Event):void{
        for(var i=0; i<this._bgNum; i++){
            var bgImg:egret.Bitmap = this._imgArr[i];
            bgImg.y += this._speed;
            // 判断超出屏幕后回到队首
            if(bgImg.y>this._stageH){
                bgImg.y = this._imgArr[0].y - this._textureHeight;
                this._imgArr.pop();
                this._imgArr.unshift(bgImg);
            }
        }
    }
    /**随机取数组中的对象
     * arr数组
    */
    public getObjByArr(arr:egret.Bitmap[]):egret.Bitmap{
        var img = arr[Math.floor(Math.random()*arr.length)]
        img.width = 40+Math.round(Math.random()*20);
        img.height = 40+Math.round(Math.random()*20);
        var value = Math.random();
        img.alpha = value>0.5?value:0.5;
        return img
    }


    /**计时器*/
    public getTime(e:egret.TimerEvent):void{
        this._gameTimeCount += 1
        console.log("计时器"+this._gameTimeCount)
        this._timer.text = (this._gameTimeCount/60>=10?""+(Math.floor(this._gameTimeCount/60)):"0"+(Math.floor(this._gameTimeCount/60)))+":"+(this._gameTimeCount%60>=10?""+(Math.floor(this._gameTimeCount%60)):"0"+(Math.floor(this._gameTimeCount%60)))
    }
}