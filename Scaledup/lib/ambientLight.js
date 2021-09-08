class AmbientLight{
    constructor(type, alphaDeg, betaDeg, color, lowColor, SHLeft, SHRight, matColor){
        this.type = type;
        let alpha = utils.degToRad(alphaDeg);
        let beta = utils.degToRad(betaDeg);
        this.lightDirection = [Math.cos(alpha) * Math.cos(beta),
            Math.sin(alpha), Math.cos(alpha) * Math.sin(beta)];
            this.color = color;
            this.lowColor = lowColor;
            this.SHLeft = SHLeft;
            this.SHRight = SHRight;
            this.matColor = matColor;
    }
    setType(type){
        this.type = type;
    }
}