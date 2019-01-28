/**
 * 子弹
*/
class Bullet extends egret.Bitmap{
    private static cacheDict:Object = {};

    public textureName:string;
    /**
     * 生产
    */
    public static produce(textureName:string):Bullet{
        if(Bullet.cacheDict[textureName]==null){
            Bullet.cacheDict[textureName] = []
        }
        var dict:Bullet[] = Bullet.cacheDict[textureName];
        var bullet:Bullet;
        if(dict.length>0){
            bullet = dict.pop()
        }else{
            bullet = new Bullet(RES.getRes(textureName),textureName);
            bullet.width = 10;
            bullet.height = 30;
        }
        bullet.textureName = textureName;
        return bullet;
    }
    /**回收*/
    public static recliam(bullet:Bullet):void{
        var textureName:string = bullet.textureName;
        if(Bullet.cacheDict[textureName]==null)
            Bullet.cacheDict[textureName] = []
        var dict:Bullet[] = Bullet.cacheDict[textureName]
        if(dict.indexOf(bullet)==-1)
            dict.push(bullet)
    }
    public constructor(texture:egret.Texture,textureName:string){
        super(texture);
        this.textureName = textureName;
    }
}