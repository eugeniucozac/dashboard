import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './PopoverFilter.styles';
import { Button } from 'components';
import * as utils from 'utils';

// mui
import { Box, Popover, Typography, makeStyles } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

PopoverFilterView.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['multiSelect', 'multiSelectAsync', 'datepicker']).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ),
    PropTypes.string,
  ]).isRequired,
  textObj: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    count: PropTypes.number,
  }),
  placeholder: PropTypes.string,
  content: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  disabled: PropTypes.bool,
  maxHeight: PropTypes.number,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    btn: PropTypes.string,
    popover: PropTypes.string,
  }),
  handlers: PropTypes.object,
};

PopoverFilterView.defaultProps = {
  maxHeight: 300,
};

export function PopoverFilterView({
  id,
  label,
  type,
  content,
  value,
  textObj,
  color,
  active,
  disabled,
  placeholder,
  maxHeight,
  nestedClasses,
  refs,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'PopoverFilter' })({ maxHeight });

  const { filterOpen, filterClose, ...restHandlers } = handlers;

  return (
    <Box className={classes.root}>
      <Typography variant="body2" className={classes.label}>
        {label}
      </Typography>

      {type === 'datepicker' &&
        cloneElement(content, {
          value: value,
          handlers: { ...restHandlers },
          nestedClasses: {
            input: classes.datepickerInput,
            datepicker: classes.datePickerContainer,
          },
        })}
      {type !== 'datepicker' && (
        <div
          className={classnames({
            [classes.field]: true,
            [nestedClasses.root]: Boolean(nestedClasses.root),
          })}
        >
          <Button
            refProp={refs.btn}
            icon={ArrowDropDownIcon}
            iconPosition="right"
            text={
              textObj?.label ? (
                <span className={classes.text}>
                  <span className={classes.textLabel}>{textObj.label}</span>
                  {textObj?.count && textObj.count > 0 ? <span className={classes.textCount}>{`+${textObj.count}`}</span> : ''}
                </span>
              ) : (
                placeholder || utils.string.t('app.select')
              )
            }
            size="small"
            variant="text"
            color={color}
            light
            aria-owns={active ? `${id}-popover` : null}
            aria-haspopup="true"
            disabled={disabled}
            onClick={handlers.filterOpen}
            title={utils.generic.isValidArray(value, true) ? value.map((v) => v.name).join('\n') : undefined}
            nestedClasses={{
              btn: classnames({
                [classes.btn]: true,
                [nestedClasses.btn]: Boolean(nestedClasses.btn),
              }),
              label: classes.btnLabel,
            }}
            data-testid={`popover-btn-${id}`}
          />

          {content && (
            <Popover
              id={`${id}-popover`}
              anchorEl={get(refs, 'btn.current')}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(active && get(refs, 'btn.current'))}
              onClose={handlers.filterClose}
              classes={{ paper: classnames({ [classes.popover]: true, [nestedClasses.popover]: Boolean(nestedClasses.popover) }) }}
            >
              {type === 'multiSelect' && cloneElement(content, { values: value, handlers: { ...restHandlers } })}
              {type === 'multiSelectAsync' && cloneElement(content, { values: value, handlers: { ...restHandlers } })}
            </Popover>
          )}
        </div>
      )}
    </Box>
  );
}
