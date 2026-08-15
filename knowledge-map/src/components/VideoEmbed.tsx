interface VideoEmbedProps {
  url?: string;
  title?: string;
}

/**
 * Whitelisted MDX component for `video` elements: embeds `videoUrl` in an
 * iframe so the learner watches without leaving the map.
 */
export function VideoEmbed({ url, title }: VideoEmbedProps) {
  if (!url) return null;
  return (
    <div className="video-embed" data-testid="video-embed">
      <iframe
        src={url}
        title={title ?? "video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="video-embed-frame"
      />
    </div>
  );
}
