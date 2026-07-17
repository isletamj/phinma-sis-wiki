import type { FC } from 'react'

/**
 * Embeds an unlisted YouTube video. Video bytes come from YouTube, never
 * from our own hosting, which keeps bandwidth cost at zero.
 */
export const YouTube: FC<{ id: string; title?: string }> = ({
  id,
  title = 'YouTube video'
}) => (
  <div className="my-4 aspect-video w-full overflow-hidden rounded-lg">
    <iframe
      className="h-full w-full"
      src={`https://www.youtube-nocookie.com/embed/${id}`}
      title={title}
      loading="lazy"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
)
