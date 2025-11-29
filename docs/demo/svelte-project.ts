import type { FileSystemTree } from '@webcontainer/api'

const files: FileSystemTree = {
	'package.json': {
		file: {
			contents: `{
  "name": "svelte-quiz-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "svelte": "^4.2.19"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^3.1.2",
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
  <title>Svelte Quiz App</title>
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
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})`,
		},
	},
	'svelte.config.js': {
		file: {
			contents: `export default {
  compilerOptions: {
    dev: true,
  },
}`,
		},
	},
	src: {
		directory: {
			'main.js': {
				file: {
					contents: `import App from './App.svelte'
import './global.css'

const app = new App({
  target: document.getElementById('app'),
})

export default app`,
				},
			},
			'App.svelte': {
				file: {
					contents: `<script>
  let currentQuestion = 0
  let score = 0
  let showResult = false
  let selectedAnswer = null
  let isAnswered = false

  const questions = [
    {
      question: 'What does Svelte compile to?',
      options: ['Virtual DOM', 'Vanilla JavaScript', 'WebAssembly', 'TypeScript'],
      correct: 1,
      emoji: '⚡',
    },
    {
      question: 'Which feature makes Svelte unique?',
      options: ['JSX syntax', 'No virtual DOM', 'Class components', 'Redux required'],
      correct: 1,
      emoji: '🎯',
    },
    {
      question: 'What is SvelteKit?',
      options: ['A UI library', 'A framework', 'A testing tool', 'A CSS framework'],
      correct: 1,
      emoji: '🚀',
    },
    {
      question: 'How do you create reactive statements in Svelte?',
      options: ['useState()', 'reactive()', '$:', 'ref()'],
      correct: 2,
      emoji: '💫',
    },
    {
      question: 'What is the file extension for Svelte components?',
      options: ['.jsx', '.vue', '.svelte', '.component'],
      correct: 2,
      emoji: '📁',
    },
  ]

  $: currentQ = questions[currentQuestion]
  $: progress = ((currentQuestion + 1) / questions.length) * 100

  function selectAnswer(index) {
    if (isAnswered) return
    selectedAnswer = index
  }

  function submitAnswer() {
    if (selectedAnswer === null) return
    isAnswered = true

    if (selectedAnswer === currentQ.correct) {
      score++
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        currentQuestion++
        selectedAnswer = null
        isAnswered = false
      } else {
        showResult = true
      }
    }, 1500)
  }

  function restart() {
    currentQuestion = 0
    score = 0
    showResult = false
    selectedAnswer = null
    isAnswered = false
  }

  function getResultMessage() {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return '🏆 Perfect! You are a Svelte master!'
    if (percentage >= 80) return '🎉 Excellent! You know Svelte well!'
    if (percentage >= 60) return '👍 Good job! Keep learning!'
    if (percentage >= 40) return '📚 Not bad! Study more about Svelte!'
    return '💪 Keep trying! Practice makes perfect!'
  }
</script>

<div class="app">
  <div class="container">
    <h1 class="title">Svelte Quiz App</h1>

    {#if !showResult}
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%"></div>
      </div>

      <div class="question-card">
        <div class="question-header">
          <span class="question-emoji">{currentQ.emoji}</span>
          <span class="question-number">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <h2 class="question-text">{currentQ.question}</h2>

        <div class="options">
          {#each currentQ.options as option, index}
            <button
              class="option-button"
              class:selected={selectedAnswer === index}
              class:correct={isAnswered && index === currentQ.correct}
              class:wrong={isAnswered && selectedAnswer === index && index !== currentQ.correct}
              on:click={() => selectAnswer(index)}
              disabled={isAnswered}
            >
              <span class="option-letter">{String.fromCharCode(65 + index)}</span>
              <span class="option-text">{option}</span>
              {#if isAnswered && index === currentQ.correct}
                <span class="result-icon">✓</span>
              {/if}
              {#if isAnswered && selectedAnswer === index && index !== currentQ.correct}
                <span class="result-icon">✗</span>
              {/if}
            </button>
          {/each}
        </div>

        <button
          class="submit-button"
          on:click={submitAnswer}
          disabled={selectedAnswer === null || isAnswered}
        >
          {isAnswered ? 'Loading...' : 'Submit Answer'}
        </button>
      </div>

      <div class="score-display">
        <div class="score-item">
          <span class="score-label">Score</span>
          <span class="score-value">{score}</span>
        </div>
        <div class="score-item">
          <span class="score-label">Progress</span>
          <span class="score-value">{currentQuestion + 1}/{questions.length}</span>
        </div>
      </div>
    {:else}
      <div class="result-card">
        <div class="result-emoji">
          {score === questions.length ? '🏆' : score >= 3 ? '🎉' : '📚'}
        </div>
        <h2 class="result-title">Quiz Complete!</h2>
        <div class="final-score">
          <div class="score-circle">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
                strokeDasharray="{(score / questions.length) * 283} 283"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF3E00;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#FF8A00;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
            <div class="score-text">
              <div class="score-number">{score}/{questions.length}</div>
              <div class="score-percentage">{Math.round((score / questions.length) * 100)}%</div>
            </div>
          </div>
        </div>
        <p class="result-message">{getResultMessage()}</p>
        <button class="restart-button" on:click={restart}>
          🔄 Try Again
        </button>
      </div>
    {/if}

    <div class="footer">
      <p>Built with Svelte 4 🧡</p>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #FF3E00 0%, #FF8A00 100%);
    min-height: 100vh;
  }

  .app {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }

  .container {
    width: 100%;
    max-width: 700px;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .title {
    font-size: 48px;
    font-weight: 700;
    text-align: center;
    color: white;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 30px;
  }

  .progress-fill {
    height: 100%;
    background: white;
    border-radius: 10px;
    transition: width 0.3s ease;
  }

  .question-card,
  .result-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
    animation: slideUp 0.5s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .question-emoji {
    font-size: 40px;
  }

  .question-number {
    font-size: 14px;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .question-text {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
    line-height: 1.4;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
  }

  .option-button {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: #f8f9fa;
    border: 3px solid transparent;
    border-radius: 15px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: left;
  }

  .option-button:not(:disabled):hover {
    background: #e9ecef;
    transform: translateX(5px);
  }

  .option-button.selected {
    border-color: #FF3E00;
    background: rgba(255, 62, 0, 0.1);
  }

  .option-button.correct {
    border-color: #28a745;
    background: rgba(40, 167, 69, 0.1);
  }

  .option-button.wrong {
    border-color: #dc3545;
    background: rgba(220, 53, 69, 0.1);
  }

  .option-button:disabled {
    cursor: not-allowed;
  }

  .option-letter {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: #FF3E00;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  .option-button.correct .option-letter {
    background: #28a745;
  }

  .option-button.wrong .option-letter {
    background: #dc3545;
  }

  .option-text {
    flex: 1;
    color: #333;
  }

  .result-icon {
    font-size: 24px;
    font-weight: 700;
  }

  .submit-button,
  .restart-button {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #FF3E00 0%, #FF8A00 100%);
    color: white;
    border: none;
    border-radius: 15px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 5px 20px rgba(255, 62, 0, 0.3);
  }

  .submit-button:not(:disabled):hover,
  .restart-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 62, 0, 0.4);
  }

  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .score-display {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .score-item {
    background: white;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .score-label {
    display: block;
    font-size: 14px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  .score-value {
    display: block;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #FF3E00 0%, #FF8A00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .result-card {
    text-align: center;
  }

  .result-emoji {
    font-size: 80px;
    margin-bottom: 20px;
    animation: bounce 1s ease infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  .result-title {
    font-size: 36px;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
  }

  .final-score {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }

  .score-circle {
    position: relative;
    width: 200px;
    height: 200px;
  }

  .score-circle svg {
    width: 100%;
    height: 100%;
  }

  .score-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .score-number {
    font-size: 48px;
    font-weight: 700;
    color: #333;
  }

  .score-percentage {
    font-size: 20px;
    color: #999;
  }

  .result-message {
    font-size: 20px;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.6;
  }

  .footer {
    text-align: center;
    color: white;
    font-size: 14px;
    margin-top: 30px;
    opacity: 0.9;
  }

  .footer p {
    margin: 0;
  }

  @media (max-width: 768px) {
    .title {
      font-size: 36px;
    }

    .question-text {
      font-size: 22px;
    }

    .question-card,
    .result-card {
      padding: 30px 20px;
    }
  }
</style>`,
				},
			},
			'global.css': {
				file: {
					contents: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`,
				},
			},
		},
	},
}

export default files
