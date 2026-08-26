import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './App.css';

interface IProps extends RouteComponentProps<{ slug: string }> {}

interface IState {
  content: string;
}

export class Post extends React.Component<IProps, IState> {
  public state: IState = { content: '' };

  public componentDidMount() {
    this.loadPost(this.props.match.params.slug);
  }

  public componentDidUpdate(previousProps: IProps) {
    var previousSlug = previousProps.match.params.slug;
    var currentSlug = this.props.match.params.slug;
    if (previousSlug !== currentSlug) {
      this.loadPost(currentSlug);
    }
  }

  private loadPost(slug: string) {
    fetch(process.env.PUBLIC_URL + '/posts/' + slug)
      .then((response: Response) => response.text())
      .then((content: string) => this.setState({ content: content }));
  }

  public render() {
    return (
      <div className="Post App">
        <p><Link to="/">Back to all posts</Link></p>
        <div dangerouslySetInnerHTML={{__html: this.state.content}} />
      </div>
    );
  }
}

export default Post;
