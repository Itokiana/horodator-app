import React, { Component } from "react";
import { dateDiff } from './utils';


class Chrono extends Component{

  constructor(props){
    super(props)
    this.state = {
      date1 : new Date(),
      date2 : new Date(),
      time: {}
    }
  }

  componentDidMount(){
    this.timerID = setInterval(
      () => { this.tick() },
      1000
    );
  }

  // componentDidUpdate() {
  //   if(this.props.start === false) {
  //     clearInterval(this.timerID);
  //   }
  // }

  componentWillUnmount(){
    clearInterval(this.timerID);  
  }

  tick() {
    console.log("COUCOUCOCU => ", this.props.start)
    if(this.props.start === true) {
      this.setState({
          date2 : new Date(),
          time: dateDiff(this.state.date1, this.state.date2)
      });
    }
    // let y = ((parseInt(this.state.time.hour) * 5) * 100)/60;
    // updateDonutChart('#specificChart', y, true)
  }

  render() {
    return (
      <span className="login100-form-title p-b-55" style={ {fontSize: "60px" } }>
      {
              this.props.start ? (
                <h6>coucou</h6>
              ) : (
                <h6>VOUS ÊTES EN PAUSE</h6>
              )
            }
        { ("0" + this.state.time.hour).slice(-2) }:{ ("0" + this.state.time.min).slice(-2) }:{ ("0" + this.state.time.sec).slice(-2) }
      </span>
    );
  }
}

export default Chrono;