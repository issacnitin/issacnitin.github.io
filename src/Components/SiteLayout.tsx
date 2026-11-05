import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import Header from './Header';

class SiteLayout extends React.Component<RouteComponentProps<{}>> {
  public componentDidUpdate(previousProps: RouteComponentProps<{}>) {
    if (previousProps.location.pathname !== this.props.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  public render() {
    return (
      <div className="site-shell">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{this.props.children}</main>
        <footer className="site-footer">
          <div><strong>Nitin Issac Joy</strong><span>Built with care. Written with curiosity.</span></div>
          <nav aria-label="Footer navigation">
            <Link to="/about">About</Link>
            <a href="https://github.com/issacnitin">GitHub</a>
          </nav>
          <span className="copyright">&copy; {new Date().getFullYear()} Nitin Issac Joy</span>
        </footer>
      </div>
    );
  }
}

export default withRouter(SiteLayout);
