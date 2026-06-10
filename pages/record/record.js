// pages/record/record.js
const util = require('../../utils/util')

Page({
  data: {
    step: 'select_course', // 当前步骤：select_course | input_score | preview
    courses: [],
    selectedCourse: null,
    // 18洞数据
    holes: [],
    // 当前正在输入的洞索引
    currentHoleIndex: 0,
    parForCurrentHole: 4,
    strokeInput: 4,
    // 预览数据
    totalStrokes: 0,
    totalPar: 0,
    saveLoading: false
  },

  onLoad() {
    const app = getApp()
    this.setData({
      courses: app.globalData.courses
    })
    this.initHoles()
  },

  initHoles() {
    const holes = []
    for (let i = 0; i < 18; i++) {
      holes.push({
        hole: i + 1,
        par: 4,
        strokes: 0,
        inputted: false
      })
    }
    this.setData({ holes, inputCount: 0 })
  },

  // 选择球场
  selectCourse(e) {
    const courseId = e.currentTarget.dataset.id
    const course = this.data.courses.find(c => c.id === courseId)
    if (!course) return
    this.setData({
      selectedCourse: course,
      step: 'input_score',
      currentHoleIndex: 0,
      parForCurrentHole: 4,
      strokeInput: 4
    })
  },

  // 设置当前洞的标准杆
  setPar(e) {
    const par = parseInt(e.currentTarget.dataset.val)
    this.setData({ parForCurrentHole: par })
  },

  // 设置杆数
  setStroke(e) {
    const val = parseInt(e.currentTarget.dataset.val)
    this.setData({ strokeInput: val })
  },

  // 输入杆数增减
  adjustStroke(e) {
    const delta = parseInt(e.currentTarget.dataset.delta)
    let val = this.data.strokeInput + delta
    val = Math.max(1, Math.min(15, val))
    this.setData({ strokeInput: val })
  },

  // 确认当前洞
  confirmHole() {
    const index = this.data.currentHoleIndex
    const holes = [...this.data.holes]
    const inputCount = (holes.filter(h => h.inputted).length || this.data.inputCount) + 1
    holes[index] = {
      ...holes[index],
      par: this.data.parForCurrentHole,
      strokes: this.data.strokeInput,
      inputted: true
    }

    if (index >= 17) {
      this.calcTotals(holes)
      return
    }

    const nextIndex = index + 1
    this.setData({
      holes,
      currentHoleIndex: nextIndex,
      parForCurrentHole: 4,
      strokeInput: 4,
      inputCount
    })
  },

  // 跳到指定洞
  jumpToHole(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    const holes = this.data.holes
    if (holes[index] && holes[index].inputted) {
      this.setData({
        currentHoleIndex: index,
        parForCurrentHole: holes[index].par,
        strokeInput: holes[index].strokes
      })
    }
  },

  // 计算总杆数
  calcTotals(holes) {
    let totalStrokes = 0
    let totalPar = 0
    holes.forEach(h => {
      totalStrokes += h.strokes
      totalPar += h.par
    })
    this.setData({
      holes,
      totalStrokes,
      totalPar,
      step: 'preview'
    })
  },

  // 返回修改
  goBackEdit() {
    const holes = this.data.holes
    let lastIndex = 0
    for (let i = 0; i < 18; i++) {
      if (holes[i].inputted) lastIndex = i
    }
    const inputCount = holes.filter(h => h.inputted).length
    this.setData({
      step: 'input_score',
      currentHoleIndex: lastIndex,
      parForCurrentHole: holes[lastIndex].par,
      strokeInput: holes[lastIndex].strokes,
      inputCount
    })
  },

  // 保存成绩
  saveRound() {
    this.setData({ saveLoading: true })
    const round = {
      id: Date.now(),
      courseName: this.data.selectedCourse.name,
      date: util.formatDate(new Date()),
      totalStrokes: this.data.totalStrokes,
      par: this.data.totalPar,
      holes: this.data.holes
    }

    // TODO: 后续接入云数据库时保存到云端
    // 目前存入本地缓存
    const storage = wx.getStorageSync('rounds') || []
    storage.unshift(round)
    wx.setStorageSync('rounds', storage)

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    })

    setTimeout(() => {
      this.setData({ saveLoading: false })
      // 重置页面
      this.initHoles()
      this.setData({
        step: 'select_course',
        selectedCourse: null,
        totalStrokes: 0,
        totalPar: 0
      })
    }, 1500)
  },

  // 返回首页
  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
