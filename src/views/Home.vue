<template>
  <button @click="printAll">开始打印</button>
  <div v-for="item in dataList" :key="item.data">
    <p>打印内容： {{ item.value }}  {{ item.printStatus }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      printerList: [],
      webview: null
    }
  },
  mounted () {
    const arr = []
    for (let i = 1000; i < 1005; i++) {
      arr.push({
        value: i,
        id: i,
        printStatus: '未打印'
      })
    }
    this.dataList = arr
    this.getPrinter()
    this.listenPrinted()
  },
  methods: {
    listenPrinted() {
      const { ipcRenderer } = this.$electron
      ipcRenderer.on('printStart', (event, data) => {
        const { id } = data
        const item = this.dataList.find(item => item.id === id)
        if (item) {
          item.printStatus = '打印中'
        }
      })

      ipcRenderer.on('printSuccess', (event, data) => {
        const { id } = data
        const item = this.dataList.find(item => item.id === id)
        if (item) {
          item.printStatus = '打印成功'
        }
      })

      ipcRenderer.on('printFail', (event, data) => {
        const { id } = data
        const item = this.dataList.find(item => item.id === id)
        if (item) {
          item.printStatus = '打印失败'
        }
      })
    },
    printAll() {
      if (!this.printerList.length) {
        alert('未检测到打印机')
        return
      }
      const { ipcRenderer } = this.$electron
      ipcRenderer.send('print', {
        list: JSON.parse(JSON.stringify(this.dataList)),
        deviceName: this.printerList[0].name
      })
    },
    getPrinter() {
      const { ipcRenderer } = this.$electron
      ipcRenderer.send('getPrinterList')
      ipcRenderer.once('getPrinterList', (e, data) => {
        if (data && data.length) {
          this.printerList = data
          console.log('设备列表')
          console.log(this.printerList)
        } else {
          console.log('暂未识别到打印机')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
