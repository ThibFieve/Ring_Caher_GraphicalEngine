class Pattern{
    constructor(scene, transform){
        this.scene = scene;
        this.tp = transform;

        this.t0 = [];
        this.t1 = [];
        this.t2 = [];
        this.t3 = [];
        this.tr = [];

        this.s0 = [];
        this.s1 = [];
        this.s2 = [];
    }

    setPattern(num){
        switch(num){
            case 0:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 0.0, 0.0, 1.0];
              this.t2 = [this.scene.playerPawn.lastCheck, this.tp[1], 6.0, 0.0, 0.0, 0.0, 1.0];
              this.t3 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 1:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], 6.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 2:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], 6.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 3:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 4:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 0.0, 0.0, 1.0];
              this.t2 = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 0.0, 0.0, 1.0];
              this.t3 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], 6.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 5:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 0.0, 0.0, 1.0];
              this.t2 = [this.scene.playerPawn.lastCheck, this.tp[1], 6.0, 0.0, 0.0, 0.0, 1.0];
              this.t3 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 6:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 7:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 8:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 0.0, 0.0, 1.0];
              this.t1 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 90.0, 90.0, 1.0];
              break;
            case 9:
              this.t0 = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 0.0, 0.0, 1.0];
              this.tr = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 90.0, 90.0, 1.0];
              break;
        } 
    }

    setSpherePattern(num){
        switch(num){
            case 0:
              this.s0 = [this.scene.playerPawn.lastCheck, this.tp[1], -12.0, 0.0, 0.0, 0.0, 1.0];
              this.s1 = [this.scene.playerPawn.lastCheck, this.tp[1], 6.0, 0.0, 0.0, 0.0, 1.0];
              this.s2 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              break;
            case 1:
              this.s0 = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 0.0, 0.0, 1.0];
              this.s1 = [this.scene.playerPawn.lastCheck, this.tp[1], 12.0, 0.0, 0.0, 0.0, 1.0];
              break;
            case 2:
              this.s0 = [this.scene.playerPawn.lastCheck, this.tp[1], -6.0, 0.0, 0.0, 0.0, 1.0];
              this.s1 = [this.scene.playerPawn.lastCheck, this.tp[1], 6.0, 0.0, 0.0, 0.0, 1.0];
              break;
            case 3:
              this.s0 = [this.scene.playerPawn.lastCheck, this.tp[1], 0.0, 0.0, 0.0, 0.0, 1.0];
              break;
        }
    }
}
