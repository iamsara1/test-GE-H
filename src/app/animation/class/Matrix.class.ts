import { Vector } from "./Vector.class";

class Matrix {
    private _rows: number;
    private _cols: number;
    public elements: number[][];

    constructor(_rows: number, _cols:  number, elements: number[][]){
       this._rows = _rows,
       this._cols = _cols,
       this.elements = elements;
    }

    // Get the value at the specified row and column
    public getValueAt(row: number, col: number): number {
        return this.elements[row][col];
    }
    
     // Add another matrix to this matrix
    public add(matrix: Matrix): Matrix {
        if (this._rows !== matrix._rows || this._cols !== matrix._cols)  
            throw new Error("The matrix dimensions are incompatible");

        const resMatrix: number[][] = this.elements.map((row, i) =>
        row.map((value, j) => value + matrix.elements[i][j]) );

        return new Matrix(this._rows, this._cols, resMatrix);
    }

    // Subtract another matrix from this matrix
    public subtract(matrix: Matrix): Matrix {
        if (this._rows !== matrix._rows || this._cols !== matrix._cols) 
            throw new Error("The matrix dimensions are incompatible");
        
        const resMatrix: number[][] = this.elements.map((row, i) =>
        row.map((value, j) => value - matrix.elements[i][j]) );

        return new Matrix(this._rows, this._cols, resMatrix);
    }

    // Multiply this matrix by another matrix
    public multiply(matrix: Matrix): Matrix {
        if (this._cols !== matrix._rows)
            throw new Error("The matrix dimensions are incompatible");
        
        const result: number[][] = this.elements.map((rowA) =>
            matrix.elements[0].map((_, j) =>
                rowA.reduce((sum, value, k) => sum + value * matrix.elements[k][j], 0)
            )
        );

        return new Matrix(this._rows, matrix._cols, result);
    }

    // Calculate the determinant of this matrix
    public determinant(): number {
        if (this._rows !== this._cols) throw new Error("To calculate the determinant, matrix must be square");

        if (this._rows === 2) {
            return this.elements[0][0] * this.elements[1][1] - this.elements[0][1] * this.elements[1][0];
        }

        let det = 0;
        for (let j = 0; j < this._cols; j++) {
            const sign = j % 2 === 0 ? 1 : -1;
            det += sign * this.elements[0][j] * this.minorOfMatrix(0, j).determinant();
        }

        return det;
    }

    // Calculate the minor of the matrix for a given row and column
    public minorOfMatrix(row: number, col: number): Matrix {
        const Data: number[][] = [];

        for (let i = 0; i < this._rows; i++) {
            if (i !== row) {
                const minRow = [];
                for (let j = 0; j < this._cols; j++) {
                    if (j !== col) {
                        minRow.push(this.elements[i][j]);
                    }
                }
                Data.push(minRow);
            }
        }

        return new Matrix(this._rows - 1, this._cols - 1, Data);
    }

    // Transpose the matrix
    public transpose(): Matrix {
        const transMatrix: number[][] = [];

        for (let i = 0; i < this._cols; i++) {
            const newRow: number[] = [];
            for (let j = 0; j < this._rows; j++) {
                newRow.push(this.elements[j][i]);
            }
            transMatrix.push(newRow);
        }

        return new Matrix(this._cols, this._rows, transMatrix);
    }

    // Calculate the inverse of the matrix
    public inverse(): Matrix {
        const det = this.determinant();
        if (det === 0) throw new Error("The matrix is non-invertible");

        const cofactorData: number[][] = [];
        for (let i = 0; i < this._rows; i++) {
            const newRow: number[] = [];
            for (let j = 0; j < this._cols; j++) {
                const sign = (i + j) % 2 === 0 ? 1 : -1;
                newRow.push(this.minorOfMatrix(i, j).determinant() * sign / det);
            }
            cofactorData.push(newRow);
        }

        return new Matrix(this._rows, this._cols, cofactorData).transpose();
    }

    // Create translation matrix using a Vector
    public static translate(vector: Vector): Matrix {
        const [dx, dy] = vector.toArray();

        return new Matrix(3, 3, [
            [1, 0, dx],
            [0, 1, dy],
            [0, 0, 1]
        ]);
    }
 
    // Create a rotation matrix
    public static rotate(radian: number, axisX: number, axisY: number): Matrix {
        const cosRad = Math.cos(radian);
        const sinRad = Math.sin(radian);

        const translationToOrigin = Matrix.translate(new Vector(-axisX, -axisY));
        
        const rotationMatrix = new Matrix(3, 3, [
            [cosRad, -sinRad, 0],
            [sinRad, cosRad, 0],
            [0, 0, 1]
        ]);
         
        const translationBack = Matrix.translate(new Vector(axisX, axisY));
         
        const combinedMatrix = translationBack.multiply(rotationMatrix).multiply(translationToOrigin);
 
         return combinedMatrix;
    }
     
    // Create a scaling matrix using a Vector
    public static scale(vector: Vector): Matrix {
        const [sx, sy] = vector.toArray();

        return new Matrix(3, 3, [
            [sx, 0,  0],
            [0,  sy, 0],
            [0,  0,  1]
        ]);
    }     
    
}

export { Matrix };