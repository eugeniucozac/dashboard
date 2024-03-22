import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Accordion.styles';
import { Link, Loader } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Accordion, AccordionDetails, AccordionSummary, Typography, Grid, Box } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

AccordionView.propTypes = {
  title: PropTypes.node,
  icon: PropTypes.bool,
  boxed: PropTypes.bool,
  expanded: PropTypes.bool,
  isDataLoading: PropTypes.bool,
  density: PropTypes.oneOf(['compact', 'default', 'comfortable']),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.object,
      text: PropTypes.string,
      color: PropTypes.oneOf(['primary', 'secondary', 'neutral']),
      onClick: PropTypes.func.isRequired,
    })
  ),
  testid: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

AccordionView.defaultProps = {
  icon: true,
  density: 'default',
  isDataLoading: false,
  testid: '',
  defaultHeader: true,
};

export function AccordionView({
  title,
  icon,
  boxed,
  expanded,
  isDataLoading,
  density,
  actions,
  testid,
  onChange,
  children,
  defaultHeader,
}) {
  const classes = makeStyles(styles, { name: 'Accordion' })({ blank: !boxed, density });

  return (
    <Accordion expanded={expanded} onChange={onChange} className={classes.panel} data-testid={`accordion${testid ? `-${testid}` : ''}`}>
      <AccordionSummary
        classes={{
          root: classnames(classes.summary),
          content: classnames(classes.summaryContent),
        }}
      >
        <div className={defaultHeader ? classes.header : classes.customHeader}>
          {icon &&
            (isDataLoading ? (
              <Box m={0.5} ml={1.2} mr={1.2}>
                <Loader visible={isDataLoading} inline />
              </Box>
            ) : (
              <KeyboardArrowDownIcon className={classes.arrow} />
            ))}

          <Typography variant="h4" noWrap className={classes.title}>
            {title}
          </Typography>
          <div className={classes.actions} data-testid="accordion-actions">
            {utils.generic.isValidArray(actions, true) &&
              actions.map((action) => {
                const isValid = Boolean(action.icon || action.text);
                const isIcon = isValid && Boolean(action.icon && !action.text);
                const isText = isValid && Boolean(action.text);
                const hasOnClick = utils.generic.isFunction(action.onClick);
                const IconComponent = isIcon ? action.icon : null;

                // skip if action doesn't have an onClick method
                if (!hasOnClick) return null;

                // render icon
                if (isIcon) {
                  return (
                    <IconComponent
                      key={action.id}
                      color={action.color || 'secondary'}
                      className={classnames(classes.actionsIcon)}
                      onClick={(e) => action.onClick(e, action.id)}
                    />
                  );
                }

                // render text link
                if (isText) {
                  return (
                    <Grid container key={action.id}>
                      {isDataLoading && (
                        <Grid item>
                          <Box m={0.5} ml={0.5}>
                            <Loader visible={isDataLoading} inline />
                          </Box>
                        </Grid>
                      )}
                      <Grid item>
                        <Link
                          text={action.text}
                          icon={isDataLoading ? null : action.icon}
                          iconPosition={action.iconPosition}
                          color={action.color || 'secondary'}
                          handleClick={(e) => action.onClick(e, action.id)}
                          nestedClasses={{
                            link: classnames(classes.actionsText, action.nestedClasses?.link),
                            icon: classnames(action.nestedClasses?.icon),
                          }}
                        />
                      </Grid>
                    </Grid>
                  );
                }

                return null;
              })}
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails className={classes.details}>{children}</AccordionDetails>
    </Accordion>
  );
}
