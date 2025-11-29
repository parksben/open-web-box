import type { FileSystemTree } from '@webcontainer/api'

const files: FileSystemTree = {
	'index.html': {
		file: {
			contents: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animated Gradient Card</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="card-glow"></div>
      <div class="card-content">
        <h1 class="title">✨ Welcome</h1>
        <p class="subtitle">Hover me for a surprise!</p>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">1.2K</span>
            <span class="stat-label">Projects</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">5.8K</span>
            <span class="stat-label">Stars</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">892</span>
            <span class="stat-label">Forks</span>
          </div>
        </div>
        <button class="cta-button">Get Started</button>
      </div>
    </div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
		},
	},
	'styles.css': {
		file: {
			contents: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.container {
  position: relative;
  perspective: 1000px;
}

.card {
  position: relative;
  width: 400px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.card:hover {
  transform: translateY(-10px) rotateX(5deg);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff00cc, #3333ff, #00ffff, #ff00cc);
  background-size: 400% 400%;
  border-radius: 20px;
  opacity: 0;
  z-index: -1;
  animation: glowAnimation 6s ease infinite;
  transition: opacity 0.3s;
}

.card:hover .card-glow {
  opacity: 0.8;
}

@keyframes glowAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card-content {
  position: relative;
  z-index: 1;
}

.title {
  font-size: 42px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: fadeInDown 0.6s ease;
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease 0.2s both;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease 0.4s both;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease 0.6s both;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.cta-button:active {
  transform: translateY(0);
}

.floating-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.6;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
		},
	},
	'script.js': {
		file: {
			contents: `// Add interactive 3D tilt effect
const card = document.querySelector('.card')

card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const rotateX = (y - centerY) / 10
  const rotateY = (centerX - x) / 10
  
  card.style.transform = \`translateY(-10px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`
})

card.addEventListener('mouseleave', () => {
  card.style.transform = 'translateY(0) rotateX(0) rotateY(0)'
})

// Button click animation
const button = document.querySelector('.cta-button')

button.addEventListener('click', () => {
  // Create ripple effect
  const ripple = document.createElement('span')
  ripple.style.position = 'absolute'
  ripple.style.width = '100%'
  ripple.style.height = '100%'
  ripple.style.top = '0'
  ripple.style.left = '0'
  ripple.style.background = 'rgba(255, 255, 255, 0.5)'
  ripple.style.borderRadius = '10px'
  ripple.style.animation = 'ripple 0.6s ease-out'
  
  button.style.position = 'relative'
  button.style.overflow = 'hidden'
  button.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 600)
  
  // Show alert
  setTimeout(() => {
    alert('🎉 Welcome to the future of web development!')
  }, 100)
})

// Add ripple animation
const style = document.createElement('style')
style.textContent = \`
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
\`
document.head.appendChild(style)

// Animated counter for stats
const animateValue = (element, start, end, duration) => {
  let startTimestamp = null
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    const value = Math.floor(progress * (end - start) + start)
    element.textContent = value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

// Animate stats on page load
window.addEventListener('load', () => {
  const statValues = document.querySelectorAll('.stat-value')
  const targets = [1200, 5800, 892]
  
  setTimeout(() => {
    statValues.forEach((stat, index) => {
      animateValue(stat, 0, targets[index], 2000)
    })
  }, 800)
})`,
		},
	},
}

export default files
