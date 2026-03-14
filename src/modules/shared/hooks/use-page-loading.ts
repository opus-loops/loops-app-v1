import { useEffect, useState } from "react"

export function usePageLoading(): boolean {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsLoading(false)
      return
    }

    const handleLoad = () => {
      if (document.readyState === "complete") {
        setIsLoading(false)
      }
    }

    window.addEventListener("load", handleLoad)
    document.addEventListener("readystatechange", handleLoad)

    return () => {
      window.removeEventListener("load", handleLoad)
      document.removeEventListener("readystatechange", handleLoad)
    }
  }, [])

  return isLoading
}
