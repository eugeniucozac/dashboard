import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

// app
import * as utils from 'utils';

// mui
import { useTheme } from '@material-ui/core';

export default function useMedia() {
  const theme = useTheme();
  const [media, setMedia] = useState({
    mobile: utils.media.match.mobile(theme).matches,
    tablet: utils.media.match.tablet(theme).matches,
    tabletUp: utils.media.match.tabletUp(theme).matches,
    desktop: utils.media.match.desktop(theme).matches,
    desktopUp: utils.media.match.desktopUp(theme).matches,
    wide: utils.media.match.wide(theme).matches,
    wideUp: utils.media.match.wideUp(theme).matches,
    extraWide: utils.media.match.extraWide(theme).matches,
  });

  useEffect(() => {
    const handleResize = throttle((event) => {
      const current = {
        mobile: utils.media.match.mobile(theme).matches,
        tablet: utils.media.match.tablet(theme).matches,
        tabletUp: utils.media.match.tabletUp(theme).matches,
        desktop: utils.media.match.desktop(theme).matches,
        desktopUp: utils.media.match.desktopUp(theme).matches,
        wide: utils.media.match.wide(theme).matches,
        wideUp: utils.media.match.wideUp(theme).matches,
        extraWide: utils.media.match.extraWide(theme).matches,
      };

      const hasChanged =
        media.mobile !== current.mobile ||
        media.tablet !== current.tablet ||
        media.tabletUp !== current.tabletUp ||
        media.desktop !== current.desktop ||
        media.desktopUp !== current.desktopUp ||
        media.wide !== current.wide ||
        media.wideUp !== current.wideUp ||
        media.extraWide !== current.extraWide;

      if (hasChanged) {
        setMedia(current);
      }
    }, 100);

    handleResize();
    window.addEventListener('resize', handleResize);

    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return media;
}
