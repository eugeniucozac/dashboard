import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './OpportunityLeads.styles';
import { Empty, Link, Loader, SeparatedList, TableCell, TableHead, TableCheckbox, Translate, Warning } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box, Collapse, Fade, Table, TableBody, TableRow } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

OpportunityLeadsView.propTypes = {
  trip: PropTypes.object.isRequired,
  leads: PropTypes.array.isRequired,
  leadsLoading: PropTypes.bool.isRequired,
  leadsEmpty: PropTypes.bool.isRequired,
  expanded: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  handleClickLeadExisting: PropTypes.func.isRequired,
  handleClickCheckbox: PropTypes.func.isRequired,
  handleClickLead: PropTypes.func.isRequired,
};

export function OpportunityLeadsView({
  trip,
  leads,
  leadsLoading,
  leadsEmpty,
  expanded,
  selected,
  handleClickLeadExisting,
  handleClickCheckbox,
  handleClickLead,
}) {
  const classes = makeStyles(styles, { name: 'OpportunityLeads' })();
  const hasLeads = utils.generic.isValidArray(leads, true);

  const cols = [
    { id: 'client', label: utils.string.t('app.client') },
    { id: 'checkbox', label: utils.string.t('opportunity.addToTrip'), narrow: true, nowrap: true },
  ];

  return (
    <>
      <Collapse in={hasLeads}>
        <Fragment>
          <Fade in={hasLeads}>
            <Translate variant="h3" label="opportunity.leadsFound" />
          </Fade>

          <Table size="small" data-testid="leads-table">
            <TableHead columns={cols} />

            <TableBody data-testid="leads-list">
              {leads.map((lead) => {
                const rowHasVisits = utils.generic.isValidArray(lead.visits, true);
                const rowIsExpanded = expanded.includes(lead.id);

                const classesRow = {
                  [classes.rowExpanded]: rowIsExpanded,
                };

                return (
                  <Fragment key={lead.id}>
                    <TableRow
                      hover
                      selected={selected.includes(lead.id)}
                      onClick={handleClickLead(lead)}
                      className={classnames(classesRow)}
                      data-testid={`leads-row-${lead.id}`}
                    >
                      <TableCell data-testid={`leads-cell-name-${lead.id}`}>
                        {get(lead, 'client.name')}

                        {rowHasVisits && (
                          <div>
                            <Link
                              text={utils.string.t('opportunity.existingTrips')}
                              color="secondary"
                              icon={ArrowDropDownIcon}
                              iconPosition="right"
                              handleClick={handleClickLeadExisting(lead.id)}
                            />
                          </div>
                        )}
                      </TableCell>

                      <TableCell compact narrow center data-testid={`leads-cell-checkbox-${lead.id}`}>
                        <TableCheckbox
                          checked={trip.visits.map((v) => v.id).includes(lead.id)}
                          disabled={false}
                          handleClick={handleClickCheckbox(lead)}
                        />
                      </TableCell>
                    </TableRow>

                    {rowHasVisits &&
                      expanded.includes(lead.id) &&
                      lead.visits.map((visit) => {
                        const hasUsers = utils.generic.isValidArray(visit.users, true);

                        return (
                          <TableRow
                            hover
                            onClick={handleClickLead(lead)}
                            className={classes.visitRow}
                            data-testid={`leads-row-visit-${lead.id}-${visit.id}`}
                            key={visit.id}
                          >
                            <TableCell compact data-testid={`leads-cell-visit-name-${lead.id}-${visit.id}`}>
                              <div className={classes.visitWrapper}>
                                <SubdirectoryArrowRightIcon className={classes.iconSubdirectory} />
                                <div className={classes.visitDetails}>
                                  {hasUsers && (
                                    <SeparatedList
                                      list={visit.users.map((user) => {
                                        user.name = utils.user.fullname(user);
                                        return user;
                                      })}
                                    />
                                  )}
                                  {visit.visitingDate && (
                                    <span className={classes.visitDate}>
                                      (
                                      {utils.string.t('format.date', {
                                        value: { date: visit.visitingDate, format: config.ui.format.date.text },
                                      })}
                                      )
                                    </span>
                                  )}
                                  {!hasUsers && !visit.visitingDate && <span>&nbsp;</span>}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell minimal narrow center data-testid={`leads-cell-visit-checkbox-${lead.id}-${visit.id}`}>
                              <TableCheckbox
                                checked={trip.visits.map((v) => v.id).includes(visit.id)}
                                disabled={false}
                                handleClick={handleClickCheckbox(lead, visit)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Fragment>
      </Collapse>

      <Fade in={!hasLeads}>
        <Collapse in={!hasLeads}>
          <Box mt={-3}>
            <Empty text={utils.string.t('opportunity.searchHint')} />
            {leadsEmpty && (
              <Box mt={2}>
                <Warning text={utils.string.t('opportunity.leadsEmpty')} type="alert" icon />
              </Box>
            )}
          </Box>
        </Collapse>
      </Fade>

      <Loader visible={leadsLoading} label={utils.string.t('opportunity.leadsLoading')} absolute />
    </>
  );
}
