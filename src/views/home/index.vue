<template>
  <div>
    <button @click="print">print</button>
<!--    <webview src="./print-template.html"></webview>-->
    <webview id="printWebview" src="/print-template.html" nodeintegration style=""></webview>
    <div v-for="item in dataList" :key="item.data">
      <p>打印设备： {{ item.deviceName }}</p>
      <p>打印内容： {{ item.data }}</p>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
export default {
  setup () {
    const dataList = ref([
      {
        data: 5
      },
      {
        data: 6
      }
    ])

    const { ctx } = getCurrentInstance()
    const ipcRenderer = ctx.$electron.ipcRenderer
    let webview
    let printerList = []

    onMounted(() => {
      getPrinterList()
      webview = document.querySelector('webview')
      webview.addEventListener('ipc-message', async event => {
        if (event.channel === 'initDataSuccess') {
          console.log('信息设置成功')
          console.log('开始打印')
          await webview.print({
            silent: true,
            printBackground: true,
            deviceName: printerList[0].name
          })
        }
      })
    })

    const getPrinterList = () => {
      ipcRenderer.send('getPrinterList')
      ipcRenderer.once('getPrinterList', (e, data) => {
        if (data && data.length) {
          printerList = data
          console.log('设备列表')
          console.log(printerList)
        } else {
          console.log('暂未识别到打印机')
        }
      })
    }

    const currentIndex = 0
    const print = () => {
      const item = dataList.value[currentIndex]
      if (item) {
        webview.send('initData', item.data)
        // setTimeout(() => {
        //   printDataSuccess(item.deviceName).then(() => {
        //     currentIndex += 1
        //     print()
        //   })
        // }, 2000)
      }
    }

    return {
      print,
      dataList
    }
  }
}
</script>

<style scoped>

</style>
