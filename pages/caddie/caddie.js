// pages/caddie/caddie.js
// 球童端 - 扫码进入后使用的记录页面
const util = require('../../utils/util')

// 球杆选项
const CLUB_OPTIONS = [
  { id: 'driver', name: '1号木' },
  { id: 'wood3', name: '3号木' },
  { id: 'wood5', name: '5号木' },
  { id: 'hybrid', name: '混合杆' },
  { id: 'iron3', name: '3号铁' },
  { id: 'iron4', name: '4号铁' },
  { id: 'iron5', name: '5号铁' },
  { id: 'iron6', name: '6号铁' },
  { id: 'iron7', name: '7号铁' },
  { id: 'iron8', name: '8号铁' },
  { id: 'iron9', name: '9号铁' },
  { id: 'pw', name: 'P杆' },
  { id: 'sw', name: '沙杆' },
  { id: 'lw', name: '高抛杆' },
  { id: 'putter', name: '推杆' }
]

Page({
  data: {
    roomId: '',
    courseName: '',
    currentHole: 1,
    totalHoles: 18,
    // 当前洞数据
    strokes: 4,
    selectedClubs: [],
    putts: 2,
    note: '',
    // 全部记录
    holes: [],
    isCompleted: false,
    totalStrokes: 0,
    loading: true,
    // 球杆选项
    clubOptions: CLUB_OPTIONS
  },

  onLoad(options) {
    const roomId = options.roomId || ''
    if (!roomId) {
      wx.showToast({ title: '无效的二维码', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.setData({ roomId })
    this.initHoles()
    this.loadRoomData()
  },

  initHoles() {
    const holes = []
    for (let i = 0; i < 18; i++) {
      holes.push({
        holeNumber: i + 1,
        par: 4,
        strokes: 0,
        clubs: [],
        putts: 0,
        note: '',
        done: false
      })
    }
    this.setData({ holes })
  },

  // 加载房间数据（从缓存或云端）
  loadRoomData() {
    // 模拟数据（实际从云端获取）
    const mockRooms = {
      'room_001': { courseName: '观澜湖球会', holes: [] },
      'room_002': { courseName: '深圳高尔夫俱乐部', holes: [] }
    }
    const roomData = mockRooms[this.data.roomId] || { courseName: '未知球场' }
    this.setData({
      courseName: roomData.courseName,
      loading: false
    })
  },

  // 杆数增减
  adjustStrokes(e) {
    const delta = parseInt(e.currentTarget.dataset.delta)
    let val = this.data.strokes + delta
    val = Math.max(1, Math.min(15, val))
    this.setData({ strokes: val })
  },

  setStrokes(e) {
    const val = parseInt(e.currentTarget.dataset.val)
    this.setData({ strokes: val })
  },

  // 推杆数调整
  adjustPutts(e) {
    const delta = parseInt(e.currentTarget.dataset.delta)
    let val = this.data.putts + delta
    val = Math.max(0, Math.min(10, val))
    this.setData({ putts: val })
  },

  setPutts(e) {
    const val = parseInt(e.currentTarget.dataset.val)
    this.setData({ putts: val })
  },

  // 球杆多选
  toggleClub(e) {
    const clubId = e.currentTarget.dataset.id
    const clubs = [...this.data.selectedClubs]
    const idx = clubs.indexOf(clubId)
    if (idx > -1) {
      clubs.splice(idx, 1)
    } else {
      clubs.push(clubId)
    }
    this.setData({ selectedClubs: clubs })
  },

  // 备注
  onNoteInput(e) {
    this.setData({ note: e.detail.value })
  },

  // 确认当前洞
  confirmHole() {
    const idx = this.data.currentHole - 1
    const holes = [...this.data.holes]
    const clubNames = this.data.selectedClubs.map(id => {
      const c = CLUB_OPTIONS.find(c => c.id === id)
      return c ? c.name : ''
    }).filter(Boolean)

    holes[idx] = {
      holeNumber: this.data.currentHole,
      par: 4,
      strokes: this.data.strokes,
      clubs: clubNames,
      putts: this.data.putts,
      note: this.data.note,
      done: true
    }

    if (this.data.currentHole >= 18) {
      // 完成
      const totalStrokes = holes.reduce((s, h) => s + h.strokes, 0)
      this.setData({ holes, isCompleted: true, totalStrokes })
      this.saveToCloud()
      return
    }

    // 下一洞
    this.setData({
      holes,
      currentHole: this.data.currentHole + 1,
      strokes: 4,
      selectedClubs: [],
      putts: 2,
      note: ''
    })
  },

  // 保存到云端
  saveToCloud() {
    // TODO: 实际保存到微信云开发数据库
    wx.setStorageSync('currentRound', {
      roomId: this.data.roomId,
      courseName: this.data.courseName,
      holes: this.data.holes,
      savedAt: Date.now()
    })
    wx.showToast({ title: '记录已保存', icon: 'success' })
  },

  // 查看已记录数据
  viewRecord() {
    wx.showModal({
      title: '已完成记录',
      content: `共18洞，总杆：${this.data.totalStrokes}`,
      showCancel: false
    })
  }
})