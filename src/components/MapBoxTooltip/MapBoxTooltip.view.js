import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './MapBoxTooltip.styles';

// mui
import { Typography, makeStyles } from '@material-ui/core';

MapBoxTooltipView.propTypes = {
  title: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element,
      title: PropTypes.string,
      content: PropTypes.node,
    })
  ),
  children: PropTypes.node,
};

export function MapBoxTooltipView({ title, list, children }) {
  const classes = makeStyles(styles, { name: 'MapBoxTooltip' })();

  return (
    <>
      {title && (
        <Typography variant="h5" className={classes.title} data-testid="mapbox-tooltip-title">
          {title}
        </Typography>
      )}

      {list &&
        list
          .filter((item) => item && item.title)
          .map((item, index) => {
            return (
              <div className={classes.item} data-testid="mapbox-tooltip-item" key={`item-${title}-${index}`}>
                {item.icon && <div className={classes.itemIcon}>{item.icon}</div>}

                <div className={classes.itemDetails}>
                  <Typography variant="h6" className={classes.itemTitle}>
                    {item.title}
                  </Typography>

                  <div className={classes.itemContent}>{item.content}</div>
                </div>
              </div>
            );
          })}

      {children && <div data-testid="mapbox-tooltip-content">{children}</div>}
    </>
  );
}
