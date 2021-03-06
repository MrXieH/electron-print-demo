'use strict'

import { app, protocol, BrowserWindow, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import { listenUpdater } from './__main/updater'
// import { UPDATE_URL } from '@/common/config'
// import './__main/readMer'
import { getPrinterList, listenPrint } from './__main/printer'

const isDevelopment = process.env.NODE_ENV !== 'production'

// __static => /mer-user/public
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// win.setFullScreen(flag)

function createWindow() {
  // readConfig()
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    // show: false,
    // fullscreen: true,
    // fullscreenable: true,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      webviewTag: true
    },
    // frame: false,
    // eslint-disable-next-line no-undef
    icon: `${__static}/app.ico`
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    // win.webContents.openDevTools()
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  // 监听获取打印机
  getPrinterList(win)
  listenPrint()
  createMenu()
}

/* set menus */
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    // const template = [
    //   {
    //     label: 'App Demo',
    //     submenu: [
    //       {
    //         role: 'about'
    //       },
    //       {
    //         role: 'quit'
    //       }
    //     ]
    //   }
    // ]
    // let menu = Menu.buildFromTemplate(template)
    // Menu.setApplicationMenu(menu)
    Menu.setApplicationMenu(null)
  } else {
    const template = [
      {
        label: 'f12',
        click: () => {
          win.webContents.openDevTools()
        }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    // windows及linux系统
    Menu.setApplicationMenu(menu)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/* ipc */
// ipcMain.on('message', (event, arg) => {
//   console.log('message', arg)
//   event.reply('reply', 'see you')
// })
