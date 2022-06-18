class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sessonCount: 25,
            breakCount: 5,
            sessionLength: 60*25,
            breakLength: 60*5,
            pause: true,
            active: false,
            reset: false
        }
        this.timer = this.timer.bind(this);
        this.startStop = this.startStop.bind(this);
        this.timeConvert = this.timeConvert.bind(this);
        this.startOrPause = this.startOrPause.bind(this);
        this.addBreak = this.addBreak.bind(this);
        this.subBreak = this.subBreak.bind(this);
        this.subSesh = this.subSesh.bind(this);
        this.addSesh = this.addSesh.bind(this);
        this.reset = this.reset.bind(this);
        this.timerLabel = this.timerLabel.bind(this);
        this.getTime = this.getTime.bind(this);
        this.playSound = this.playSound.bind(this);
    }
    //timeConvert takes a time in seconds and returns the time in mm:ss format. The maximum input for the function is 3600 seconds (1 hour).
    timeConvert (time) {
        let minutes = Math.floor(time/60);
        let seconds = time % 60
        if(time <= 0) {
            return "00:00";
        } else if (time < 10){
        return minutes.toString() + "0:0" + seconds.toString();
       } else if (time < 60){
        return minutes.toString() + "0:" + seconds.toString();
       } else if (time < 600 && seconds < 10){
        return "0" + minutes.toString() + ":0" + seconds.toString();
       } else if (time < 600) {
        return "0" + minutes.toString() + ":" + seconds.toString();
       } else if (time < 3600 && seconds < 10){
        return minutes.toString() + ":0" + seconds.toString();
       } else if (time < 3600) {
        return minutes.toString() + ":" + seconds.toString();
       } else if (time == 3600) {
        return "60:00";
       } else {
        return "Error time is greater than one hour.";
       }
    }
    timer (sessionTime, breakTime){
        let seconds = sessionTime;
        this.setState({
            breakSeconds: this.state.breakCount * 60
        })
        let breakSeconds = breakTime;
        let interval = setInterval( () => {
            if (this.state.reset){
                this.setState({
                    reset: false
                })
                clearInterval(interval);
            }
        if (!this.state.pause){
            seconds = this.state.sessionLength;
            seconds--;
            this.setState({
                sessionLength: seconds
            })
            if(seconds < -1) {
                this.playSound();
                clearInterval(interval);
                let interval2 = setInterval(() => {
                    if (this.state.reset){
                        this.setState({
                            reset: false
                        })
                        clearInterval(interval2);
                    }
                    if (!this.state.pause){
                        breakSeconds = this.state.breakLength;
                    breakSeconds--;
                    this.setState({
                        breakLength: breakSeconds
                    })
                    //try down here
                    if(breakSeconds < -2){
                        console.log("this is the break length" + this.state.breakLength);
                        this.playSound();
                        clearInterval(interval2);
                        this.setState({
                            sessionLength: this.state.sessonCount *60,
                            breakLength: this.state.breakCount * 60
                        })
                        this.timer()
                    }
                    }
                },1000)
            }
        }
        },1000)
        
    }
    startOrPause () {
        this.setState({
            reset: false
        })
        if (!this.state.active){
            this.setState({
                active: true
            })
            this.startStop();
        } else {
            if (this.state.pause) {
                this.setState({
                    pause: false
                })
            } else {
                this.setState({
                    pause: true
                })
            }
        }  
    }
    startStop (){
        this.setState({
            pause: !this.state.pause
        })
            this.timer();
    }
    addBreak (){
        if(this.state.pause){
            if(this.state.breakLength < 3600){
                this.setState({
                    breakLength: this.state.breakCount * 60 + 60,
                    breakCount: this.state.breakCount + 1,
                    reset: false
                })
            }
        }
    }
    subBreak (){
        if(this.state.pause){
            if(this.state.breakLength > 60){
                this.setState({
                    breakLength: this.state.breakCount * 60 - 60,
                    breakCount: this.state.breakCount - 1,
                    reset: false
                })
            }
        }
    }
    addSesh (){
        if(this.state.pause){
            if(this.state.sessionLength < 3600){
                this.setState({
                    sessionLength: this.state.sessonCount * 60 +60,
                    sessonCount: this.state.sessonCount + 1,
                    reset: false
                })
            }
        }
    }
    subSesh (){
        if(this.state.pause){
            if(this.state.sessionLength > 60){
                this.setState({
                    sessionLength: this.state.sessonCount * 60 - 60,
                    sessonCount: this.state.sessonCount - 1,
                    reset: false
                })
            }
        }
    }
    reset () {
        if (!this.state.reset){
            this.setState({
                sessonCount: 25,
                breakCount: 5,
                sessionLength: 1500,
                breakLength: 300,
                pause: true,
                active: false,
                reset: true
            })
        }
        document.getElementById("beep").pause();
        document.getElementById("beep").currentTime = 0;
    }
    timerLabel () {
        if(this.state.sessionLength > -1 && this.state.breakLength > 0){
            return "Session";
        } else if (this.state.sessionLength < 0 && this.state.breakLength < 0) {
            return "Session";
        } else {
            return "Break";
        }
    }
    getTime () {
        if(this.state.sessionLength > -1) {
            return this.state.sessionLength;
        } else if (this.state.sessionLength < 0 && this.state.breakLength < 0) {
           
            return this.state.sessonCount *60;
        } else {
            return this.state.breakLength;
        }
    }
    playSound () {
        document.getElementById('beep').play();
    }
    render(){
        return(
            <div className="clock">
                <audio src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" id="beep" preload="auto"></audio>
                <div className="seshBox">
                    <div id="session-label">Session Length</div>
                    <button id="session-increment" onClick={this.addSesh}></button>
                    <div id="session-length">{this.state.sessonCount}</div>
                    <button id="session-decrement" onClick={this.subSesh}></button>
                </div>
                <div className="breakBox">
                    <div id="break-label">"Break Length"</div>
                    <button id="break-increment" onClick={this.addBreak}></button>
                    <div id="break-length">{this.state.breakCount}</div>
                    <button id="break-decrement" onClick={this.subBreak}></button>
                </div>
                <div id="timer-label">{this.timerLabel()}</div>
                <div id="time-left">{this.timeConvert(this.getTime())}</div>
                <button id="start_stop" onClick={this.startOrPause}>Start / Stop</button>
                <button id="reset" onClick={this.reset}>Reset</button>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById("root"))