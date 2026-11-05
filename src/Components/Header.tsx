import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Nitin Issac Joy, home">
        <span className="brand-mark" aria-hidden="true">n<span>.</span></span>
        <span>Nitin Issac Joy<span className="brand-subtitle">Software &amp; stories</span></span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink exact to="/" activeClassName="nav-active">Writing</NavLink>
        <NavLink to="/about" activeClassName="nav-active">About</NavLink>
        <a className="nav-github" href="https://github.com/issacnitin">GitHub <span aria-hidden="true">&#8599;</span></a>
      </nav>
    </header>
  );
}
