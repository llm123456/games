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
/**
 * 子弹
*/
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(texture, textureName) {
        var _this = _super.call(this, texture) || this;
        _this.textureName = textureName;
        return _this;
    }
    /**
     * 生产
    */
    Bullet.produce = function (textureName) {
        if (Bullet.cacheDict[textureName] == null) {
            Bullet.cacheDict[textureName] = [];
        }
        var dict = Bullet.cacheDict[textureName];
        var bullet;
        if (dict.length > 0) {
            bullet = dict.pop();
        }
        else {
            bullet = new Bullet(RES.getRes(textureName), textureName);
            bullet.width = 10;
            bullet.height = 30;
        }
        bullet.textureName = textureName;
        return bullet;
    };
    /**回收*/
    Bullet.recliam = function (bullet) {
        var textureName = bullet.textureName;
        if (Bullet.cacheDict[textureName] == null)
            Bullet.cacheDict[textureName] = [];
        var dict = Bullet.cacheDict[textureName];
        if (dict.indexOf(bullet) == -1)
            dict.push(bullet);
    };
    Bullet.cacheDict = {};
    return Bullet;
}(egret.Bitmap));
__reflect(Bullet.prototype, "Bullet");
//# sourceMappingURL=Bullet.js.map