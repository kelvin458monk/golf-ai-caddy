// pages/caddie/caddie.js
// 球童端 - 按杆数逐杆选球杆
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
    putts: 2,
    note: '',
    holes: [],
    isCompleted: false,
    totalStrokes: 0,
    doneCount: 0,
    clubOptions: CLUB_OPTIONS,
    // 当前击球进度
    currentStroke: 1,        // 第几杆
    strokeClubs: [],        // 每杆对应的球杆 ['driver','iron7','pw','putter']
    selectedClub: ''        // 当前选中的球杆
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
    this.setData({ holes, strokes: 4, currentStroke: 1, strokeClubs: [], selectedClub: '' })
  },

  loadRoomData() {
    const room = wx.getStorageSync('currentRoom')
    if (room && room.courseName) {
      this.setData({ courseName: room.courseName })
    }
    this.setData({ loading: false })
  },

  // 杆数调整
  adjustStrokes(e) {
    const delta = parseInt(e.currentTarget.dataset.delta)
    const val = Math.max(1, Math.min(15, this.data.strokes + delta))
    this.setData({ strokes: val, currentStroke: 1, strokeClubs: [], selectedClub: '' })
  },

  // 推杆数
  adjustPutts(e) {
    const delta = parseInt(e.currentTarget.dataset.delta)
    const val = Math.max(0, Math.min(10, this.data.putts + delta))
    this.setData({ putts: val })
  },

  // 选择球杆（逐杆记录）
  selectClub(e) {
    const clubId = e.currentTarget.dataset.id
    this.setData({ selectedClub: clubId })
  },

  // 确认这一杆
  confirmStroke() {
    if (!this.data.selectedClub) {
      wx.showToast({ title: '请先选择球杆', icon: 'none' })
      return
    }
    const clubs = [...this.data.strokeClubs, this.data.selectedClub]
    
    if (clubs.length >= this.data.strokes) {
      // 杆数够了，显示推杆+备注界面
      this.setData({ strokeClubs: clubs, selectedClub: '', currentStroke: clubs.length + 1 })
    } else {
      // 继续下一杆
      this.setData({ strokeClubs: clubs, selectedClub: '', currentStroke: clubs.length + 1 })
    }
  },

  // 备注
  onNoteInput(e) {
    this.setData({ note: e.detail.value })
  },

  // 确认当前洞（最终保存）
  confirmHole() {
    const idx = this.data.currentHole - 1
    const holes = [...this.data.holes]
    
    // 整理球杆名称
    const clubNames = this.data.strokeClubs.map(id => {
      const c = CLUB_OPTIONS.find(c => c.id === id)
      return c ? c.name : ''
    })

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

    // 下一洞
    this.setData({
      holes,
      currentHole: this.data.currentHole + 1,
      strokes: 4,
      currentStroke: 1,
      strokeClubs: [],
      selectedClub: '',
      putts: 2,
      note: '',
      doneCount,
      totalStrokes
    })
  },

  // 修改上一洞
  editLastHole() {
    if (this.data.currentHole <= 1) {
      wx.showToast({ title: '没有上一洞', icon: 'none' })
      return
    }
    const prevIdx = this.data.currentHole - 2
    const holes = [...this.data.holes]
    const prevHole = holes[prevIdx]
    
    this.setData({
      currentHole: this.data.currentHole - 1,
      strokes: prevHole.strokes || 4,
      strokeClubs: [],
      selectedClub: '',
      putts: prevHole.putts || 2,
      note: prevHole.note || ''
    })
    
    // 清除这一洞的记录
    holes[prevIdx].done = false
    this.setData({ holes })
  },

  // 修改指定洞
  editHole(e) {
    const holeNum = parseInt(e.currentTarget.dataset.hole)
    if (holeNum > this.data.currentHole) {
      wx.showToast({ title: '还未记录此洞', icon: 'none' })
      return
    }
    const idx = holeNum - 1
    const holes = [...this.data.holes]
    const h = holes[idx]
    
    this.setData({
      currentHole: holeNum,
      strokes: h.strokes || 4,
      strokeClubs: [],
      selectedClub: '',
      putts: h.putts || 2,
      note: h.note || ''
    })
    
    holes[idx].done = false
    this.setData({ holes })
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
  }
})