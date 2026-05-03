import { useState, useEffect } from 'react'
import '../styles/Timer.css'

export default function Timer() {
  const [seconds, setSeconds] = useState(600) // 10 minutes = 600 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 0) {
          return 600 // Reset to 10 minutes
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  const formatTime = (val) => String(val).padStart(2, '0')

  const percentage = (seconds / 600) * 100

  return (
    <div className="timer-container">
      <div className="timer-card">
        <h2>Auto Refresh Timer</h2>

        <div className="timer-display">
          <div className="timer-circle">
            <svg className="timer-svg" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                className="timer-bg-circle"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                className="timer-progress-circle"
                style={{
                  strokeDasharray: `${(percentage / 100) * (2 * Math.PI * 90)} ${2 * Math.PI * 90}`
                }}
              />
            </svg>
            <div className="timer-text">
              <span className="time">{formatTime(minutes)}:{formatTime(secs)}</span>
              <span className="label">remaining</span>
            </div>
          </div>
        </div>

        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${percentage}%` }}></div>
        </div>

        <div className="timer-info">
          <p>Data refreshes when timer reaches zero</p>
        </div>
      </div>
    </div>
  )
}
