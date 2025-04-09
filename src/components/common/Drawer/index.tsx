import React, { useEffect } from 'react'
import { Popup, Button } from 'antd-mobile'
import { CloseCircleFill } from 'antd-mobile-icons'
import styles from './index.module.scss'
import classNames from 'classnames'

interface IDrawerProps {
  className?: string
  title?: string
  minHeight?: string
  noPadding?: boolean
  showClose?: boolean
  showConfirm?: boolean
  confirmText?: string
  visible: boolean
  children?: React.ReactNode
  titleRight?: React.ReactNode
  onConfirm?: () => void
  onClose?: () => void
}

const IDrawer: React.FC<IDrawerProps> = ({
  className,
  title,
  minHeight = '30vh',
  noPadding = false,
  showClose = true,
  showConfirm = false,
  confirmText = 'Confirm',
  visible,
  children,
  titleRight,
  onConfirm,
  onClose
}) => {
  // const prevBgColorRef = useRef('')

  const handleOpen = () => {
    document.body.classList.add('disable-scroll')
  }

  const handleConfirm = () => {
    document.body.classList.remove('disable-scroll')
    onConfirm?.()
  }

  const handleClose = () => {
    document.body.classList.remove('disable-scroll')
    onClose?.()
  }

  useEffect(() => {
    const handleScroll = (e: Event) => {
      console.log('scroll', e)
    }

    document.body.addEventListener('scroll', handleScroll)

    return () => {
      document.body.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('disable-scroll')
    }
  }, [])

  return (
    <Popup
      className={classNames(styles.iDrawer, className)}
      visible={visible}
      position="bottom"
      onMaskClick={handleClose}
      afterShow={handleOpen}
      onClose={onClose}
      bodyStyle={{ minHeight }}
    >
      {(title || showClose) && (
        <div className="i-drawer-header">
          {title && (
            <div className="title-wrapper">
              <span className="drawer-title">{title}</span>
              {titleRight}
            </div>
          )}
          {showClose && (
            <Button className="btn-close" fill="none" onClick={handleClose}>
              <CloseCircleFill />
            </Button>
          )}
        </div>
      )}

      <div className={`i-drawer-content ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>

      {showConfirm && (
        <div className="i-drawer-footer">
          <Button
            className="btn-confirm"
            color="primary"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      )}
    </Popup>
  )
}

export default IDrawer
