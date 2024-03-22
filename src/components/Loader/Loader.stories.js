import React, { useEffect, useState } from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import { Layout, Loader } from 'components';
import { Grid } from '@material-ui/core';
import mixins from '../../theme/theme-mixins';
import merge from 'lodash/merge';

export default {
  title: 'Loader',
  component: Loader,
  decorators: [withKnobs],
};

const getStore = (obj) => {
  const enhancer = compose(applyMiddleware(thunk));
  const defaultStore = createStore(reducer, {}, enhancer);
  const preloadedState = merge(defaultStore.getState(), obj);

  // return default store if no custom JSON is passed
  if (!obj) {
    return defaultStore;
  }

  // otherwise, return new deeply-merged store with data from JSON obj
  return createStore(reducer, preloadedState, enhancer);
};

export const Default = () => {
  const mediaMatchMobile = window.matchMedia('(max-width: 599.95px)');
  const mediaMatchTablet = window.matchMedia('(min-width: 600px) and (max-width: 959.95px)');
  const [isMobile, setIsMobile] = useState(mediaMatchMobile.matches);
  const [, setIsTablet] = useState(mediaMatchTablet.matches);

  useEffect(() => {
    const handlerMobile = (e) => setIsMobile(e.matches);
    const handlerTablet = (e) => setIsTablet(e.matches);

    mediaMatchMobile.addListener(handlerMobile);
    mediaMatchTablet.addListener(handlerTablet);

    return () => {
      mediaMatchMobile.removeListener(handlerMobile);
      mediaMatchTablet.removeListener(handlerTablet);
    };
  });

  const visible = boolean('Visible', true);
  const label = select('Label', ['', 'app.loading', 'app.authenticating'], '');
  const absolute = boolean('Absolute', false);
  const panel = boolean('Panel', false);
  const inline = boolean('Inline', false);

  const stylesAbsolute = {
    background: '#fafafa',
    border: '1px dashed #ddd',
    borderRadius: 5,
    padding: 20,
    minHeight: 200,
  };

  const stylesPanel = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      margin: -30,
      width: 'calc(100% + 60px)',
      height: '100vh',
    },
    header: () => ({
      flex: 'none',
      background: '#fafafa',
      boxShadow: '0px 1px 0px 0px #ddd',
      width: '100%',
      height: 64,
      zIndex: 1210,
    }),
    body: {
      display: 'flex',
      flex: 1,
    },
    menu: () => ({
      flex: 'none',
      background: '#fafafa',
      borderRight: '1px solid #ddd',
      width: mixins.nav.width.collapsed,
      ...(isMobile && { display: 'none' }),
    }),
    panel: () => ({
      padding: 40,
      height: '100%',
    }),
  };

  const stylesInline = {
    position: 'unset',
    background: 'none',
    alignItems: 'flex-start',
  };

  return (
    <Provider store={getStore()}>
      {!absolute && !panel && !inline && <Loader visible={visible} label={label} />}

      {absolute && !panel && (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <div style={stylesAbsolute}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, atque cupiditate, dolore doloremque earum ...
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{ ...stylesAbsolute, position: 'relative' }}>
              <Loader visible={visible} label={label} absolute={absolute} />
              Cuibusdam. Aspernatur atque consequatur ea eos fugit, officia placeat quo voluptatem. Ad aniur ea eos fugit, officia placeat
              quo vomi enim incidunt modi sint vel veritatis voluptas...
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={stylesAbsolute}>
              Ipsa magnam magni maiur ea eos fugit, officia placeat quo voores nam neque odit placeat, qui soluta tempo ur ea eos fugit,
              officia placeat quo vo ribus voluptates voluptatum...
            </div>
          </Grid>
        </Grid>
      )}

      {panel && (
        <div style={stylesPanel.root}>
          <div style={stylesPanel.header()} />
          <div style={stylesPanel.body}>
            <div style={stylesPanel.menu()} />
            <Layout>
              <Layout main>
                <div style={{ padding: 20 }}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, atque cupiditate, dolore doloremque earum ...
                </div>
              </Layout>
              <Layout sidebar padding={false}>
                <div style={stylesPanel.panel()}>
                  <Loader visible={visible} label={label} panel={panel} />
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consectetur consequuntur dolor enim est expedita harum
                    nam.
                  </div>
                </div>
              </Layout>
            </Layout>
          </div>
        </div>
      )}

      {inline && !absolute && !panel && (
        <Grid container spacing={4}>
          <Grid item xs={6} sm={6}>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, atque cupiditate, dolore doloremque earum ...</div>
          </Grid>
          <Grid item xs={6} sm={6}>
            <div style={stylesInline}>
              <Loader visible={visible} inline={inline} />
            </div>
          </Grid>
        </Grid>
      )}
    </Provider>
  );
};
