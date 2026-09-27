import {
  useEffect,
} from 'react'

type LoadFunction = () =>
  void | Promise<unknown>

export function useInitialLoad(
  load: LoadFunction,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const timeout =
      window.setTimeout(() => {
        void load()
      }, 0)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [enabled, load])
}
