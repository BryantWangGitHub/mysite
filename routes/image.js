
var images = require("node-images");
function Image(input,output,pix,quality ){
  this.input = input;
  this.output= output;
  this.pix   = pix;
  this.quality = quality;
}
module.exports = Image;
Image.prototype.trans= function trans(){
  images(this.input)                     //Load image from file 
    //加载图像文件
    .size(this.pix)                          //Geometric scaling the image to 400 pixels width 等比缩放图像到400像素宽
    //.draw(this.input, 10, 10)   //Drawn logo at coordinates (10,10)在(10,10)处绘制Logo
    .save(this.output, {               //Save the image to a file,whih quality 50
      quality :  this.quality                   //保存图片到文件,图片质量为50
    });
};


