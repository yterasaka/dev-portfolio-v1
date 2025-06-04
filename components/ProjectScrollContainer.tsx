'use client'

import {ProjectListItem} from '@/components/ProjectListItem'
// import {useDragScroll} from '@/hooks/useDragScroll'
import {resolveHref} from '@/sanity/lib/utils'
import type {ShowcaseProject} from '@/types'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {useEffect, useState} from 'react'

// R3Fコンポーネントを動的インポート（SSR無効）
const R3FProjectCanvas = dynamic(() => import('./R3FProjectCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center">Loading 3D...</div>
  ),
})

interface ProjectScrollContainerProps {
  showcaseProjects: ShowcaseProject[]
}

export function ProjectScrollContainer({showcaseProjects}: ProjectScrollContainerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [use3D, setUse3D] = useState(false) // Default to 2D to prevent hydration issues
  const [isClient, setIsClient] = useState(false)

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // const {scrollRef, isDragging} = useDragScroll({disabled: isMobile})

  // Debug logging
  console.log('ProjectScrollContainer:', {
    showcaseProjects: showcaseProjects?.length,
    use3D,
    isClient,
    isMobile,
    sampleProject: showcaseProjects?.[0], // Log first project for inspection
  })

  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 3Dモードの切り替えボタン（オプション）
  const toggle3D = () => setUse3D(!use3D)

  // const handleLinkClick = (e: React.MouseEvent) => {
  //   if (isDragging && !isMobile) {
  //     e.preventDefault()
  //     return false
  //   }
  // }

  // クライアントサイドでない場合は2Dモードで表示
  if (!isClient || isMobile) {
    // if (!isClient || isMobile || !use3D) {
    return (
      <div className="w-full relative">
        {/* <div className="mb-4 flex justify-center">
          <button
            onClick={toggle3D}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold"
          >
            {use3D ? '🎮 Switch to 2D View' : '🌟 Switch to 3D View'}
          </button>
        </div> */}

        <div
          // ref={scrollRef}
          className={`
            flex gap-1 pb-4 scrollbar-hide select-none relative
            ${
              isMobile
                ? 'flex-col overflow-visible'
                : 'overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing'
            }
          `}
        >
          {showcaseProjects.map((project, index) => {
            const href = resolveHref(project?._type, project?.slug)
            if (!href) return null

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
                key={project._id}
                href={href}
                data-sanity={project._id}
                // onClick={handleLinkClick}
              >
                <ProjectListItem project={project as any} />
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  // 3Dモードの場合はR3Fキャンバス
  return (
    <div className="w-full relative">
      {/* <div className="absolute top-4 left-4 z-10">
        <button
          onClick={toggle3D}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold backdrop-blur-sm bg-opacity-90"
        >
          🎮 Switch to 2D View
        </button>
      </div> */}
      <R3FProjectCanvas showcaseProjects={showcaseProjects} />
    </div>
  )
}
