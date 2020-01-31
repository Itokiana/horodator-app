const axios = require('axios');
const { ApiBaseUri } = require("../configs");
// let { dateDiff } = require('../utils');


function dateDiff(date1, date2) {
  var diff = {}                           // Initialisation du retour
  var tmp = date2 - date1;

  tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
  diff.sec = tmp % 60;                    // Extraction du nombre de secondes

  tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
  diff.min = tmp % 60;                    // Extraction du nombre de minutes

  tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
  diff.hour = tmp % 24;                   // Extraction du nombre d'heures

  tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
  diff.day = tmp;

  return diff;
}

module.exports.sendInactivity = (jwt, data) => {
  return axios({
    headers: { 'Authorization': jwt },
    method: 'post',
    url: ApiBaseUri.horodator_server + '/inactivity',
    data: data
  })
}

module.exports.sendWindow = (jwt, data) => {
  return axios({
    headers: { 'Authorization': jwt },
    method: 'post',
    url: ApiBaseUri.horodator_server + '/active_window',
    data: {
        title: data.title,
        platform: data.platform,
        x: data.bounds.x,
        y: data.bounds.y,
        widthScreen: data.bounds.width,
        heightScreen: data.bounds.height,
        startedAt: new Date(),
        endedAt: new Date()
      }
  })
}

module.exports.select_url_online = (cb, token, url) => {
  axios({
    method: "POST",
    headers: {
      "Authorization": token
    },
    url: ApiBaseUri.horodator_server + "/last_visited_url",
    data: {
      url: url,
    },
  })
  .then((res) => {
    if(!res.error){
      cb(token, res.data)
    }
  });
}

module.exports.start_visit_url_online = (url, token) => {
  axios({
    method: "POST",
    headers: {
      "Authorization": token
    },
    url: ApiBaseUri.horodator_server + "/start_visit_url",
    data: {
      url: url,
      date_of_visit: new Date(),
      start_focus: new Date()
    },
  })
  .then((res) => {
    if(!res.error){
      // cb(res.data)
    }
  });
} 

module.exports.blur_url_online = (token, data) => {

  axios({
    method: "PUT",
    headers: {
      "Authorization": token
    },
    url: ApiBaseUri.horodator_server + "/blur_visited_url",
    data: {
      id: data.id,
      end_focus: new Date(),
      total_focus: dateDiff(new Date(data.start_focus), new Date()) + data.total_focus
    },
  })
  .then((res) => {
    console.log(res.data)
  });
} 

module.exports.update_focused_url_online = (token, data) => {
  axios({
    method: "PUT",
    headers: {
      "Authorization": token
    },
    url: ApiBaseUri.horodator_server + "/focus_visited_url",
    data: {
      id: data.id,
      start_focus: new Date()
    },
  })
  .then((res) => {
    console.log(res.data)
  });
} 

module.exports.end_visit_url_online = (token, data) => {
  axios({
    method: "PUT",
    headers: {
      "Authorization": token
    },
    url: ApiBaseUri.horodator_server + "/end_visit_url",
    data: {
      id: data.id,
      end_focus: new Date(),
      end_of_visit: new Date()
    },
  })
  .then((res) => {
    console.log(res.data)
  });
} 