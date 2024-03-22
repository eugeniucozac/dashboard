import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './PremiumProcessingPendingActionAccordion.styles';
import { Accordion, Button } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

PremiumProcessingPendingActionAccordionView.propTypes = {
  handlers: PropTypes.shape({
    newRfiHandler: PropTypes.func.isRequired,
    issueDocumentsHandler: PropTypes.func.isRequired,
  }).isRequired,
  isValidRPSection: PropTypes.bool,
  isUnassignedStage: PropTypes.bool,
  isWorkBasket: PropTypes.bool,
  isIssueDocumentStage: PropTypes.bool.isRequired,
  isAllCases: PropTypes.bool,
  isCheckSigningCase: PropTypes.bool.isRequired,
  isQcFlag: PropTypes.bool.isRequired,
};

export function PremiumProcessingPendingActionAccordionView({
  handlers,
  isValidRPSection,
  isWorkBasket,
  isUnassignedStage,
  isAllCases,
  isCheckSigningCase,
  isIssueDocumentStage,
  isQcFlag,
}) {
  const classes = makeStyles(styles, { name: 'Accordion' })();
  return (
    <section className={classes.caseAccordion}>
      <Accordion title={utils.string.t('premiumProcessing.pendingActionAccordion.title')} testid="processing-case">
        <section className={classes.details}>
          <Button
            text={utils.string.t('premiumProcessing.pendingActionAccordion.rfis')}
            color={'default'}
            variant={'outlined'}
            size="xsmall"
            disabled={isValidRPSection || isWorkBasket || isQcFlag || isAllCases || isUnassignedStage || isCheckSigningCase}
            onClick={() => handlers.newRfiHandler()}
          />
          {!isCheckSigningCase && (
            <Button
              text={utils.string.t('premiumProcessing.caseActionAccordion.issueDocuments')}
              color={'default'}
              variant={'outlined'}
              onClick={() => handlers.issueDocumentsHandler()}
              size="xsmall"
              disabled={isWorkBasket || isAllCases || isUnassignedStage || !isIssueDocumentStage}
            />
          )}
        </section>
      </Accordion>
    </section>
  );
}
