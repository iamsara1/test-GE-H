import { Watch } from './Watch.class';

class WatchContainer {
  // Array to store watches
  private watches: Watch[] = [];

  // HTML element containing watches in the DOM
  private watchesDiv: HTMLElement = document.getElementById('watches');

  constructor() {
    // Get button and timezone input elements
    const addWatchButton = document.getElementById('addWatchButton');
    const timeZoneInput = document.getElementById('TimeZone') as HTMLInputElement;

    if (addWatchButton && timeZoneInput) {
      // Add initial watch with the timezone depending on the user's location
      const timeZoneInitial = Math.abs(new Date().getTimezoneOffset()/60);
      const initialWatch = new Watch(timeZoneInitial);
      this.addWatchToContainer(initialWatch, timeZoneInitial);

      // Add a click listener to the "Add Watch" button 
      addWatchButton.addEventListener('click', () => {
        const timeZone = parseInt(timeZoneInput.value, 10);
        // Create a new watch with the specified timezone and add it to the container 
        if (!isNaN(timeZone)) {
          const newWatch = new Watch(timeZone);
          this.addWatchToContainer(newWatch, timeZone);
        }
      });
    }

    // Update time for all watches every second
    setInterval(() => {
      this.updateTimeForAllWatches();
    }, 1000);
    
  }

  // Add a watch to the container
  public addWatchToContainer(newWatch: Watch, timeZone : number) : void{
    // Create a new div element for the watch
    const watchDiv = document.createElement('div');
    watchDiv.classList.add(`watch`);
    watchDiv.id = `Watch-${newWatch.getWatchId()}`;

    // Create a delete button for removing the watch
    const deleteButton = document.createElement('div');
    deleteButton.innerText = 'X';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => {
        this.deleteWatch(newWatch.getWatchId());
    });
    watchDiv.appendChild(deleteButton);

    // Create timezone label
    const timeZonelabel = document.createElement('div');
    timeZonelabel.classList.add('timeZonelabel');
    timeZonelabel.innerText = 'GMT' + (timeZone >= 0 ? '+'+ timeZone : timeZone);
    watchDiv.appendChild(timeZonelabel);

    // Create an element to display the current time
    const time = document.createElement('div');
    time.classList.add(`time`);
    time.id = `time-${newWatch.getWatchId()}`;
    time.innerText = newWatch.getCurrentTime();
    watchDiv.appendChild(time);

    // Create a button for toggling watch mode
    const modeButton = document.createElement('button');
    modeButton.innerText = 'Mode';
    modeButton.classList.add('mode');
    modeButton.addEventListener('click', () => {
      newWatch.toggleMode(); 
      newWatch.getModeValue() != 0 ? increaseButton.disabled = false : increaseButton.disabled = true;
      increaseButton.classList.toggle('enable', !increaseButton.disabled);
    });
    watchDiv.appendChild(modeButton);

    // Create a button for increasing time
    const increaseButton = document.createElement('button');
    increaseButton.innerText = 'Increase';
    increaseButton.disabled = true;
    increaseButton.classList.add('increase');
    increaseButton.addEventListener('click', () => {
      newWatch.increaseTime();
      time.innerText = newWatch.getCurrentTime();
    });
    watchDiv.appendChild(increaseButton);

    // Create a button for toggling light mode
    const lightButton = document.createElement('button');
    lightButton.innerText = 'Light Mode';
    lightButton.classList.add('light');
    lightButton.addEventListener('click', () => {
      newWatch.toggleLight();
      time.classList.toggle('light-on-time', newWatch.getLightValue());
      lightButton.innerText === 'Light Mode' ? lightButton.innerText = 'Dark Mode' : lightButton.innerText = 'Light Mode';
    });
    watchDiv.appendChild(lightButton);

    // Create a button for toggling time format
    const toggleFormatButton = document.createElement('button');
    toggleFormatButton.innerText = 'Toggle Format';
    toggleFormatButton.classList.add('toggleFormat');
    toggleFormatButton.addEventListener('click', () => {
      newWatch.toggleTimeFormat();
      time.innerText = newWatch.getCurrentTime();
    });
    watchDiv.appendChild(toggleFormatButton);

    // Create a button for scaling up the watch
    const scaleUpButton = document.createElement('button');
    scaleUpButton.innerText = 'Scale-up';
    scaleUpButton.classList.add('scaleUp');
    scaleUpButton.addEventListener('click', () => {
      newWatch.scaleUp(1.5, 1.5);
      this.updatePosition(newWatch);
    });
    watchDiv.appendChild(scaleUpButton);

    // Create a button for scaling down the watch
    const scaleDownButton = document.createElement('button');
    scaleDownButton.innerText = 'Scale-down';
    scaleDownButton.classList.add('scaleDown');
    scaleDownButton.addEventListener('click', () => {
      newWatch.scaleDown(1.5, 1.5);
      this.updatePosition(newWatch);
    });
    watchDiv.appendChild(scaleDownButton);
    
    // Create a button for rotating the watch on itself
    const rotateSelfButton = document.createElement('button');
    rotateSelfButton.innerText = 'Rotate on itself';
    rotateSelfButton.classList.add('rotateSelf');
    rotateSelfButton.addEventListener('click', () => {
      newWatch.rotateSelf(45, () => {
        this.updatePosition(newWatch);
      });
    });
    watchDiv.appendChild(rotateSelfButton);

    // Create a button for rotating the watch around a point
    const rotateAroundPointButton = document.createElement('button');
    rotateAroundPointButton.innerText = 'Rotate Around';
    rotateAroundPointButton.classList.add('rotateAround');
    rotateAroundPointButton.addEventListener('click', () => {
    // Générer des valeurs aléatoires pour X et Y
      newWatch.rotateAroundPoint(120, this.getRandomValue(0, window.innerWidth), this.getRandomValue(0, window.innerHeight), () => {
        this.updatePosition(newWatch);
      }); 
      this.updatePosition(newWatch);
    });
    watchDiv.appendChild(rotateAroundPointButton);
    
    // Create a button for resetting the watch
    const resetButton = document.createElement('button');
    resetButton.innerText = 'Reset';
    resetButton.classList.add('reset');
    resetButton.addEventListener('click', () => {
      newWatch.reset();
      time.classList.toggle('light-on-time', newWatch.getLightValue());
      if(lightButton.innerText === 'Dark Mode')  lightButton.innerText = 'Light Mode';
      newWatch.getModeValue() != 0 ? increaseButton.disabled = false : increaseButton.disabled = true;
      increaseButton.classList.toggle('enable', !increaseButton.disabled);
      time.innerText = newWatch.getCurrentTime();
    });
    watchDiv.appendChild(resetButton);

    // Add the new watch to the DOM and the watches array
    this.watchesDiv.appendChild(watchDiv);
    this.watches.push(newWatch);
    this.updatePosition(newWatch);
  }

  // Update the time display for all watches
  public updateTimeForAllWatches(): void{
    this.watches.forEach(watch => {
      const { watchId, currentTime } = watch.updateWatchDisplay();
      const timeElement = document.getElementById(`time-${watchId}`);
      if (timeElement) {
        timeElement.innerText = currentTime;
      }
    });
  }

  // Update the position, scale, and rotation of a watch in the container
  public updatePosition(watch: Watch): void {
    const watchDiv = document.getElementById(`Watch-${watch.getWatchId()}`);
    const translateX = watch.getPosition().getX();
    const translateY = watch.getPosition().getY();
    const rotation = watch.getRotation();
     const scale = watch.getScale();
    watchDiv.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`;
  }

  // Delete a watch from the container And from thes watches array
  public deleteWatch(watchId: number): void {
    const watchIndex = this.watches.findIndex(watch => watch.getWatchId() === watchId);

    if (watchIndex !== -1) {
      const watchDiv = document.getElementById(`Watch-${watchId}`);
      if (watchDiv) {
        watchDiv.remove(); 
      }

      this.watches.splice(watchIndex, 1); 
    }
  }

  // Function to generate a random value between min and max
  public getRandomValue(min: number, max: number) : number{
    return Math.random() * (max - min) + min;
  }

}

export { WatchContainer };
