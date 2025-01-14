interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

export const generateTableOfContents = (content: string): TocItem[] => {
  const headings = content.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/g) || [];
  const toc: TocItem[] = [];

  headings.forEach((heading) => {
    const level = parseInt(heading.match(/<h([2-6])/)?.[1] || '2');
    const title = heading.replace(/<[^>]*>/g, '').trim();
    const id = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const tocItem: TocItem = { id, title, level };

    if (level === 2) {
      toc.push(tocItem);
    } else {
      const lastH2 = toc[toc.length - 1];
      if (lastH2) {
        if (!lastH2.children) lastH2.children = [];
        lastH2.children.push(tocItem);
      }
    }
  });

  return toc;
};

export const injectHeadingIds = (content: string): string => {
  return content.replace(
    /<h([2-6])(.*?)>(.*?)<\/h[2-6]>/g,
    (match, level, attrs, title) => {
      const id = title.toLowerCase()
        .replace(/<[^>]*>/g, '')
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return `<h${level}${attrs || ''} id="${id}">${title}</h${level}>`;
    }
  );
};
