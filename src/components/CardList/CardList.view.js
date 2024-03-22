import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './CardList.styles';
import { Card } from 'components';

// mui
import { makeStyles, Tab, Tabs as MuiTabs, Typography } from '@material-ui/core';

CardListView.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  scrollable: PropTypes.bool,
  scrollButtons: PropTypes.oneOf(['auto', 'desktop', 'on', 'off']),
  hasValidData: PropTypes.func,
  nestedClasses: PropTypes.object,
};

export function CardListView({ title, data, scrollable, scrollButtons, hasValidData, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'CardList' })({ scrollable });

  return (
    <div className={classes.root} data-testid="cardlist">
      {title && (
        <Typography variant="body2" className={classes.title}>
          {title}
        </Typography>
      )}
      <MuiTabs
        value={false}
        variant={scrollable ? 'scrollable' : undefined}
        scrollButtons={scrollButtons}
        classes={{
          root: classes.tabs,
          flexContainer: classnames({ [classes.tabsWrap]: !Boolean(scrollable) }),
        }}
      >
        {data.map((card) => {
          // only render cards with content
          if (hasValidData([card])) {
            return (
              <Tab
                key={card.id}
                component={React.forwardRef(({ cardProps }, ref) => {
                  return <Card cardRef={ref} {...cardProps} />;
                })}
                disableRipple
                disableFocusRipple
                cardProps={{
                  title: card.title,
                  subheader: card.subheader,
                  text: card.text,
                  compact: card.compact === undefined ? true : card.compact,
                  disabled: card.disabled,
                  active: card.active,
                  onClick: card.onClick,
                  children: card.children,
                  classes: {
                    root: classnames({
                      [classes.card]: true,
                      [nestedClasses.card]: Boolean(nestedClasses.card),
                    }),
                  },
                  'data-testid': `card-${card.id}`,
                }}
              />
            );
          }

          return null;
        })}
      </MuiTabs>
    </div>
  );
}
