import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { EnumTheme } from '@/enum/common'

interface INavbarAtom {
  show: boolean
  title: string
  left?: string | React.ReactNode
  right?: string | React.ReactNode
  onBack?: () => void
}

export const themeAtom = atomWithStorage<EnumTheme>('theme', EnumTheme.LIGHT)

export const navbarAtom = atom<INavbarAtom>({
  show: false,
  title: 'Sentio',
  onBack: () => {
    history.back()
  }
})
