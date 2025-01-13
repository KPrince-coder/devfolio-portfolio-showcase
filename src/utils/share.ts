export type SharePlatform = 'copy' | 'twitter' | 'facebook' | 'linkedin';

export const shareContent = async (
  url: string,
  title: string,
  platform: SharePlatform,
  onSuccess?: () => void
) => {
  switch (platform) {
    case 'copy':
      await navigator.clipboard.writeText(url);
      onSuccess?.();
      break;
    case 'twitter':
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        '_blank'
      );
      break;
    case 'facebook':
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank'
      );
      break;
    case 'linkedin':
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        '_blank'
      );
      break;
  }
};
