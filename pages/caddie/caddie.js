// pages/caddie/caddie.js
// 球童端 - 逐杆记录：每杆选球杆+标记推杆
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
    holes: [],
    isCompleted: false,
    totalStrokes: 0,
    doneCount: 0,
    clubOptions: CLUB_OPTIONS,
    // 当前击球记录
    strokes: [],           // [{club: 'driver', isPutt: false}, ...]
    currentStroke: 1,     // 第几杆（1-based）
    selectedClub: ''       // 当前选中的球杆
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
      holes.push({ holeNumber: i + 1, par, strokes: [], done: false })
    }
    this.setData({ holes, strokes: [], currentStroke: 1, selectedClub: '' })
  },

  loadRoomData() {
    const room = wx.getStorageSync('currentRoom')
    if (room && room.courseName) {
      this.setData({ courseName: room.courseName })
    }
    this.setData({ loading: false })
  },

  // 选择球杆
  selectClub(e) {
    const clubId = e.currentTarget.dataset.id
    this.setData({ selectedClub: clubId })
  },

  // 确认这一杆（标记是否推杆）
  confirmStroke(e) {
    if (!this.data.selectedClub) {
      wx.showToast({ title: '请先选择球杆', icon: 'none' })
      return
    }
    const isPutt = e.currentTarget.dataset.putt === 'true'
    const strokes = [...this.data.strokes, {
      club: this.data.selectedClub,
      isPutt: isPutt
    }]
    this.setData({ strokes, selectedClub: '', currentStroke: strokes.length + 1 })
  },

  // 标记为推杆并确认
  confirmAsPutt() {
    this.confirmStroke({ currentTarget: { dataset: { putt: 'true' } } })
  },

  // 标记为击球并确认
  confirmAsShot() {
    this.confirmStroke({ currentTarget: { dataset: { putt: 'false' } } })
  },

  // 删除最后一杆
  removeLastStroke() {
    if (this.data.strokes.length === 0) return
    const strokes = this.data.strokes.slice(0, -1)
    this.setData({ strokes, currentStroke: strokes.length + 1 })
  },

  // 确认当前洞
  confirmHole() {
    if (this.data.strokes.length === 0) {
      wx.showToast({ title: '请先记录至少一杆', icon: 'none' })
      return
    }
    
    const idx = this.data.currentHole - 1
    const holes = [...this.data.holes]
    
    holes[idx] = {
      holeNumber: this.data.currentHole,
      par: holes[idx].par,
      strokes: [...this.data.strokes],
      done: true
    }

    const doneCount = holes.filter(h => h.done).length
    const totalStrokes = holes.reduce((s, h) => {
      return s + (h.done ? h.strokes.length : 0)
    }, 0)

    if (this.data.currentHole >= 18) {
      this.setData({ holes, isCompleted: true, totalStrokes, doneCount })
      this.saveToCloud()
      return
    }

    // 下一洞
    this.setData({
      holes,
      currentHole: this.data.currentHole + 1,
      strokes: [],
      currentStroke: 1,
      selectedClub: '',
      doneCount,
      totalStrokes
    })
  },

  // 修改上一洞
  editLastHole() {
    if (this.data.currentHole <= 1) return
    const prevIdx = this.data.currentHole - 2
    const holes = [...this.data.holes]
    holes[prevIdx].done = false
    this.setData({
      currentHole: this.data.currentHole - 1,
      strokes: [],
      selectedClub: '',
      currentStroke: 1,
      holes
    })
  },

  // 修改指定洞
  editHole(e) {
    const holeNum = parseInt(e.currentTarget.dataset.hole)
    const idx = holeNum - 1
    const holes = [...this.data.holes]
    holes[idx].done = false
    this.setData({
      currentHole: holeNum,
      strokes: [],
      selectedClub: '',
      currentStroke: 1,
      holes
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
  }
})