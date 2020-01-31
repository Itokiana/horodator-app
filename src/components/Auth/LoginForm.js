import React, { Component } from "react";
import axios from 'axios';
import { Base64 } from 'js-base64';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';

import { ApiBaseUri } from "../../configs";

class LoginForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  componentDidMount() {
    if(sessionStorage.getItem("session") !== null) {
      this.setState({ redirect: true });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const email = this.getEmail.value;
    const password = this.getPassword.value;
    const data = {
      email: email,
      password: password
    };

    axios.post(ApiBaseUri.horodator_server + '/api/login', data)
    .then((res) => {
      if(res.status === 200) {
        if(res.data.jwt !== undefined){
          console.log("DATA = > ", res.data)
          let current_user = Base64.encode(JSON.stringify(res.data))
          window.sessionStorage.setItem("session", current_user);

          this.setState({ redirect: true });
          
        } else {
          console.log("ERREUR DE LOGIN")
          var inputEl = $('.validate-input .input100');
          console.log(inputEl)

          for(var i=0; i<inputEl.length; i++) {
            $(inputEl[i]).parent().addClass('alert-validate');
          }
        }
      }
    })
    .catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
      console.log(err)
   })
  }

  handleInputFocus = e => {
    $('input[name="'+ e.target.name +'"]').parent().removeClass('alert-validate');
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to='/'/>;
    }

    return (

      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30">
            <form className="login100-form validate-form" onSubmit={ this.handleSubmit }>
              <span className="login100-form-title p-b-55">
                Tongasoa
              </span>

              <div className="wrap-input100 validate-input m-b-16" data-validate = "Erreur ou email incorrect">
                <input className="input100" type="email" name="email" placeholder="Email" ref={ (input) => this.getEmail = input } onFocus={ this.handleInputFocus } />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-envelope"></span>
                </span>
              </div>

              <div className="wrap-input100 validate-input m-b-16" data-validate = "Erreur de mot de passe">
                <input className="input100" type="password" name="pass" placeholder="Password" ref={ (input) => this.getPassword = input } onFocus={ this.handleInputFocus }/>
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-lock"></span>
                </span>
              </div>

              
              <div className="container-login100-form-btn p-t-25">
                <button className="login100-form-btn">
                  Connexion
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;