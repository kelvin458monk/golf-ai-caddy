// app.js
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    // 球场数据
    courses: [
      { id: 'tianma', name: '上海天马高尔夫', holes: 18, par: 72 },
      { id: 'meilanhu', name: '上海美兰湖高尔夫', holes: 18, par: 72 },
      { id: 'yintao', name: '上海银涛高尔夫', holes: 18, par: 72 },
      { id: 'sanyang', name: '三阳高尔夫', holes: 18, par: 72 }
    ]
  },

  onLaunch() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.hasLogin = true
    }
  }
})