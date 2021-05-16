import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import WorkspaceList from './WorkspaceList';
import '../styles/main.styl';
import '../styles/base-theme/index.styl';
import store from './store';

const rootElement = document.getElementById('root');

if (__DEV__) {
  const hotLoaderRender = () => render(
    <AppContainer>
      <Provider store={store}><WorkspaceList /></Provider>
    </AppContainer>,
    rootElement,
  );

  hotLoaderRender();
  if (module.hot) module.hot.accept('./WorkspaceList', hotLoaderRender);
} else {
  render(<Provider store={store}><WorkspaceList /></Provider>, rootElement);
}
