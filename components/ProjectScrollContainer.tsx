'use client'

import {ProjectListItem} from '@/components/ProjectListItem'
import {useDragScroll} from '@/hooks/useDragScroll'
import {resolveHref} from '@/sanity/lib/utils'
import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'

interface ProjectWithDataAttribute {
  _key: string
  _type: string
  slug?: any
  dataAttributeValue?: string
  [key: string]: any
}

interface ProjectScrollContainerProps {
  showcaseProjects: ProjectWithDataAttribute[]
}

export function ProjectScrollContainer({showcaseProjects}: ProjectScrollContainerProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const {scrollRef, isDragging} = useDragScroll({disabled: isMobile})

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isDragging && !isMobile) {
      e.preventDefault()
      return false
    }
  }

  return (
    <div id="scrollarea" className="w-full relative">
      <div
        ref={scrollRef}
        className={`
          flex gap-1 pb-4 scrollbar-hide select-none relative
          ${
            isMobile
              ? 'flex-col overflow-visible'
              : 'overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing'
          }
        `}
      >
        {showcaseProjects &&
          showcaseProjects.length > 0 &&
          showcaseProjects.map((project) => {
            const href = resolveHref(project?._type, project?.slug)
            if (!href) {
              return null
            }
            return (
              <Link
                className={`
                  scroll-item
                  ${
                    isMobile
                      ? 'w-full mb-4'
                      : 'flex-shrink-0 w-[400px] md:w-[500px] lg:w-[600px] active:cursor-grabbing'
                  }
                `}
                key={project._key}
                href={href}
                data-sanity={project.dataAttributeValue}
                onClick={handleLinkClick}
              >
                <ProjectListItem project={project as any} />
              </Link>
            )
          })}
      </div>
    </div>
  )
}
