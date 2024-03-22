import React, { useState } from 'react';
import PropTypes from 'prop-types';

// app
import { Button, FilterBar, FormGrid, Translate, Restricted } from 'components';
import { DepartmentAccountsList, DepartmentAccountsCalendarList, DepartmentAccountsCalendarTable, DepartmentAccountsTable } from 'modules';

import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles, Box, Grid } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import AddIcon from '@material-ui/icons/Add';
import TodayIcon from '@material-ui/icons/Today';

import styles from './DepartmentAccounts.styles';

DepartmentAccountsView.propTypes = {
  props: PropTypes.shape({
    rows: PropTypes.array.isRequired,
    cols: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    pagination: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired,
  }).isRequired,
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  deptId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  media: PropTypes.object.isRequired,
  calendarView: PropTypes.bool.isRequired,
};

export function DepartmentAccountsView({
  props,
  fields,
  actions,
  deptId,
  media,
  calendarView,
  displayMonthList,
  handleAddButtonClick,
  handleMonthChange,
  clickNewEnquiry,
}) {
  const useStyles = makeStyles(styles, { name: 'DepartmentAccounts' });
  const classes = useStyles();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const firstMonth = displayMonthList[0];
  const lastMonth = displayMonthList[displayMonthList.length - 1];
  return (
    <Box mt={3} data-testid="department-accounts">
      <Box display="flex" p={1}>
        {!media.mobile ? (
          <Restricted include={[constants.ROLE_BROKER, constants.ROLE_COBROKER]}>
            <Grid item className={classes.gridActions}>
              <Button
                icon={AddIcon}
                size="medium"
                text={<Translate label={!media.mobile && 'submission.new'} />}
                variant="contained"
                color="primary"
                onClick={clickNewEnquiry}
                data-testid="new-enquiry"
              />
            </Grid>
          </Restricted>
        ) : null}
        <Box mb={media.mobile ? 4 : 2} width={media.mobile ? '100%' : '40%'} marginLeft="auto">
          <FilterBar id="departmentFilter" fields={fields} actions={actions} key={deptId} />
        </Box>
      </Box>
      {media.mobile ? (
        <Box mx={-3} data-testid="department-accounts-mobile-calendar">
          {calendarView ? (
            <>
              <Box mt={8} mb={media.mobile ? 4 : 2} ml={2} position="relative">
                <FormGrid container justifyContent="center">
                  <FormGrid>
                    <Button
                      onClick={() => handleAddButtonClick(utils.date.previousMonth(firstMonth).date, false)}
                      icon={AddIcon}
                      size="small"
                      text={`${utils.date.previousMonth(firstMonth).monthName}`}
                      variant="outlined"
                      color="primary"
                      data-testid="previous-month-button"
                    />
                  </FormGrid>

                  <FormGrid nestedClasses={{ container: classes.rootCurrentMonth }}>
                    <DatePicker
                      open={isCalendarOpen}
                      autoOk
                      openTo="month"
                      emptyLabel=""
                      views={['month', 'year']}
                      format="MMMM YYYY"
                      icon="TodayIcon"
                      onClose={() => setIsCalendarOpen(false)}
                      onChange={(value) => {
                        handleMonthChange(value);
                        setIsCalendarOpen(false);
                      }}
                      className={classes.hidden}
                    />

                    <TodayIcon size="small" onClick={() => setIsCalendarOpen(true)} className={classes.todayIconMobile} />
                  </FormGrid>
                </FormGrid>
              </Box>
              {displayMonthList.map((displayMonth) => {
                const monthDetails = utils.date.monthDetails(displayMonth);
                const title = `${monthDetails.monthName} ${monthDetails.year}`;

                return (
                  <Box key={`${monthDetails.monthName}-${monthDetails.year}-${deptId}`}>
                    <Box pl={3} pr={3}>
                      <Translate variant="h2" label={title} />
                    </Box>
                    <DepartmentAccountsCalendarList {...props} deptId={deptId} monthDetails={monthDetails} />
                  </Box>
                );
              })}

              <Box mt={4} mb={2}>
                <FormGrid container justifyContent="center">
                  <FormGrid>
                    <Button
                      onClick={() => handleAddButtonClick(utils.date.nextMonth(lastMonth).date, true)}
                      icon={AddIcon}
                      size="small"
                      text={`${utils.date.nextMonth(lastMonth).monthName}`}
                      variant="outlined"
                      color="primary"
                      data-testid="next-month-button"
                    />
                  </FormGrid>
                </FormGrid>
              </Box>
            </>
          ) : (
            <DepartmentAccountsList {...props} />
          )}
        </Box>
      ) : (
        <>
          {calendarView ? (
            <>
              <Box mt={6} mb={media.mobile ? 4 : 2} ml={2} data-testid="department-accounts-calendar">
                <FormGrid container justifyContent="center">
                  <FormGrid>
                    <Button
                      onClick={() => handleAddButtonClick(utils.date.previousMonth(firstMonth).date, false)}
                      icon={AddIcon}
                      size="small"
                      text={`${utils.date.previousMonth(firstMonth).monthName}`}
                      variant="outlined"
                      color="primary"
                      data-testid="previous-month-button"
                    />
                  </FormGrid>

                  <FormGrid nestedClasses={{ container: classes.rootCurrentMonth }}>
                    <DatePicker
                      open={isCalendarOpen}
                      autoOk
                      openTo="month"
                      emptyLabel=""
                      views={['month', 'year']}
                      format="MMMM YYYY"
                      icon="TodayIcon"
                      onClose={() => setIsCalendarOpen(false)}
                      onChange={(value) => {
                        handleMonthChange(value);
                        setIsCalendarOpen(false);
                      }}
                      className={classes.hidden}
                    />
                    <div className={classes.todayIcon}>
                      <Button
                        onClick={() => setIsCalendarOpen(true)}
                        icon={TodayIcon}
                        iconPosition="right"
                        size="small"
                        text={`Select month`}
                        variant="outlined"
                        color="primary"
                        data-testid="previous-month-button"
                      />
                    </div>
                  </FormGrid>
                </FormGrid>
              </Box>
              {displayMonthList.map((displayMonth) => {
                const monthDetails = utils.date.monthDetails(displayMonth);
                const title = `${monthDetails.monthName} ${monthDetails.year}`;

                return (
                  <Box key={`${monthDetails.monthName}-${monthDetails.year}-${deptId}`}>
                    <Translate variant="h3" label={title} />
                    <DepartmentAccountsCalendarTable {...props} deptId={deptId} monthDetails={monthDetails} />
                  </Box>
                );
              })}

              <Box mb={media.mobile ? 4 : 2} ml={2}>
                <FormGrid container justifyContent="center">
                  <FormGrid>
                    <Button
                      onClick={() => handleAddButtonClick(utils.date.nextMonth(lastMonth).date, true)}
                      icon={AddIcon}
                      size="small"
                      text={`${utils.date.nextMonth(lastMonth).monthName}`}
                      variant="outlined"
                      color="primary"
                      data-testid="next-month-button"
                    />
                  </FormGrid>
                </FormGrid>
              </Box>
            </>
          ) : (
            <DepartmentAccountsTable {...props} />
          )}
        </>
      )}
    </Box>
  );
}
