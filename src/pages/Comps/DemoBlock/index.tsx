import type { FC, ReactNode } from 'react'
import styles from './index.module.scss'

interface Props {
  title: string
  marginBottom?: string
  padding?: string
  background?: string
  children?: ReactNode
}

export const DemoBlock = ({
  title,
  marginBottom = '12px',
  padding = '12px 12px',
  background = 'var(--adm-color-background)',
  children
}: Props) => {
  return (
    <div className={styles.demoBlock} style={{ marginBottom }}>
      <div className={styles.title}>{title}</div>
      <div
        className={styles.main}
        style={{
          padding,
          background
        }}
      >
        {children}
      </div>
    </div>
  )
}
