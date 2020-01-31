import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';

import { ApiBaseUri } from "../../configs";
import { start, stop } from '../../cors/horodator_server';
import { sendInactivity } from '../../cors/computer_event_to_send';
import Chrono from "./Chrono";


class Dashboard extends Component{

  constructor(props){
    super(props);
    this.state = {
      timeInactivitySenderInterval: 10000,
      connected: true,
      startWatch: true,
    }
  }

  componentDidMount(){
    this.startHorodator();
    axios.get(ApiBaseUri.horodator_server + '/dashboard/settings/time_check')
    .then((res) => {
      this.setState({
        timeInactivitySenderInterval: parseInt(res.data.inactivity)
      })
    })

    this.inactivitySenderID = setInterval(() => {
      let inactivity_position = JSON.parse(localStorage.getItem("inactivity_position"));
      const schedule = JSON.parse(sessionStorage.getItem('owner'))

      if(inactivity_position !== null && inactivity_position.length !== 0 && schedule !== null){
        this.reportInactivity({ schedule: schedule.schedule, inactivity: inactivity_position[0] })
      }
    }, this.state.timeInactivitySenderInterval)

    this.loadSessionID = setInterval(() => {
      if(sessionStorage.getItem("session") !== null) {
        this.setState({ connected: true })
      } else {
        this.setState({ connected: false })
      }
      this.checkSession()
    }, 5000)
  }

  componentWillUnmont(){
    clearInterval(this.inactivitySenderID)
    clearInterval(this.loadSessionID)
  }

  startHorodator(){
    let session = sessionStorage.getItem("session");
    let computerInfos = sessionStorage.getItem("computer_infos");
    if(session !== null && computerInfos !== null ){
      console.log(computerInfos)
      let c = JSON.parse(computerInfos)

      session = Base64.decode(session);
      console.log(session)
      start(
        JSON.parse(session).jwt,
        {
          ip: c.ip,
          mac: c.mac
        }
      ).then((res) => {
        sessionStorage.setItem('owner', JSON.stringify(res.data));
      })

    }
  }

  stopHorodator(){
    let session = sessionStorage.getItem("session");
    let owner = JSON.parse(sessionStorage.getItem("owner"))

    if(session !== null){

      session = Base64.decode(session);
      console.log(session)
      stop(
        JSON.parse(session).jwt,
        { schedule: owner.schedule }
      ).then((res) => {
        sessionStorage.removeItem('owner');
      })

    }
  }

  reportInactivity(data){
    let session = sessionStorage.getItem("session");
    let owner = sessionStorage.getItem("owner");
    if(session !== null && owner !== null){

      session = Base64.decode(session);
      sendInactivity(
        JSON.parse(session).jwt,
        data
      )

    }
  }

  handleSignout = e => {
    e.preventDefault();

    let jwt_token = JSON.parse(Base64.decode(sessionStorage.getItem("session"))).jwt
    let owner = JSON.parse(sessionStorage.getItem("owner"))

    if(owner !== null){
      axios({
        method: "PUT",
        headers: {
          "Authorization": jwt_token
        },
        url: ApiBaseUri.horodator_server + '/end_horodator',
        data: { schedule: owner.schedule }
      }).then((res) => {
        sessionStorage.setItem("owner", JSON.stringify(res.data))
        sessionStorage.removeItem("session")
        this.setState({ connected: false })
      })
    } else {
      sessionStorage.removeItem("session")
      this.setState({ connected: false })
    }
  }

  handlePause = e => {
    this.setState({ startWatch: false });
    this.stopHorodator();
    sessionStorage.setItem("state", "pause")
  }

  handleStart = e => {
    this.setState({ startWatch: true });
    this.startHorodator();
    sessionStorage.removeItem("state")
  }

  checkSession() {
    if(sessionStorage.getItem("session") !== null){

      let jwt_token = JSON.parse(Base64.decode(sessionStorage.getItem("session"))).jwt

      axios({
        method: "GET",
        headers: {
          "Authorization": jwt_token
        },
        url: ApiBaseUri.horodator_server + '/current_user'
      }).then(
        (res) => {},
        (err) => {
          this.setState({ connected: false })
          sessionStorage.removeItem("session")
        }
      )

    }

  }


  render() {
    if(sessionStorage.getItem("session") === null || this.state.connected === false) {
      return <Redirect to='/auth'/>;
    }
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30">
            {
              this.state.startWatch ? (
                <span className="lnr lnr-clock float-right mt-3" style={ { fontSize: "46px" } } onClick={ this.handlePause } data-toggle="tooltip" data-placement="bottom" title="Pause"></span>
              ) : (
                <span className="lnr lnr-clock float-right mt-3 text-success" style={ { fontSize: "46px" } } onClick={ this.handleStart } data-toggle="tooltip" data-placement="bottom" title="Let's GO"></span>
              )
            }
            <Chrono start={ this.state.startWatch } />

            <div className="container-login100-form-btn p-t-25">
              <button className="login100-form-btn" onClick={ this.handleSignout }>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;