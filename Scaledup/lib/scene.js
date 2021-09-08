


class Scene{
    constructor(objects, lights, camera, playerPawn){
        this.objects = [];
        this.lights = new Map();
        this.camera = null;
        this.playerPawn= null;
        this.c = 0;

        if(objects != null && objects.length > 0) this.objects = objects;
        if(lights != null) this.lights = lights;
        if(camera != null) this.camera = camera;
        if(playerPawn != null) this.playerPawn = playerPawn;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.85, 0.85, 0.85, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST); // z-buffer
        //gl.enable(gl.CULL_FACE); // backface culling

        this.perspectiveMatrix = utils.MakePerspective(30, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
    }

    getPerspectiveMatrix(){
        return this.perspectiveMatrix;
    }
    setCamera(camera){
        this.camera = camera;
    }

    drawObject(o){
      gl.useProgram(o.program); // USE THE CORRESPONDING SHADER ! Pogram is defined as the shaders are loaded 
      var viewworldMatrix = utils.multiplyMatrices(this.camera.getViewMatrix(), o.getWorldMatrix());
      var projectionMatrix = utils.multiplyMatrices(this.getPerspectiveMatrix(), viewworldMatrix);

      gl.uniformMatrix4fv(o.ProjectionMatrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(o.worldMatrixLocation, gl.FALSE, utils.transposeMatrix(o.worldMatrix));
      gl.uniformMatrix4fv(o.cameraPosition, gl.FALSE, utils.transposeMatrix(this.camera.getPosition()));

      gl.uniform1f(o.dTexMixLocation, o.dTexMix); 


      if (o.normals != null) { // if the object i has normals
        gl.uniformMatrix4fv(o.normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(o.normalMatrix));

        gl.uniform4fv(o.lightColorHandle, this.lights["light"].color);
        gl.uniform3fv(o.lightDirectionHandle, this.lights["light"].lightDirection);
        gl.uniform4fv(o.lightTypeHandle, this.lights["light"].type);
        gl.uniform3fv(o.lightPositionHandle, this.lights["light"].position);
        gl.uniform1f(o.coneOutHandle, this.lights["light"].coneOut);
        gl.uniform1f(o.coneInHandle, this.lights["light"].coneIn);
        gl.uniform1f(o.decayHandle, this.lights["light"].decay);
        gl.uniform1f(o.targetHandle, this.lights["light"].target);

        gl.uniform4fv(o.ambientTypeHandle, this.lights["ambLight"].type);
        gl.uniform4fv(o.ambientColorHandle, this.lights["ambLight"].color);
        gl.uniform4fv(o.ambientLowColorHandle, this.lights["ambLight"].lowColor);
        gl.uniform4fv(o.ambientSHLeftHandle, this.lights["ambLight"].SHLeft);
        gl.uniform4fv(o.ambientSHRightHandle, this.lights["ambLight"].SHRight);
        gl.uniform4fv(o.ambientMatColorHandle, this.lights["ambLight"].matColor);
        gl.uniform3fv(o.ambientDirHandle, this.lights["ambLight"].lightDirection);
    }    

    if(o.lights != null){
        gl.uniform4fv(o.diffuseTypeHandle, o.lights["diffLight"].type);
        gl.uniform4fv(o.diffuseColorHandle, o.lights["diffLight"].color);
        gl.uniform1f(o.diffuseToonHandle, o.lights["diffLight"].DToonTh);

        gl.uniform4fv(o.specularTypeHandle, o.lights["specLight"].type);
        gl.uniform4fv(o.specularColorHandle, o.lights["specLight"].color);
        gl.uniform1f(o.specShineHandle, o.lights["specLight"].specShine);
        gl.uniform1f(o.toonSpecHandle, o.lights["specLight"].SToonTh);

        gl.uniform4fv(o.emissionTypeHandle, o.lights["emitLight"].type);
        gl.uniform4fv(o.emitColorHandle, o.lights["emitLight"].color);
    }

    if (o.uvs != null) { // if the object i has UV and texture

        if(o instanceof Player && this.c < 1){
            console.log("\nUVS");
            console.log(o.uvs);
            this.c += 1;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, o.texture);
        gl.uniform1i(o.textLocation, 0); //tell the shader our tyexture is in unit 0
       } 


       


      
 
       
 
        gl.bindVertexArray(o.vao);
    
        gl.drawElements(gl.TRIANGLES, o.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
