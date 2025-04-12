import React, { useEffect, useState, useRef } from 'react'
import {
  Avatar,
  Button,
  Form,
  Swiper,
  Input,
  TextArea,
  SwiperRef,
  Radio,
  Space
} from 'antd-mobile'
import { useAuthProviderContext } from '@/providers/AuthProvider'
import { USER_AVATAR_URL } from '@/constants/common'
import { useNavigate } from 'react-router-dom'
import { EnumUserGender } from '@/enum/common'
import { PATH } from '@/constants/path'
import { toast } from 'react-toastify'
import styles from './index.module.scss'

const EditProfile: React.FC = () => {
  const { profile, updateUserProfile } = useAuthProviderContext()
  const refSwiper = useRef<SwiperRef | null>(null)
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<EnumUserGender | null>(null)
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(2)
  const navigate = useNavigate()

  const handleFormChange = (field: string, value: string) => {
    switch (field) {
      case 'avatar':
        setSelectedAvatarIndex(Number(value))
        break
      case 'nickname':
        setNickname(value)
        break
      case 'gender':
        setGender(value as EnumUserGender)
        break
      case 'age':
        setAge(value)
        break
      case 'bio':
        setBio(value)
        break
    }
  }

  const handleClickAvatar = (index: number) => {
    setSelectedAvatarIndex(index)
    refSwiper.current?.swipeTo(index)
  }

  const handleSubmit = async () => {
    if (!nickname || !gender || !age) return

    try {
      await updateUserProfile?.({
        avatar_index: selectedAvatarIndex,
        avatar_url: USER_AVATAR_URL[selectedAvatarIndex],
        nickname,
        gender,
        age: Number(age)
        // bio,
      })

      toast.success('Profile updated successfully')
      setTimeout(() => {
        navigate(PATH.profile)
      }, 2000)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  useEffect(() => {
    if (!profile) return

    setNickname(profile.nickname)
    setGender(profile.gender)
    setAge(profile.age.toString())
    // setBio(profile.bio || '')
    setSelectedAvatarIndex(profile?.avatar_index)
  }, [profile])

  return (
    <div className={styles.container}>
      <div className={styles.profileContent}>
        <div className={styles.avatarSwiper}>
          <Swiper
            ref={refSwiper}
            defaultIndex={selectedAvatarIndex}
            slideSize={36}
            trackOffset={32}
            indicator={false}
            stuckAtBoundary={false}
            total={USER_AVATAR_URL.length}
            onIndexChange={value => handleFormChange('avatar', String(value))}
          >
            {USER_AVATAR_URL.map((avatar, index) => (
              <Swiper.Item
                key={index}
                onClick={() => handleClickAvatar(index)}
                className={`${styles.avatarOption} ${
                  selectedAvatarIndex === index
                    ? styles.avatarOptionSelected
                    : ''
                }`}
              >
                <Avatar
                  className={styles.avatarOptionItem}
                  src={avatar}
                  alt="avatar"
                />
              </Swiper.Item>
            ))}
          </Swiper>
        </div>
        <Form className={styles.profileForm} layout="vertical">
          <Form.Item label="Nick Name">
            <Input
              value={nickname}
              clearable
              maxLength={20}
              placeholder="Please enter nickname"
              onChange={value => handleFormChange('nickname', value)}
            />
          </Form.Item>
          <Form.Item label="Gender">
            <Radio.Group
              defaultValue={gender}
              value={gender}
              onChange={value => handleFormChange('gender', value as string)}
            >
              <Space direction="horizontal" style={{ gap: '20px' }}>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
                <Radio value="other">Other</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Age">
            <Input
              value={age}
              clearable
              min={1}
              max={100}
              placeholder="Please enter age"
              onChange={value => handleFormChange('age', value)}
            />
          </Form.Item>
          {/* <Form.Item label="Bio">
            <TextArea
              value={bio}
              maxLength={100}
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Please enter bio (optional)"
              onChange={value => handleFormChange('bio', value)}
            />
          </Form.Item> */}
        </Form>
      </div>

      <div className={styles.profileFooter}>
        <Button
          className={styles.submitButton}
          color="primary"
          disabled={!nickname || !gender || Number(age) <= 0}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default EditProfile
