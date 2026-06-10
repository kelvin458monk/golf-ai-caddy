// utils/util.js - 工具函数

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}`
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${pad(month)}-${pad(day)}`
}

const pad = n => n < 10 ? '0' + n : n

// 计算总杆数
const calcTotalStrokes = holes => {
  return holes.reduce((sum, h) => sum + (h.strokes || 0), 0)
}

// 计算与标准杆的差值
const calcParDiff = (totalStrokes, par) => {
  const diff = totalStrokes - par
  if (diff === 0) return 'E'
  return diff > 0 ? `+${diff}` : `${diff}`
}

// 计算每洞成绩（小鸟、帕、博基等）
const calcHoleResult = (strokes, par) => {
  const diff = strokes - par
  if (diff <= -2) return { label: '老鹰', color: '#FFD700' }
  if (diff === -1) return { label: '小鸟', color: '#27AE60' }
  if (diff === 0) return { label: '标准杆', color: '#3498DB' }
  if (diff === 1) return { label: '博基', color: '#E67E22' }
  if (diff === 2) return { label: '双博基', color: '#E74C3C' }
  return { label: `${diff}博基`, color: '#C0392B' }
}

// 生成模拟比赛数据（开发阶段使用）
const generateMockRounds = () => {
  const courses = getApp().globalData.courses
  const now = new Date()
  const rounds = []

  const names = ['观澜湖高尔夫球场', '深圳高尔夫俱乐部', '东莞峰景高尔夫', '广州南沙高尔夫']

  for (let i = 3; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i * 7)
    const courseIndex = i % names.length
    const courseName = names[courseIndex]
    const holes = []
    let total = 0
    for (let h = 1; h <= 18; h++) {
      const par = [3, 4, 5][h % 3]
      const strokes = par + Math.floor(Math.random() * 5) - 1
      holes.push({ hole: h, par, strokes: Math.max(1, strokes) })
      total += Math.max(1, strokes)
    }
    rounds.push({
      id: Date.now() - i * 60000,
      courseName,
      date: formatDate(date),
      totalStrokes: total,
      par: 72,
      holes
    })
  }
  return rounds
}

// 生成AI分析数据（mock）
const generateMockAnalysis = round => {
  const total = round.totalStrokes
  const par = round.par
  const diff = total - par

  // 统计各类型成绩
  let birdie = 0, parCount = 0, bogey = 0, doubleBogey = 0, other = 0
  round.holes.forEach(h => {
    const r = h.strokes - h.par
    if (r <= -1) birdie++
    else if (r === 0) parCount++
    else if (r === 1) bogey++
    else if (r === 2) doubleBogey++
    else other++
  })

  return {
    summary: `本场总杆 ${total}，${diff > 0 ? '高于' : diff < 0 ? '低于' : '平'}标准杆${diff === 0 ? '' : Math.abs(diff) + '杆'}。小鸟球 ${birdie} 个，标准杆 ${parCount} 个，博基 ${bogey} 个。`,
    strengths: '您的三杆洞表现稳定，开球上球道率较高。',
    improvements: '五杆洞的攻果岭精准度有待提升，建议多练习长铁和中铁。',
    suggestions: '下次下场建议重点关注：1) 长铁杆的攻果岭练习；2) 果岭边的切杆短打。',
    scoreTrend: '近4场平均成绩呈稳定趋势，保持练习节奏。'
  }
}

module.exports = {
  formatTime,
  formatDate,
  calcTotalStrokes,
  calcParDiff,
  calcHoleResult,
  generateMockRounds,
  generateMockAnalysis
}
