import {client} from '@/sanity/lib/client'
import {urlForImage} from '@/sanity/lib/utils'
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image'

interface ImageBoxProps {
  'image'?: {asset?: any}
  'alt'?: string
  'width'?: number
  'height'?: number
  'size'?: string
  'classesWrapper'?: string
  'data-sanity'?: string
  'grayscale'?: boolean
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  width = 1920,
  height = 1080,
  size = '100vw',
  classesWrapper,
  grayscale = false,
  ...props
}: ImageBoxProps) {
  const builder = imageUrlBuilder(client)
  const imageUrl = image && urlForImage(image)?.height(height).width(width).fit('crop').url()
  const grayscaleImageUrl =
    image && grayscale
      ? builder
          .image(image)
          .height(height)
          .width(width)
          .fit('crop')
          .saturation(-100)
          .auto('format')
          .url()
      : null

  const finalImageUrl = grayscaleImageUrl || imageUrl

  return (
    <div
      className={`w-full overflow-hidden rounded-[3px] bg-gray-50 ${classesWrapper}`}
      data-sanity={props['data-sanity']}
    >
      {finalImageUrl && (
        <Image
          className="absolute h-full w-full"
          alt={alt}
          width={width}
          height={height}
          sizes={size}
          src={finalImageUrl}
        />
      )}
    </div>
  )
}
