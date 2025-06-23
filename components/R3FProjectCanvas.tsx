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

      {/* 3D空間の外に配置された戻るボタン */}
      {clicked !== null && (
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              color: '#aaaaaa',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
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
