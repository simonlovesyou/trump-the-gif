import { fabric } from 'fabric';
var frameCanvas = new fabric.Canvas('frame-c');
//--------- DummyData ------------
var frameDimensions = {
  height:600,
  width:700
}
var currentFramePath = null;
var mappingTools = [];
var loadFrames = function(){
  /*Dummy Code*/
 currentFramePath = '../images/trump-template.jpg';
}
// -------- END OF DummyData ------------

//Create circles for edges of mapping and place them on canvas
var loadMappingTools = function(){
  var mappingCoords = [{x:30,y:30},{x:frameDimensions.width-30,y:30},{x:frameDimensions.width-30,y:frameDimensions.height-30},{x:30,y:frameDimensions.height-30},]
  for(var i = 0 ; i<4;i++){
    var mappingTool = createMappingCircle(mappingCoords[i].x,mappingCoords[i].y);
    mappingTools.push(mappingTool);
    frameCanvas.add(mappingTool);
    console.log("mappingTool added to coords:" + mappingTool.left + "," + mappingTool.top);
  }
}
var createMappingCircle = function(x,y){
  var newCircle = new fabric.Circle({
    radius: 5,
    fill: 'green',
    left: x,
    top: y
});

  return newCircle;
}
var initCanvas = function(){
  frameCanvas.setHeight(frameDimensions.height);
  frameCanvas.setWidth(frameDimensions.width);
  setCanvasBackgroundImage(currentFramePath,frameCanvas);
  loadMappingTools();
  frameCanvas.renderAll();
}

var setCanvasBackgroundImage = function(BGImageName, targetCanvas){
  fabric.Image.fromURL(BGImageName, function(img) {
     img.set({width: targetCanvas.width, height: targetCanvas.height, originX: 'left', originY: 'top'});
     targetCanvas.setBackgroundImage(img, targetCanvas.renderAll.bind(targetCanvas));

  });
}
//Load procedure (Should handle promises)
loadFrames();
initCanvas();
