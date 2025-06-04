import type {ShowcaseProject} from '@/types'
import {proxy} from 'valtio'

export const state = proxy({
  clicked: null as number | null,
  projects: [] as ShowcaseProject[],
})
