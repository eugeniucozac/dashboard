import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classnames from 'classnames';
import kebabCase from 'lodash/kebabCase';

// app
import styles from './PlacementSummary.styles';
import { selectIsBroker } from 'stores';
import { AvatarGroup, Summary, Info, SeparatedList, Translate, DocumentAutoUpload, PopoverMenu } from 'components';
import { LayerAccordion, PolicyAccordion } from 'modules';
import * as utils from 'utils';
import config from 'config';

// mui
import { withStyles, Collapse, Fade } from '@material-ui/core';
import ApartmentIcon from '@material-ui/icons/Apartment';
import TodayIcon from '@material-ui/icons/Today';
import PeopleIcon from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/Add';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import uniqBy from 'lodash/uniqBy';
import * as constants from '../../consts';

// state
const mapStateToProps = (state) => ({
  referenceDataDepartments: state.referenceData.departments,
  referenceDataStatusesPlacement: state.referenceData.statuses.placement,
  isBroker: selectIsBroker(state),
});

export class PlacementSummary extends PureComponent {
  static propTypes = {
    placement: PropTypes.object,
    users: PropTypes.array,
    showActions: PropTypes.bool,
    showToggle: PropTypes.bool,
    expanded: PropTypes.bool,
    expandedToggle: PropTypes.oneOf(['btn', 'card']),
    collapseActions: PropTypes.bool,
    collapseTitle: PropTypes.bool,
    collapseSubtitle: PropTypes.bool,
    collapseDescription: PropTypes.bool,
    collapseContent: PropTypes.bool,
    handleExpand: PropTypes.func,
    handleClickExpand: PropTypes.func,
    testid: PropTypes.string,
  };

  renderSummaryActions = () => {
    const { showActions, placement, isBroker } = this.props;

    if (showActions) {
      const items = [];

      utils.placement.isPhysicalLoss(placement) &&
        items.push({
          id: 'overview',
          label: utils.string.t('placement.overview.title'),
          linkTo: `${config.routes.placement.overview}/${placement.id}`,
        });

      items.push({
        id: 'marketing',
        label: utils.string.t('placement.marketing.title'),
        linkTo: `${config.routes.placement.marketing.markets}/${placement.id}`,
      });

      isBroker &&
        items.push({
          id: 'modelling',
          label: utils.string.t('placement.modelling.title'),
          linkTo: `${config.routes.placement.modelling}/${placement.id}`,
        });

      isBroker &&
        items.push({
          id: 'openingMemo',
          label: utils.string.t('placement.openingMemo.title'),
          linkTo: `${config.routes.placement.checklist}/${placement.id}`,
        });

      items.push({
        id: 'documents',
        label: utils.string.t('placement.document.title'),
        linkTo: `${config.routes.placement.documents}/${placement.id}`,
      });

      return (
        <PopoverMenu
          color="primary"
          size="small"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          id="summary-actions"
          items={items}
        />
      );
    }

    return null;
  };

  renderSummaryInfos = () => {
    const { placement, users, classes } = this.props;
    const { locations = [] } = placement;

    const hasLocations = locations && locations.length > 0;

    const clients = utils.placement.getClients(placement).map((client, index) => {
      return (
        <span key={`${kebabCase(client)}-${index}`} className={classes.clients}>
          {client}
        </span>
      );
    });

    const brokers = utils.users.getBrokers(users, { gxbUsersIncluded: true });
    const cobrokersPlacement = utils.users.getCobrokers(users);
    const cobrokersOffice = utils.placement.getOfficeCobrokers(placement);
    const cobrokers = uniqBy([...cobrokersPlacement, ...cobrokersOffice]);

    const classesBoxes = {
      [classes.boxes]: true,
      [classes.boxesEmpty]: !hasLocations,
    };

    return (
      <div className={classnames(classes.info)}>
        {placement.clients && placement.clients.length > 0 && (
          <Info
            title={utils.string.t('app.client', { count: placement.clients.length })}
            avatarIcon={ApartmentIcon}
            description={clients}
            nestedClasses={{ root: classes.boxes }}
            data-testid="summary-clients"
          />
        )}

        {placement.inceptionDate && (
          <Info
            title={utils.string.t('app.inceptionDate')}
            avatarIcon={TodayIcon}
            description={
              <Translate label="format.date" options={{ value: { date: placement.inceptionDate, format: config.ui.format.date.text } }} />
            }
            nestedClasses={{ root: classes.boxes }}
            data-testid="summary-inceptiondate"
          />
        )}

        {brokers && brokers.length > 0 && (
          <Info
            title={utils.string.t('app.broker', { count: brokers.length })}
            avatarIcon={PeopleIcon}
            content={<AvatarGroup users={brokers} max={3} testid="summary-brokers" />}
            nestedClasses={{ root: classes.boxes }}
            data-testid="summary-brokers"
          />
        )}

        {cobrokers && cobrokers.length > 0 && (
          <Info
            title={utils.string.t('app.cobroker', { count: cobrokers.length })}
            avatarIcon={PeopleIcon}
            content={<AvatarGroup users={cobrokers} max={3} testid="summary-cobrokers" />}
            nestedClasses={{ root: classes.boxes }}
            data-testid="summary-cobrokers"
          />
        )}

        <div className={classnames(classesBoxes)}>
          <Fade in={hasLocations}>
            <div>
              <Collapse in={hasLocations}>
                <Info
                  title={utils.string.t('app.totalInsurableValue')}
                  avatarIcon={AddIcon}
                  description={
                    <Translate label="format.currency" options={{ value: { number: utils.location.getTiv(locations), currency: 'USD' } }} />
                  }
                  data-testid="summary-locations-tiv"
                />
              </Collapse>
            </div>
          </Fade>
        </div>

        <div className={classnames(classesBoxes)}>
          <Fade in={hasLocations}>
            <div>
              <Collapse in={hasLocations}>
                <Info
                  title={utils.string.t('app.locationsCount')}
                  avatarIcon={LocationOnIcon}
                  description={locations.length}
                  data-testid="summary-locations-count"
                />
              </Collapse>
            </div>
          </Fade>
        </div>
      </div>
    );
  };

  render() {
    const {
      placement,
      showToggle,
      expanded,
      expandToggle,
      collapseActions,
      collapseTitle,
      collapseSubtitle,
      collapseDescription,
      collapseContent,
      handleExpand,
      handleClickExpand,
      isBroker,
      referenceDataDepartments,
      referenceDataStatusesPlacement,
      testid,
    } = this.props;

    // abort
    if (!placement || !placement.id) return null;

    const department = utils.referenceData.departments.getById(referenceDataDepartments, placement.departmentId) || {};
    const statusBoundId = utils.referenceData.status.getIdByCode(referenceDataStatusesPlacement, constants.STATUS_PLACEMENT_BOUND);
    const statusLabel = utils.referenceData.status.getLabelById(referenceDataStatusesPlacement, placement.statusId);
    const isBound = utils.placement.isBound(placement, statusBoundId);

    return (
      <Summary
        status={statusLabel}
        title={
          <SeparatedList
            list={placement.insureds}
            flag="isProvisional"
            flagSize="80%"
            flagIcon={InfoOutlinedIcon}
            flagTooltip={<Translate label="renewals.provisionalInsuredTooltip" />}
            hover
            hoverWeight="regular"
          />
        }
        subtitle={department.name}
        description={placement.description}
        actions={this.renderSummaryActions()}
        infos={this.renderSummaryInfos()}
        showToggle={showToggle}
        expanded={expanded}
        expandToggle={expandToggle}
        collapseActions={collapseActions}
        collapseTitle={collapseTitle}
        collapseSubtitle={collapseSubtitle}
        collapseDescription={collapseDescription}
        collapseContent={collapseContent}
        handleExpand={handleExpand}
        handleClickExpand={handleClickExpand}
        testid={testid}
      >
        {isBound ? <PolicyAccordion placement={placement} /> : <LayerAccordion placement={placement} />}
        {isBroker && expanded !== false && (
          <DocumentAutoUpload divider={true} link={`${config.routes.placement.documents}/${placement.id}`} placement={placement} />
        )}
      </Summary>
    );
  }
}

export default compose(connect(mapStateToProps, null), withStyles(styles))(PlacementSummary);
