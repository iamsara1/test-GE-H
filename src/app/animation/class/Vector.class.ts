import { Point } from "./Point.class";

class Vector {
    [x: string]: any;

    private _x: number;
    private _y: number;

    constructor(x: number,y: number) {
        this._x = x;
        this._y = y;
    }

    //Adds another vector to this vector.
    public add(other: Vector): Vector {
        return new Vector(this._x + other._x, this._y + other._y);
    }

    //Subtracts another vector from this vector.
    public subtract(other: Vector): Vector {
        return new Vector(this._x - other._x, this._y - other._y);
    }

    // Return a new vector with all components multiplied by a number passed as a parameter
    public scaleBy(scalar: number): Vector {
        return new Vector(this._x * scalar, this._y * scalar);
    }
    
    // Invert the vector
    public invert(): Vector {
        return new Vector(-this._x, -this._y);
    }

    // Convert a Point to a Vector
    public toVector(point: Point): Vector {
        return new Vector(point.getX(), point.getY());
    }

    // Convert a Vector to a point
    public toPoint() : Point {
        return new Point(this._x, this._y);
    }

    // Convert a Vector to an array 
    public toArray() : number[]{
        return [this._x, this._y]
    }

}

export { Vector }