import type { FileSystemTree } from '@webcontainer/api'

const files: FileSystemTree = {
	'package.json': {
		file: {
			contents: `{
  "name": "vue-charts",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "vite": "^5.4.11"
  }
}`,
		},
	},
	'index.html': {
		file: {
			contents: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Dashboard</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`,
		},
	},
	'vite.config.js': {
		file: {
			contents: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`,
		},
	},
	src: {
		directory: {
			'main.js': {
				file: {
					contents: `import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')`,
				},
			},
			'App.vue': {
				file: {
					contents: `<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 进度圆环数据
const circleData = ref([
  { label: 'CPU', value: 0, target: 75, color: '#667eea' },
  { label: 'Memory', value: 0, target: 58, color: '#f093fb' },
  { label: 'Disk', value: 0, target: 82, color: '#4facfe' },
])

// 柱状图数据
const barData = ref([
  { day: 'Mon', value: 0, target: 65 },
  { day: 'Tue', value: 0, target: 78 },
  { day: 'Wed', value: 0, target: 52 },
  { day: 'Thu', value: 0, target: 85 },
  { day: 'Fri', value: 0, target: 70 },
  { day: 'Sat', value: 0, target: 45 },
  { day: 'Sun', value: 0, target: 38 },
])

// 折线图数据
const lineData = ref([
  { month: 'Jan', value: 0, target: 20 },
  { month: 'Feb', value: 0, target: 35 },
  { month: 'Mar', value: 0, target: 28 },
  { month: 'Apr', value: 0, target: 52 },
  { month: 'May', value: 0, target: 45 },
  { month: 'Jun', value: 0, target: 68 },
])

// 饼图数据
const pieData = ref([
  { label: 'Vue', value: 0, target: 45, color: '#42b883' },
  { label: 'React', value: 0, target: 35, color: '#61dafb' },
  { label: 'Angular', value: 0, target: 20, color: '#dd0031' },
])

let animationId = null

// 计算圆环路径
const getCircleStroke = (value) => {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return { circumference, offset }
}

// 计算折线图路径
const linePath = computed(() => {
  const width = 100
  const height = 100
  const points = lineData.value.map((item, index) => {
    const x = (index / (lineData.value.length - 1)) * width
    const y = height - (item.value / 100) * height
    return \`\${x},\${y}\`
  })
  return \`M \${points.join(' L ')}\`
})

// 计算饼图扇形
const pieSlices = computed(() => {
  let currentAngle = -90
  const total = pieData.value.reduce((sum, item) => sum + item.value, 0)
  
  return pieData.value.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const startAngle = (currentAngle * Math.PI) / 180
    const endAngle = ((currentAngle + angle) * Math.PI) / 180
    
    const x1 = 50 + 40 * Math.cos(startAngle)
    const y1 = 50 + 40 * Math.sin(startAngle)
    const x2 = 50 + 40 * Math.cos(endAngle)
    const y2 = 50 + 40 * Math.sin(endAngle)
    
    const largeArc = angle > 180 ? 1 : 0
    const path = \`M 50 50 L \${x1} \${y1} A 40 40 0 \${largeArc} 1 \${x2} \${y2} Z\`
    
    currentAngle += angle
    
    return { path, color: item.color, label: item.label, percentage }
  })
})

// 动画函数
const animate = () => {
  let updated = false
  
  // 更新圆环数据
  circleData.value.forEach(item => {
    if (item.value < item.target) {
      item.value = Math.min(item.value + 1, item.target)
      updated = true
    }
  })
  
  // 更新柱状图数据
  barData.value.forEach(item => {
    if (item.value < item.target) {
      item.value = Math.min(item.value + 1.5, item.target)
      updated = true
    }
  })
  
  // 更新折线图数据
  lineData.value.forEach(item => {
    if (item.value < item.target) {
      item.value = Math.min(item.value + 1, item.target)
      updated = true
    }
  })
  
  // 更新饼图数据
  pieData.value.forEach(item => {
    if (item.value < item.target) {
      item.value = Math.min(item.value + 0.8, item.target)
      updated = true
    }
  })
  
  if (updated) {
    animationId = requestAnimationFrame(animate)
  }
}

onMounted(() => {
  setTimeout(() => {
    animate()
  }, 500)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1>Vue Dashboard</h1>
      <p>Real-time Analytics & Performance Metrics</p>
    </header>

    <div class="charts-grid">
      <!-- 圆环图 -->
      <div class="chart-card">
        <h3 class="card-title">System Status</h3>
        <div class="circles-container">
          <div v-for="item in circleData" :key="item.label" class="circle-item">
            <svg width="120" height="120" class="circle-svg">
              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                :stroke="item.color"
                strokeWidth="10"
                strokeLinecap="round"
                :strokeDasharray="getCircleStroke(100).circumference"
                :strokeDashoffset="getCircleStroke(item.value).offset"
                transform="rotate(-90 60 60)"
                class="circle-progress"
              />
              <text
                x="60"
                y="60"
                text-anchor="middle"
                dominant-baseline="middle"
                class="circle-text"
              >
                {{ Math.round(item.value) }}%
              </text>
            </svg>
            <div class="circle-label">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- 柱状图 -->
      <div class="chart-card">
        <h3 class="card-title">Weekly Activity</h3>
        <div class="bar-chart">
          <div v-for="item in barData" :key="item.day" class="bar-item">
            <div class="bar-container">
              <div 
                class="bar-fill"
                :style="{ height: item.value + '%' }"
              >
                <span class="bar-value">{{ Math.round(item.value) }}</span>
              </div>
            </div>
            <div class="bar-label">{{ item.day }}</div>
          </div>
        </div>
      </div>

      <!-- 折线图 -->
      <div class="chart-card">
        <h3 class="card-title">Monthly Trend</h3>
        <div class="line-chart">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="line-svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#667eea;stop-opacity:0" />
              </linearGradient>
            </defs>
            <path
              :d="linePath + ' L 100 100 L 0 100 Z'"
              fill="url(#areaGradient)"
            />
            <path
              :d="linePath"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="line-labels">
            <span v-for="item in lineData" :key="item.month" class="line-label">
              {{ item.month }}
            </span>
          </div>
        </div>
      </div>

      <!-- 饼图 -->
      <div class="chart-card">
        <h3 class="card-title">Framework Usage</h3>
        <div class="pie-chart">
          <svg viewBox="0 0 100 100" class="pie-svg">
            <g v-for="(slice, index) in pieSlices" :key="index">
              <path
                :d="slice.path"
                :fill="slice.color"
                class="pie-slice"
              />
            </g>
          </svg>
          <div class="pie-legend">
            <div v-for="item in pieData" :key="item.label" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }"></span>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ Math.round(item.value) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 10px 0;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.header p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
  max-width: 1400px;
  margin: 0 auto;
}

.chart-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 25px 0;
}

/* 圆环图样式 */
.circles-container {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
}

.circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.circle-svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.circle-progress {
  transition: strokeDashoffset 0.5s ease;
}

.circle-text {
  font-size: 18px;
  font-weight: 700;
  fill: #2d3748;
}

.circle-label {
  font-size: 14px;
  color: #718096;
  font-weight: 600;
}

/* 柱状图样式 */
.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 10px;
  height: 220px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 30px;
}

.bar-container {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 8px 8px 0 0;
  transition: height 0.5s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  min-height: 5%;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.bar-value {
  font-size: 11px;
  font-weight: 700;
  color: white;
}

.bar-label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
}

/* 折线图样式 */
.line-chart {
  position: relative;
}

.line-svg {
  width: 100%;
  height: 180px;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2));
}

.line-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.line-label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
}

/* 饼图样式 */
.pie-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.pie-svg {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}

.pie-slice {
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.pie-slice:hover {
  opacity: 0.85;
}

.pie-legend {
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 13px;
  color: #2d3748;
  font-weight: 600;
  white-space: nowrap;
}

.legend-value {
  font-size: 13px;
  color: #718096;
  font-weight: 700;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 28px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .circles-container {
    flex-direction: column;
  }
  
  .bar-chart {
    height: 180px;
  }
  
  .bar-container {
    height: 140px;
  }
  
  .pie-chart {
    flex-direction: column;
  }
}
</style>`,
				},
			},
			'style.css': {
				file: {
					contents: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
}`,
				},
			},
		},
	},
}

export default files
