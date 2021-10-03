const electron = require('electron')
const { app, BrowserWindow , remote} = electron

/**
 * npm run electron
 */
let mainWindows = null
function createWindow(){
  mainWindows = new BrowserWindow({ 
    width: 1280,
    height: 600,
    frame: true,
    devTools: true
  })
  mainWindows.setResizable(false)
  // mainWindows.setMenu(null) 
  mainWindows.loadFile(`index.html`)

}

app.on('ready', createWindow);

