class Draw{
    //1、id名称，2、canvas的宽，3、canvas的高，4、值所占百分比，5、圆中间的文本文件
    //6、大圆环背景颜色，7、值圆环颜色，8、字体颜色，9、字体大小
    constructor(id,width=200,height=200,percent=50,content='50%',color1='#ccc',color2='#000',color3='red',fontSize=40){
        this.Div = document.querySelector(id);
        this.width = width;
        this.height = height;
        this.percent = 3.6*percent;
        this.content = content;
        this.color1 = color1;
        this.color2 = color2;
        this.color3 = color3;
        this.fontSize = fontSize;
        this.timer = null;
        this.num = 0;
        this.init();
    }
    init(){
        this.Div.height = this.height;
        this.Div.width =  this.width;
        let ctx = this.Div.getContext('2d');
        this.repaint(ctx);
    }
    repaint(ctx){
        this.timer = setTimeout(()=>{
            ctx.clearRect(0,0,500,500);
            this.round(ctx,this.num);
            this.num = this.num + 2;
            this.timer = null;
            if(this.num <= this.percent){
                this.repaint(ctx);
            }
        },0)
    }
    round(ctx,num){
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.color1;
        ctx.arc(100, 100, 90, 0, Math.PI*2,true);
        ctx.stroke();
        ctx.closePath();
        //绘制第二个圆
        ctx.beginPath();
        ctx.lineWidth = 10; //10px
        ctx.lineCap = "round";
        ctx.strokeStyle = this.color2;
        ctx.arc(100, 100, 90, 0, (Math.PI/180)*num,false);
        ctx.stroke();
        ctx.closePath();
        // 绘制中间的文字
        ctx.font = `${this.fontSize}px Arial`;
        ctx.fillStyle = this.color3;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.content, 100, 100);
    }
}