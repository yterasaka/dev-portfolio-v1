import ImageBox from '@/components/ImageBox'
import type {ShowcaseProject} from '@/types'
import React from 'react'

interface ProjectProps {
  project: ShowcaseProject
}

export function ProjectListItem(props: ProjectProps) {
  const {project} = props

  return (
    <>
      <div className="w-auto px-6 mx-auto">
        <ImageBox
          image={project.coverImage}
          alt={`Cover image from ${project.title}`}
          classesWrapper="relative aspect-[16/10] grayscale "
        />
      </div>
    </>
  )
}
