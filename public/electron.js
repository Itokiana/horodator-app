const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Notification = electron.Notification;

const path = require("path");
const isDev = require("electron-is-dev");

const { hooking, browser_hooking } = require('./core/tracker');
const { inactivity } = require('./core/checker')

let mainWindow;


function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 700, 
    height: 700,
    icon: __dirname + '/index.png',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    },
  });

  mainWindow.loadURL(isDev? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`);

  setInterval(() => {
    try {
      mainWindow.webContents.executeJavaScript('sessionStorage.setItem("computer_infos", \'{ "ip": "'+ require('ip').address() +'", "mac": "'+ require('getmac').default() +'"  }\')')
    }
    catch(error) {}
  }, 15000);


  hooking(mainWindow);
  inactivity(mainWindow)
  browser_hooking(mainWindow);

  let alertInactivityNotification = new Notification({
    title: 'ALERT HORODATOR',
    body: 'Veuillez activer HORODATOR SVP !!!\nSinon votre temps de travail risquerait de ne pas être comptabilisé 😉',
    silent: false,
    icon: __dirname + '/index.png'
  })

  alertInactivityNotification.on("click", () => {
    mainWindow.focus()
    mainWindow.focusOnWebView()
  })

  setInterval(() => {
    mainWindow.webContents.executeJavaScript('sessionStorage.getItem("state")').then((status) => {
      if(status !== null){
        alertInactivityNotification.show()
      }
    })
  }, 15000);

  try {
    mainWindow.webContents.executeJavaScript('sessionStorage.setItem("computer_infos", \'{ "ip": "'+ require('ip').address() +'", "mac": "'+ require('getmac').default() +'"  }\')')
  }
  catch(error) {}
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});