// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 处理跨场时区问题
const formatDate = date => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 调用AI API生成分析报告
async function callAiApi(roundData) {
  // TODO: 接入真实AI API（如腾讯混元、OpenAI）
  // 返回结构化分析数据

  const { totalStrokes, par, holes } = roundData
  const diff = totalStrokes - par

  // 统计各类成绩
  let birdie = 0, parCount = 0, bogey = 0, doubleBogey = 0
  holes.forEach(h => {
    const r = h.strokes - h.par
    if (r <= -1) birdie++
    else if (r === 0) parCount++
    else if (r === 1) bogey++
    else doubleBogey++
  })

  return {
    summary: `本场总杆 ${totalStrokes}，${diff > 0 ? '高于' : diff < 0 ? '低于' : '平'}标准杆${diff === 0 ? '' : Math.abs(diff) + '杆'}。小鸟球 ${birdie} 个，标准杆 ${parCount} 个，博基 ${bogey} 个，双博基以上 ${doubleBogey} 个。`,
    strengths: '您的前九洞发挥较为稳定，保Par能力较强。',
    improvements: '后九洞体能下降明显，失误增多，建议加强体能训练。',
    suggestions: '1) 长杆攻果岭时注意落点区域选择\n2) 果岭边切杆练习量建议增加\n3) 下场前做好热身',
    scoreTrend: '近4场数据将为您生成趋势分析。',
    fairwayHitRate: 65,
    greenInRegulation: 50,
    puttsPerHole: 1.8
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const { action, data } = event

  try {
    switch (action) {
      case 'analyze': {
        const analysis = await callAiApi(data)
        return { code: 0, data: analysis }
      }

      case 'getTrend': {
        // TODO: 从数据库获取历史数据生成趋势
        return { code: 0, data: { trend: 'stable' } }
      }

      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (err) {
    return { code: -1, message: err.message }
  }
}
