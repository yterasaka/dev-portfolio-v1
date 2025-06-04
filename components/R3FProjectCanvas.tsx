'use client'

import {state} from '@/lib/state'
import type {ShowcaseProject} from '@/types'
import {Canvas} from '@react-three/fiber'
import {Suspense, useEffect, useState} from 'react'
import ProjectItems from './ProjectItems'

interface R3FProjectCanvasProps {
  showcaseProjects: ShowcaseProject[]
}

export default function R3FProjectCanvas({showcaseProjects}: R3FProjectCanvasProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">Loading 3D Canvas...</div>
    )
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full">
      {/* <div className="h-screen w-full"> */}
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
          <color attach="background" args={['#ececec']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ProjectItems projects={showcaseProjects} />
        </Canvas>
      </Suspense>
    </div>
  )
}
