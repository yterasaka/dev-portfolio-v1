import {defineQuery} from 'next-sanity'

export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    _id,
    _type,
    overview,
    showcaseProjects[]{
      _key,
      ...@->{
        _id,
        _type,
        coverImage,
        overview,
        "slug": slug.current,
        tags,
        title,
      }
    },
    title,
  }
`)

export const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    overview,
    title,
    "slug": slug.current,
    contentSections[]{
      _key,
      sectionTitle,
      content
    }
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    client,
    coverImage,
    description,
    duration,
    overview,
    role,
    site,
    "slug": slug.current,
    tags,
    title,
    type
  }
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    footer,
    headerTitle,
    headerSubTitle,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": slug.current,
        title
      }
    },
    ogImage,
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{"slug": slug.current}
`)
