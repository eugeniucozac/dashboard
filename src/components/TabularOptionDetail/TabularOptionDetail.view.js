import React from 'react';

// app
import { Tooltip } from 'components';
import styles from './TabularOptionDetail.styles';
import PropTypes from 'prop-types';

// mui
import { makeStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

TabularOptionDetailView.propTypes = {
  label: PropTypes.string.isRequired,
  labelWidth: PropTypes.string,
  sublabels: PropTypes.array,
  sublabelWidths: PropTypes.array,
  detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  children: PropTypes.node,
};

export function TabularOptionDetailView({ label, labelWidth, sublabels, sublabelWidths, detail, children }) {
  const classes = makeStyles(styles, { name: 'OptionDetail' })({ labelWidth });

  return (
    <div className={classes.root}>
      {children}
      {(label || detail) && (
        <>
          {label && (
            <span className={classes.label} style={{ flex: `1 1 calc(${labelWidth} - ${detail ? 16 : 0}px)` }}>
              {label}
            </span>
          )}
          {sublabels &&
            sublabels.map((sublabel, idx) => {
              return (
                <span key={'sublabel' + idx} className={classes.sublabel} style={{ flex: `1 1 ${sublabelWidths[idx]}` }}>
                  {sublabel}
                </span>
              );
            })}
          {detail && (
            <span style={{ width: 16 }}>
              <Tooltip title={<span className={classes.detail}>{detail}</span>}>
                {detail && <InfoOutlinedIcon classes={{ root: classes.icon }} />}
              </Tooltip>
            </span>
          )}
        </>
      )}
    </div>
  );
}
