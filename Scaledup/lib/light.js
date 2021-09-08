class Light{
    constructor(type, alphaDeg, betaDeg, color, position, coneOut, coneIn, decay, target){
        let alpha = utils.degToRad(alphaDeg);
        let beta = utils.degToRad(betaDeg);
        this.lightDirection = [Math.cos(alpha) * Math.cos(beta),
            Math.sin(alpha), Math.cos(alpha) * Math.sin(beta)];
        this.color = color;
        this.type = type;
        this.position = position;
        this.coneOut = coneOut;
        this.coneIn = coneIn;
        this.decay = decay;
        this.target = target;
    }
    getAlpha(){
        return this.alpha;
    }
    getBeta(){
        return this.beta;
    }
    getDL(){
        return this.dl;
    }
    getColor(){
        return this.color;
    }
    setType(type){
        this.type = type;
    }
}