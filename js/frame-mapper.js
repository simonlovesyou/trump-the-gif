import { fabric } from 'fabric';
var frameCanvas = new fabric.Canvas('frame-c');
var nextFrameButton = document.getElementById('next-frame-btn');
var resetToolsButton = document.getElementById('reset-tools-btn');
var mappingContainer = document.getElementById('mapping-container');
var finishedContainer = document.getElementById('mapping-finished');

//--------- DummyData ------------
var frameDimensions = {
  height:600,
  width:700
}
var mappingStartingCoords = [];
var currentFrameIndex = null;
var mappingTools = [];
var frames = [];
// -------- END OF DummyData ------------
var loadFrames = function(){
  /*Dummy Code*/
 currentFrameIndex = 0;
 frames.push({path:'../images/trump-template.jpg'});
}

//Create circles for edges of mapping and place them on canvas
var loadMappingTools = function(targetCanvas){
  mappingStartingCoords = [{x:30,y:30,angle:315},{x:frameDimensions.width-30,y:30,angle:45},{x:frameDimensions.width-30,y:frameDimensions.height-30,angle:135},{x:30,y:frameDimensions.height-30,angle:225}];
  for(var i = 0 ; i<4;i++){
    var mappingTool = createMappingTriangle(mappingStartingCoords[i].x,mappingStartingCoords[i].y,mappingStartingCoords[i].angle);
    mappingTools.push(mappingTool);

    targetCanvas.add(mappingTool);

  }
}

//Resets all mapping tools to starting position
var resetMappingTools = function(){
  mappingTools.forEach(function(mappingTool,index){
    var pos = frameCanvas.getObjects().indexOf(mappingTool);
    frameCanvas.item(pos).left = mappingStartingCoords[index].x;
    frameCanvas.item(pos).top = mappingStartingCoords[index].y;
    frameCanvas.item(pos).setCoords();
  })
  frameCanvas.renderAll();
  console.log("frame mapping tools have been reset")
}
//create a mapping tool in form of a circle
var createMappingCircle = function(x,y){
  var newCircle = new fabric.Circle({
    radius: 5,
    fill: 'green',
    left: x,
    top: y
  });

  return newCircle;
}

var createMappingTriangle = function(x,y,angle){
  var newTriangle = new fabric.Triangle({
    width:20,
    height:10,
    fill: 'green',
    left: x,
    top: y
  });
  newTriangle.setAngle(angle);
  return newTriangle;
}

//build and prepare canvas object and tools
var initCanvas = function(){
  frameCanvas.setHeight(frameDimensions.height);
  frameCanvas.setWidth(frameDimensions.width);
  setCanvasBackgroundImage(frames[currentFrameIndex].path,frameCanvas);
  loadMappingTools(frameCanvas);
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

//------- Functions handling the process after frame has been mapped ------

//Returns index if more frames exist
var incrementFrameIndex = function(){
  if(currentFrameIndex + 1 < frames.length){
    currentFrameIndex++;
    return currentFrameIndex;
  }
}

//Get coordinates of mapping tools and save them as an array in frame object.
var getMappingCoords = function(){
  console.log("Mapping coordinates:");
  mappingTools.forEach(function (mappingTool, i) {
    mappingTools[i].setCoords();
    mappingTool.setCoords();
    console.log(mappingTool.getBoundingRect().left + ", " + mappingTool.getBoundingRect().top);
    //TODO: ---------- Save coords in dataset --------------
    frames[currentFrameIndex].mappingCoords = {x:mappingTool.getBoundingRect().left,y:mappingTool.getBoundingRect().top };
  });
}
var saveFrameMappingData = function(){
  /*DUMMY CODE*/
  console.log("Fake save complete");
}
//Handles all that should happend when frame mapping should be saved and new frame should be shown, or finish.
var completeSingleFrameMapping = function(){
  getMappingCoords();

  if(incrementFrameIndex()){
      setBackgroundImage(frames[currentFrameIndex].path,frameCanvas);
  }else{
    console.log("All frames have been mapped");
    saveFrameMappingData();
    mappingContainer.style.display = 'none';
    finishedContainer.style.display = '';
  }
  frameCanvas.renderAll();
}
resetToolsButton.onclick = resetMappingTools;
nextFrameButton.onclick = completeSingleFrameMapping;
