import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const fetchMock = jest.spyOn(window, 'fetch')
    .mockImplementation(() => new Promise<Response>(() => undefined));
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
  fetchMock.mockRestore();
});
