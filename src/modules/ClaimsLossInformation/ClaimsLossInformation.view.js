import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// app
import styles from './ClaimsLossInformation.styles';
import { Accordion, Info } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

ClaimsLossInformationView.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.shape({}),
  actions: PropTypes.array.isRequired,
};

export function ClaimsLossInformationView({ title, details, actions }) {
  const classes = makeStyles(styles, { name: 'ClaimsLossInformation' })();

  const typeOfQualifier = [{ id: 1, name: 'Auto Populated' }];
  const typeOfCatCode = [{ id: 1, name: 'Auto Populated' }];

  return (
    <section className={classes.caseAccordion}>
      <Accordion title={title} actions={actions} testid="search-loss-information">
        {details && (
          <section className={classes.details}>
            <Info
              title={utils.string.t('claims.lossInformation.ref')}
              description={details.id}
              nestedClasses={{ root: classnames(classes.description) }}
              data-testid="loss-id"
            />
            <Info
              title={utils.string.t('claims.lossInformation.qualifier')}
              description={typeOfQualifier[0].name}
              nestedClasses={{ root: classnames(classes.description) }}
              data-testid="loss-qualifier"
            />
            <Info
              title={utils.string.t('claims.lossInformation.name')}
              description={details.name}
              nestedClasses={{ root: classnames(classes.description) }}
              data-testid="loss-name"
            />
            <Info
              title={utils.string.t('claims.lossInformation.fromDate')}
              description={details.lossDate}
              nestedClasses={{ root: classnames(classes.description) }}
              data-testid="loss-date-from"
            />
            <Info
              title={utils.string.t('claims.lossInformation.details')}
              description="lorem ipsum lorem ipsum"
              nestedClasses={{ root: classnames(classes.description) }}
              data-testid="loss-details"
            />
            <Info
              title={utils.string.t('claims.lossInformation.toDate')}
              description={details.lossDate}
              nestedClasses={{ root: classnames(classes.description) }}
              data-testid="loss-date-to"
            />
            <Info
              title={utils.string.t('claims.lossInformation.catCode')}
              description={typeOfCatCode[0].name}
              nestedClasses={{ root: classnames(classes.description) }}
              data-testid="cat-code"
            />
          </section>
        )}
      </Accordion>
    </section>
  );
}
