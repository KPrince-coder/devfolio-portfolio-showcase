
export type SharePlatform = 'copy' | 'twitter' | 'facebook' | 'linkedin' | 'whatsapp';

interface ShareConfig {
  url: string;
  text: string;
  platform: SharePlatform;
  onSuccess?: () => void;
}

const SHARE_URLS = {
  twitter: 'https://twitter.com/intent/tweet',
  facebook: 'https://www.facebook.com/sharer/sharer.php',
  linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
  whatsapp: 'https://api.whatsapp.com/send',
} as const;

export async function shareContent({ url, text, platform, onSuccess }: ShareConfig): Promise<void> {
  try {
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      onSuccess?.();
      return;
    }

    const shareUrl = new URL(SHARE_URLS[platform]);
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    switch (platform) {
      case 'twitter':
        shareUrl.searchParams.set('text', text);
        shareUrl.searchParams.set('url', encodedUrl);
        break;
      case 'facebook':
        shareUrl.searchParams.set('u', encodedUrl);
        break;
      case 'linkedin':
        // LinkedIn requires specific parameters for better preview
        window.open(
          `${SHARE_URLS.linkedin}?url=${encodedUrl}&title=${encodedText}`,
          'share',
          'width=550,height=400,toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1'
        );
        onSuccess?.();
        return;
      case 'whatsapp':
        const whatsappUrl = isMobile ? 'whatsapp://send' : SHARE_URLS.whatsapp;
        const shareText = `${text}\n\n${url}`;
        window.open(
          `${whatsappUrl}?text=${encodeURIComponent(shareText)}`,
          'share',
          isMobile ? undefined : 'width=550,height=400,toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1'
        );
        onSuccess?.();
        return;
    }

    // Open share dialog in a centered popup window
    const width = 550;
    const height = 400;
    const left = Math.round((window.screen.width / 2) - (width / 2));
    const top = Math.round((window.screen.height / 2) - (height / 2));

    window.open(
      shareUrl.toString(),
      'share',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    onSuccess?.();
  } catch (error) {
    console.error('Error sharing content:', error);
  }
}
