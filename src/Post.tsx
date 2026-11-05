import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { getPost, IPost } from './Utilities/Posts';

interface IProps extends RouteComponentProps<{ slug: string }> {}

interface IState {
  post: IPost | null;
  loading: boolean;
  error: boolean;
}

export class Post extends React.Component<IProps, IState> {
  public state: IState = { post: null, loading: true, error: false };
  private request = 0;

  public componentDidMount() {
    this.loadPost();
  }

  public componentDidUpdate(previousProps: IProps) {
    if (previousProps.match.params.slug !== this.props.match.params.slug) {
      this.loadPost();
    }
  }

  public componentWillUnmount() {
    this.request++;
  }

  private loadPost = () => {
    const request = ++this.request;
    this.setState({ post: null, loading: true, error: false });
    getPost(this.props.match.params.slug)
      .then(post => {
        if (request === this.request) {
          document.title = post.title + ' | Nitin Issac Joy';
          this.setState({ post, loading: false });
        }
      })
      .catch((error: Error) => {
        console.error('Unable to load post:', error);
        if (request === this.request) {
          document.title = 'Story unavailable | Nitin Issac Joy';
          this.setState({ loading: false, error: true });
        }
      });
  }

  public render() {
    const post = this.state.post;
    return (
      <div className="article-page">
        <Link className="text-link back-link" to="/"><span aria-hidden="true">&larr;</span> All stories</Link>
        {this.state.loading && <p className="empty-state" role="status">Loading the story...</p>}
        {this.state.error && (
          <div className="empty-state" role="alert">
            <h1>This story couldn't be loaded.</h1>
            <p>Check the address, or try loading it again.</p>
            <button className="button button-primary" onClick={this.loadPost}>Try again</button>
          </div>
        )}
        {post && (
          <article className="reading-surface">
            <div className="article-author">
              <img src={process.env.PUBLIC_URL + '/images/profile.jpg'} alt="" width={40} height={40} />
              <div><span>Nitin Issac Joy</span><span>{post.readingMinutes} min read</span></div>
              <span className="eyebrow">From the notebook</span>
            </div>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="article-end">
              <p>Thanks for reading.</p>
              <Link className="text-link" to="/">Explore more stories <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </article>
        )}
      </div>
    );
  }
}

export default Post;
