'use client'

import {useEffect, useRef, useState} from 'react'

interface UseDragScrollOptions {
  disabled?: boolean
}

export const useDragScroll = (options: UseDragScrollOptions = {}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const {disabled = false} = options

  useEffect(() => {
    const detailswrap = scrollRef.current
    if (!detailswrap || disabled) return

    const draggableElements = detailswrap.querySelectorAll('img, a, .scroll-item')
    draggableElements.forEach((element) => {
      element.setAttribute('draggable', 'false')
      element.addEventListener('dragstart', (e) => e.preventDefault())
    })

    let isDraggingLocal = false
    let startX = 0
    let scrollStartX = 0

    const disableSmoothScroll = () => {
      detailswrap.style.scrollBehavior = 'auto'
    }

    const enableSmoothScroll = () => {
      detailswrap.style.scrollBehavior = 'smooth'
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return

      isDraggingLocal = true
      setIsDragging(true)
      startX = e.pageX
      scrollStartX = detailswrap.scrollLeft

      disableSmoothScroll()
      detailswrap.style.cursor = 'grabbing'
      detailswrap.style.userSelect = 'none'

      draggableElements.forEach((element) => {
        ;(element as HTMLElement).style.pointerEvents = 'none'
      })

      e.preventDefault()
      e.stopPropagation()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingLocal) return

      e.preventDefault()
      e.stopPropagation()

      const deltaX = e.pageX - startX
      const newScrollLeft = scrollStartX - deltaX
      const maxScroll = detailswrap.scrollWidth - detailswrap.clientWidth
      const clampedScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll))

      detailswrap.scrollLeft = clampedScrollLeft
    }

    const handleMouseUp = () => {
      if (isDraggingLocal) {
        isDraggingLocal = false

        enableSmoothScroll()
        detailswrap.style.cursor = 'grab'
        detailswrap.style.userSelect = ''

        draggableElements.forEach((element) => {
          ;(element as HTMLElement).style.pointerEvents = 'auto'
        })

        setTimeout(() => setIsDragging(false), 16)
      }
    }

    const handleMouseLeave = () => {
      if (isDraggingLocal) {
        handleMouseUp()
      }
    }

    detailswrap.addEventListener('mousedown', handleMouseDown, {passive: false})
    document.addEventListener('mousemove', handleMouseMove, {passive: false})
    document.addEventListener('mouseup', handleMouseUp)
    detailswrap.addEventListener('mouseleave', handleMouseLeave)

    detailswrap.style.cursor = 'grab'
    detailswrap.style.scrollBehavior = 'smooth'

    return () => {
      detailswrap.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      detailswrap.removeEventListener('mouseleave', handleMouseLeave)

      draggableElements.forEach((element) => {
        element.removeEventListener('dragstart', (e) => e.preventDefault())
      })
    }
  }, [disabled])

  return {
    scrollRef,
    isDragging,
  }
}
