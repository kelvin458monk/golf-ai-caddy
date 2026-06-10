// pages/caddie/caddie.js
// 球童端 - 扫码进入后使用的记录页面
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
    courseName: '未知球场',
    currentHole: 1,
    totalHoles: 18,
    strokes: 4,
    selectedClubs: [],
    putts: 2,
    note: '',
    holes: [],
    isCompleted: false,
    totalStrokes: 0,
    doneCount: 0,
    clubOptions: CLUB_OPTIONS
  },

  onLoad(options) {
    const roomId = options.roomId || ''
    const courseName = options.course || ''
    let coursePars = null
    
    if (options.pars) {
      try {
        coursePars = JSON.parse(decodeURIComponent(options.pars))
      } catch (e) {}
    }
    
    if (!roomId) {
      wx.showToast({ title: '无效的二维码', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }

    this.setData({ roomId, courseName: courseName ? decodeURIComponent(courseName) : '未知球场' })
    this.initHoles(coursePars)
    this.loadRoomData()
  },

  initHoles(coursePars) {
    const defaultPars = [4,4,4,4,4,4,4,4,4]
    const holes = []
    for (let i = 0; i < 18; i++) {
      const par = coursePars && coursePars[i] ? coursePars[i] : defaultPars[i]
      holes.push({ holeNumber: i + 1, par, strokes: 0, clubs: [], putts: 0, note: '', done: false })
    }
    this.setData({ holes })
  },

  loadRoomData() {
    const room = wx.getStorageSync('currentRoom')
    if (room && room.courseName) {
      this.setData({ courseName: room.courseName })
    }
    this.setData({ loading: false })
  },

  // 杆数
  adjustStrokes(e) {
    const delta = parseInt(e.currentTarget.dataset.delta)
    const val = Math.max(1, Math.min(15, this.data.strokes + delta))
    this.setData({ strokes: val })
  },

  // 推杆
  adjustPutts(e) {
    const delta = parseInt(e.currentTarget.dataset.delta)
    const val = Math.max(0, Math.min(10, this.data.putts + delta))
    this.setData({ putts: val })
  },

  // 球杆选择
  toggleClub(e) {
    const clubId = e.currentTarget.targetDataset.id || e.currentTarget.dataset.id
    let clubs = this.data.selectedClubs
    if (clubs.includes(clubId)) {
      clubs = clubs.filter(id => id !== clubId)
    } else {
      clubs = [...clubs, clubId]
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
      par: holes[idx].par,
      strokes: this.data.strokes,
      clubs: clubNames,
      putts: this.data.putts,
      note: this.data.note,
      done: true
    }

    const doneCount = holes.filter(h => h.done).length
    const totalStrokes = holes.reduce((s, h) => s + (h.strokes || 0), 0)

    if (this.data.currentHole >= 18) {
      this.setData({ holes, isCompleted: true, totalStrokes, doneCount })
      this.saveToCloud()
      return
    }

    this.setData({
      holes,
      currentHole: this.data.currentHole + 1,
      strokes: 4,
      selectedClubs: [],
      putts: 2,
      note: '',
      doneCount,
      totalStrokes
    })
  },

  saveToCloud() {
    const roundData = {
      roomId: this.data.roomId,
      courseName: this.data.courseName,
      holes: this.data.holes,
      totalStrokes: this.data.totalStrokes,
      savedAt: Date.now()
    }
    const completedRounds = wx.getStorageSync('completedRounds') || []
    completedRounds.unshift(roundData)
    wx.setStorageSync('completedRounds', completedRounds)
    wx.showToast({ title: '记录已保存', icon: 'success' })
  },

  viewRecord() {
    wx.showModal({
      title: '已完成记录',
      content: `共${this.data.doneCount}洞，总杆：${this.data.totalStrokes}`,
      showCancel: false
    })
  },

  // 检查球杆是否已选
  isClubSelected(clubId) {
    return this.data.selectedClubs.includes(clubId)
  }
})