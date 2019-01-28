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
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(textureName, fireDelay) {
        var _this = _super.call(this) || this;
        /**飞机血量*/
        _this.enemyBloom = 10;
        _this.enemy = new egret.Bitmap(textureName);
        _this.enemy.width = 80;
        _this.enemy.height = 80;
        _this.addChild(_this.enemy);
        _this.fireDelay = fireDelay;
        _this.fireTimer = new egret.Timer(fireDelay);
        _this.fireTimer.addEventListener(egret.TimerEvent.TIMER, _this.createBullet, _this);
        _this.bloomFloor = new egret.Shape();
        _this.bloomFloor.graphics.beginFill(0x00ff00, 1);
        _this.bloomFloor.graphics.drawRect(_this.enemy.x, _this.enemy.y - 10, 100, 10);
        _this.bloomFloor.graphics.lineStyle(2, 0xffffff);
        _this.bloomFloor.graphics.endFill();
        _this.addChild(_this.bloomFloor);
        return _this;
    }
    /**生产*/
    Enemy.produce = function (textureName, fireDelay) {
        if (Enemy.cacheDict[textureName] == null) {
            Enemy.cacheDict[textureName] = [];
        }
        var dict = Enemy.cacheDict[textureName];
        var enemy;
        if (dict.length > 0) {
            enemy = dict.pop();
        }
        else {
            enemy = new Enemy(RES.getRes(textureName), fireDelay);
        }
        enemy.enemyBloom = 10;
        return enemy;
    };
    /**回收*/
    Enemy.reclaim = function (enemy, textureName) {
        if (Enemy.cacheDict[textureName] == null)
            Enemy.cacheDict[textureName] = [];
        var dict = Enemy.cacheDict[textureName];
        if (dict.indexOf(enemy))
            dict.push(enemy);
    };
    /**
     * 开火
    */
    Enemy.prototype.fire = function () {
        this.fireTimer.start();
    };
    /**停止开火*/
    Enemy.prototype.stopfire = function () {
        this.fireTimer.stop();
    };
    /**
     * 派发创建子弹事件
    */
    Enemy.prototype.createBullet = function (e) {
        this.dispatchEventWith("createBullet");
    };
    /**敌人对象池*/
    Enemy.cacheDict = {};
    return Enemy;
}(egret.DisplayObjectContainer));
__reflect(Enemy.prototype, "Enemy");
//# sourceMappingURL=Enemy.js.map