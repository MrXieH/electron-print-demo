<template>
  <button @click="printAll">打印全部</button>
  <!--    <webview src="./print-template.html"></webview>-->
<!--  <webview id="printWebview" src="/print-template.html" nodeintegration style=""></webview>-->
  <div v-for="item in dataList" :key="item.value">
    <p>打印内容： {{ item.value }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [
        { value: 1 },
        { value: 2 }
      ]
    }
  },
  methods: {
    printAll() {
      console.log('打印全部')
      for (const item of this.dataList) {
        this.createWebview(item)
      }
    },
    createWebview(data) {
      const webview = document.createElement('webview')
      webview.setAttribute('nodeintegration', 'true')
      webview.setAttribute('id', data.value)
      // webview.setAttribute('style', 'visibility: hidden')
      webview.setAttribute('src', '/print-template.html')
      document.body.appendChild(webview)
      webview.addEventListener('did-stop-loading', () => {
        webview.send('setPrintData', data.value)
        webview.addEventListener('ipc-message', async event => {
          if (event.channel === 'initDataSuccess') {
            console.log('信息设置成功')
            console.log('开始打印')
            await webview.print({
              silent: true,
              printBackground: true,
              deviceName: this.printerList[0].name
            })
          }
        })
      })
      // setTimeout(() => {
      //   webview.send('setPrintData', data.value)
      // }, 30)
      // document.appendChild(webview)
      // console.log(webview)
    }
  }
}
</script>

<style scoped>

</style>
