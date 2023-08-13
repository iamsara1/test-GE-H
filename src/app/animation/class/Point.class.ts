class Point {    
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    //Get the x-coordinate of the point
    public getX() : number {
        return this._x;
    }

    //Get the y-coordinate of the point
    public getY() : number {
        return this._y;
    }

    //Set the x-coordinate of the point.
    public setX(x: number): void {
        this._x = x;
    }

    //Set the y-coordinate of the point.
    public setY(y: number): void{
        this._y = y;
    }
}

export { Point };