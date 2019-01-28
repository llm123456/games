namespace game{
    /**创建图片
     * name: 图片名称
    */
    export function createBitmapByName(name:string):egret.Bitmap{
        var img:egret.Bitmap = new egret.Bitmap()
        var texture:egret.Texture = RES.getRes(name);
        img.texture = texture;
        return img;
    }

    /**创建图片
     * name: 图片名称
     * x: 舞台x轴位置
     * y: 舞台y轴位置
     * width: 图片宽度
     * height: 图片高度
    */
    export function createBitmap(name:string, x:number, y:number, width:number, height:number):egret.Bitmap{
        var img:egret.Bitmap = new egret.Bitmap()
        var texture:egret.Texture = RES.getRes(name);
        img.texture = texture;
        img.width = width;
        img.height = height;
        img.x = x;
        img.y = y;
        return img;
    }

    /**
     * 矩形检测碰撞区域
    */
    export function testHit(obj1:egret.DisplayObject, obj2:egret.DisplayObject):boolean {
        var rect1:egret.Rectangle = obj1.getBounds();
        var rect2:egret.Rectangle = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj1.y;
        return rect1.intersects(rect2);
    }
}