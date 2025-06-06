import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import {ProjectScrollContainer} from '@/components/ProjectScrollContainer'
import type {HomePageQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import type {ShowcaseProject} from '@/types'
import {createDataAttribute} from 'next-sanity'

export interface HomePageProps {
  data: HomePageQueryResult | null
}

export async function HomePage({data}: HomePageProps) {
  const {overview = [], showcaseProjects = [], title = ''} = data ?? {}

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  const projectsWithDataAttributes: ShowcaseProject[] =
    showcaseProjects?.map(
      (project) =>
        ({
          ...project,
        }) as unknown as ShowcaseProject,
    ) || []

  return (
    <div className="flex items-center min-h-[calc(100vh-theme(spacing.16))]">
      {/* Showcase projects */}
      <div className="flex overflow-x-auto overflow-y-hidden gap-1 scrollbar-hide select-none w-full">
        {/* <div className="flex overflow-x-auto overflow-y-hidden gap-1 pb-4 scroll-smooth scrollbar-hide select-none w-full"> */}
        <OptimisticSortOrder id={data?._id} path={'showcaseProjects'}>
          <ProjectScrollContainer showcaseProjects={projectsWithDataAttributes} />
        </OptimisticSortOrder>
      </div>
    </div>
  )
}
