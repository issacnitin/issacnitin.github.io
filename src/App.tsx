import * as React from 'react';
import { Link } from 'react-router-dom';
import { getPosts, IPost } from './Utilities/Posts';

interface IState {
  posts: IPost[];
  loading: boolean;
  error: boolean;
}

class App extends React.Component<{}, IState> {
  public state: IState = { posts: [], loading: true, error: false };
  private active = false;

  public componentDidMount() {
    this.active = true;
    document.title = 'Nitin Issac Joy | Software & stories';
    this.loadPosts();
  }

  public componentWillUnmount() {
    this.active = false;
  }

  private loadPosts = () => {
    this.setState({ loading: true, error: false });
    getPosts()
      .then(posts => {
        if (this.active) {
          this.setState({ posts, loading: false });
        }
      })
      .catch((error: Error) => {
        console.error('Unable to load posts:', error);
        if (this.active) {
          this.setState({ loading: false, error: true });
        }
      });
  }

  private renderPost(post: IPost, featured: boolean) {
    return (
      <article className={featured ? 'post-card featured-post' : 'post-card'} key={post.slug}>
        <div className="post-meta">
          <time dateTime={post.date}>{post.dateLabel}</time>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3><Link to={'/blog/' + post.slug}>{post.title}</Link></h3>
        <p className="post-excerpt">{post.excerpt}</p>
        <Link className="text-link" to={'/blog/' + post.slug}>
          Read story <span aria-hidden="true">&rarr;</span>
          <span className="sr-only">: {post.title}</span>
        </Link>
      </article>
    );
  }

  public render() {
    const featured = this.state.posts[0];
    return (
      <div className="home-page">
        <section className="hero" aria-labelledby="intro-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Software engineer at Microsoft Azure</p>
            <h1 id="intro-title">Building software.<br /><span>Sharing what I learn.</span></h1>
            <p className="hero-description">
              I'm Nitin Issac Joy. I write about engineering, the ideas behind
              technology, and the lessons that come from building things.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#writing">Explore the writing <span aria-hidden="true">&darr;</span></a>
              <Link className="text-link" to="/about">A little about me <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
          <div className="hero-portrait">
            <div className="portrait-frame">
              <img src={process.env.PUBLIC_URL + '/images/profile.jpg'} alt="Nitin Issac Joy" width={320} height={360} />
            </div>
            <div className="portrait-caption">
              <span className="portrait-name">Nitin Issac Joy</span>
              <span>Engineer. Builder. Always curious.</span>
            </div>
          </div>
        </section>

        <div className="interests" aria-label="Writing interests">
          <span className="eyebrow">A few things on my mind</span>
          <span>Software engineering</span>
          <span>Cloud &amp; systems</span>
          <span>Ideas &amp; experiments</span>
        </div>

        <section className="writing-section" id="writing" aria-labelledby="writing-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The notebook</p>
              <h2 id="writing-title">Thoughts, stories &amp; side quests.</h2>
            </div>
            <p>Notes from a life in software.</p>
          </div>
          {this.state.loading && <p className="empty-state" role="status">Opening the notebook...</p>}
          {this.state.error && (
            <div className="empty-state" role="alert">
              <p>The stories couldn't be loaded. Please try again.</p>
              <button className="button button-primary" onClick={this.loadPosts}>Try again</button>
            </div>
          )}
          {!this.state.loading && !this.state.error && (
            featured ? (
              <div className="post-grid">
                {this.renderPost(featured, true)}
                {this.state.posts.slice(1).map(post => this.renderPost(post, false))}
              </div>
            ) : <p className="empty-state">New stories will appear here.</p>
          )}
        </section>
        <aside className="closing-note">
          <div>
            <p className="eyebrow">Beyond the notebook</p>
            <h2>Curiosity doesn't stop at the day job.</h2>
            <p>Find my projects, experiments, and work in progress on GitHub.</p>
          </div>
          <a className="button button-outline" href="https://github.com/issacnitin">Explore GitHub <span aria-hidden="true">&rarr;</span></a>
        </aside>
      </div>
    );
  }
}

export default App;
