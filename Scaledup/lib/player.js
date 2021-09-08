

class Player extends GameObject{

    constructor(transform, vertices, indices, normals, uvs, textureText, program, lights){
        super(transform, vertices, indices, normals, uvs, textureText, program, lights);
        this.moveRight = false;
        this.moveLeft = false;
        this.moveForward = false;
        this.moveBackward = false;
        this.translationSpeed = 10.0;
        this.rotationalSpeed = 10.0;
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;
        this.lights = lights;
        this.lastCheck = this.worldMatrix[3];
    }

    move(ts){

        //move object to left  or right 
        let h = 0;
        if(this.moveLeft){
            h = -ts*2.0/3.0;
        } else if(this.moveRight){
            h = ts*2.0/3.0;
        } 

        // speed up or slow down
        let v = 2*ts;
        if(this.moveForward){
            v += ts;
        } else if(this.moveBackward){
            v -= ts;
        }

        let dir = [Math.cos( utils.degToRad(this.rz)) * Math.cos( utils.degToRad(this.rx)),
            Math.sin( utils.degToRad(this.rz)), Math.cos( utils.degToRad(this.rz)) * Math.sin( utils.degToRad(this.rx))];
        this.setWorldMatrix([this.worldMatrix[3], this.worldMatrix[7], this.worldMatrix[11], this.rx, this.ry, this.rz, 1.0]);

        let translation = utils.MakeTranslateMatrix(v*dir[0], 0, h*dir[0]);
        this.multiplyWorldMatrixBy(translation);
        
        // clamp the spaceship's left-right movement
        var boundary = 12.0;
        if (this.worldMatrix[11] < - boundary)
            this.worldMatrix[11] = -boundary;
        else if (this.worldMatrix[11] > boundary)
            this.worldMatrix[11] = boundary;
    }


}