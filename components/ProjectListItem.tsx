import ImageBox from '@/components/ImageBox'
import type {ShowcaseProject} from '@/types'
import React from 'react'

interface ProjectProps {
  project: ShowcaseProject
}

export function ProjectListItem(props: ProjectProps) {
  const {project} = props

  console.log('project test', project)

  return (
    <>
      <div className="w-auto px-[16px] mx-auto flex gap-5">
        <ImageBox
          image={project.coverImage}
          alt={`Cover image from ${project.title}`}
          classesWrapper="relative aspect-[16/10] grayscale flex-1"
        />
        <div className="flex-1 text-base uppercase font-bold">
          <div>{project.title}</div>
          <div>{project.year}</div>
        </div>
      </div>
    </>
  )
}
