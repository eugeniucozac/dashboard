import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';

// app
import styles from './PlacementSummaryTop.styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { AvatarGroup, SummaryTop, Info, SeparatedList, Translate } from 'components';
import { LayerAccordion, PolicyAccordion } from 'modules';
import * as utils from 'utils';
import config from 'config';
import { showModal } from 'stores';

// mui
import { makeStyles, Collapse, Fade } from '@material-ui/core';
import ApartmentIcon from '@material-ui/icons/Apartment';
import TodayIcon from '@material-ui/icons/Today';
import PeopleIcon from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/Add';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import uniqBy from 'lodash/uniqBy';
import * as constants from '../../consts';

PlacementSummaryTop.propTypes = {
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

export function PlacementSummaryTop(props) {
  const [isOpenSummaryTop, setIsOpenSummaryTop] = useState(false);
  const classes = makeStyles(styles, { name: 'PlacementSummary' })();
  // state

  const referenceDataDepartments = useSelector((state) => get(state, 'referenceData.departments'));
  const referenceDataStatusesPlacement = useSelector((state) => get(state, 'referenceData.statuses.placement'));

  const dispatch = useDispatch();

  const renderSummaryHeaderInfos = () => {
    const { placement } = props;
    const { locations = [] } = placement;
    const hasLocations = locations && locations.length > 0;

    const clients = utils.placement
      .getClients(placement)
      .slice(0, 2)
      .map((client, index) => {
        return (
          <span key={`${kebabCase(client)}-${index}`} className={classes.clients}>
            {client}
          </span>
        );
      });

    const classesBoxes = {
      [classes.headerBoxes]: true,
      [classes.boxesEmpty]: !hasLocations,
    };

    return (
      <div className={classnames(classes.headerInfo)}>
        {placement.clients && placement.clients.length > 0 && (
          <Info
            title={clients}
            avatarIcon={ApartmentIcon}
            nestedClasses={{ root: classes.headerBoxes, content: classes.infoContent }}
            data-testid="summary-clients"
            ellipsis={true}
          />
        )}

        {placement.inceptionDate && (
          <Info
            title={
              <Translate label="format.date" options={{ value: { date: placement.inceptionDate, format: config.ui.format.date.text } }} />
            }
            avatarIcon={TodayIcon}
            nestedClasses={{ root: classes.headerBoxes, details: classes.infoContent }}
            data-testid="summary-inceptiondate"
          />
        )}
        {hasLocations ? (
          <div className={classnames(classesBoxes)}>
            <Fade in={hasLocations}>
              <div>
                <Collapse in={hasLocations}>
                  <Info
                    title={
                      <Translate
                        label="format.currency"
                        options={{ value: { number: utils.location.getTiv(locations), currency: 'USD' } }}
                        nestedClasses={{ details: classes.infoContent }}
                      />
                    }
                    avatarIcon={AddIcon}
                    data-testid="summary-locations-tiv"
                  />
                </Collapse>
              </div>
            </Fade>
          </div>
        ) : null}
        {hasLocations ? (
          <div className={classnames(classesBoxes)}>
            <Fade in={hasLocations}>
              <div>
                <Collapse in={hasLocations}>
                  <Info
                    title={locations.length}
                    avatarIcon={LocationOnIcon}
                    data-testid="summary-locations-count"
                    nestedClasses={{ details: classes.infoContent }}
                  />
                </Collapse>
              </div>
            </Fade>
          </div>
        ) : null}
      </div>
    );
  };

  const renderSummaryInfos = () => {
    const { placement, users } = props;
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
            ellipsis
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
    testid,
  } = props;

  // abort
  if (!placement || !placement.id) return null;

  const department = utils.referenceData.departments.getById(referenceDataDepartments, placement.departmentId) || {};
  const statusBoundId = utils.referenceData.status.getIdByCode(referenceDataStatusesPlacement, constants.STATUS_PLACEMENT_BOUND);
  const statusLabel = utils.referenceData.status.getLabelById(referenceDataStatusesPlacement, placement.statusId);
  const isBound = utils.placement.isBound(placement, statusBoundId);

  const handleSummaryTop = () => {
    setIsOpenSummaryTop((prev) => !prev);
  };

  const handleEditPlacement = () => {
    dispatch(
      showModal({
        component: 'EDIT_PLACEMENT',
        props: {
          title: 'renewals.editPlacement',
          subtitle: utils.string.t('renewals.editPlacementHint', { placement: placement.insureds.map((insured) => insured.name) }),
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            placement: placement,
            calendarView: false,
          },
        },
      })
    );
  };

  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          isOpenSummaryTop && handleSummaryTop();
        }}
      >
        <div className={classes.summaryContainer}>
          <SummaryTop
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
            infos={renderSummaryInfos()}
            headerInfo={renderSummaryHeaderInfos()}
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
            isOpen={isOpenSummaryTop}
            handleSummaryTop={handleSummaryTop}
            handleEditPlacement={handleEditPlacement}
            testid={testid}
          >
            {isBound ? (
              <PolicyAccordion placement={placement} nestedClasses={{ root: classes.accordion }} />
            ) : (
              <LayerAccordion placement={placement} nestedClasses={{ root: classes.accordion }} />
            )}
          </SummaryTop>
        </div>
      </ClickAwayListener>
    </>
  );
}

export default PlacementSummaryTop;
