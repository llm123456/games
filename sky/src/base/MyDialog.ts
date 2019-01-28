/**
 * 对话框
*/
class MyDialog extends egret.DisplayObjectContainer{

	/**对话框文字*/
	private wenzi:string;
	/**对话框纹理*/
	private picture:egret.Shape;

	public constructor(wenzi:string) {
		super();
		this.wenzi = wenzi;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
	}

	private addToStage(e:egret.Event):void{
		// 蒙版
		var mengban:egret.Shape = new egret.Shape();
		// 创建对话框
		var duihuakuang:egret.Shape = new egret.Shape();
		duihuakuang.graphics.beginFill(0x222d42,1);
		duihuakuang.graphics.lineStyle(2,0x9dffff,1);
		duihuakuang.graphics.drawRoundRect(0,0,this.stage.stageWidth-40,200,20,20);
		duihuakuang.graphics.endFill();
		this.addChild(duihuakuang);

		// 添加文字
		var wenzi:egret.TextField = new egret.TextField;
		wenzi.text = this.wenzi;
		wenzi.x = 0;
		wenzi.y = 60;
		wenzi.size = 32;
		wenzi.background = true;
		wenzi.backgroundColor = 0x394255;
		wenzi.width = this.stage.stageWidth-44;
		this.addChild(wenzi);

		// 创建色块
		this.picture = new egret.Shape();
		this.picture.graphics.beginFill(0x45aaf2,1);
		this.picture.graphics.lineStyle(2,0xffffff,1);
		this.picture.graphics.drawRect(20,-25,50,50);
		this.picture.graphics.endFill();
		this.addChild(this.picture);
	}

}