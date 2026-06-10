// app.js
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    // 球场数据（包含每洞标准杆）
    courses: [
      { 
        id: 'tianma', 
        name: '上海天马高尔夫', 
        holes: 18, 
        par: 72,
        // 前9洞：4P4 + 3P5 + 2P3
        pars: [5, 4, 3, 4, 5, 4, 4, 3, 4]
      },
      { 
        id: 'meilanhu', 
        name: '上海美兰湖高尔夫', 
        holes: 18, 
        par: 72,
        // 前9洞：4P4 + 3P5 + 2P3
        pars: [4, 5, 4, 3, 4, 5, 4, 3, 4]
      },
      { 
        id: 'yintao', 
        name: '上海银涛高尔夫', 
        holes: 18, 
        par: 72,
        // 前9洞：4P4 + 3P5 + 2P3
        pars: [5, 4, 4, 3, 4, 4, 5, 3, 4]
      },
      { 
        id: 'sanyang', 
        name: '三阳高尔夫', 
        holes: 18, 
        par: 72,
        // 前9洞：4P4 + 3P5 + 2P3
        pars: [4, 4, 3, 5, 4, 4, 5, 3, 4]
      }
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