// app.js
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    openid: '',
    // 预设球场列表（后续可扩展更多球场）
    courses: [
      { id: 1, name: '观澜湖高尔夫球场', holes: 18, par: 72 },
      { id: 2, name: '深圳高尔夫俱乐部', holes: 18, par: 72 },
      { id: 3, name: '东莞峰景高尔夫', holes: 18, par: 72 },
      { id: 4, name: '广州南沙高尔夫', holes: 18, par: 72 }
    ]
  },

  onLaunch() {
    // 检查云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        env: 'golf-ai-caddy-xxx',
        traceUser: true
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              this.globalData.hasLogin = true
            }
          })
        }
      }
    })
  }
})
