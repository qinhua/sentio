import React from 'react'
import { Avatar, Tag } from 'antd-mobile'
import { DoctorItem } from '../../../ChatDetail/types'
import { alphaColor } from '@/utils/common'
import classNames from 'classnames'
import styles from './index.module.scss'

interface DoctorCardProps {
  active: boolean
  data: DoctorItem
  className?: string
}

const DoctorCard: React.FC<DoctorCardProps> = ({ active, data, className }) => {
  const { avatar, name, style, expertise, bio } = data

  return (
    <div
      className={classNames(
        'doctor-card',
        styles.doctorCard,
        active && styles.active,
        className
      )}
      style={{
        background: `linear-gradient(-10deg, #fff 60%, ${data.color} 100%)`,
        boxShadow: active
          ? `0 10px 30px 0 ${alphaColor(data.color, 0.3)}`
          : '0 3px 10px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className={styles.topCon}>
        <Avatar className={styles.avatar} src={avatar} alt="doctor avatar" />
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.style}>{style}</p>
      </div>
      <div className={styles.expertise}>
        {expertise.map((itm, idx) => (
          <Tag
            key={idx}
            style={{
              '--background-color': data.color,
              '--border-color': data.color
            }}
          >
            {itm}
          </Tag>
        ))}
      </div>
      <p className={styles.desc}>{bio}</p>
    </div>
  )
}

export default DoctorCard
