import React from 'react';
import PropTypes from 'prop-types';

// app
import { Accordion, Button } from 'components';
import * as utils from 'utils';
import styles from './PremiumProcessingCreateActionAccordion.styles';

// mui
import { makeStyles } from '@material-ui/core';

PremiumProcessingCreateActionAccordionView.propTypes = {
  handlers: PropTypes.shape({
    issueDocumentsHandler: PropTypes.func.isRequired,
    newRfiHandler: PropTypes.func.isRequired,
    manageDocuments: PropTypes.func.isRequired,
    checkSigningHandler: PropTypes.func.isRequired,
  }).isRequired,
  isUnassignedStage: PropTypes.bool,
  isCompletedStage: PropTypes.bool,
  isWorkBasket: PropTypes.bool,
  isAllCases: PropTypes.bool,
  userRoleRejectCase: PropTypes.bool,
  isValidRPSection: PropTypes.bool,
  isIssueDocumentStage: PropTypes.bool.isRequired,
  isQcFlag: PropTypes.bool,
  isCheckSigningCase: PropTypes.bool.isRequired,
  isRejectPendingActionStage: PropTypes.bool,
};

export default function PremiumProcessingCreateActionAccordionView({
  handlers,
  isUnassignedStage,
  isWorkBasket,
  isAllCases,
  userRoleRejectCase,
  isCompletedStage,
  isValidRPSection,
  isQcFlag,
  isIssueDocumentStage,
  isCheckSigningCase,
  isRejectPendingActionStage,
}) {
  const classes = makeStyles(styles, { name: 'AttachmentsAccordion' })();

  return (
    <section className={classes.attachmentsAccordion}>
      <Accordion title={utils.string.t('premiumProcessing.caseActionAccordion.title')} testid="processing-attachments">
        <section className={classes.details}>
          <Button
            text={utils.string.t('premiumProcessing.caseActionAccordion.newRfi')}
            color={'default'}
            variant={'outlined'}
            size="xsmall"
            disabled={isValidRPSection || isWorkBasket || isQcFlag || isAllCases || isUnassignedStage || isRejectPendingActionStage}
            onClick={() => handlers.newRfiHandler()}
          />
          <Button
            text={utils.string.t('premiumProcessing.caseActionAccordion.manageDocuments')}
            color={'default'}
            variant={'outlined'}
            size="xsmall"
            disabled={isWorkBasket || isAllCases || isUnassignedStage}
            onClick={() => handlers.manageDocuments()}
          />
          {!isCheckSigningCase && (
            <>
              <Button
                text={utils.string.t('premiumProcessing.caseActionAccordion.rejectCase')}
                color={'default'}
                variant={'outlined'}
                size="xsmall"
                onClick={() => handlers.handleRejectCase()}
                disabled={isWorkBasket || isAllCases || isUnassignedStage || isQcFlag || !userRoleRejectCase || isCompletedStage}
              />
              <Button
                text={utils.string.t('premiumProcessing.caseActionAccordion.issueDocuments')}
                color={'default'}
                variant={'outlined'}
                onClick={() => handlers.issueDocumentsHandler()}
                size="xsmall"
                disabled={isWorkBasket || isAllCases || isUnassignedStage || !isIssueDocumentStage || isCheckSigningCase}
              />
            </>
          )}
          {isAllCases && isCompletedStage && (
            <Button
              text={utils.string.t('premiumProcessing.caseActionAccordion.newCheckSigning')}
              color={'default'}
              variant={'outlined'}
              onClick={() => handlers.checkSigningHandler()}
              size="xsmall"
              disabled={!userRoleRejectCase}
            />
          )}
        </section>
      </Accordion>
    </section>
  );
}
