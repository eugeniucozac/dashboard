import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

// app
import { Empty, Loader } from 'components';
import { PlacementSummary } from 'modules';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import * as utils from 'utils';

// mui
import { Collapse, Fade } from '@material-ui/core';

// state
const mapStateToProps = (state) => ({
  placementSelected: state.placement.selected,
  placementSelectedLoading: state.placement.loadingSelected,
});

export class ClientSummary extends PureComponent {
  render() {
    const { placementSelected, placementSelectedLoading } = this.props;

    return (
      <Fragment>
        <Fade timeout={400} in={!placementSelected || !placementSelected.id}>
          <Collapse timeout={400} in={!placementSelected || !placementSelected.id}>
            <Empty
              title={utils.string.t('client.office.noPlacement')}
              text={utils.string.t('client.office.noPlacementHint')}
              icon={<IconSearchFile />}
              padding
            />
          </Collapse>
        </Fade>

        {placementSelected && placementSelected.id && (
          <PlacementSummary placement={placementSelected} showActions={true} testid="client-office" />
        )}

        <Loader visible={placementSelectedLoading} panel />
      </Fragment>
    );
  }
}

export default compose(connect(mapStateToProps, null))(ClientSummary);
