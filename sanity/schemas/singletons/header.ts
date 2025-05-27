import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subTitle',
      title: 'Sub Title',
      type: 'string',
    }),
    defineField({
      name: 'menuItems',
      title: 'Navigation Menu',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link To',
              type: 'reference',
              to: [{type: 'home'}, {type: 'page'}, {type: 'project'}],
            }),
            defineField({
              name: 'externalLink',
              title: 'External Links',
              type: 'url',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        subtitle: 'Header',
        title,
      }
    },
  },
})
