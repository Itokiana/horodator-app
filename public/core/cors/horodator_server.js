const axios = require('axios');
const { ApiBaseUri } = require("../configs");

module.exports.start = (jwt, data) => {
  return axios({
    headers: { 'Authorization': jwt },
    method: 'post',
    url: ApiBaseUri.horodator_server + '/start_horodator',
    data: data
  })
}

module.exports.stop = (jwt, data) => {
  return axios({
    headers: { 'Authorization': jwt },
    method: 'put',
    url: ApiBaseUri.horodator_server + '/end_horodator',
    data: data
  })
}