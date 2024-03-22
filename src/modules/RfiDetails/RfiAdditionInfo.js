import React, { useState } from 'react';
import PropTypes from 'prop-types';

//app
import styles from './RfiDetails.styles';
import { DetailsCard } from 'modules';
import { Accordion } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

//mui
import { Typography, makeStyles, Divider } from '@material-ui/core';

RfiAdditionInfo.propTypes = {
  rfiOriginType: PropTypes.oneOf(Object.values(constants.RFI_ORIGIN_TYPES_FROM_CAMUNDA)),
  lossInfo: PropTypes.array.isRequired,
  claimInfo: PropTypes.array.isRequired,
};
export function RfiAdditionInfo({ rfiOriginType, lossInfo, claimInfo, taskInfo, isTaskDetailsLoading, rfiInfo = {} }) {
  const classes = makeStyles(styles, { name: 'TaskDetails' })();

  const [accordionsExpandStatus, setAccordiansStatus] = useState({
    isLossCardExpanded: rfiOriginType === constants.RFI_ORIGIN_TYPES_FROM_CAMUNDA.loss,
    isClaimCardExpanded: rfiOriginType === constants.RFI_ORIGIN_TYPES_FROM_CAMUNDA.claim,
    isPolicyCardExpanded: false,
    isTaskCardExpanded: rfiOriginType === constants.RFI_ORIGIN_TYPES_FROM_CAMUNDA.task,
  });

  const setAccordiansIsExpanded = (cardName, isExpand) => {
    const accordionsStatus = { ...accordionsExpandStatus };
    accordionsStatus[cardName] = isExpand;
    setAccordiansStatus(accordionsStatus);
  };

  const accordionTitle = (title) => {
    return (
      <Typography className={classes.title} variant="body2">
        {' '}
        {title}
      </Typography>
    );
  };

  const infoCard = (title = '', details = '', isLoading = false) => {
    return <DetailsCard title={title} details={details} isLoading={isLoading} width={'30%'} />;
  };
  const renderInfoCard = (items) => {
    return <div className={classes.infoCardContainer}>{items?.map((info) => infoCard(info?.title, info?.value, info?.isLoading))}</div>;
  };

  return (
    <>
      <Accordion style={{ boxShadow: 'none' }} title={accordionTitle(utils.string.t('claims.rfiDashboard.additionalDetails.title'))}>
        <div className={classes.infoCardContainerWrapper}>
          <Accordion
            expanded={accordionsExpandStatus.isLossCardExpanded}
            title={accordionTitle(utils.string.t('claims.rfiDashboard.additionalDetails.lossInformation'))}
            onChange={(event, isExpanded) => setAccordiansIsExpanded('isLossCardExpanded', isExpanded)}
            isDataLoading={lossInfo?.isLoading}
          >
            {renderInfoCard(lossInfo)}
          </Accordion>
          <Divider />

          <Accordion
            expanded={accordionsExpandStatus.isClaimCardExpanded}
            title={accordionTitle(utils.string.t('claims.rfiDashboard.additionalDetails.claimInformation'))}
            onChange={(event, isExpanded) => setAccordiansIsExpanded('isClaimCardExpanded', isExpanded)}
            isDataLoading={claimInfo?.isLoading}
          >
            {renderInfoCard(claimInfo)}
          </Accordion>
          <Divider />

          <Accordion
            expanded={accordionsExpandStatus.isTaskCardExpanded}
            title={accordionTitle(utils.string.t('claims.rfiDashboard.additionalDetails.associatedTaskDetails'))}
            onChange={(event, isExpanded) => setAccordiansIsExpanded('isTaskCardExpanded', isExpanded)}
            isDataLoading={claimInfo?.isLoading}
          >
            {renderInfoCard(taskInfo)}
          </Accordion>
        </div>
      </Accordion>
    </>
  );
}
