import { useEffect, useRef, useState } from 'react'
import NumberInput from './NumberInput'
import './IntervalTimer.css'

export default function IntervalTimer() {
  const [totalLoops, setTotalLoops] = useState(4)
  const [initialTime, setInitialTime] = useState(10) // 작업 시간(초)
  const [intervalRest, setIntervalRest] = useState(3) // 텀(초)

  const [timeLeftMs, setTimeLeftMs] = useState(0)
  const [currentLoop, setCurrentLoop] = useState(0)
  const [isInterval, setIsInterval] = useState(false) // false: 작업, true: 텀
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const stop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentLoop(0)
    setIsInterval(false)
    setTimeLeftMs(0)
    clearTimer()
  }

  const start = () => {
    // 시작 <-> 중지 토글
    if (isRunning) {
      stop()
      return
    }
    if (initialTime <= 0 || totalLoops <= 0) {
      return
    }
    setCurrentLoop(1)
    setIsInterval(false)
    setTimeLeftMs(initialTime * 1000)
    setIsRunning(true)
    setIsPaused(false)
  }

  const togglePause = () => {
    if (!isRunning) return
    if (!isPaused) {
      setIsPaused(true)
      clearTimer()
    } else {
      setIsPaused(false)
    }
  }

  useEffect(() => {
    if (!isRunning || isPaused) {
      clearTimer()
      return
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeftMs((prev) => {
        const next = prev - 10
        if (next <= 0) {
          // 현재 phase 종료
          if (!isInterval) {
            // 작업 단계 끝 → 텀으로
            if (intervalRest > 0 && currentLoop < totalLoops) {
              setIsInterval(true)
              return intervalRest * 1000
            }
          }

          // 텀 끝 or 텀이 없는 경우 → 다음 루프 or 종료
          if (currentLoop < totalLoops) {
            console.log('next loop')
            setCurrentLoop((c) => c + 1)
            setIsInterval(false)
            return initialTime * 1000
          } else {
            stop()
            return 0
          }
        }
        return next
      })
    }, 10)

    return () => {
      clearTimer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, isPaused, isInterval, currentLoop, totalLoops, initialTime, intervalRest])

  const formatTime = (ms: number) => {
    if (ms <= 0) return '0.00'
    return (ms / 1000).toFixed(2)
  }

  const phaseLabel = isInterval ? '준비...' : isRunning ? '작업!' : '정지'
  const phaseKey = isInterval ? 'phase-interval' : isRunning ? 'phase-work' : 'phase-stopped'

  return (
    <div className="interval-timer">
      <h1 className="interval-timer__title">인터벌 타이머</h1>

      <div className="interval-timer__card interval-timer__inputs">
        <NumberInput value={totalLoops} label="반복 수" onChange={setTotalLoops} />
        <NumberInput value={initialTime} label="초기 시간 (초)" onChange={setInitialTime} />
        <NumberInput value={intervalRest} label="텀 (초)" onChange={setIntervalRest} />
      </div>

      <div className={`interval-timer__card interval-timer__display ${phaseKey}`}>
        <div className="interval-timer__meta">
          <div className="interval-timer__meta-item">
            <span className="interval-timer__meta-value">
              {currentLoop} / {totalLoops}
            </span>
          </div>
          <div className="interval-timer__meta-item">
            <span className="interval-timer__meta-value x-large">{phaseLabel}</span>
          </div>
        </div>

        <div className="interval-timer__time">
          <span className="interval-timer__time-value">
            {formatTime(isRunning ? timeLeftMs : (initialTime || 0) * 1000)}
            <span className="interval-timer__time-unit">초</span>
          </span>
        </div>

        <div className="interval-timer__controls">
          <button
            className={`interval-timer__button interval-timer__button--primary ${
              isRunning ? 'interval-timer__button--danger' : ''
            }`}
            onClick={start}
          >
            {isRunning ? '중지' : '시작'}
          </button>

          <button
            className="interval-timer__button interval-timer__button--ghost"
            onClick={togglePause}
            disabled={!isRunning}
          >
            {isPaused ? '재개' : '일시정지'}
          </button>
        </div>
      </div>
      <div className="center">
        <p>
          이중혁 - <a href="https://github.com/wndgur2/interval-timer">Github</a>
        </p>
      </div>
    </div>
  )
}
