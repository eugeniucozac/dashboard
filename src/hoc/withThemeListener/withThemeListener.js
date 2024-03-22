import React, { PureComponent } from 'react';
import { compose } from 'redux';
import throttle from 'lodash/throttle';

// app
import * as utils from 'utils';

// mui
import { withTheme } from '@material-ui/core';

const withThemeListener = (WrappedComponent) => {
  class HOC extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        media: {
          mobile: true,
          tablet: false,
          desktop: false,
        },
      };
    }

    componentWillMount() {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    handleResize = throttle((event) => {
      const { mobile, tablet, desktop } = this.state.media;
      const { theme } = this.props;

      const media = {
        mobile: utils.media.match.mobile(theme).matches,
        tablet: utils.media.match.tablet(theme).matches,
        tabletUp: utils.media.match.tabletUp(theme).matches,
        desktop: utils.media.match.desktop(theme).matches,
        desktopUp: utils.media.match.desktopUp(theme).matches,
        wide: utils.media.match.wide(theme).matches,
        wideUp: utils.media.match.wideUp(theme).matches,
        extraWide: utils.media.match.extraWide(theme).matches,
      };

      const hasChanged = mobile !== media.mobile || tablet !== media.tablet || desktop !== media.desktop;

      if (hasChanged) {
        this.setState({ media });
      }
    }, 100);

    render() {
      return <WrappedComponent {...this.state.media} {...this.props} />;
    }
  }

  return HOC;
};

export default compose(withTheme, withThemeListener);
