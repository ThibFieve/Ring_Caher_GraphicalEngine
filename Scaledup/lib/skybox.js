

class SkyBox{
    constructor(program){
        this.timesDrawn = 0;
        this.inverseViewProjMatrix = null;
        this.program = program;
        this.skyboxVertPos = new Float32Array(
            [
              -1, -1, 1.0,
               1, -1, 1.0,
              -1,  1, 1.0,
              -1,  1, 1.0,
               1, -1, 1.0,
               1,  1, 1.0,
            ]);
        
        this.skyboxTexHandle = gl.getUniformLocation(this.program, "u_texture"); 
        this.inverseViewProjMatrixHandle = gl.getUniformLocation(this.program, "inverseViewProjMatrix"); 
        this.skyboxVertPosAttr = gl.getAttribLocation(this.program, "in_position");
        
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.skyboxVertPos, gl.STATIC_DRAW);
        
        gl.enableVertexAttribArray(this.skyboxVertPosAttr);
        gl.vertexAttribPointer(this.skyboxVertPosAttr, 3, gl.FLOAT, false, 0, 0);


        
        this.texture = gl.createTexture();
        var myTex = this.texture;
        gl.activeTexture(gl.TEXTURE0+3);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, myTex);

        var dir = baseDir+"skybox/";

        const faceInfos = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
                url: dir+'forward.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                url: dir+'left.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
                url: dir+'top180.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                url: dir+'bottom.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
                url: dir+'right.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
                url: dir+'back.jpg',
            },
        ];

        faceInfos.forEach((faceInfo) => {

            const {target, url} = faceInfo;

            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 1024;
            const height = 1024;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            const image = new Image();
            image.src = url;
            //image.crossOrigin = "anonymous";
            //console.log(url);
            image.addEventListener('load', function(){

                gl.activeTexture(gl.TEXTURE0+3);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, myTex);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

            });

        });

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    }

    draw(perspectiveMatrix, viewMatrix){
        gl.useProgram(this.program);
        gl.activeTexture(gl.TEXTURE0+3);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        gl.uniform1i(this.skyboxTexHandle, 3);

        if (this.timesDrawn == 0){
            var viewProjMat = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);
            this.inverseViewProjMatrix = utils.invertMatrix(viewProjMat);
            this.timesDrawn++;
        }
        
        gl.uniformMatrix4fv(this.inverseViewProjMatrixHandle, gl.FALSE, utils.transposeMatrix(this.inverseViewProjMatrix));
    
        gl.bindVertexArray(this.vao);
        gl.depthFunc(gl.LEQUAL);
        gl.drawArrays(gl.TRIANGLES, 0, 1*6)
    }
}