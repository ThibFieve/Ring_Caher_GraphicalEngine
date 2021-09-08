


class Camera {
    constructor(cx, cy, cz, elev, ang){
        
        this.cx = cx;
        this.cy = cy;
        this.cz = cz;
        this.elev = elev;
        this.ang=ang;
        
       this.localpos=utils.MakeTranslateMatrix(this.cx,this.cy,this.cz);
       

        this.viewMatrix = utils.MakeView(cx, cy, cz, elev, ang);
    }
    getViewMatrix(){
        return this.viewMatrix;
    }
    getPosition(){
        return [this.cx ,this.cy, this.cz ];
            
    }
    setViewMatrix(vm){
        this.viewMatrix = vm;
    }


    setupCamera(player,offset){ // Give it a gameobject and an offset with respect to that object , the camera will follow the object and look at it 

    
    this.localpos=utils.MakeTranslateMatrix(offset[0],offset[1],offset[2]);

   this.followPlayer(player); // follow the player
   this.updateViewMatrix(player); // look at the player


    }

    followPlayer(player){ // Give it a gameobject and an offset with respect to that object 
        
        
        var playerWorldMatrix = player.getWorldMatrix();
      
        var CameraPos =utils.multiplyMatrices(playerWorldMatrix,this.localpos);


        this.cx= CameraPos[3];
        this.cy= CameraPos[7];
        this.cz= 0;//CameraPos[11]; // IF YOU WANT THE CAMERA NOT TO FOLLOW THE SHIP REPLACE THIS BY 0 or -1 , or any positions

        

    }

    
    
    updateViewMatrix(player){  // Look at camera 
        var vm = player.getWorldMatrix();
        var vz = [this.cx - vm[3], this.cy - vm[7], this.cz - vm[11]];
        var normvz = [math.norm(vz), math.norm(vz), math.norm(vz)];
        vz=math.dotDivide(vz, normvz);
        var vx= math.cross( [0.0,1.0,0.0],vz);
        var normvx = [math.norm(vx),math.norm(vx),math.norm(vx)];
        vx=math.dotDivide(vx, normvx);
        var vy= math.cross(vz,vx);
        var CameraMatrix= [ vx[0], vy[0], vz[0] , this.cx,  
                        vx[1], vy[1], vz[1] , this.cy ,
                        vx[2], vy[2], vz[2] , this.cz  ,
                        0.0 ,0.0 ,0.0 ,1.0       ];

        
        var viewMatrix = utils.invertMatrix(CameraMatrix);
        this.setViewMatrix(viewMatrix);
    }

}