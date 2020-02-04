const activeWin = require('active-win');
const { Base64 } = require('js-base64');
const connectivity = require('connectivity');
let { 

  sendWindow, 
  start_visit_url_online, 
  select_url_online, 
  update_focused_url_online, 
  blur_url_online,
  end_visit_url_online

} = require('./cors/computer_event_to_send');

let {

  visit_url,
  quit_url,
  blur_url,
  focus_url

} = require('./checker')


module.exports.hooking = (mainWindow) => {
  

  require('http').createServer(function(request, response) {

    var body = ''
    request.on('data', function(data) {
      body += data
      let k = JSON.parse(body)

      console.log("HOOOOOOO =>",k.length)

      console.log("HEHEHEHE => " + body)

      if(k.type === "mousemove"){
        mainWindow.webContents.executeJavaScript(`localStorage.setItem("mousemove_event", '${ body }')`)
      }
      if(k.type === "keydown"){
        mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
      }
      if(k.type === "mousewheel"){
        mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
      }
      if(k.type === "mousedown"){
        mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
      }
      if(k.type === "mouseclick"){
        mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
        mainWindow.webContents.executeJavaScript('sessionStorage.getItem("session")').then((s) => {
          if(s !== null){
            (async () => {
              let jwt = JSON.parse(Base64.decode(s))
              console.log("################################",jwt)
              sendWindow(jwt.jwt, await activeWin()).then((res) => console.log(res.data))
            })();
          }
        })
      }
      if(k.length === 2){
        mainWindow.webContents.executeJavaScript('sessionStorage.getItem("session")').then((s) => {
          if(s !== null){
            (async () => {
              let jwt = JSON.parse(Base64.decode(s))
              console.log("#===========================",jwt)
              sendWindow(jwt.jwt, await activeWin()).then((res) => console.log(res.data))
            })();
          }
        })
      }
      // [ '15', '56' ]
    })
    request.on('end', function() {
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end('post received')
    })
  
  }).listen(9001)


}


module.exports.browser_hooking = (win) => {
  var url = require("url");
  require('http').createServer(function (request, response) {

    var parsedUrl = url.parse(request.url, true); // true to get query as object
    var queryAsObject = parsedUrl.query;

    if(queryAsObject.event === 'visit'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              start_visit_url_online(queryAsObject.url, JSON.parse(Base64.decode(session)).jwt)
            }
          })
        } else {
          visit_url(queryAsObject.url, win)
        }
      })
      
    }
    if(queryAsObject.event === 'focus'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              select_url_online(update_focused_url_online, JSON.parse(Base64.decode(session)).jwt,  queryAsObject.url)
            }
          })
        } else {
          focus_url(queryAsObject.url, win)
        }
      })
      
    }
    if(queryAsObject.event === 'blur'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              select_url_online(blur_url_online, JSON.parse(Base64.decode(session)).jwt,  queryAsObject.url)
            }
          })
        } else {
          blur_url(queryAsObject.url, win)
        }
      })
      
    }
    if(queryAsObject.event === 'close'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              select_url_online(end_visit_url_online, JSON.parse(Base64.decode(session)).jwt,  queryAsObject.url)
            }
          })
        } else {
          quit_url(queryAsObject.url, win)
        }
      })
      
    }

    // console.log(JSON.stringify(queryAsObject));
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end('OK');
  }).listen(9999)
}