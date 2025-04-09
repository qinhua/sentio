import React, { useEffect } from 'react'
import { Button, CenterPopup, PopupProps } from 'antd-mobile'
import { CloseCircleFill } from 'antd-mobile-icons'
import styles from './index.module.scss'
import classNames from 'classnames'

interface IDialogProps {
  className?: string
  title?: string
  width?: string
  minHeight?: string
  noPadding?: boolean
  showClose?: boolean
  showConfirm?: boolean
  showCancel?: boolean
  closeOnMaskClick?: boolean
  confirmText?: string
  cancelText?: string
  visible: boolean
  children?: React.ReactNode
  titleRight?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

const IDialog: React.FC<IDialogProps> = ({
  className,
  title,
  width = 'auto',
  minHeight = 'auto',
  noPadding = false,
  showClose = true,
  showConfirm = true,
  showCancel = true,
  closeOnMaskClick = true,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  visible,
  children,
  titleRight,
  onConfirm,
  onCancel,
  onClose
}) => {
  const handleOpen = () => {
    document.body.classList.add('disable-scroll')
  }

  const handleConfirm = () => {
    document.body.classList.remove('disable-scroll')
    onConfirm?.()
  }

  const handleCancel = () => {
    document.body.classList.remove('disable-scroll')
    onCancel?.()
    onClose?.()
  }

  const handleClose = () => {
    if (!closeOnMaskClick) return
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
    <CenterPopup
      className={classNames(styles.iDialog, className)}
      visible={visible}
      onMaskClick={handleClose}
      afterShow={handleOpen}
      onClose={onClose}
      bodyStyle={{ width, minHeight }}
    >
      {(title || showClose) && (
        <div className="i-dialog-header">
          {title && (
            <div className="title-wrapper">
              <span className="dialog-title">{title}</span>
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

      <div className={`i-dialog-content ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>

      {(showConfirm || showCancel) && (
        <div className="i-dialog-footer">
          {showCancel && (
            <Button
              fill="outline"
              className="btn-cancel"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
          )}
          {showConfirm && (
            <Button
              className="btn-confirm"
              color="primary"
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          )}
        </div>
      )}
    </CenterPopup>
  )
}

export default IDialog
