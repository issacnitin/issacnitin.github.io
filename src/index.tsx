import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './App.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { NewPost } from './NewPost';
import Post from './Post';
import About from './Components/About';
import SiteLayout from './Components/SiteLayout';

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <SiteLayout>
      <Switch>
        <Route exact path="/" component={App}/>
        <Route exact path="/about" component={About}/>
        <Route exact path="/blog/:slug" component={Post}/>
        <Route exact path='/newpost' component={NewPost}/>
        <Route render={() => <div className="empty-state"><h1>Page not found.</h1><a className="text-link" href={process.env.PUBLIC_URL + '/'}>Back to the notebook</a></div>} />
      </Switch>
    </SiteLayout>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
