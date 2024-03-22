import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import get from 'lodash/get';

// app
import styles from './ClientContent.styles';
import { SectionHeader, Translate } from 'components';
import { ClientSelection, MarketSelection } from 'forms';
import { ClientCharts } from 'modules';
import * as utils from 'utils';

// mui
import { withStyles, Collapse } from '@material-ui/core';

export class ClientContent extends PureComponent {
  static propTypes = {
    urlParentId: PropTypes.number,
    type: PropTypes.oneOf(['client', 'market']).isRequired,
  };

  render() {
    const { parent, urlParentId, showByMarket, showByYear, showOfficeSelection, type, pageIcon, classes } = this.props;

    const pageTitlePlural = utils.string.t(`${type}.title`);
    const pageTitle = utils.string.t(`app.${type}`);
    const selectLabel = utils.string.t(`${type}.selectFromList`);

    const SelectionComponent = type === 'market' ? MarketSelection : ClientSelection;

    const isReady =
      parent &&
      get(parent, 'selected.id') &&
      get(parent, 'placementsFetched') &&
      !get(parent, 'loading.selected') &&
      !get(parent, 'loading.placements');

    return (
      <Fragment>
        <Collapse in={!Boolean(urlParentId)} timeout={'auto'}>
          <SectionHeader title={pageTitlePlural} icon={pageIcon} nestedClasses={{ root: classes.header }} testid={`${type}-analysis`} />

          <Fragment>
            <Translate variant="h5" label={selectLabel} />
            <SelectionComponent nestedClasses={{ form: classes.selection }} />
          </Fragment>
        </Collapse>

        {Boolean(urlParentId) && isReady && (
          <ClientCharts
            key={get(parent, 'selected.id')}
            type={type}
            parent={parent}
            pageTitle={pageTitle}
            pageIcon={pageIcon}
            showByMarket={showByMarket}
            showByYear={showByYear}
            showOfficeSelection={showOfficeSelection}
          />
        )}
      </Fragment>
    );
  }
}

export default compose(withRouter, withStyles(styles))(ClientContent);
