import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import About from './Components/About';
import Header from './Components/Header';

it('renders the introduction and loading state while posts are loading', () => {
  const fetchMock = jest.spyOn(window, 'fetch')
    .mockImplementation(() => new Promise<Response>(() => undefined));
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><App /></MemoryRouter>, div);
  expect(div.querySelector('h1')!.textContent).toContain('Building software.');
  expect(div.querySelector('[role="status"]')!.textContent).toContain('Opening the notebook');
  expect(div.querySelector('a[href="/about"]')).not.toBeNull();
  ReactDOM.unmountComponentAtNode(div);
  fetchMock.mockRestore();
});

it('renders an accessible navigation with the current page highlighted', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter initialEntries={['/about']}><Header /></MemoryRouter>, div);
  expect(div.querySelector('nav')!.getAttribute('aria-label')).toBe('Main navigation');
  expect(div.querySelector('a[href="/about"]')!.getAttribute('aria-current')).toBe('page');
  expect(div.querySelector('a[href="/"]')!.className).not.toContain('nav-active');
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a complete about page', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><About /></MemoryRouter>, div);
  expect(div.querySelector('h1')!.textContent).toContain("Hi, I'm Nitin.");
  expect(div.textContent).toContain('All views here are my own.');
  expect(document.title).toBe('About | Nitin Issac Joy');
  ReactDOM.unmountComponentAtNode(div);
});
