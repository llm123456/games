class Enemy extends egret.DisplayObjectContainer{
    /**敌人位图*/
    private enemy:egret.Bitmap;
    /**创建子弹的时间间隔*/
    private fireDelay:number;
    /**定时射击*/
    private fireTimer:egret.Timer;
    /**飞机血量*/
    public enemyBloom:number = 10;
    /**敌机血条文本*/
    private bloomFloor:egret.Shape;
    /**敌人对象池*/
    private static cacheDict:Object = {};

    /**生产*/
    public static produce(textureName:string,fireDelay:number):Enemy{
        if(Enemy.cacheDict[textureName]==null){
            Enemy.cacheDict[textureName] = [];
        }
        var dict:Enemy[] = Enemy.cacheDict[textureName];
        var enemy:Enemy;
        if(dict.length>0){
            enemy = dict.pop();
        }else{
            enemy = new Enemy(RES.getRes(textureName),fireDelay);
        }
        enemy.enemyBloom = 10;
        return enemy
    }
    /**回收*/
    public static reclaim(enemy:Enemy,textureName:string):void{
        if(Enemy.cacheDict[textureName]==null)
            Enemy.cacheDict[textureName] = []
        var dict:Enemy[] = Enemy.cacheDict[textureName];
        if(dict.indexOf(enemy))
            dict.push(enemy)
    }
    public constructor( textureName: egret.Texture,fireDelay:number){
        super();

        this.enemy = new egret.Bitmap(textureName)
        this.enemy.width = 80;
        this.enemy.height = 80;
        this.addChild(this.enemy);
        this.fireDelay = fireDelay;
        this.fireTimer = new egret.Timer(fireDelay);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this)

        this.bloomFloor = new egret.Shape();
        this.bloomFloor.graphics.beginFill(0x00ff00,1);
        this.bloomFloor.graphics.drawRect(this.enemy.x,this.enemy.y-10,100,10);
        this.bloomFloor.graphics.lineStyle(2,0xffffff);
        this.bloomFloor.graphics.endFill();
        this.addChild(this.bloomFloor)
    }
    /**
     * 开火
    */
    public fire():void{
        this.fireTimer.start()
    }
    /**停止开火*/
    public stopfire():void{
        this.fireTimer.stop()
    }
    /**
     * 派发创建子弹事件
    */
    private createBullet(e:egret.TimerEvent):void{
        this.dispatchEventWith("createBullet")
    }
    
}