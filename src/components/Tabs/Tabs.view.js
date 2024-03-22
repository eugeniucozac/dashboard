import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

// app
import * as utils from 'utils';
import styles from './Tabs.styles';

// mui
import { Tabs as MuiTabs, Tab, Badge, makeStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

TabsView.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      errors: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      complete: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  light: PropTypes.bool,
  compact: PropTypes.bool,
  swipeable: PropTypes.bool,
  variant: PropTypes.string,
  componentProps: PropTypes.object,
  nestedClasses: PropTypes.shape({
    tabs: PropTypes.shape({
      root: PropTypes.string,
      content: PropTypes.string,
    }),
    tab: PropTypes.string,
    root: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

TabsView.defaultProps = {
  tabs: [],
  variant: 'scrollable',
  nestedClasses: {},
};

export function TabsView({
  tabs,
  verticalAlignBool,
  value,
  light,
  compact,
  swipeable,
  variant,
  componentProps,
  nestedClasses,
  onChange,
  ...props
}) {
  const classes = makeStyles(styles, { name: 'Tabs' })({ light, compact });

  const TabLabel = ({ label, subLabel, total, complete, count, errors }) => {
    return (
      <>
        <div className={classes.label}>
          {isNumber(count) ? (
            <Badge badgeContent={count} color="error">
              {label}
            </Badge>
          ) : (
            label
          )}{' '}
          {isNumber(complete) && isNumber(total) && <TabCount total={total} complete={complete} />}
          {Boolean(errors) && <InfoOutlinedIcon color="error" className={classes.iconError} />}
        </div>
        {subLabel && <div className={classes.sublabel}>{subLabel}</div>}
      </>
    );
  };

  const TabCount = ({ complete, total }) => {
    return (
      <span className={classes.labelCount}>
        ({complete}/{total})
      </span>
    );
  };

  const TabContent = () => {
    const elements = React.Children.toArray(props.children);
    const disconnectedTabContent = elements.every((el) => get(el, 'props.value') === undefined);

    if (!props.children) return null;

    // if none of the children have a value props, then render whatever is there
    // this allows to display any components as tab content (ex: OpeningMemoContent)
    // this content can manage itself what it renders based on its own selected tab state
    if (disconnectedTabContent) {
      return props.children;
    }

    // if any of the child have a value props
    // then the Tabs component controls which one to display based on the current value
    return React.Children.map(props.children, (child) => {
      return React.cloneElement(child, {
        style: { display: value === child.props.value ? 'block' : 'none' },
      });
    });
  };

  const getValueIndex = (value) => {
    return tabs.findIndex((tab) => {
      return tab.value === value;
    });
  };

  const getIndexValue = (index) => {
    return get(tabs, `[${index}].value`);
  };

  // abort
  if (!utils.generic.isValidArray(tabs)) return null;

  return tabs.length ? (
    <div
      className={classnames({
        [classes.root]: true,
        [nestedClasses.root]: Boolean(nestedClasses.root),
      })}
      data-testid="tabs"
    >
      <MuiTabs
        orientation={verticalAlignBool ? 'vertical' : 'horizontal'}
        {...props}
        value={value}
        onChange={onChange}
        variant={variant}
        classes={{
          root: classnames([classes.tabs, get(nestedClasses, 'tabs.root')]),
          scrollButtons: classnames(variant === 'scrollable' ? classes.scrollButtons : undefined),
        }}
        data-testid="tabs-mui"
      >
        {tabs.map((tab, index) => {
          const { subLabel, ...tabProps } = tab;
          return (
            <Tab
              key={index}
              {...tabProps}
              value={tab.value}
              disabled={tab?.disabled}
              label={<TabLabel {...tab} subLabel={subLabel} label={utils.string.t(tab.label)} />}
              data-testid="tabs-mui-item"
              classes={{ root: get(nestedClasses, 'tab.root') }}
            />
          );
        })}
      </MuiTabs>

      <div data-testid="tabs-content" className={get(nestedClasses, 'tabs.content')}>
        {swipeable && (
          <SwipeableViews
            index={getValueIndex(value)}
            enableMouseEvents
            hysteresis={0.3}
            onChangeIndex={(index) => onChange(null, getIndexValue(index))}
            {...componentProps}
          >
            {props.children}
          </SwipeableViews>
        )}

        {!swipeable && <TabContent />}
      </div>
    </div>
  ) : null;
}
