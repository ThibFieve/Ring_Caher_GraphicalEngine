

class GameObject{
    
    constructor(transform, vertices, indices, normals, uvs, textureText, program, lights, type){

        /////////////////////// Parent Matrix///////////////////
        this.parentMatrix=utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
        this.type = type;
        //////////////////////////////////////////////////////////////

        this.worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
        this.transform = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0];
        if(transform != null && transform.length == 7){
            this.worldMatrix = utils.MakeWorld(transform[0], 
                transform[1], transform[2], transform[3], 
                transform[4], transform[5], transform[6]);
            this.transform = transform;
            }

        this.localWorldMatrix= this.worldMatrix   ;  
        this.worldMatrix= utils.multiplyMatrices(this.parentMatrix,this.localWorldMatrix);
        

                
        this.normalMatrix = utils.invertMatrix(utils.transposeMatrix(this.worldMatrix));

    
        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals;
        this.uvs = uvs;
        this.textureText = textureText;
        this.lights = lights;

        
        
        this.program = program;
        
        // attribute locations
        this.positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
        this.normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
        this.uvAttributeLocation = gl.getAttribLocation(program, "a_uv");
        this.ProjectionMatrixLocation = gl.getUniformLocation(program, "matrix");
        this.worldMatrixLocation= gl.getUniformLocation(program, "pMatrix");
        this.normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
        this.textLocation = gl.getUniformLocation(program, "u_texture"); 

        //light uniform locations
        this.lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
        this.lightColorHandle = gl.getUniformLocation(program, 'lightColor');
        this.lightTypeHandle = gl.getUniformLocation(program, 'lightType');
        this.lightPositionHandle = gl.getUniformLocation(program, 'lightPos');
        this.coneOutHandle = gl.getUniformLocation(program, 'ConeOut');
        this.coneInHandle = gl.getUniformLocation(program, 'ConeIn');
        this.decayHandle = gl.getUniformLocation(program, 'Decay');
        this.targetHandle = gl.getUniformLocation(program, 'Target');

        //diffuse uniform locations
        this.diffuseTypeHandle = gl.getUniformLocation(program, 'diffuseType');
        this.diffuseColorHandle = gl.getUniformLocation(program, 'diffuseColor');
        this.diffuseToonHandle = gl.getUniformLocation(program, 'DToonTh');
        

        //specular uniform locations
        this.specularTypeHandle = gl.getUniformLocation(program, 'specularType');
        this.specularColorHandle = gl.getUniformLocation(program, 'specularColor');
        this.specShineHandle = gl.getUniformLocation(program, 'SpecShine');
        this.toonSpecHandle = gl.getUniformLocation(program, 'SToonTh');


        //ambient uniform locations
        this.ambientTypeHandle = gl.getUniformLocation(program, 'ambientType');
        this.ambientColorHandle = gl.getUniformLocation(program, 'ambientLightColor');
        this.ambientLowColorHandle = gl.getUniformLocation(program, 'ambientLightLowColor');
        this.ambientSHLeftHandle = gl.getUniformLocation(program, 'SHLeftLightColor');
        this.ambientSHRightHandle = gl.getUniformLocation(program, 'SHRightLightColor');
        this.ambientMatColorHandle = gl.getUniformLocation(program, 'ambientMatColor');
        this.ambientDirHandle = gl.getUniformLocation(program, 'ADir');


        //emission uniform locations
        this.emissionTypeHandle = gl.getUniformLocation(program, 'emissionType');
        this.emitColorHandle = gl.getUniformLocation(program, 'emitColor');
    

        

        // Camera position
        this.cameraPosition = gl.getUniformLocation(program, "eyePos");
        
        

        this.dTexMixLocation = gl.getUniformLocation(program, "DTexMix");
        this.dTexMix = 1.0;




        
        this.vao = null;

        this.positionBuffer = null;        
        this.indexBuffer = null;
        this.normalBuffer = null;
        this.uvBuffer = null;
        this.texture = null;
    }

    getWorldMatrix(){
        return this.worldMatrix;
    }
    getNormalMatrix(){
        return this.normalMatrix;
    }


    setNewWorldMatrix(Matrix){ // Set a new world matrix from a worldmartix
            this.worldMatrix =  Matrix;
            this.normalMatrix = utils.invertMatrix(utils.transposeMatrix(this.worldMatrix));
        
    }

    setWorldMatrix(transform){  // Set a new world matrix from a transform
        if(transform != null && transform.length == 7){
            this.worldMatrix = utils.MakeWorld(transform[0], 
                transform[1], transform[2], transform[3], 
                transform[4], transform[5], transform[6]);
            this.normalMatrix = utils.invertMatrix(utils.transposeMatrix(this.worldMatrix));
        }
    }

    changeWorldMatrix(m){
        this.worldMatrix = utils.multiplyMatrices( this.worldMatrix,m); // IT is done like that because we rotate around the axis of the object  that is not centered on 0 !

        this.normalMatrix = utils.invertMatrix(utils.transposeMatrix(this.worldMatrix));
    }

    multiplyWorldMatrixBy(m){
        this.worldMatrix = utils.multiplyMatrices( m,this.worldMatrix); // IT is done like that because we rotate around the axis of the object  that is not centered on 0 !

        this.normalMatrix = utils.invertMatrix(utils.transposeMatrix(this.worldMatrix));
    }

    instantiate(){
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        // bind position buffer
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.vertexAttribPointer(this.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        // bind index buffer
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        if(this.normals != null){
            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.normalAttributeLocation);
            gl.vertexAttribPointer(this.normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        }
        
        if(this.uvs != null){
            this.uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.uvAttributeLocation);
            gl.vertexAttribPointer(this.uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            //Loading the Image//
            
            this.texture = gl.createTexture();
            var myTex = this.texture;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            var image = new Image();
            image.src = baseDir + this.textureText;
            
            image.onload = function(){;
                gl.activeTexture(gl.TEXTURE0);            ////////////////////////This line/////////
                gl.bindTexture(gl.TEXTURE_2D, myTex);    /////////////////////// THIS LINE ////////////////////////////////
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); //
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

                gl.generateMipmap(gl.TEXTURE_2D);
            }
        }
        
    }


    linkAChild( ChildObject){
        if(typeof ChildObject != "object")
        {
            console.log(" The parameter entered in LinkChild is not an GameObject");
        }
        ChildObject.parentMatrix=this.worldMatrix;
        ChildObject.worldMatrix= utils.multiplyMatrices(ChildObject.parentMatrix,ChildObject.localWorldMatrix);
        ChildObject.normalMatrix = utils.invertMatrix(utils.transposeMatrix(ChildObject.worldMatrix));
        

    }
    linkAParent( ParentObject){
        if(typeof ParentObject != "object")
        {
            console.log(" The parameter entered in ParentChild is not an GameObject");
        }
        this.parentMatrix=ParentObject.worldMatrix;
        
        this.worldMatrix= utils.multiplyMatrices(this.parentMatrix,this.localWorldMatrix);
        this.normalMatrix = utils.invertMatrix(utils.transposeMatrix(this.worldMatrix))
    }

   


}

