var programs = new Map();
var gl;
var baseDir;
var shaderDir;
var skybox;
var scene;
var lights_obj = new Map();
var score = 0;
var objectList = [];
var lights_ring = new Map();

///////////////////////////////////////////////////
var lastUpdateTime = (new Date).getTime();
var currentTime = (new Date).getTime();
///////////////////////////////////////////////////


// INITIALISING FUNCTION ; LOADS IN THE SHADERS///////////////////////////////////////

async function init() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  baseDir = window.location.href.replace(page, '');
  shaderDir = baseDir + "shaders/";

  var canvas = document.getElementById("c");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);

  // Shaders for objects without texture
  await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

    programs["lamb"] = utils.createProgram(gl, vertexShader, fragmentShader);
  });

  // Shaders for objects with texture
  await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs_tex.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

    programs["text"] = utils.createProgram(gl, vertexShader, fragmentShader);
  });

  // Shaders for the skybox
  await utils.loadFiles([shaderDir + 'skybox_vs.glsl', shaderDir + 'skybox_fs.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

    programs["skybox"] = utils.createProgram(gl, vertexShader, fragmentShader);
  });

  /////////////////////////////////// 
  // Shaders not used
  await utils.loadFiles([shaderDir + 'vs_pos.glsl', shaderDir + 'fs_pos.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

    programs["pos"] = utils.createProgram(gl, vertexShader, fragmentShader);
  });

  await utils.loadFiles([shaderDir + 'vs_unlit.glsl', shaderDir + 'fs_unlit.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

    programs["unlit"] = utils.createProgram(gl, vertexShader, fragmentShader);
  });
////////////////////////////////////


///////////////////// Loading assets
 objStr1 = await utils.get_objstr("X-WING.obj");
 objModel1 = new OBJ.Mesh(objStr1);


 objStr2 = await utils.get_objstr("ring.obj");
 objModel2 = new OBJ.Mesh(objStr2);
///////////////////////////////////////////////////////
  
  main();
}


function main() {

  // Create the variables for the text
  var scoreElement = document.querySelector("#score");
  var scoreNode = document.createTextNode("");
  
  scoreElement.appendChild(scoreNode);
  ////////////////////////////////////////////////////

  initSphere(); // define in the sphere defintion

  //INITIALISATION OF VARIABLES AND LIGTHS////////////
     /*
    LIGHT TYPE VECTORS
    -->DIFFUSE LIGHT 
    lambert: [1.0, 0.0, 0.0, 0.0]
    toon: [0.0, 1.0, 0.0, 0.0]
    oren-nayar: [0.0, 0.0, 1.0, 0.0]

    -->SPECULAR LIGHT
    phong: [1.0, 0.0, 0.0, 0.0]
    blinn: [0.0, 1.0, 0.0, 0.0]
    toonP: [1.0, 0.0, 1.0, 0.0]
    toonB: [1.0, 1.0, 0.0, 0.0]
    cook torrence: [0.0, 0.0, 0.0, 1.0]

    -->EMITTED LIGHT
    yes: [1.0, 0.0, 0.0, 0.0]
    no: [0.0, 0.0, 0.0, 0.0]
  */
    var DToonTh = 0.5;
    var SToonTh = 0.9;
    var specShine = 100.0;
  
    // Fill BRDF map
    lights_obj["diffLight"] = new DiffuseLight([1.0, 0.0, 0.0, 0.0], [0.0, 1.0, 1.0, 1.0], DToonTh);
    lights_obj["specLight"] = new SpecularLight([0.0, 0.0, 0.0, 0.0], [1.0, 1.0, 1.0, 1.0], specShine, SToonTh);
    lights_obj["emitLight"] = new EmittedLight([0.0, 0.0, 0.0, 0.0], [0.0, 0.4, 0.4, 1.0]);
  
    // Fill BRDF map for the rings
    lights_ring["diffLight"] = lights_obj["diffLight"];
    lights_ring["specLight"] = lights_obj["specLight"];
    lights_ring["emitLight"] = new EmittedLight([0.0, 0.0, 0.0, 0.0], [0.6, 0.6, 0.0, 1.0]);


  t4 = [-3.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0];

  var p = new Player(t4, objModel1.vertices, objModel1.indices, objModel1.vertexNormals, 
    objModel1.textures, "X-Wing-Colors.png", programs["text"], lights_obj);
  p.instantiate();

  



  /////////////////////////////////////
     /*
    LIGHT TYPE VECTORS
    -->LIGHT
    none: [0.0, 0.0, 0.0, 0.0]
    direct: [1.0, 0.0, 0.0, 0.0]
    point: [0.0, 1.0, 0.0, 0.0]
    spot: [0.0, 0.0, 1.0, 0.0]

    -->AMBIENT LIGHT
    ambient: [1.0, 0.0, 0.0, 0.0]
    hemispheric: [0.0, 1.0, 0.0, 0.0]
    SH: [0.0, 0.0, 1.0, 0.0]
  */
  //set params of light
  var lightColor = [1.0, 1.0, 1.0, 1.0];
  var pos = [10.0, 500.0, 100.0];
  var coneOut = 80.0;
  var coneIn = 0.8;
  var decay = 0.0;
  var target = 6.1;

  //set params of ambient light
  var ambLightColor = [0.13, 0.13, 0.13, 1.0];
  var ambLightLowColor = [0.0, 0.13, 0.0, 1.0];
  var SHLeft = [0.33, 0.0, 0.33, 1.0];
  var SHRight = [0.0, 0.33, 0.33, 1.0];
  var matColor = [1.0, 0.0, 1.0, 1.0];

  var lights = new Map();
  lights["light"] = new Light([1.0, 0.0, 0.0, 0.0], 60.0, 45.0, lightColor, pos, coneOut, coneIn, decay, target);
  lights["ambLight"] = new AmbientLight([1.0, 0.0, 0.0, 0.0], 0.0, 0.0, ambLightColor, ambLightLowColor, SHLeft, SHRight, matColor);
  /////////////////////////////////////////


  var camera = new Camera(1.5, 7.0, 20.0, 0.0, 0.0);
  var lastUpdateTime = (new Date).getTime();
  
  scene = new Scene(null, lights, camera, p);
  skybox = new SkyBox(programs["skybox"]);

  
  //// DRAW CALL !/////////////////////////////////////////////////////////////////////////////////////////////////

  scene.playerPawn.lastCheck += 40.0;
  spawnSpheres();
  scene.playerPawn.lastCheck += 40.0;
  spawnPattern();
  scene.playerPawn.lastCheck += 40.0;
  spawnSpheres();
  scene.playerPawn.lastCheck += 40.0;
  spawnPattern();

  drawScene();


  ///// Drawcall function

  function drawScene() {
    
    animate();

    // set the nodes for the text
    scoreNode.nodeValue = score.toFixed(0);  // no decimal place
  
    // Make the camera follow to player 
    scene.camera.setupCamera(scene.playerPawn,[-25.0, 4.0, 1.5]); 
    
    // Not needed, used to link objects
    //scene.objects[3].linkAParent(scene.playerPawn);
    


    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    // Draw the skybox
    skybox.draw(scene.getPerspectiveMatrix(), scene.camera.getViewMatrix());

    // Draw the objects
    for(i = 0; i < objectList.length; i++){
      scene.drawObject(objectList[i]);
    }
    console.log(objectList.length);
    scene.drawObject(scene.playerPawn);

    window.requestAnimationFrame(drawScene);
  }


  ///// Animate . called at begining of drawcall
  function animate() {
    currentTime = (new Date).getTime();

    // Make rings rotate
    var deltaC = (90 * (currentTime - lastUpdateTime)) / 1000.0;
    var curRotation = utils.MakeRotateXYZMatrix(deltaC, -deltaC, deltaC);

    // Check if the object in the list is a ring or a sphere
    for (i = 0; i < objectList.length; i++) {
      if(objectList[i].type == 1){
        objectList[i].changeWorldMatrix(curRotation);
      }
    }

    // Movement of the spaceship
    let ts = scene.playerPawn.translationSpeed*(currentTime - lastUpdateTime)/1000.0;
    
    scene.playerPawn.move(ts);

    // Delete objects left behind
    deleteObjects();

    // Check if spaceship hits a ball
    detectCollision();


    var playerWorldMatrix = scene.playerPawn.worldMatrix;
    var playerPosX = playerWorldMatrix[3];

    // Randomly spheres and rings
    if (playerPosX > scene.playerPawn.lastCheck - 80){

      scene.playerPawn.lastCheck += 40.0;
      spawnSpheres();
      scene.playerPawn.lastCheck += 40.0;
      spawnPattern();
      scene.playerPawn.lastCheck += 40.0;
      spawnSpheres();
      scene.playerPawn.lastCheck += 40.0;
      spawnPattern();

      
      

    }
    
    lastUpdateTime = currentTime; 
  }


function spawnSpheres(){

    var tp = scene.playerPawn.transform;
    var num_patterns = 3;
    var rn = Math.random();
    var pattern = new Pattern(scene, tp);
      
    pattern.setSpherePattern(Math.floor(rn * (num_patterns + 1)));

    var type = 0;

    if(pattern.s0[2]!=null){
      var o0 = new GameObject(pattern.s0, vertexPositionData, indexData, normalData, 
        null, null, programs["lamb"], lights_obj, type);
        o0.instantiate();
        objectList.push(o0);
    }
          
    if(pattern.s1[2]!=null){
      var o1 = new GameObject(pattern.s1, vertexPositionData, indexData, normalData, 
        null, null, programs["lamb"], lights_obj, type);
        o1.instantiate();
        objectList.push(o1);
    }
                
    if(pattern.s2[2]!=null){
      var o2 = new GameObject(pattern.s2, vertexPositionData, indexData, normalData, 
        null, null, programs["lamb"], lights_obj, type);
        o2.instantiate();
        objectList.push(o2);
    }
}

function spawnPattern(){

    var tp = scene.playerPawn.transform;
    var num_patterns = 9;
    var rn = Math.random();
    var pattern = new Pattern(scene, tp);
      
    pattern.setPattern(Math.floor(rn * (num_patterns + 1)));

    var sphere_type = 0;
    var ring_type = 1;

    var r = new GameObject(pattern.tr, objModel2.vertices, objModel2.indices, objModel2.vertexNormals, 
    null, null, programs["lamb"], lights_ring, ring_type);
    r.instantiate();
    objectList.push(r);

    if(pattern.t0[2]!=null){
      var o0 = new GameObject(pattern.t0, vertexPositionData, indexData, normalData, 
        null, null, programs["lamb"], lights_obj, sphere_type);
        o0.instantiate();
        objectList.push(o0);
    }
          
    if(pattern.t1[2]!=null){
      var o1 = new GameObject(pattern.t1, vertexPositionData, indexData, normalData, 
        null, null, programs["lamb"], lights_obj, sphere_type);
        o1.instantiate();
        objectList.push(o1);
    }
                
    if(pattern.t2[2]!=null){
        var o2 = new GameObject(pattern.t2, vertexPositionData, indexData, normalData, 
            null, null, programs["lamb"], lights_obj, sphere_type);
        o2.instantiate();
        objectList.push(o2);
    }
       
     if(pattern.t3[2]!=null){
        var o3 = new GameObject(pattern.t3, vertexPositionData, indexData, normalData, 
            null, null, programs["lamb"], lights_obj, sphere_type);    
        o3.instantiate();
        objectList.push(o3);
    }
}


  function startOver() {
    window.location.href = window.location.href;
  }


  function deleteObjects(){
    var playerMatrix = scene.playerPawn.worldMatrix;
    var playerPosX = playerMatrix[3];

    var n = 0;

    for(var i = 0; i < objectList.length; i++){
      var objMatrix = objectList[i].worldMatrix;
      var objPosX = objMatrix[3];
      if (playerPosX - objPosX > 10.0){
        n++;
      }
    }

    for(var i = 0; i < n; i++){
      var objToDel = objectList.shift();
      delete objToDel;
    }

  }


  function detectCollision(){
    var playerMatrix = scene.playerPawn.worldMatrix;
    var playerPos = [playerMatrix[3], playerMatrix[7], playerMatrix[11]];


    var index = -1;
    var hitRing = 0;

    for(var i = 0; i < objectList.length; i++){
      var objMatrix = objectList[i].worldMatrix;
      var objPos = [objMatrix[3], objMatrix[7], objMatrix[11]];

      //var d = [Math.abs(playerPos[0] - objPos[0]), Math.abs(playerPos[1] - objPos[1]), Math.abs(playerPos[2] - objPos[2])];
      //console.log(d);

      if(Math.abs(playerPos[0] - objPos[0]) < 4.0 && Math.abs(playerPos[1] - objPos[1]) < 4.0 && Math.abs(playerPos[2] - objPos[2]) < 4.0){
        if(objectList[i].type == 0){
          console.log("HIT A SPHERE!");
          index = i;
          startOver();
          //score == 0;
        }
        else if(objectList[i].type == 1){
          console.log("HIT A RING!");
          
          hitRing = 1;
          score += 50;
          console.log("Score: " + score);
          index = i;
        }
      }
    }
    if(index > -1 && hitRing){
      var objToDel = objectList[i];
      objectList.splice(index, 1);
      delete objToDel;
    }
  }


  
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// IF YOU ADD AN OBJECT YOU NEED TO ADD REFERENCES HERE !

function FetchData()  // THIS IS to make a array of arrays of the object/s definition , each element of those array is a matrix (of indices, vertex,normal,uv) of a specific object 
// myListofVerteces[0] is the vertex list of oject 0 which is cubeDefinition, because cubeDefinition has the name vertices (check cubedefiniton file) ,
// indices uv as they varaibles , and they are used below first
{


    t0 = [-4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0];
    t1 = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0];
    t2 = [4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0];
    // Texture Cube
    t3 = [1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 1.0];
    // ring
    t4=[0.0, 4.0, 2.0, 0.0, 90.0, 90.0, 1.0];

    
  /*
    LIGHT TYPES VECTORS
    none: [0.0, 0.0, 0.0, 0.0]
  
    -->DIFFUSE LIGHT
    lambert: [1.0, 0.0, 0.0, 0.0]
    toon: [0.0, 1.0, 0.0, 0.0]
    orenNayar: [0.0, 0.0, 1.0, 0.0]

    -->SPECULAR LIGHT
    phong: [1.0, 0.0, 0.0, 0.0]
    blinn: [0.0, 1.0, 0.0, 0.0]
    toonP: [1.0, 0.0, 1.0, 0.0]
    toonB: [0.0, 1.0, 1.0, 0.0]
    cookTorrance: [0.0, 0.0, 0.0, 1.0]

    -->EMITTED LIGHT
    yes: [1.0, 0.0, 0.0, 0.0]
    no: [0.0, 0.0, 0.0, 0.0]
    */


  var o0 = new GameObject(t0, vertexPositionData, indexData, normalData, 
    null, null, programs["lamb"], lights_obj);
  var o1 = new GameObject(t1, vertexPositionData, indexData, null, 
    null, null, programs["pos"], null);
  var o2 = new GameObject(t2, vertexPositionData, indexData, null, 
    null, null, programs["unlit"], null);
  var o3 = new GameObject(t3, textvertices, textindices, null, 
    textuv, "crate.png", programs["noname"], lights_obj);
  var o4 = new GameObject(t4, objModel2.vertices, objModel2.indices, objModel2.vertexNormals, 
   null, null, programs["lamb"], lights_ring);
  var objects = [o0,o1,o2,o3,o4];


  for(var i = 0; i < objects.length; i++){
    //console.log(i)  
    objects[i].instantiate(); 
  }
  return objects;

}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////// KEY EVENT/////////

function onKeyDown(e){ // THIS MUST BE DECLARED OUTSIDE OF MAIN TO BE REACHABLE BY window.addEventListener keyfunctions !
  if (e.keyCode == 65) {  // a
    scene.playerPawn.moveRight = false;
    scene.playerPawn.moveLeft = true;    
  }
  
  else if (e.keyCode == 68) {  // d
    //Rx+=1.5;
    scene.playerPawn.moveRight = true;
    scene.playerPawn.moveLeft = false;
  } 

  if (e.keyCode == 87) {  // w
    scene.playerPawn.moveForward = true;
    scene.playerPawn.moveBackward = false;
  }

  if (e.keyCode == 83) {  // s
    scene.playerPawn.moveBackward = true;
    scene.playerPawn.moveForward = false;
  }

  ////////////////////////////////////
  /*
    light type:
    1 -> direct
    2 -> point
    3 -> spot
  */
 /////////////////////////////////////

  if(e.keyCode == 49) { //1
    scene.lights["light"].setType([1.0, 0.0, 0.0, 0.0]);
  }

  if(e.keyCode == 50) { //2
    scene.lights["light"].setType([0.0, 1.0, 0.0, 0.0]);
  }

  if(e.keyCode == 51) { //3
    scene.lights["light"].setType([0.0, 0.0, 1.0, 0.0]);
  }

  ////////////////////////////////////
  /*
    ambient type:
    4 -> ambient
    5 -> hemispheric
    6 -> SH
  */
 /////////////////////////////////////

  if(e.keyCode == 52) { //4
    scene.lights["ambLight"].setType([1.0, 0.0, 0.0, 0.0]);
  }

  if(e.keyCode == 53) { //5
    scene.lights["ambLight"].setType([0.0, 1.0, 0.0, 0.0]);
  }

  if(e.keyCode == 54) { //6
    scene.lights["ambLight"].setType([0.0, 0.0, 1.0, 0.0]);
  }

  ////////////////////////////////////
  /*
    diffuse type:
    7 -> lambert
    8 -> toon 
    9 -> orenNayar
  */
 /////////////////////////////////////

  if(e.keyCode == 55) { //7
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["diffLight"].setType([1.0, 0.0, 0.0, 0.0]);
    }
    scene.playerPawn.lights["diffLight"].setType([1.0, 0.0, 0.0, 0.0]);
    lights_ring["diffLight"].setType([1.0, 0.0, 0.0, 0.0]);
  }

  if(e.keyCode == 56) { //8
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["diffLight"].setType([0.0, 1.0, 0.0, 0.0]);
    }
    scene.playerPawn.lights["diffLight"].setType([0.0, 1.0, 0.0, 0.0]);
    lights_ring["diffLight"].setType([0.0, 1.0, 0.0, 0.0]);
  }

  if(e.keyCode == 57) { //9
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["diffLight"].setType([0.0, 0.0, 1.0, 0.0]);
    }
    scene.playerPawn.lights["diffLight"].setType([0.0, 0.0, 1.0, 0.0]);
    lights_ring["diffLight"].setType([0.0, 0.0, 1.0, 0.0]);
  }

////////////////////////////////////
  /*
    specular type:
    z -> phong
    x -> blinn 
    c -> toonP
    v -> toonB
    b -> cookTorrence
    r -> none
  */
 /////////////////////////////////////

 if(e.keyCode == 90) { //z
  for(var i=0; i<objectList.lenght; i++){
    objectList[i].lights["specLight"].setType([1.0, 0.0, 0.0, 0.0]);
  }
  scene.playerPawn.lights["specLight"].setType([1.0, 0.0, 0.0, 0.0]);
  lights_ring["specLight"].setType([1.0, 0.0, 0.0, 0.0]);
  }

  if(e.keyCode == 88) { //x
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["specLight"].setType([0.0, 1.0, 0.0, 0.0]);
    }
    scene.playerPawn.lights["specLight"].setType([0.0, 1.0, 0.0, 0.0]);
    lights_ring["specLight"].setType([0.0, 1.0, 0.0, 0.0]);
  }

  if(e.keyCode == 67) { //c
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["specLight"].setType([1.0, 0.0, 1.0, 0.0]);
    }
    scene.playerPawn.lights["specLight"].setType([1.0, 0.0, 1.0, 0.0]);
    lights_ring["specLight"].setType([1.0, 0.0, 1.0, 0.0]);
  }

  if(e.keyCode == 86) { //v
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["specLight"].setType([0.0, 1.0, 1.0, 0.0]);
    }
    scene.playerPawn.lights["specLight"].setType([0.0, 1.0, 1.0, 0.0]);
    lights_ring["specLight"].setType([0.0, 1.0, 1.0, 0.0]);
  }

  if(e.keyCode == 66) { //b
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["specLight"].setType([0.0, 0.0, 0.0, 1.0]);
    }
    scene.playerPawn.lights["specLight"].setType([0.0, 0.0, 0.0, 1.0]);
    lights_ring["specLight"].setType([0.0, 0.0, 0.0, 1.0]);
  }

  if(e.keyCode == 82) { //r
    for(var i=0; i<objectList.lenght; i++){
      objectList[i].lights["specLight"].setType([0.0, 0.0, 0.0, 0.0]);
    }
    scene.playerPawn.lights["specLight"].setType([0.0, 0.0, 0.0, 0.0]);
    lights_ring["specLight"].setType([0.0, 0.0, 0.0, 0.0]);
  }

////////////////////////////////////
  /*
    emit type:
    y -> yes
    n -> no 
  */
 /////////////////////////////////////
  if(e.keyCode == 89) { //y
    scene.playerPawn.lights["emitLight"].setType([1.0, 0.0, 0.0, 0.0]);
  }

  if(e.keyCode == 78) { //n
    scene.playerPawn.lights["emitLight"].setType([0.0, 0.0, 0.0, 0.0]);
  }
}

function onKeyUp(e){
  if (e.keyCode == 65) {  // a
    scene.playerPawn.moveLeft = false;
  }
  
  if (e.keyCode == 68) {  // d
    scene.playerPawn.moveRight = false;
  } 

  if (e.keyCode == 87) {  // w
    scene.playerPawn.moveForward = false;
  }

  if (e.keyCode == 83) {  // s
    scene.playerPawn.moveBackward = false;
  }
  //window.requestAnimationFrame(drawScene);
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.onload = init;
// required for the key to work
//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keydown", onKeyDown, false); // keydown isntead of keyup 
window.addEventListener("keyup", onKeyUp, false);