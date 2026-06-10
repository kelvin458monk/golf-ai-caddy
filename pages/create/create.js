// pages/create/create.js
// 球员端 - 开新球局，选择记录方式
Page({
  data: {
    step: 'select_course', // select_course | select_recorder | qr_code
    courses: [],
    selectedCourse: null,
    roomId: '',
    playerName: '',
    saveLoading: false
  },

  onLoad() {
    const app = getApp()
    this.setData({
      courses: app.globalData.courses,
      playerName: app.globalData.userInfo?.nickName || '球员'
    })
  },

  // 选择球场
  selectCourse(e) {
    const courseId = e.currentTarget.dataset.id
    const course = this.data.courses.find(c => c.id === courseId)
    if (!course) return
    this.setData({ selectedCourse: course })
  },

  // 确认选择球场 → 进入选择记录方式
  confirmCourse() {
    if (!this.data.selectedCourse) {
      wx.showToast({ title: '请先选择球场', icon: 'none' })
      return
    }
    this.setData({ step: 'select_recorder' })
  },

  // 球童扫码记录 → 生成二维码
  useCaddie() {
    this.setData({ saveLoading: true })
    const roomId = 'room_' + Date.now()
    const roomData = {
      roomId,
      courseId: this.data.selectedCourse.id,
      courseName: this.data.selectedCourse.name,
      playerName: this.data.playerName,
      createdAt: Date.now(),
      status: 'active',
      holes: [],
      mode: 'caddie'
    }
    wx.setStorageSync('currentRoom', roomData)
    setTimeout(() => {
      this.setData({ roomId, step: 'qr_code', saveLoading: false })
    }, 300)
  },

  // 自己记录 → 跳转球童页面
  useSelf() {
    const roomId = 'room_' + Date.now()
    const roomData = {
      roomId,
      courseId: this.data.selectedCourse.id,
      courseName: this.data.selectedCourse.name,
      playerName: this.data.playerName,
      createdAt: Date.now(),
      status: 'active',
      holes: [],
      mode: 'self'
    }
    wx.setStorageSync('currentRoom', roomData)
    wx.navigateTo({
      url: `/pages/caddie/caddie?roomId=${roomId}&course=${encodeURIComponent(this.data.selectedCourse.name)}`
    })
  },

  // 返回上一步
  backToSelect() {
    this.setData({ step: 'select_course' })
  },

  // 复制房间码
  copyRoomId() {
    wx.setClipboardData({
      data: this.data.roomId,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  // 查看报告
  goReport() {
    wx.navigateTo({ url: '/pages/report/report' })
  },

  // 重新选择
  reselect() {
    this.setData({
      step: 'select_course',
      selectedCourse: null,
      roomId: ''
    })
  }
})