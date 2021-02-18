import { ipcMain, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
const fs = require('fs')

export function getPrinterList(mainWindow) {
  ipcMain.on('getPrinterList', (event) => {
    const list = mainWindow.webContents.getPrinters()

    mainWindow.webContents.send('getPrinterList', list)
  })
}

const printPlan = {
  currentIndex: 0,
  list: [],
  deviceName: ''
}

export function listenPrint() {
  ipcMain.on('print', (event, data) => {
    console.log('开始打印')
    const { list, deviceName } = data
    printPlan.currentIndex = 0
    printPlan.list = list
    printPlan.deviceName = deviceName
    print(event)
  })
}

function print(event) {
  const item = printPlan.list[printPlan.currentIndex]
  if (item) {
    const printWindow = new BrowserWindow({
      title: '打印测试',
      show: false,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      printWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'print-template.html')
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      // win.webContents.openDevTools()
      printWindow.loadURL('app://./print-template.html')
    }

    printWindow.on('ready-to-show', () => {
      printWindow.webContents.send('setPrintData', item.value)
      setTimeout(() => {
        event.sender.send('printStart', item)
        printWindow.webContents.print({
          silent: true,
          printBackground: false,
          deviceName: item.deviceName
        }, (data) => {
          console.log('打印结果', data)
          if (data) {
            event.sender.send('printSuccess', item)
          } else {
            event.sender.send('printFail', item)
          }
          printPlan.currentIndex += 1
          print(event)
        })
      }, 20)
    })
  }
}
