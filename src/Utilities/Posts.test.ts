import { getPost, getPosts, parsePost } from './Posts';

const content = '<h1>A story &amp; an idea</h1><time datetime="2020-08-02">August 2, 2020</time><p>A short introduction.</p>';

it('extracts post metadata from the existing HTML format', () => {
  const post = parsePost('a_story', content);
  expect(post.title).toBe('A story & an idea');
  expect(post.date).toBe('2020-08-02');
  expect(post.dateLabel).toBe('August 2, 2020');
  expect(post.excerpt).toBe('A short introduction.');
  expect(post.readingMinutes).toBe(1);
  expect(post.content).toBe(content);
});

it('limits summaries and estimates reading time for longer articles', () => {
  const post = parsePost('long_story', '<h1>Long story</h1><p>' + 'word '.repeat(500) + '</p>');
  expect(post.excerpt.length).toBeLessThanOrEqual(200);
  expect(post.excerpt.slice(-3)).toBe('...');
  expect(post.readingMinutes).toBe(3);
});

it('rejects responses that are not a post', () => {
  expect(() => parsePost('missing', '<html><body>Not found</body></html>')).toThrow('Post has no title');
});

it('loads every post in manifest order, including CRLF and blank lines', async () => {
  const fetchMock = jest.spyOn(window, 'fetch').mockImplementation((url: string) => {
    return Promise.resolve(new Response(url.indexOf('postorder') !== -1 ? 'first\r\n\r\nsecond\r\n' : content));
  });
  const posts = await getPosts();
  expect(posts.map(post => post.slug)).toEqual(['first', 'second']);
  expect(fetchMock).toHaveBeenCalledTimes(3);
  fetchMock.mockRestore();
});

it('rejects an HTTP failure rather than rendering an error page as an article', async () => {
  const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
    return Promise.resolve(new Response('Not found', { status: 404 }));
  });
  await expect(getPost('missing')).rejects.toEqual(new Error('Request failed (404): /posts/missing'));
  fetchMock.mockRestore();
});
