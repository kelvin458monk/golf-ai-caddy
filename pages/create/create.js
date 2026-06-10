// pages/create/create.js
// 球员端 - 开新球局，生成二维码供球童扫码
const util = require('../../utils/util')

Page({
  data: {
    step: 'select_course', // select_course | qr_code
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

  // 确认选择并生成二维码
  confirmCourse() {
    if (!this.data.selectedCourse) {
      wx.showToast({ title: '请先选择球场', icon: 'none' })
      return
    }
    this.setData({ saveLoading: true })

    // 生成房间ID
    const roomId = 'room_' + Date.now()
    const roomData = {
      roomId,
      courseId: this.data.selectedCourse.id,
      courseName: this.data.selectedCourse.name,
      playerName: this.data.playerName,
      createdAt: Date.now(),
      status: 'active',
      holes: []
    }

    // 保存到本地（实际存到云开发）
    wx.setStorageSync('currentRoom', roomData)

    setTimeout(() => {
      this.setData({
        roomId,
        step: 'qr_code',
        saveLoading: false
      })
    }, 500)
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

  // 重新选择
  reselect() {
    this.setData({
      step: 'select_course',
      selectedCourse: null,
      roomId: ''
    })
  }
})