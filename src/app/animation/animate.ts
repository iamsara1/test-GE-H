import { Matrix } from "./class/Matrix.class";
import { Point } from "./class/Point.class";
import { Vector } from "./class/Vector.class"

class Animate {
    // Performs a translation 
    public translate (point: Point, translationPoint: Point): Matrix {
        const matrixToTranslate = new Matrix(3, 1, [[point.getX()], [point.getY()], [1]]);

        const translationVector = new Vector(translationPoint.getX(), translationPoint.getY());
        
        const matrix = Matrix.translate(translationVector);

        const resMatrix = matrix.multiply(matrixToTranslate);

        return resMatrix;
    }

    // Performs a rotation
    public  rotate (point: Point, radian : number, axisX: number, axisY: number): Point {
        const matrixToRotate = new Matrix(3, 1, [[point.getX()], [point.getY()], [1]]);
        const matrix = Matrix.rotate(radian, axisX, axisY);

        const resMatrix = matrix.multiply(matrixToRotate);
        
        const rotatedPoint = new Point(resMatrix.getValueAt(0, 0), resMatrix.getValueAt(1, 0));

        return rotatedPoint;
    }

    // Performs a scaling
    public  scale (point: Point, scalingVector: Vector): Point {
        const matrixToScale = new Matrix(3, 1, [[point.getX()], [point.getY()], [1]]);

        const matrix = Matrix.scale(scalingVector);

        const resMatrix = matrix.multiply(matrixToScale);

        const scaledPoint = new Point(resMatrix.getValueAt(0, 0), resMatrix.getValueAt(1, 0));

        return scaledPoint;
    }
}

export { Animate };
