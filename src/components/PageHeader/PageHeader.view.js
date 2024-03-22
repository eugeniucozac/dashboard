import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './PageHeader.styles';
import { Info } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';

PageHeaderView.propTypes = {
  logo: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.object,
      title: PropTypes.string,
      content: PropTypes.node,
    })
  ),
};

export function PageHeaderView({ logo, items }) {
  const classes = makeStyles(styles, { name: 'PageHeader' })();

  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        {logo && <img src={logo} alt="logo" className={classes.image} />}

        {!logo && <PhotoOutlinedIcon className={classnames([classes.image, classes.imageMissing])} />}
      </div>

      {utils.generic.isValidArray(items, true) && (
        <div className={classes.info}>
          {items
            .filter((item) => item.icon && item.title)
            .map((item, idx) => {
              return (
                <Info
                  key={`${item.title}-${idx}`}
                  title={item.title}
                  avatarIcon={item.icon}
                  content={item.content}
                  nestedClasses={{
                    root: classes.box,
                    details: classes.details,
                  }}
                  data-testid={`page-header-${idx}`}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
