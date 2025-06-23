import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import type {SettingsQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, stegaClean} from 'next-sanity'
import Link from 'next/link'

interface NavbarProps {
  data: SettingsQueryResult
}
export function Navbar(props: NavbarProps) {
  const {data} = props
  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  console.log('Navbar data', data)

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-5 py-4 uppercase font-bold h-[64px]"
      data-sanity={dataAttribute?.('menuItems')}
    >
      <Link href="/" className="flex-1" data-sanity={dataAttribute?.('title')}>
        {data?.headerTitle}
      </Link>
      <div className="flex-1 text-right">
        <OptimisticSortOrder id={data?._id!} path="menuItems">
          {data?.menuItems?.map((menuItem) => {
            const href = resolveHref(menuItem?._type, menuItem?.slug)
            if (!href) {
              return null
            }
            return (
              <Link
                key={menuItem._key}
                className=""
                data-sanity={dataAttribute?.([
                  'menuItems',
                  {_key: menuItem._key as unknown as string},
                ])}
                href={href}
              >
                {stegaClean(menuItem.title)}
              </Link>
            )
          })}
        </OptimisticSortOrder>
      </div>
    </header>
  )
}
