import React, { useState, useEffect } from 'react'
import { Button } from 'antd-mobile'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { ImgLogo } from '@/constants/file'
import { PATH } from '@/constants/path'
import styles from './index.module.scss'

const Welcome: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const welcomeTexts = ['Connecting you to a better tomorrow...']
  const typingSpeed = 80
  const pauseTime = 2000
  const navigate = useNavigate()

  const handleEnterApp = () => {
    navigate(PATH.completeInfo)
  }

  useEffect(() => {
    if (!isTyping) return

    const currentText = welcomeTexts[currentTextIndex]
    if (typingText.length < currentText.length) {
      const timeout = setTimeout(() => {
        setTypingText(currentText.substring(0, typingText.length + 1))
      }, typingSpeed)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setTypingText('')
        setCurrentTextIndex((currentTextIndex + 1) % welcomeTexts.length)
      }, pauseTime)
      return () => clearTimeout(timeout)
    }
  }, [typingText, currentTextIndex, isTyping])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img src={ImgLogo} alt="logo" />
          <p>Sentio</p>
        </div>
        <h2 className={styles.title}>
          {typingText}
          <span className={styles.blinkCursor}>|</span>
        </h2>
        <Button onClick={handleEnterApp} className={styles.button}>
          <Icon icon="tabler:arrow-right-dashed" />
          Enter Sentio
        </Button>
      </div>
    </div>
  )
}

export default Welcome
