import React, { useState, useEffect } from 'react'
import { Avatar, Button } from 'antd-mobile'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { PATH } from '@/constants/path'
import styles from './index.module.scss'
import { useAuthProviderContext } from 'src/providers/AuthProvider'

const Profile: React.FC = () => {
  const { profile, clearAccount } = useAuthProviderContext()
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(PATH.editProfile)
  }

  const handleLogout = () => {
    clearAccount?.()
  }

  if (!profile) return null

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.baseInfo}>
          <div className={styles.avatarCon}>
            <Avatar
              className={styles.avatar}
              src={profile.avatar_url!}
              alt="avatar"
            />
            <Icon
              icon={
                profile.gender === 'male'
                  ? 'fluent-emoji:male-sign'
                  : 'fluent-emoji:female-sign'
              }
              className={styles.gender}
            />
          </div>
          <p className={styles.name}>{profile.nickname}</p>
          <p className={styles.bio}>{profile.bio}</p>
        </div>

        <div className={styles.buttonGroup}>
          <Button onClick={handleEdit} className={styles.buttonEdit}>
            <Icon icon="cuida:edit-outline" />
            Edit Profile
          </Button>
          <Button onClick={handleLogout} className={styles.buttonLogout}>
            <Icon icon="ri:logout-circle-r-line" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
