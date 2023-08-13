class Time {
    private _hour: number;
    private _minute: number;
    private _second: number;
    private _timeZone: number;    // Time zone offset in hours
    private _timeFormat: string; // Time format (24h or AM/PM)
  
    // Constructor initializes the time based on the provided time zone
    constructor(timeZone : number) {
      const date = new Date();   
      this._hour = date.getHours() + date.getTimezoneOffset()/60;
      this._minute = date.getMinutes();
      this._second = date.getSeconds();
      this._timeZone = timeZone;
      this.addHours(this._timeZone);
      this._timeFormat = "24h";
    }
    
    // Set the time using a new Date object
    public setTime(newDate: Date): void {
      this._hour = newDate.getHours();
      this._minute = newDate.getMinutes();
      this._second = newDate.getSeconds();
    }

    // Set the time format (24h or AM/PM)
    public setTimeFormat(timeFormat: string): void{
        this._timeFormat = timeFormat;
    }
    
    // Add hours to the time, considering overflow
    public addHours(hours: number): void {
        const hour = (this._hour + hours) % 24;
        this._hour = hour >= 0 ? hour : hour + 24;
    }

    // Add minutes to the time, considering overflow
    public addMinutes(minutes: number): void {
        const Minutes = this._hour * 60 + this._minute + minutes;
        this._hour = Math.floor(Minutes / 60) % 24;
        this._minute = Minutes % 60;
    } 
  
    // Get the time zone
    public getTimeZone(): number {
        return this._timeZone;
    }

    // Get the time format (24h or AM/PM)
    public getTimeFormat(): string {
        return this._timeFormat;
    }

     // Get a string representation of the time
    public getTimetoString(hourFormatted ?: number, period ?: string): string {
      const hours = this._hour.toString().padStart(2, '0');
      const minutes = this._minute.toString().padStart(2, '0');
      const secondes = this._second.toString().padStart(2, '0');
      if (period !== undefined && hourFormatted !== undefined ) {
        return `${hourFormatted}:${minutes}:${secondes} ${period}`
      } else {
        return `${hours}:${minutes}:${secondes}`
      }
    }

    // Get the formatted time based on the selected time format
    public getFormattedTime(): string {
        if (this._timeFormat === 'AM/PM') {
          const period = this._hour >= 12 ? 'PM' : 'AM';
          const hours= this._hour % 12 || 12;
          return this.getTimetoString(hours, period);
        } else {
          return this.getTimetoString();
        }
    }
    
    // Update the time display by incrementing the time by one second
    public updateTimeDisplay(): void { 
        let newTime = new Date()
        newTime.setHours(this._hour, this._minute, this._second);
        newTime = new Date(newTime.getTime() + 1000);
        this.setTime(newTime);
    }

}
  
export { Time };