import { useEffect } from 'react'
import { eventEmitter } from '@/utils/events'

export function useEvent(
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventListener: (...args: any[]) => void
) {
  useEffect(() => {
    eventEmitter.on(eventName, eventListener)
    return () => {
      eventEmitter.off(eventName, eventListener)
    }
  }, [eventListener, eventName])
}
