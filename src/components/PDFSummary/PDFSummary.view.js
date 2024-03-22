import React from 'react';

// app
import { Translate, Info } from 'components';
import styles from './PDFSummary.styles';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';
import ApartmentIcon from '@material-ui/icons/Apartment';
import TodayIcon from '@material-ui/icons/Today';
import PeopleIcon from '@material-ui/icons/People';

export function PDFSummaryView({ brokers, placementInfo, introduction }) {
  const classes = makeStyles(styles, { name: 'PDFSummary' })();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div>
          <Info
            title={utils.string.t('app.client', { count: placementInfo.clientCount })}
            avatarIcon={ApartmentIcon}
            description={placementInfo.clients}
            data-testid="market-sheet-clients"
            nestedClasses={{ root: classes.info }}
          />
          {brokers && (
            <Info
              title={utils.string.t('app.broker', { count: placementInfo.userCount })}
              avatarIcon={PeopleIcon}
              description={brokers}
              data-testid="summary-assigned-brokers"
              nestedClasses={{ root: classes.info }}
            />
          )}
          {placementInfo.inceptionDate && (
            <Info
              title={utils.string.t('app.inceptionDate')}
              avatarIcon={TodayIcon}
              description={
                <Translate
                  label="format.date"
                  options={{ value: { date: placementInfo.inceptionDate, format: config.ui.format.date.text } }}
                />
              }
              nestedClasses={{ root: classes.info }}
              data-testid="market-sheet-inception-date"
            />
          )}
        </div>
        <div className={classes.detailContainer}>
          <div className={classes.detail}>
            <Translate className={classes.label} label={utils.string.t('app.department')} variant="body2" />
            <Translate label={placementInfo.department} variant="body2" />
          </div>
          <div className={classes.detail}>
            <Translate className={classes.label} label={utils.string.t('app.description')} variant="body2" />
            <Translate label={placementInfo.description} variant="body2" />
          </div>
          {introduction && (
            <div className={classes.introduction}>
              <Translate className={classes.introductionLabel} label={utils.string.t('app.introduction')} variant="body2" />
              <div>{introduction}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
