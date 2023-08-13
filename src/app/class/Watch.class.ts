import { Time } from './Time.class';
import { Animate } from '../animation/animate';
import { Point } from '../animation/class/Point.class';
import { Vector } from '../animation/class/Vector.class';

class Watch {
  private _watchId: number;     // Unique identifier for the watch
  private _time: Time;          // Object to manage time-related functionality
  private _modeValue: number;   // Current mode value (0, 1, or 2)
  private _lightValue: boolean; // Light mode status (on or off)
  private _animate: Animate;    // Object to handle animation operations
  private _position: Point;     // Current position of the watch (x, y)
  private _rotation: number;    // Current rotation angle of the watch
  private _scale: number = 1;   // Current scaling factor of the watch
  private _timerRotationAround : NodeJS.Timer; // Timer for rotating the watch around an arbitrary point
  private _timerRotation : NodeJS.Timer; // Timer for self-rotation animation

  constructor(timeZone : number) {
    this._time = new Time(timeZone);
    this._modeValue = 0;
    this._lightValue = false;
    this._watchId = Math.floor(Math.random() * 10000);
    this._animate = new Animate();
    this._position = new Point(0,0);
    this._rotation = 0;
  }

  // Getters for watch properties
  public getScale(): number {
    return this._scale;
  }
  
  public getWatchId(): number{
    return this._watchId;
  }
 
  public getCurrentTime(): string {
    return this._time.getFormattedTime();
  }
 
   // Toggle methods
  public toggleMode(): void {
    this._modeValue = (this._modeValue + 1) % 3;
  }

  public toggleLight(): void {
    this._lightValue = !this._lightValue;
  }

  // Increase time based on mode
  public increaseTime(): void {
    if (this._modeValue === 1) {
        this._time.addHours(1);
    } else if (this._modeValue === 2) {
        this._time.addMinutes(1);
    }
  }

  public getLightValue(): boolean {
    return this._lightValue;
  }

  public getModeValue(): number {
    return this._modeValue;
  }

  // Reset watch to default state
  public reset(): void {
    this._time = new Time(this._time.getTimeZone()); 
    this._modeValue = 0;
    this._lightValue = false;
  }

  // Toggle time format between 24-hour and AM/PM
  public toggleTimeFormat(): void {
    const timeFormat = this._time.getTimeFormat() === "24h" ? "AM/PM" : "24h";
    this._time.setTimeFormat(timeFormat);
  }
 
  // Update the watch display and return current time information
  public updateWatchDisplay(): { watchId: number; currentTime: string } {    
    this._time.updateTimeDisplay();
    return {
      watchId: this._watchId,
      currentTime: this._time.getFormattedTime(),
    };
  }

  // Get current position of the watch
  public getPosition(): Point {
    return this._position;
  }

  // Get current rotation angle of the watch
  public getRotation(): number {
    return this._rotation;
  }

  // Scale up the watch based on given x and y factors
  public scaleUp(x: number, y: number): void {
    const scalingVector = new Vector(x, y); // Utilisez les coordonnées x et y directement
    this._position = this._animate.scale(this._position, scalingVector);
    this._scale *= Math.max(x, y); // Mise à jour de l'échelle
  }

  // Scale down the watch
  public scaleDown(x: number, y: number): void {
    const scalingVector = new Vector(1 / x, 1 / y); // Utilisez les coordonnées inversées
    this._position = this._animate.scale(this._position, scalingVector);
    this._scale /= Math.max(x, y); // Mise à jour de l'échelle
  }

   // Rotate the watch around its own center
  public rotateSelf(angle: number, callback: () => void): void {
    const initialRotation = this._rotation;
    const targetRotation = initialRotation + 360;
    
    this._timerRotation = setInterval(() => {
      this._position =  this._animate.rotate(this._position, angle, 0, 0);
      this._rotation += angle;

      if (this._rotation >= targetRotation) {
        clearInterval(this._timerRotation);
        this._rotation = initialRotation;
      }      
      callback();
    }, 1000);

  }

   // Rotate the watch around an arbitrary point
  public rotateAroundPoint(angle: number, X: number, Y: number, callback: () => void): void {
    const initialRotation = this._rotation;
    const targetRotation = initialRotation + 360;

    this._timerRotationAround = setInterval(() => {
      this._position = this._animate.rotate(this._position, angle, X, Y);
      this._rotation += angle;

      if (this._rotation >= targetRotation) {
        clearInterval(this._timerRotationAround);
        this._rotation = initialRotation; 
      } 
      callback();
    }, 1000);

  }

}


export { Watch };