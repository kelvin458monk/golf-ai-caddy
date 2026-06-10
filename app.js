// app.js
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    // 球场数据（暂时用标准72杆，后续Kelvin提供真实数据）
    courses: [
      { 
        id: 'tianma', 
        name: '上海天马高尔夫', 
        holes: 27,   // 老18+新9+天马9，目前默认显示18洞
        par: 72,
        // 标准72杆布局（前9洞）
        pars: [4, 4, 4, 5, 4, 3, 4, 5, 4]
      },
      { 
        id: 'meilanhu', 
        name: '上海美兰湖高尔夫', 
        holes: 36,   // 36洞
        par: 72,
        // 标准72杆布局（前9洞）
        pars: [4, 5, 4, 3, 4, 5, 4, 3, 4]
      },
      { 
        id: 'yintao', 
        name: '上海银涛高尔夫', 
        holes: 18, 
        par: 72,
        // 标准72杆布局（前9洞）
        pars: [5, 4, 4, 3, 4, 4, 5, 3, 4]
      },
      { 
        id: 'sanyang', 
        name: '三阳高尔夫', 
        holes: 18, 
        par: 72,
        // 标准72杆布局（前9洞）
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