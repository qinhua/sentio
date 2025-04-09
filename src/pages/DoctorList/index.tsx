import React, { useState, useRef } from 'react'
import { Button, Swiper, SwiperRef } from 'antd-mobile'
import DoctorCard from './component/DoctorCard'
import { DOCTOR_LIST } from '@/constants/common'
import { useNavigate } from 'react-router-dom'
import { PATH } from '@/constants/path'
import styles from './index.module.scss'
import classNames from 'classnames'

export interface DoctorItem {
  id: number
  name: string
  avatar: string
  color: string
  style: string
  expertise: string[]
  description: string
}

const DoctorList: React.FC = () => {
  const refSwiper = useRef<SwiperRef | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem>(
    DOCTOR_LIST[1]
  )
  const navigate = useNavigate()

  const handleDoctorChange = (index: number) => {
    setSelectedDoctor(DOCTOR_LIST[index])
  }

  const handleDoctorClick = (index: number) => {
    setSelectedDoctor(DOCTOR_LIST[index])
    refSwiper.current?.swipeTo(index)
  }

  const handleCommunicate = () => {
    navigate(PATH.chatDetail(selectedDoctor.id), {
      state: {
        doctor: selectedDoctor
      }
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.doctorSwiper}>
        <Swiper
          ref={refSwiper}
          defaultIndex={1}
          slideSize={60}
          trackOffset={20}
          stuckAtBoundary={false}
          total={DOCTOR_LIST.length}
          onIndexChange={handleDoctorChange}
        >
          {DOCTOR_LIST.map((item, index) => (
            <Swiper.Item key={index} onClick={() => handleDoctorClick(index)}>
              <DoctorCard
                data={item}
                active={selectedDoctor.id === item.id}
                className={classNames({
                  [styles.leftRotate]: item.id < selectedDoctor.id,
                  [styles.rightRotate]: item.id > selectedDoctor.id
                })}
              />
            </Swiper.Item>
          ))}
        </Swiper>
        <Button
          className={styles.communicateButton}
          color="primary"
          onClick={handleCommunicate}
        >
          Communicate
        </Button>
      </div>
    </div>
  )
}
export default DoctorList
