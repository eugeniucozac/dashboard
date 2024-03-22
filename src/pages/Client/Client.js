import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';

// app
import { Layout } from 'components';
import { ClientContent, ClientSummary } from 'modules';
import {
  addLoader,
  removeLoader,
  deleteParentPlacements,
  deselectPlacement,
  getParent,
  getParentPlacements,
  resetPlacementLocations,
  resetPortfolioMapLevel,
} from 'stores';
import config from 'config';
import * as utils from 'utils';

// mui
import ApartmentIcon from '@material-ui/icons/Apartment';

// state
const mapStateToProps = (state) => ({
  brand: state.ui.brand,
  parent: state.parent,
});

// dispatch
const mapDispatchToProps = {
  addLoader,
  removeLoader,
  deleteParentPlacements,
  deselectPlacement,
  getParent,
  getParentPlacements,
  resetPlacementLocations,
  resetPortfolioMapLevel,
};

export class Client extends PureComponent {
  componentWillMount() {
    const { match, deselectPlacement } = this.props;
    const urlParentId = toNumber(get(match, 'params.id'));

    deselectPlacement();

    if (urlParentId) {
      this.fetchParent(urlParentId);
    }
  }

  componentWillUnmount() {
    this.props.resetPlacementLocations();
  }

  componentDidUpdate(prevProps) {
    const prevParentId = get(prevProps, 'match.params.id');
    const nextParentId = get(this.props, 'match.params.id');

    if (prevParentId !== nextParentId) {
      this.props.resetPortfolioMapLevel();
      this.props.deselectPlacement();
      this.props.deleteParentPlacements();

      if (nextParentId) {
        this.fetchParent(nextParentId);
      }
    }
  }

  fetchParent = (id) => {
    const { addLoader, removeLoader, getParent, history } = this.props;

    addLoader('fetchParentsPlacements');

    // first get office details
    // then get placements for that office
    getParent(id).then((response) => {
      if (response && response.id) {
        this.fetchPlacements(id);
      } else {
        history.replace(config.routes.home.root);
        removeLoader('fetchParentsPlacements');
      }
    });
  };

  fetchPlacements = (id) => {
    const { removeLoader, getParentPlacements } = this.props;

    getParentPlacements(id).then(() => {
      removeLoader('fetchParentsPlacements');
    });
  };

  render() {
    const { parent, brand, match } = this.props;
    const urlParentId = toNumber(get(match, 'params.id'));

    const slug = get(match, 'params.slug');
    const parentName = get(parent, 'selected.name') || utils.string.capitalise(slug);
    const title = parentName ? `${utils.string.t('app.client')} - ${parentName}` : utils.string.t('client.title');

    return (
      <>
        <Helmet>
          <title>{`${title} - ${utils.app.getAppName(brand)}`}</title>
        </Helmet>

        <Layout testid="client">
          <Layout main>
            <ClientContent type="client" parent={parent} pageIcon={ApartmentIcon} urlParentId={urlParentId} />
          </Layout>

          <Layout sidebar padding={false}>
            {get(parent, 'selected') ? <ClientSummary /> : <span />}
          </Layout>
        </Layout>
      </>
    );
  }
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Client);
