import * as React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default class About extends React.Component {
  public componentDidMount() {
    document.title = 'About | Nitin Issac Joy';
  }

  public render() {
    return (
      <section className="about-page" aria-labelledby="about-title">
        <div className="about-intro">
          <p className="eyebrow">The person behind the posts</p>
          <h1 id="about-title">Hi, I'm Nitin.<br /><span>A builder at heart.</span></h1>
          <p className="about-lead">Software engineer at Microsoft Azure, with a curiosity that reaches well beyond code.</p>
          <img className="about-portrait" src={process.env.PUBLIC_URL + '/images/profile.jpg'} alt="Nitin Issac Joy" width={360} height={400} />
        </div>
        <div className="about-story">
          <h2>Learning by building.</h2>
          <p>My path in software has taken me through an internship at NetApp and engineering roles at Intuit, Zynga, and Microsoft. Along the way, I've worked on everything from tax software to games, servers, and large-scale data processing.</p>
          <p>What keeps it interesting is the same thing that got me started: understanding how things work, asking questions, and trying an idea to see where it leads.</p>
          <h2>A notebook, not a manual.</h2>
          <p>This site is a collection of personal reflections on software engineering, algorithms, product decisions, and projects. Some are lessons from work. Others are experiments and ideas I'm still thinking through.</p>
          <p>The posts are snapshots of what I was thinking at the time, rather than definitive answers. All views here are my own.</p>
          <div className="about-links">
            <Link className="button button-primary" to="/">Read the stories <span aria-hidden="true">&rarr;</span></Link>
            <a className="text-link" href="https://github.com/issacnitin">Find me on GitHub <span aria-hidden="true">&#8599;</span></a>
          </div>
        </div>
      </section>
    );
  }
}
