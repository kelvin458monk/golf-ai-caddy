// app.js
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    // 球场数据
    courses: [
      {
        id: 'tianma',
        name: '上海天马高尔夫',
        type: 'combo',  // 组合型：选2个9洞组成18洞
        combos: [
          { id: 'laojiuchang', name: '老球场', pars: [4,5,3,4,4,5,3,4,4] },
          { id: 'xinqiuchang', name: '新球场', pars: [4,4,5,4,3,5,4,3,4] },
          { id: 'tianmachang', name: '天马场', pars: [4,4,4,4,3,5,4,3,5] }
        ]
      },
      {
        id: 'meilanhu-mingren',
        name: '上海美兰湖高尔夫（名人赛球场）',
        type: 'full18',
        pars: [4,4,5,3,4,3,5,4,4, 4,4,3,5,4,5,4,3,4]
      },
      {
        id: 'meilanhu-nike',
        name: '上海美兰湖高尔夫（尼克劳斯球场）',
        type: 'full18',
        pars: [4,4,3,4,5,4,5,3,4, 4,5,3,5,4,3,5,3,4]
      },
      {
        id: 'yintao',
        name: '上海银涛高尔夫',
        type: 'full18',
        pars: [4,4,3,5,3,4,4,5,4, 4,4,3,5,4,4,3,4,5]
      },
      {
        id: 'sanyang',
        name: '三阳高尔夫',
        type: 'full18',
        pars: [4,5,3,4,5,3,4,4,4, 4,4,5,3,4,4,3,4,5]
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