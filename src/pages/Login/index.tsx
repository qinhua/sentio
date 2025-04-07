import React, { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import { PATH } from '@/constants/path'
import classNames from 'classnames'
import styles from './index.module.scss'

const Login: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [isAgreementChecked, setIsAgreementChecked] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const welcomeTexts = ['你好，我是 Sentio', '你的专属心理伙伴']
  const typingSpeed = 150
  const pauseTime = 2000
  // Profile setup state
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(0)
  const avatarOptions = [
    'https://public.readdy.ai/ai/img_res/7c58f4b84ad03dfbe5b0837324a46233.jpg',
    'https://public.readdy.ai/ai/img_res/5361b15b6145ccaab89945cec1bd423e.jpg',
    'https://public.readdy.ai/ai/img_res/efeab7668ab04a2c3c83141bdd49df5c.jpg',
    'https://public.readdy.ai/ai/img_res/4505ee251917448027c81b2fe0386121.jpg'
  ]
  const navigate = useNavigate()

  const handleGoogleLogin = () => {
    // Simulate Google OAuth authentication flow
    console.log('Initiating Google OAuth flow')
    // Show loading state
    const button = document.activeElement as HTMLButtonElement
    if (button) {
      const originalText = button.innerHTML
      button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>授权中...'
      button.disabled = true
      // Simulate API call delay
      setTimeout(() => {
        // Always show profile setup
        console.log('New user detected, showing profile setup')
        setShowProfileSetup(true)
        // Reset button state
        button.innerHTML = originalText
        button.disabled = false
      }, 2000)
    }
  }

  // Typing effect
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
  const handleEnterApp = () => {
    setShowProfileSetup(true)
  }
  const handleCompleteProfile = () => {
    if (!nickname || !gender || !age) return
    setIsLoggedIn(true)
    navigate(PATH.doctorList)
  }
  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <i className={classNames(styles.closeButton, 'fa fa-times')}></i>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <div className={styles.avatarContainer}>
              {[
                'https://public.readdy.ai/ai/img_res/87e9737cf82ce32d79b888a6305c4bf2.jpg',
                'https://public.readdy.ai/ai/img_res/6df508e6f5d920c31ec721cd5f1483a9.jpg',
                'https://public.readdy.ai/ai/img_res/f46ad8fac2d7880c86a20372540c2dac.jpg'
              ].map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Sentio Avatar ${index + 1}`}
                  className={styles.avatarImage}
                  style={{
                    opacity:
                      index === Math.floor((Date.now() / 5000) % 3) ? 1 : 0,
                    animationDelay: `${index * 5}s`
                  }}
                />
              ))}
            </div>

            <div className={styles.titleContainer}>
              <h1 className={styles.title}>
                {typingText}
                <span className={styles.blinkCursor}>|</span>
              </h1>
            </div>

            <div className={styles.buttonContainer}>
              <Button className={`${styles.button} ${styles.primaryButton}`}>
                <i className="fa fa-phone mr-2"></i>
                手机号登录
              </Button>

              <Button
                variant="outline"
                className={`${styles.button} ${styles.outlineButton}`}
                onClick={handleGoogleLogin}
              >
                <i className="fa fa-google mr-2"></i>
                谷歌登录
              </Button>

              <Button
                variant="outline"
                className={`${styles.button} ${styles.outlineButton}`}
              >
                <i className="fa fa-apple mr-2"></i>
                Apple ID 登录
              </Button>

              <Button
                variant="outline"
                onClick={handleEnterApp}
                className={`${styles.button} ${styles.outlineButton}`}
              >
                <i className="fa fa-arrow-right mr-2"></i>
                进入应用
              </Button>
            </div>
          </div>

          <div className={styles.agreementContainer}>
            <Checkbox
              id="agreement"
              checked={isAgreementChecked}
              onCheckedChange={checked =>
                setIsAgreementChecked(checked as boolean)
              }
              className={styles.checkbox}
            />
            <label htmlFor="agreement" className={styles.agreementText}>
              我已阅读并同意 Sentio 的
              <a href="#" className={styles.link}>
                服务条款
              </a>
              和
              <a href="#" className={styles.link}>
                隐私政策
              </a>
            </label>
          </div>
        </div>

        {showProfileSetup && (
          <div className={styles.profileSetup}>
            <div className={styles.profileHeader}>
              <button
                onClick={() => setShowProfileSetup(false)}
                className={styles.backButton}
              >
                <i className="fa fa-arrow-left"></i>
              </button>
              <h1 className={styles.profileTitle}>完善您的个人资料</h1>
            </div>

            <div className={styles.profileContent}>
              <div className={styles.profileForm}>
                <div className={styles.formSection}>
                  <Label className={styles.label}>选择您的头像</Label>
                  <div className={styles.avatarGrid}>
                    {avatarOptions.map((avatar, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedAvatar(index)}
                        className={`${styles.avatarOption} ${
                          selectedAvatar === index
                            ? styles.avatarOptionSelected
                            : ''
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={`Avatar option ${index + 1}`}
                          className={styles.avatarOptionItem}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formSection}>
                  <Label htmlFor="nickname" className={styles.label}>
                    昵称
                  </Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="请输入您的昵称"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formSection}>
                  <Label className={styles.label}>性别</Label>
                  <RadioGroup
                    value={gender}
                    onValueChange={setGender}
                    className={styles.radioGroup}
                  >
                    <div className={styles.radioItem}>
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-base">
                        男
                      </Label>
                    </div>
                    <div className={styles.radioItem}>
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-base">
                        女
                      </Label>
                    </div>
                    <div className={styles.radioItem}>
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="text-base">
                        保密
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className={styles.formSection}>
                  <Label htmlFor="age" className={styles.label}>
                    年龄
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="请输入您的年龄"
                    className={styles.input}
                    min="1"
                    max="120"
                  />
                </div>
              </div>
            </div>

            <div className={styles.profileFooter}>
              <Button
                onClick={handleCompleteProfile}
                disabled={!nickname || !gender || !age}
                className={`${styles.submitButton} ${
                  !nickname || !gender || !age
                    ? styles.submitButtonDisabled
                    : ''
                }`}
              >
                开始沟通
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return <></>
}

export default Login
