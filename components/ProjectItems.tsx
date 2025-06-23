'use client'

import {state} from '@/lib/state'
import {urlForImage} from '@/sanity/lib/utils'
import type {ShowcaseProject} from '@/types'
import {Html, Image, Scroll, ScrollControls, useScroll} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {easing} from 'maath'
import {useRef, useState} from 'react'
import * as THREE from 'three'
import {useSnapshot} from 'valtio'

function BackButton() {
  const {height} = useThree((state) => state.viewport)
  const {clicked} = useSnapshot(state)

  // クリックされていない場合は表示しない
  if (clicked === null) {
    return null
  }

  const handleBack = () => {
    state.clicked = null
  }

  return (
    <Html
      position={[0, -height / 2 + 0.6, 0]} // ミニマップと同じ位置
      center
      style={{
        pointerEvents: 'auto',
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleBack}
        style={{
          padding: '8px 16px',
          backgroundColor: '#333',
          color: '#aaaaaa',
          // color: '#ececec',
          border: '1px solid #555',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#555'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#333'
        }}
      >
        ← Back
      </button>
    </Html>
  )
}

function Minimap() {
  const ref = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const {projects, clicked} = useSnapshot(state)
  const {height} = useThree((state) => state.viewport)

  useFrame((state, delta) => {
    if (!ref.current) return

    ref.current.children.forEach((child, index) => {
      const y = scroll.curve(index / projects.length - 1.5 / projects.length, 4 / projects.length)
      easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta)

      // クリック時にミニマップの色をバックグラウンドと同じ色に変更
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        // バックグラウンドの色（通常は黒系）に変更
        easing.dampC(
          child.material.color,
          clicked !== null ? '#1a1a1a' : '#aaaaaa', // バックグラウンドの色を指定
          0.1,
          delta,
        )
      }
    })
  })

  return (
    <group ref={ref}>
      {projects.map((_, i) => (
        <mesh key={i} position={[i * 0.06 - projects.length * 0.03, -height / 2 + 0.6, 0]}>
          <boxGeometry args={[0.01, 1, 0.01]} />
          <meshBasicMaterial color={'#aaaaaa'} />
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
    // 拡大表示中は何もしない（戻るボタンのみで戻る）
    if (clicked !== null) {
      return
    }
    state.clicked = index === clicked ? null : index
  }
  const over = () => {
    // クリックされたアイテム以外がクリックされている場合はhoverしない
    if (clicked !== null && clicked !== index) {
      return
    }
    hover(true)
  }
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
      [clicked === index ? 4.7 : scale[0], clicked === index ? 3.5 : 1.5 + y, 1],
      0.15,
      delta,
    )

    // スクロール位置を考慮して画面中央に配置
    const scrollOffset = scroll.offset * (scroll.pages - 1) * state.viewport.width

    if (clicked === index) {
      // // スクロール位置を考慮して画面中央に配置
      easing.damp(ref.current.position, 'x', scrollOffset, 0.15, delta)
    } else if (clicked !== null) {
      if (index < clicked) {
        easing.damp(ref.current.position, 'x', scrollOffset - 3, 0.15, delta)
      }
      if (index > clicked) {
        easing.damp(ref.current.position, 'x', scrollOffset + 3, 0.15, delta)
      }
    } else {
      // 何もクリックされていない時は元の位置に戻る
      easing.damp(ref.current.position, 'x', position[0], 0.15, delta)
    }

    // マテリアルアニメーション
    if (ref.current.material) {
      // scale.set()メソッドを使用して修正
      if (ref.current.material.scale && ref.current.material.scale.set) {
        ref.current.material.scale.set(ref.current.scale.x, ref.current.scale.y)
      }

      // クリックされた項目のみカラー、それ以外は常にグレースケール
      easing.damp(ref.current.material, 'grayscale', clicked === index ? 0 : 1, 0.15, delta)

      easing.dampC(ref.current.material.color, clicked === index ? 'white' : '#aaa', 0.15, delta)

      // 透明度アニメーション（クリックされた項目以外を薄くする）
      easing.damp(
        ref.current.material,
        'opacity',
        clicked !== null && clicked !== index ? 0 : 1,
        0.15,
        delta,
      )

      // マテリアルの透明度を有効にする
      ref.current.material.transparent = true
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
  const {clicked} = useSnapshot(state)
  const xW = w + gap
  const pages = (width - xW + projects.length * xW) / width

  // 状態を更新
  state.projects = projects
  console.log('pages', pages)

  // 背景クリックを無効にするための透明な平面
  const BackgroundBlocker = () => {
    if (clicked === null) return null

    return (
      <mesh
        position={[0, 0, -1]}
        scale={[1000, 1000, 1]}
        onClick={(e) => {
          e.stopPropagation() // イベントの伝播を停止
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    )
  }

  return (
    <ScrollControls
      horizontal
      damping={0.1}
      pages={pages}
      enabled={clicked === null}
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
        pointerEvents: clicked !== null ? 'none' : 'auto',
      }}
    >
      <Minimap />
      <BackButton /> {/* 戻るボタンを追加 */}
      <Scroll>
        {projects.map((project, i) => (
          <ProjectItem
            key={project._id || `project-${i}`}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[w, 2, 1]}
            project={project}
          />
        ))}
      </Scroll>
    </ScrollControls>
  )
}
