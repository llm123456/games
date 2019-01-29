namespace game{
	export class StoryScene extends base.BaseScene{
		private gushibj:egret.Bitmap;

		// 返回按钮
		private text1:egret.TextField;
		//图片数组
		private images:egret.Bitmap[] = [];
		// 图片索引
		private index:number = 0;
		// 图片容器
		private rightCon:egret.DisplayObjectContainer;

		// 容器宽高
		private _width;
		private _height;

		constructor(level:number){
			super("story");
			console.log(level);
			this.index = level;
			
		}

		protected async Init() {
			console.log("init")
			this._width = this.uiLayer.width;
			this._height = this.uiLayer.height;
			base.API.Init("http://127.0.0.1:8000/api/")
			base.API.call("get_plot",{user_name:"a",level:1}).then((response)=>{
				console.log(response)

				var bgImg:egret.Bitmap = game.createBitmapByName("Space04-03_jpg");
				bgImg.height = this._height;
				bgImg.width = this._width;
				bgImg.x = 0;
				bgImg.y = 0;
				this.uiLayer.addChild(bgImg);
				console.log(bgImg)

				var beijing = new egret.Shape();
				beijing.graphics.beginFill(0xff0000,1);
				beijing.graphics.drawRect(0,0,this._width,50);
				beijing.graphics.endFill();
				this.uiLayer.addChild(beijing);

				this.text1 = new egret.TextField();
				this.text1.text = '返回';
				this.text1.touchEnabled = true;
				this.uiLayer.addChild(this.text1);
				this.text1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.return, this);
				var datalength = response['imgs'].length
				for(var i=0;i<datalength;i++){
					var img1 = game.createBitmap(response['imgs'][i]["name"],0,50,this._width,this._height-50);
					this.images.push(img1);
				}
				// var img1 = game.createBitmap("mh1_jpg",0,50,this._width,this._height-50);
				// var img2 = game.createBitmap("mh2_jpg",0,50,this._width,this._height-50);
				// var img3 = game.createBitmap("mh3_jpg",0,50,this._width,this._height-50);
				// this.images.push(img1);
				// this.images.push(img2);
				// this.images.push(img3);
				// // this.addChild(img1);
				// console.log(img1)
				// console.log(img2)
				// console.log(img3)
				console.log(this.images)

				this.rightCon = new egret.DisplayObjectContainer();
				this.rightCon.height = this._height;
				this.rightCon.width = this._width;
				this.rightCon.x = 0;
				this.rightCon.y = 0;
				this.rightCon.touchEnabled = true;
				this.rightCon.addChild(this.images[0])
				this.uiLayer.addChild(this.rightCon);
				console.log(this.rightCon);
				this.rightCon.addEventListener(egret.TouchEvent.TOUCH_TAP,this.point,this);
			}).catch(err=>{
				console.log(err)
			})
			
			
			// let story = new eui.Image("bg_jpg");
			// story.horizontalCenter = 0;
			// story.verticalCenter = 0;
			// this.uiLayer.addChild(story)

			// let returnBtn = new eui.Button();
			// returnBtn.label = "返回";
			// returnBtn.enabled = true;
			// returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.return, this)
			// returnBtn.top = 0;
			// returnBtn.left = 0;
			// this.uiLayer.addChild(returnBtn);
        }

		private point(e:egret.TouchEvent):void{
		
			// this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.point,this);
			console.log("x轴："+e.stageX,"Y轴"+e.stageY)
			var imglength = this.images.length;
			if(e.stageX>this._width*0.5){
				if(this.index>=imglength-1){
					return
				}
				this.index += 1
				this.rightCon.addChild(this.images[this.index])
				this.images[this.index].x = this._width;
				egret.Tween.get(this.images[this.index-1]).to({x:-this._width},1000);
				egret.Tween.get(this.images[this.index]).to({x:0},1000);
				setTimeout(()=>{
					this.rightCon.removeChild(this.images[this.index-1])
				},1000);
				
			}else{
				console.log('左边')
				if(this.index<=0){
					return
				}
				this.index -= 1
				this.rightCon.addChild(this.images[this.index])
				this.images[this.index].x = -this._width;
				egret.Tween.get(this.images[this.index]).to({x:0},1000);
				egret.Tween.get(this.images[this.index+1]).to({x:this._width},1000);
				setTimeout(()=>{
					this.rightCon.removeChild(this.images[this.index+1])
				},1000);
			}
		}

		
		private return(e:egret.TouchEvent):void{
			var main = new MainScene(this.index);
			this.Switch(main);
		}
		
	}
}