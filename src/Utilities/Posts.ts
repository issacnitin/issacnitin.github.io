export interface IPost {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  excerpt: string;
  readingMinutes: number;
  content: string;
}

export function parsePost(slug: string, content: string): IPost {
  const document = new DOMParser().parseFromString(content, 'text/html');
  const heading = document.querySelector('h1');
  const time = document.querySelector('time');
  const paragraph = document.querySelector('p');
  const title = heading && heading.textContent;
  if (!title || !title.trim()) {
    throw new Error('Post has no title: ' + slug);
  }
  const text = (document.body.textContent || '').trim();
  const excerpt = ((paragraph && paragraph.textContent) || '').replace(/\s+/g, ' ').trim();
  return {
    slug,
    title: title.trim(),
    date: (time && time.getAttribute('datetime')) || '',
    dateLabel: (time && time.textContent) || 'From the notebook',
    excerpt: excerpt.length > 200 ? excerpt.slice(0, 197).replace(/\s+\S*$/, '') + '...' : excerpt,
    readingMinutes: Math.max(1, Math.ceil(text.split(/\s+/).length / 200)),
    content
  };
}

function getText(path: string): Promise<string> {
  return fetch(process.env.PUBLIC_URL + path)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error('Request failed (' + response.status + '): ' + path);
      }
      return response.text();
    });
}

export function getPost(slug: string): Promise<IPost> {
  return getText('/posts/' + encodeURIComponent(slug))
    .then(content => parsePost(slug, content));
}

export function getPosts(): Promise<IPost[]> {
  return getText('/posts/postorder')
    .then(order => {
      const slugs = order.split(/\r?\n/).map(slug => slug.trim()).filter(Boolean);
      return Promise.all(slugs.map(getPost));
    });
}
