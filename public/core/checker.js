const axios = require('axios');
const { ApiBaseUri } = require("./configs");
const { dateDiff } = require('./utils');

module.exports.inactivity = (mainWindow) => {

  let lastMousePosition = {}
  let inactivityMousePosition = []
  let trackerStart = true

  axios.get(ApiBaseUri.horodator_server + '/dashboard/settings/time_check')
  .then((res) => {

    let timeTrackerInterval = parseInt(res.data.inactivity_part);
    let timeInactivitySenderInterval = parseInt(res.data.inactivity);
    
    let trackerInterval = setInterval(() => {

      mainWindow.webContents.executeJavaScript('localStorage.getItem("mousemove_event")').then((mouseMoved) => {

        console.log("HAHAHAHA", JSON.parse(mouseMoved))

        if(mouseMoved !== null){
          mouseMoved = JSON.parse(mouseMoved);
          if(trackerStart) {
        
            if(mouseMoved.length !== 0) {
              
              if(lastMousePosition.length === 0){
                lastMousePosition.x = mouseMoved.x
                lastMousePosition.y = mouseMoved.y
                lastMousePosition.created_at = new Date();
              }
              
              if(lastMousePosition.x === mouseMoved.x && lastMousePosition.y === mouseMoved.y) {
                let p = {
                  x: lastMousePosition.x,
                  y: lastMousePosition.y,
                  created_at: new Date()
                }
                inactivityMousePosition.push(p);

              } else {
                lastMousePosition.x = mouseMoved.x
                lastMousePosition.y = mouseMoved.y
                lastMousePosition.created_at = new Date();
                inactivityMousePosition = [];
                console.log("VIDAGE")
              }
            }
            
          }

        }

      })
        
    
    }, timeTrackerInterval)

    setInterval(() => {

      mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify(inactivityMousePosition) }')`)

    }, timeInactivitySenderInterval);

  })

}


module.exports.visit_url = (url, win) => {

  let urls_visited = []
  let url_visit = {
    url: url, 
    date_of_visit: new Date(), 
    focus: false, 
    total_focus: 0, 
    start_focus: new Date(),
    end_focus: new Date(),
    end_of_visit: new Date()
  }
  win.webContents.executeJavaScript('localStorage.getItem("Url_visited")').then((urls) => {
    if(urls !== null){
      urls_visited =  JSON.parse(urls)
      urls_visited.push(url_visit)
      win.webContents.executeJavaScript(`localStorage.setItem("Url_visited", '${ JSON.stringify(urls_visited) }')`)
      console.log(JSON.stringify(urls_visited))
    } else {
      urls_visited = [url_visit]
      console.log(JSON.stringify(urls_visited))
      win.webContents.executeJavaScript(`localStorage.setItem("Url_visited", '${ JSON.stringify(urls_visited) }')`)
    }
  })
}

module.exports.quit_url = (url, win) => {

  win.webContents.executeJavaScript('localStorage.getItem("Url_visited")').then((urls) => {
    if(urls !== null){
      let urls_parse = JSON.parse(urls)
      urls_parse.map((u, i) => {
        if(u.url === url){
          urls_parse[i].focus = false
          urls_parse[i].end_focus = new Date()
          urls_parse[i].end_of_visit = new Date()
        }
      })
      console.log(JSON.stringify(urls_parse))
      win.webContents.executeJavaScript(`localStorage.setItem( "Url_visited", '${ JSON.stringify(urls_parse) }' )`)
    }
  })

}


module.exports.blur_url = (url, win) => {

  win.webContents.executeJavaScript('localStorage.getItem("Url_visited")').then((urls) => {
    if(urls !== null){
      let urls_parse = JSON.parse(urls)
      urls_parse.map((u, i) => {
        if(u.url === url){
          let total_focus = dateDiff(new Date(u.start_focus), new Date()) + parseInt(u.total_focus);
          urls_parse[i].focus = false
          urls_parse[i].end_focus = new Date()
          urls_parse[i].total_focus = total_focus
        }
      })
      console.log(JSON.stringify(urls_parse))
      win.webContents.executeJavaScript(`localStorage.setItem( "Url_visited", '${ JSON.stringify(urls_parse) }' )`)
    }
  })

}


module.exports.focus_url = (url, win) => {

  win.webContents.executeJavaScript('localStorage.getItem("Url_visited")').then((urls) => {
    if(urls !== null){
      let urls_parse = JSON.parse(urls)
      urls_parse.map((u, i) => {
        if(u.url === url){
          urls_parse[i].focus = true
          urls_parse[i].end_focus = null
          urls_parse[i].start_focus = new Date()
        }
      })
      console.log(JSON.stringify(urls_parse))
      win.webContents.executeJavaScript(`localStorage.setItem("Url_visited", '${ JSON.stringify(urls_parse) }' )`)
    }
  })
  
}