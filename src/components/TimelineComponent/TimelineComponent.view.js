import React from 'react';
import PropTypes from 'prop-types';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';

//app
import styles from './TimelineComponent.styles';
import * as utils from 'utils';
import { InfiniteScroll } from 'components';

// mui
import { makeStyles } from '@material-ui/core';

TimelineComponentView.propTypes = {
  align: PropTypes.string.isRequired,
  isVirtualized: PropTypes.bool.isRequired,
  contentItems: PropTypes.array.isRequired,
};

export function TimelineComponentView({ propsTypes }) {
  const classes = makeStyles(styles, { name: 'TimelineComponent' })();
  const props = propsTypes;
  const rowCount = props?.contentItems.length;

  const renderContainerHeightBasedOnLength = (length) => {
    let containerHeight;
    switch (length) {
      case 1:
        containerHeight = 215;
        break;
      case 2:
        containerHeight = 345;
        break;
      case 3:
        containerHeight = 475;
        break;
      default:
        containerHeight = 530;
        break;
    }
    return containerHeight;
  };

  const renderRow = (index) => {
    return (
      <TimelineItem
        key={index}
        className={classnames({ [classes.leftListItem]: (props.align === 'alternate' && index % 2 !== 0) || props.align === 'left' })}
      >
        {props?.contentItems[index]?.isOppositeContent && (
          <TimelineOppositeContent>{props?.contentItems[index]?.oppositeContent}</TimelineOppositeContent>
        )}
        <TimelineSeparator>
          <TimelineDot color={props?.contentItems[index]?.iconColour} variant={props?.contentItems[index]?.isTimeLineDotVarient}>
            {props?.contentItems[index]?.isDotIcon && props?.contentItems[index]?.isTimeLineDotIcon}
          </TimelineDot>
          {props?.contentItems[index]?.isTimeLineConnector && index !== props?.contentItems?.length - 1 && (
            <TimelineConnector className={props?.contentItems[index]?.secondaryTail ? classes.secondaryTail : false} />
          )}
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={props?.contentItems[index].isElevation} className={classes.paper}>
            {props?.contentItems[index].content}
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  };

  return props.isVirtualized && utils.generic.isValidArray(props?.contentItems, true) ? (
    <InfiniteScroll
      itemCount={rowCount}
      content={(index) => renderRow(index)}
      containerHeight={renderContainerHeightBasedOnLength(rowCount)}
      rowHeight={60}
    />
  ) : (
    <Timeline align={props?.align}>
      {utils.generic.isValidArray(props?.contentItems, true) &&
        props?.contentItems.map((item, index) => {
          return (
            <TimelineItem>
              {item?.isOppositeContent && <TimelineOppositeContent>{item.oppositeContent}</TimelineOppositeContent>}
              <TimelineSeparator>
                <TimelineDot color={item?.iconColour} variant={item?.isTimeLineDotVarient}>
                  {item?.isDotIcon && item?.isTimeLineDotIcon}
                </TimelineDot>
                {item?.isTimeLineConnector && index !== props?.contentItems?.length - 1 && (
                  <TimelineConnector className={item?.secondaryTail ? classes.secondaryTail : false} />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={item.isElevation} className={classes.paper}>
                  {item.content}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
    </Timeline>
  );
}
