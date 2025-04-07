import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { EnumTheme } from '@/enum/common'

interface INavbarAtom {
  show: boolean
  title: string
  right?: React.ReactNode
  onBack?: () => void
}

export const themeAtom = atomWithStorage<EnumTheme>('theme', EnumTheme.LIGHT)

export const navbarAtom = atom<INavbarAtom>({
  show: false,
  title: 'Goodex',
  onBack: () => {
    history.back()
  }
})
