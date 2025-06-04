'use client'

import {state} from '@/lib/state'
import {urlForImage} from '@/sanity/lib/utils'
import type {ShowcaseProject} from '@/types'
import {Image, Scroll, ScrollControls, useScroll} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {easing} from 'maath'
import {useRef, useState} from 'react'
import * as THREE from 'three'
import {useSnapshot} from 'valtio'

function Minimap() {
  const ref = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const {projects} = useSnapshot(state)
  const {height} = useThree((state) => state.viewport)

  useFrame((state, delta) => {
    if (!ref.current) return

    ref.current.children.forEach((child, index) => {
      const y = scroll.curve(index / projects.length - 1.5 / projects.length, 4 / projects.length)
      easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta)
    })
  })

  return (
    <group ref={ref}>
      {projects.map((_, i) => (
        <mesh key={i} position={[i * 0.06 - projects.length * 0.03, -height / 2 + 0.6, 0]}>
          <boxGeometry args={[0.01, 1, 0.01]} />
          <meshBasicMaterial color={'#262523'} />
        </mesh>
      ))}
    </group>
  )
}

interface ProjectItemProps {
  scale: [number, number, number]
  position: [number, number, number]
  index: number
  project: ShowcaseProject
  c?: THREE.Color
}

function ProjectItem({
  scale,
  position,
  index,
  project,
  c = new THREE.Color(),
  ...props
}: ProjectItemProps) {
  const ref = useRef<any>(null!)
  const {clicked, projects} = useSnapshot(state)
  const [hovered, hover] = useState(false)

  const click = () => {
    state.clicked = index === clicked ? null : index
  }
  const over = () => hover(true)
  const out = () => hover(false)

  const scroll = useScroll()

  // プロジェクト画像のURL生成 - より堅牢なフォールバック
  const getImageUrl = () => {
    if (project?.coverImage) {
      try {
        const url = urlForImage(project.coverImage)?.width(800).height(600).url()
        return url || 'https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Project'
      } catch (error) {
        console.warn('Error generating image URL:', error)
        return 'https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Project'
      }
    }
    return 'https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Project'
  }

  const imageUrl = getImageUrl()

  useFrame((state, delta) => {
    if (!ref.current) return

    const y = scroll.curve(index / projects.length - 1.5 / projects.length, 4 / projects.length)

    // スケールアニメーション（クリック時に拡大）
    easing.damp3(
      ref.current.scale,
      [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
      0.15,
      delta,
    )

    // 位置アニメーション（クリック時に他のアイテムを移動）
    if (clicked !== null && index < clicked) {
      easing.damp(ref.current.position, 'x', position[0] - 2, 0.15, delta)
    }
    if (clicked !== null && index > clicked) {
      easing.damp(ref.current.position, 'x', position[0] + 2, 0.15, delta)
    }
    if (clicked === null || clicked === index) {
      easing.damp(ref.current.position, 'x', position[0], 0.15, delta)
    }

    // マテリアルアニメーション
    if (ref.current.material) {
      // scale.set()メソッドを使用して修正
      if (ref.current.material.scale && ref.current.material.scale.set) {
        ref.current.material.scale.set(ref.current.scale.x, ref.current.scale.y)
      }

      easing.damp(
        ref.current.material,
        'grayscale',
        hovered || clicked === index ? 0 : Math.max(0, 1 - y),
        0.15,
        delta,
      )

      easing.dampC(
        ref.current.material.color,
        hovered || clicked === index ? 'white' : '#aaa',
        hovered ? 0.3 : 0.15,
        delta,
      )
    }
  })

  return (
    <Image
      ref={ref}
      {...props}
      position={position}
      scale={[scale[0], scale[1]]} // 2D scaleに変更
      url={imageUrl} // 確実にstringになる
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  )
}

interface ProjectItemsProps {
  projects: ShowcaseProject[]
  w?: number
  gap?: number
}

export default function ProjectItems({projects, w = 0.7, gap = 0.15}: ProjectItemsProps) {
  const {width} = useThree((state) => state.viewport)
  const xW = w + gap

  // 状態を更新
  state.projects = projects

  return (
    <ScrollControls
      horizontal
      damping={0.1}
      style={{overflow: 'hidden'}}
      pages={(width - xW + projects.length * xW) / width}
    >
      <Minimap />
      <Scroll>
        {projects.map((project, i) => (
          <ProjectItem
            key={project._id || `project-${i}`}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[w, 4, 1]}
            project={project}
          />
        ))}
      </Scroll>
    </ScrollControls>
  )
}
