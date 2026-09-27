import {
  useEffect,
} from 'react'

type LoadFunction = () =>
  void | Promise<unknown>

export function useInitialLoad(
  load: LoadFunction,
) {
  useEffect(() => {
    const timeout =
      window.setTimeout(() => {
        void load()
      }, 0)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [load])
}
