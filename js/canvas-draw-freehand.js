import { fabric } from 'fabric';

var canvasLeft = new fabric.Canvas('cLeft');
var canvasRight = new fabric.Canvas('cRight');
var canvas = canvasLeft;
var newCanvas = new fabric.Canvas('dest-c');
var drawingModeEl = document.getElementById('drawing-mode'),
      drawingOptionsEl = document.getElementById('drawing-mode-options'),
      drawingColorEl = document.getElementById('drawing-color'),
      drawingLineWidthEl = document.getElementById('drawing-line-width'),
      drawingShadowWidth = document.getElementById('drawing-shadow-width'),
      doneEditingEl = document.getElementById('done-btn');

var initCanvas = function(c, cWidth,cHeight){
  c.isDrawingMode = true;
  c.setHeight(cHeight);
  c.setWidth(cWidth);
  c.backgroundColor = document.getElementById('canvas-background-picker').value;
  if(!c.backgroundColor){
    c.backgroundColor = "#f6f7e9";
  }
  c.renderAll();
}
var setActiveCanvas = function (c){
  canvas = c;
}
initCanvas(canvasLeft, 200,400);
initCanvas(canvasRight, 200,400);
initCanvas(newCanvas, 600,700);
setActiveCanvas(canvasLeft);

document.getElementById('cLeft').onclick = setActiveCanvas(canvasLeft);
document.getElementById('cRight').onclick = setActiveCanvas(canvasRight);

var mergeCanvasWithBG = function (c,BGImageName, width,height,drawCoordTopLeft,drawCoordBottomLeft,drawCoordTopRight,drawCoordBottomRight) {
  var destCtx = newCanvas.getContext('2d');
  var drawingContext = c.getContext();
  newCanvas.setHeight(height);
  newCanvas.setWidth(width);
  fabric.Image.fromURL(BGImageName, function(img) {
     img.set({width: newCanvas.width, height: newCanvas.height, originX: 'left', originY: 'top'});
     newCanvas.setBackgroundImage(img, newCanvas.renderAll.bind(canvas));
     var canvasContent = drawingContext.canvas;
       /*
     canvasContent.width = (drawCoordTopLeft.x - drawCoordTopRight.x);
     canvasContent.heigth = (drawCoordTopLeft.y - drawCoordTopRight.y);*/
     drawImageInPerspective(canvasContent,newCanvas,drawCoordTopLeft.x,drawCoordTopLeft.y,drawCoordBottomLeft.x,drawCoordBottomLeft.y,drawCoordTopRight.x,drawCoordTopRight.y,drawCoordBottomRight.x,drawCoordBottomRight.y,false,false);
     //destCtx.drawImage(canvasContent,drawPosX,drawPosY,drawWidth,drawHeight);

  });

}
doneEditingEl.onclick = function(){
  mergeCanvasWithBG(canvasLeft,'../images/trump-template.jpg',600,700,{x:162,y:219},{x:156,y:540},{x:269,y:227},{x:269,y:550});
  mergeCanvasWithBG(canvasRight,'../images/trump-template.jpg',600,700,{x:285,y:224},{x:280,y:555},{x:375,y:190},{x:372,y:535});
}
  drawingModeEl.onclick = function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Enter manipulation mode';
      drawingOptionsEl.style.display = '';

    }
    else {
      drawingModeEl.innerHTML = 'Enter drawing mode';
      drawingOptionsEl.style.display = 'none';
    }
  };


  if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 2;

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 5;
      var patternCanvas = fabric.document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      var canvasWidth = rect.getBoundingRectWidth();

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };


  }

  document.getElementById('drawing-mode-selector').addEventListener('change', function() {

    if (this.value === 'hline') {
      canvas.freeDrawingBrush = vLinePatternBrush;
    }
    else if (this.value === 'vline') {
      canvas.freeDrawingBrush = hLinePatternBrush;
    }
    else if (this.value === 'square') {
      canvas.freeDrawingBrush = squarePatternBrush;
    }
    else if (this.value === 'diamond') {
      canvas.freeDrawingBrush = diamondPatternBrush;
    }
    else if (this.value === 'texture') {
      canvas.freeDrawingBrush = texturePatternBrush;
    }
    else {
      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
    }
  });

  drawingColorEl.onchange = function() {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
  };
  drawingLineWidthEl.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
  };
  drawingShadowWidth.onchange = function() {
    canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadowBlur = 0;
  }

  document.getElementById('canvas-background-picker').addEventListener('change', function() {
    canvas.backgroundColor = this.value;
    canvas.renderAll();
  });

  /* Insert image in perspective*/
  function drawImageInPerspective(
          srcImg,
          targetCanvas,
          //Define where on the canvas the image should be drawn:
          //coordinates of the 4 corners of the quadrilateral that the original rectangular image will be transformed onto:
          topLeftX, topLeftY,
          bottomLeftX, bottomLeftY,
          topRightX, topRightY,
          bottomRightX, bottomRightY,
          //optionally flip the original image horizontally or vertically *before* transforming the original rectangular image to the custom quadrilateral:
          flipHorizontally,
          flipVertically
      ) {

      var srcWidth=srcImg.width;
      var srcHeight=srcImg.height;

      var targetMarginX=Math.min(topLeftX, bottomLeftX, topRightX, bottomRightX);
      var targetMarginY=Math.min(topLeftY, bottomLeftY, topRightY, bottomRightY);

      var targetTopWidth=(topRightX-topLeftX);
      var targetTopOffset=topLeftX-targetMarginX;
      var targetBottomWidth=(bottomRightX-bottomLeftX);
      var targetBottomOffset=bottomLeftX-targetMarginX;

      var targetLeftHeight=(bottomLeftY-topLeftY);
      var targetLeftOffset=topLeftY-targetMarginY;
      var targetRightHeight=(bottomRightY-topRightY);
      var targetRightOffset=topRightY-targetMarginY;

      var tmpWidth=Math.max(targetTopWidth+targetTopOffset, targetBottomWidth+targetBottomOffset);
      var tmpHeight=Math.max(targetLeftHeight+targetLeftOffset, targetRightHeight+targetRightOffset);

      var tmpCanvas=document.createElement('canvas');
      tmpCanvas.width=tmpWidth;
      tmpCanvas.height=tmpHeight;
      var tmpContext = tmpCanvas.getContext('2d');

      tmpContext.translate(
          flipHorizontally ? tmpWidth : 0,
          flipVertically ? tmpHeight : 0
      );
       tmpContext.scale(
          (flipHorizontally ? -1 : 1)*(tmpWidth/srcWidth),
          (flipVertically? -1 : 1)*(tmpHeight/srcHeight)
      );

      tmpContext.drawImage(srcImg, 0, 0);

      var tmpMap=tmpContext.getImageData(0,0,tmpWidth,tmpHeight);
      var tmpImgData=tmpMap.data;

      var targetContext=targetCanvas.getContext('2d');
      var targetMap = targetContext.getImageData(targetMarginX,targetMarginY,tmpWidth,tmpHeight);
      var targetImgData = targetMap.data;

      var tmpX,tmpY,
          targetX,targetY,
          tmpPoint, targetPoint;

      for(var tmpY = 0; tmpY < tmpHeight; tmpY++) {
          for(var tmpX = 0;  tmpX < tmpWidth; tmpX++) {

              //Index in the context.getImageData(...).data array.
              //This array is a one-dimensional array which reserves 4 values for each pixel [red,green,blue,alpha) stores all points in a single dimension, pixel after pixel, row after row:
              tmpPoint=(tmpY*tmpWidth+tmpX)*4;

              //calculate the coordinates of the point on the skewed image.
              //
              //Take the X coordinate of the original point and translate it onto target (skewed) coordinate:
              //Calculate how big a % of srcWidth (unskewed x) tmpX is, then get the average this % of (skewed) targetTopWidth and targetBottomWidth, weighting the two using the point's Y coordinate, and taking the skewed offset into consideration (how far topLeft and bottomLeft of the transformation trapezium are from 0).
              targetX=(
                         targetTopOffset
                         +targetTopWidth * tmpX/tmpWidth
                     )
                     * (1- tmpY/tmpHeight)
                     + (
                         targetBottomOffset
                         +targetBottomWidth * tmpX/tmpWidth
                     )
                     * (tmpY/tmpHeight)
              ;
              targetX=Math.round(targetX);

              //Take the Y coordinate of the original point and translate it onto target (skewed) coordinate:
              targetY=(
                         targetLeftOffset
                         +targetLeftHeight * tmpY/tmpHeight
                     )
                     * (1-tmpX/tmpWidth)
                     + (
                         targetRightOffset
                         +targetRightHeight * tmpY/tmpHeight
                     )
                     * (tmpX/tmpWidth)
              ;
              targetY=Math.round(targetY);

              targetPoint=(targetY*tmpWidth+targetX)*4;

              targetImgData[targetPoint]=tmpImgData[tmpPoint];  //red
              targetImgData[targetPoint+1]=tmpImgData[tmpPoint+1]; //green
              targetImgData[targetPoint+2]=tmpImgData[tmpPoint+2]; //blue
              targetImgData[targetPoint+3]=tmpImgData[tmpPoint+3]; //alpha
          }
      }

      targetContext.putImageData(targetMap,targetMarginX,targetMarginY);
  }
