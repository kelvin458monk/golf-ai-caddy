// pages/create/create.js
// 球员端 - 开新球局，选择球场和记录方式
Page({
  data: {
    step: 'select_course', // select_course | select_recorder | qr_code | tianma_combo
    courses: [],
    selectedCourse: null,
    roomId: '',
    playerName: '',
    saveLoading: false,
    // 天马专用
    tianmaCombos: [],
    selectedCombos: []
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

  // 确认选择球场
  confirmCourse() {
    if (!this.data.selectedCourse) {
      wx.showToast({ title: '请先选择球场', icon: 'none' })
      return
    }
    // 天马特殊处理
    if (this.data.selectedCourse.type === 'combo') {
      this.setData({
        step: 'tianma_combo',
        tianmaCombos: this.data.selectedCourse.combos,
        selectedCombos: []
      })
      return
    }
    this.setData({ step: 'select_recorder' })
  },

  // 天马：选择9洞组合（选2个）
  toggleCombo(e) {
    const comboId = e.currentTarget.dataset.id
    let selected = [...this.data.selectedCombos]
    const idx = selected.indexOf(comboId)
    if (idx >= 0) {
      selected.splice(idx, 1)
    } else {
      if (selected.length >= 2) {
        wx.showToast({ title: '最多选2个', icon: 'none' })
        return
      }
      selected.push(comboId)
    }
    this.setData({ selectedCombos: selected })
  },

  // 天马：确认组合
  confirmTianma() {
    if (this.data.selectedCombos.length !== 2) {
      wx.showToast({ title: '请选择2个9洞', icon: 'none' })
      return
    }
    const course = this.data.selectedCourse
    const combos = course.combos.filter(c => this.data.selectedCombos.includes(c.id))
    const roomData = {
      roomId: 'room_' + Date.now(),
      courseId: course.id,
      courseName: course.name,
      type: 'combo',
      comboNames: combos.map(c => c.name),
      pars: [...combos[0].pars, ...combos[1].pars], // 拼接18洞标准杆
      playerName: this.data.playerName,
      createdAt: Date.now(),
      status: 'active',
      holes: [],
      mode: 'pending'
    }
    wx.setStorageSync('currentRoom', roomData)
    this.setData({ 
      step: 'select_recorder',
      roomData 
    })
  },

  // 球童扫码记录 → 生成二维码
  useCaddie() {
    this.setData({ saveLoading: true })
    let roomData = this.data.roomData
    if (!roomData) {
      const course = this.data.selectedCourse
      // 天马组合球场需要拼接pars
      let pars = course.type === 'combo' ? this.getTianmaPars() : course.pars
      roomData = {
        roomId: 'room_' + Date.now(),
        courseId: course.id,
        courseName: course.name,
        type: course.type === 'combo' ? 'combo' : 'full18',
        pars: pars,
        playerName: this.data.playerName,
        createdAt: Date.now(),
        status: 'active',
        holes: [],
        mode: 'pending'
      }
      wx.setStorageSync('currentRoom', roomData)
    }
    const roomId = roomData.roomId
    roomData.mode = 'caddie'
    wx.setStorageSync('currentRoom', roomData)
    setTimeout(() => {
      this.setData({ roomId, step: 'qr_code', saveLoading: false })
    }, 300)
  },

  // 自己记录 → 跳转球童页面
  useSelf() {
    let roomData = this.data.roomData
    if (!roomData) {
      const course = this.data.selectedCourse
      // 天马组合球场需要拼接pars
      let pars = course.type === 'combo' ? this.getTianmaPars() : course.pars
      roomData = {
        roomId: 'room_' + Date.now(),
        courseId: course.id,
        courseName: course.name,
        type: course.type === 'combo' ? 'combo' : 'full18',
        pars: pars,
        playerName: this.data.playerName,
        createdAt: Date.now(),
        status: 'active',
        holes: [],
        mode: 'self'
      }
      wx.setStorageSync('currentRoom', roomData)
    }
    const roomId = roomData.roomId
    roomData.mode = 'self'
    wx.setStorageSync('currentRoom', roomData)
    wx.navigateTo({
      url: `/pages/caddie/caddie?roomId=${roomId}&course=${encodeURIComponent(roomData.courseName)}&pars=${encodeURIComponent(JSON.stringify(roomData.pars))}`
    })
  },

  // 天马组合球场：获取已选2个9洞的pars拼接
  getTianmaPars() {
    const course = this.data.selectedCourse
    const combos = course.combos.filter(c => this.data.selectedCombos.includes(c.id))
    if (combos.length === 2) {
      return [...combos[0].pars, ...combos[1].pars]
    }
    // 兜底：返回标准72杆
    return [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
  },

  // 返回上一步
  backToSelect() {
    this.setData({ 
      step: 'select_course',
      selectedCourse: null,
      selectedCombos: [],
      roomData: null
    })
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
      roomId: '',
      selectedCombos: [],
      roomData: null
    })
  }
})