'use client'

import {state} from '@/lib/state'
import type {ShowcaseProject} from '@/types'
import {Canvas} from '@react-three/fiber'
import {Suspense, useEffect, useState} from 'react'
import {MdOutlineArrowBack, MdOutlineArrowDownward} from 'react-icons/md'
import {useSnapshot} from 'valtio'
import ProjectItems from './ProjectItems'

interface R3FProjectCanvasProps {
  showcaseProjects: ShowcaseProject[]
}

export default function R3FProjectCanvas({showcaseProjects}: R3FProjectCanvasProps) {
  const [isClient, setIsClient] = useState(false)
  const {clicked} = useSnapshot(state)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleBack = () => {
    state.clicked = null
  }

  // クリックされたプロジェクトの情報を取得
  const selectedProject = clicked !== null ? showcaseProjects[clicked] : null
  console.log('Selected Project:', selectedProject)

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">Loading 3D Canvas...</div>
    )
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full">
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center">
            Loading 3D Scene...
          </div>
        }
      >
        <Canvas
          gl={{preserveDrawingBuffer: true, antialias: false}}
          onPointerMissed={() => (state.clicked = null)}
          camera={{position: [0, 0, 5]}}
        >
          <color attach="background" args={['#1A1A1A']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ProjectItems projects={showcaseProjects} />
        </Canvas>
      </Suspense>

      {/* プロジェクト情報表示 */}
      {selectedProject && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none text-center max-w-[600px] px-5">
          <h2 className="text-gray-400 text-3xl font-bold mb-4">{selectedProject.title}</h2>
          <p>
            {selectedProject.year} | {selectedProject.type} | {selectedProject.role}
          </p>
        </div>
      )}

      {/* 3D空間の外に配置された戻るボタン */}
      {clicked !== null && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-400 rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-700"
          >
            <div className="flex items-center gap-2">
              <MdOutlineArrowBack />
              Back
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
