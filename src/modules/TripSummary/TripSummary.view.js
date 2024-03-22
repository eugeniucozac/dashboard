import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

// app
import styles from './TripSummary.styles';
import {
  AvatarGroup,
  Button,
  Empty,
  FormDateFormik,
  FormTextFormik,
  Info,
  InlineEdit,
  MapBox,
  MapBoxTooltip,
  PopoverMenu,
  Ratio,
  SeparatedList,
  Summary,
  TableCell,
  TableHead,
  Translate,
  Warning,
} from 'components';
import * as utils from 'utils';
import config from 'config';
import { ReactComponent as EarthPinFile } from '../../assets/svg/line-icon-earth-pin.svg';

// mui
import { makeStyles, Box, Collapse, Fade, Table, TableBody, TableRow, Typography } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';

TripSummaryView.propTypes = {
  trip: PropTypes.object,
  visits: PropTypes.array,
  map: PropTypes.object,
  isExisting: PropTypes.bool,
  inlineEditMode: PropTypes.bool,
  inlineEditingFields: PropTypes.object,
  mobile: PropTypes.bool,
  tablet: PropTypes.bool,
  desktop: PropTypes.bool,
  wide: PropTypes.bool,
  handleClickLead: PropTypes.func,
  handleClickMarker: PropTypes.func,
  handleEditVisit: PropTypes.func,
  handleClickRemoveVisit: PropTypes.func,
  handleEditBrokersClick: PropTypes.func,
  handleClickEditTitle: PropTypes.func,
  handleClickAwayEditTitle: PropTypes.func,
  handleSaveTrip: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export function TripSummaryView({
  trip = {},
  visits,
  map,
  isExisting,
  inlineEditMode,
  inlineEditingFields,
  mobile,
  tablet,
  desktop,
  wide,
  handleClickLead,
  handleClickMarker,
  handleEditVisit,
  handleClickRemoveVisit,
  handleEditBrokersClick,
  handleClickEditTitle,
  handleClickAwayEditTitle,
  handleSaveTrip,
  handleSubmit,
  handleOnLoad,
  handleOnChange,
}) {
  const classes = makeStyles(styles, { name: 'TripSummary' })();
  const hasVisits = utils.generic.isValidArray(visits, true);
  const showSummary = Boolean(trip.id || hasVisits);

  const dateFrom = utils.trip.getDateFrom(visits);
  const dateTo = utils.trip.getDateTo(visits);
  const brokers = utils.trip.getBrokers(visits);

  const cols = [
    { id: 'visits', label: <Translate label="app.visit_plural" /> },
    { id: 'date', label: <Translate label="app.date" />, align: 'center' },
    { id: 'actions', empty: true },
  ];

  const formFields = [
    {
      name: 'title',
      type: 'text',
      value: trip.title || '',
      label: utils.string.t('form.title.label'),
      placeholder: utils.string.t('opportunity.addTripTitle'),
      validation: Yup.string().trim().required(utils.string.t('form.title.required')),
    },
    ...visits.map((visit) => {
      return {
        id: visit.id,
        name: `date-${visit.id}`,
        type: 'datepicker',
        value: visit.visitingDate || null,
        validation: Yup.mixed().required(),
        plainText: true,
        muiPickerProps: {
          disableToolbar: true,
          variant: 'inline',
          format: config.ui.format.date.text,
        },
        nestedClasses: {
          input: visit.visitingDate ? classes.dateInput : classes.dateAddLink,
        },
      };
    }),
  ];

  const customTooltipComponent = ({ tooltip }) => {
    return <MapBoxTooltip title={get(tooltip, 'client.name')} list={[{ icon: <LocationOnIcon />, title: tooltip.outputAddress }]} />;
  };

  const FormDateComponent = ({ field, form, ...rest }) => {
    return (
      <FormDateFormik
        {...rest}
        name={field.name}
        value={field.value}
        handleUpdate={(name, value) => {
          const date = value ? utils.string.t('format.date', { value: { date: value, format: 'YYYY-MM-DD' } }) : null;

          form.setFieldValue(name, date);
          handleEditVisit({ id: rest.id, visitingDate: date }, inlineEditMode);
        }}
      />
    );
  };

  return (
    <Fragment>
      <Fade in={showSummary}>
        <Collapse in={showSummary}>
          {showSummary && (
            <Summary
              commentsOptions={{
                id: trip.id ? `broker/trip/${trip.id}` : null,
                title: utils.string.t('trips.commentsTitle'),
                placeholder: utils.string.t('trips.commentsPlaceholder'),
              }}
              testid="trip"
            >
              <div className={classes.wrapper}>
                {isExisting && (
                  <div className={classnames(classes.info)}>
                    <Info
                      title={utils.string.t('app.leadUser')}
                      avatarIcon={PersonIcon}
                      content={<AvatarGroup users={[trip.user]} max={1} />}
                      nestedClasses={{ root: classnames(classes.boxes) }}
                      data-testid="trip-summary-lead-user"
                    />
                    {hasVisits && (
                      <Fragment>
                        <Info
                          title={utils.string.t('app.broker', { count: brokers.length })}
                          avatarIcon={PeopleIcon}
                          content={<AvatarGroup users={brokers} max={3} />}
                          nestedClasses={{ root: classnames(classes.boxes) }}
                          data-testid="trip-summary-brokers"
                        />
                        <Info
                          title={utils.string.t('app.dateFrom')}
                          avatarIcon={TodayIcon}
                          description={
                            <Translate
                              label="format.date"
                              options={{ value: { date: dateFrom, format: config.ui.format.date.text, default: '-' } }}
                            />
                          }
                          nestedClasses={{ root: classnames(classes.boxes) }}
                          data-testid="trip-summary-date-from"
                        />
                        <Info
                          title={utils.string.t('app.dateTo')}
                          avatarIcon={EventIcon}
                          description={
                            <Translate
                              label="format.date"
                              options={{
                                value: {
                                  date: dateFrom !== dateTo && dateTo,
                                  format: config.ui.format.date.text,
                                  default: '-',
                                },
                              }}
                            />
                          }
                          nestedClasses={{ root: classnames(classes.boxes) }}
                          data-testid="trip-summary-date-to"
                        />
                      </Fragment>
                    )}
                  </div>
                )}

                {isExisting && (
                  <Box mt={4} mb={1} data-testid="trip-summary-map">
                    <Ratio w={mobile ? 1.25 : tablet ? 1.5 : desktop ? 1.25 : wide ? 1.5 : 1.75} h={1}>
                      <MapBox
                        id="visits-summary"
                        responsive
                        center={map.center}
                        zoom={map.zoom}
                        markerMaxZoom={map.maxZoom}
                        allowSatelliteView={false}
                        fitBounds
                        locations={visits}
                        activeMarkers={map.activeMarkers}
                        onClickMarker={handleClickMarker}
                        onLoad={handleOnLoad}
                        onChange={handleOnChange}
                        tooltipComponent={customTooltipComponent}
                      />
                    </Ratio>
                  </Box>
                )}

                <Formik
                  key={`${trip.id}-${visits.map((visit) => visit.id).join('-')}`} // we use a key to keep track of how/when to force a form re-initialization
                  initialValues={utils.form.getInitialValues(formFields)}
                  validationSchema={utils.form.getValidationSchema(formFields)}
                  onSubmit={() => {
                    handleSaveTrip(isExisting);
                  }}
                >
                  {({ values, errors, dirty, validateForm, submitForm, setFieldValue }) => {
                    const isMissingDates = !isEmpty(errors) && Object.entries(errors).find((error) => error[0].includes('date-'));
                    const isMissingUsers = visits.find((visit) => !visit.users || visit.users.length <= 0);

                    return (
                      <Fragment>
                        <div className={classes.titleWrapper} data-testid="trip-summary-title">
                          {isExisting && inlineEditMode && (
                            <Typography variant="h2" className={classes.title}>
                              <InlineEdit
                                name="title"
                                value={values['title']}
                                error={Boolean(errors['title'])}
                                editing={inlineEditingFields.title}
                                multiline
                                onClick={handleClickEditTitle}
                                onClickAway={handleClickAwayEditTitle(
                                  values['title'],
                                  errors['title'],
                                  dirty,
                                  validateForm,
                                  submitForm,
                                  setFieldValue,
                                  true
                                )}
                              />
                            </Typography>
                          )}

                          {!(isExisting && inlineEditMode) && (
                            <FormTextFormik
                              {...utils.form.getFieldProps(formFields, 'title')}
                              muiComponentProps={{
                                multiline: true,
                                InputProps: {
                                  onBlur: (event) => {
                                    const prevValue = utils.form.getFieldProps(formFields, 'title').value;
                                    const newValue = values['title'];

                                    if (prevValue !== newValue) {
                                      handleClickAwayEditTitle(
                                        newValue,
                                        errors['title'],
                                        dirty,
                                        validateForm,
                                        submitForm,
                                        setFieldValue,
                                        false
                                      )(event);
                                    }
                                  },
                                },
                              }}
                            />
                          )}
                        </div>

                        {hasVisits && (
                          <Table size="small" data-testid="visits-table">
                            <TableHead columns={cols} />

                            <TableBody data-testid="visits-list">
                              {visits.map((visit) => {
                                return (
                                  <TableRow
                                    key={visit.id}
                                    hover={isExisting}
                                    onClick={isExisting ? handleClickLead(visit) : undefined}
                                    className={
                                      isExisting
                                        ? classnames(classes.row, {
                                            [classes.rowSelected]: map.activeMarkers.includes(visit.id),
                                          })
                                        : undefined
                                    }
                                    data-testid={`visit-row-${visit.id}`}
                                  >
                                    <TableCell data-testid={`visit-cell-name-${visit.id}`}>
                                      {get(visit, 'client.name')}

                                      {utils.generic.isValidArray(visit.users, true) && (
                                        <div className={classes.users}>
                                          <SeparatedList
                                            list={visit.users.map((user) => {
                                              user.name = utils.user.fullname(user);
                                              return user;
                                            })}
                                          />
                                        </div>
                                      )}
                                    </TableCell>

                                    <TableCell
                                      minimal
                                      narrow
                                      nowrap
                                      center
                                      onClick={(event) => event.stopPropagation()} // prevent map flyTo animation when clicking on DatePicker
                                      data-testid={`visit-cell-date-${visit.id}`}
                                    >
                                      <div className={classes.dateWrapper}>
                                        <Field
                                          {...utils.form.getFieldProps(formFields, `date-${visit.id}`)}
                                          component={FormDateComponent}
                                        />
                                      </div>
                                    </TableCell>

                                    <TableCell menu data-testid={`visit-cell-menu-${visit.id}`}>
                                      <PopoverMenu
                                        id="visit-menu"
                                        data={{
                                          visit,
                                          inlineEditMode,
                                        }}
                                        items={[
                                          {
                                            id: 'add-remove-brokers',
                                            label: 'opportunity.addRemoveBrokers',
                                            callback: handleEditBrokersClick,
                                          },
                                          {
                                            id: 'remove',
                                            label: 'app.remove',
                                            callback: handleClickRemoveVisit,
                                          },
                                        ]}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        )}

                        {!inlineEditMode && (isMissingDates || isMissingUsers) && (
                          <Box mt={2}>
                            {isMissingDates && <Warning type="error" text={utils.string.t('trips.validation.dates')} icon />}
                            {isMissingUsers && <Warning type="error" text={utils.string.t('trips.validation.users')} icon />}
                          </Box>
                        )}

                        {!inlineEditMode && (
                          <Box mt={2}>
                            <Button
                              color="primary"
                              text={utils.string.t('opportunity.saveTrip')}
                              onClick={handleSubmit(submitForm, validateForm)}
                            />
                          </Box>
                        )}
                      </Fragment>
                    );
                  }}
                </Formik>
              </div>
            </Summary>
          )}
        </Collapse>
      </Fade>

      <Fade timeout={400} in={!showSummary}>
        <Collapse timeout={400} in={!showSummary}>
          <Empty
            title={utils.string.t(isExisting ? 'trips.summaryHintTitle' : 'opportunity.summaryHintTitle')}
            text={utils.string.t(isExisting ? 'trips.summaryHintText' : 'opportunity.summaryHintText')}
            icon={<EarthPinFile />}
            padding
          />
        </Collapse>
      </Fade>
    </Fragment>
  );
}
