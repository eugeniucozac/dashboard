import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { firstBy } from 'thenby';
import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';

// app
import styles from './DepartmentMarkets.styles';
import { Avatar, Button, Overflow, PopoverMenu, Restricted, StatusIcon, TableCell, TableHead, Translate } from 'components';
import * as constants from 'consts';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Grid, Table, TableRow, TableBody } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

DepartmentMarketsView.propTypes = {
  groups: PropTypes.array,
  items: PropTypes.array,
  cols: PropTypes.array.isRequired,
  deptId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  marketAccountStatuses: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    addDepartmentMarket: PropTypes.func.isRequired,
  }).isRequired,
  popoverActions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
};

export function DepartmentMarketsView({ groups, items, cols, deptId, marketAccountStatuses, popoverActions, handlers }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'DepartmentMarketsView' })({ wide: media.wideUp });

  return (
    <Box mt={2}>
      <Box mb={2}>
        <Grid container alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Grid item>
            <Button
              size="xsmall"
              variant="outlined"
              icon={AddIcon}
              text={<Translate label="market.addMarket" />}
              onClick={handlers.addDepartmentMarket({ deptId, markets: items.map((item) => item.market) })}
            />
          </Grid>
        </Grid>
      </Box>

      {groups &&
        utils.generic.isValidArray(groups, true) &&
        groups.map((group) => {
          const groupName = kebabCase(group.name);
          const markets = utils.sort.arrayNestedPropertyValue(group.markets, 'market.edgeName', 'asc');

          return (
            <Box mb={2} key={`${group.id}-${groupName}`}>
              <Overflow>
                <Table size="small" data-testid={`table-capacity-${group.id}-${groupName}`}>
                  <TableHead
                    columns={cols.map((col) => {
                      const isTitle = col.id === 'name';

                      if (isTitle) {
                        col.label = (
                          <Box display="flex" alignItems="center" position="relative">
                            <span>{group.name}</span>
                            {group.color && (
                              <Box ml={0.75} mb={-0.25}>
                                <Avatar text=" " size={10} bg={group.color} title={group.name} />
                              </Box>
                            )}
                          </Box>
                        );
                      }

                      return { ...col };
                    })}
                  />

                  <TableBody data-testid="department-market-list">
                    {utils.generic.isValidArray(markets, true) &&
                      markets.map((item) => {
                        const underwriters = get(item, 'underwriters', []).sort(firstBy(utils.sort.array('numeric', 'id')));

                        const hasStatus = !!(item.market && item.market.statusId);

                        return (
                          <TableRow
                            key={item.id}
                            hover
                            className={classnames(classes.row, {
                              [classes.rowNew]: Boolean(item.__new__),
                            })}
                          >
                            <TableCell nestedClasses={{ root: classes.cellsMarkets }}>
                              <div className={classes.market}>
                                <div className={classes.marketStatus}>
                                  <Restricted include={[constants.ROLE_BROKER]}>
                                    {hasStatus && (
                                      <StatusIcon translationPath="statusMarket" list={marketAccountStatuses} id={item.market.statusId} />
                                    )}
                                  </Restricted>
                                </div>
                                <div className={classes.marketName}>{utils.market.getName(item)}</div>
                              </div>
                            </TableCell>
                            <TableCell nestedClasses={{ root: classes.cellsUnderwriters }} colSpan={2}>
                              <Table size="small">
                                <TableBody>
                                  {underwriters.map((uw) => {
                                    return (
                                      <TableRow key={uw.id}>
                                        <TableCell borderless minimal nestedClasses={{ root: classes.cellsNested }}>
                                          <KeyboardArrowRightIcon className={classes.underwriterArrow} />
                                          <span className={classes.underwriterName}>{utils.user.fullname(uw)}</span>
                                        </TableCell>
                                        <TableCell borderless minimal nestedClasses={{ root: classes.cellsNested }}>
                                          {uw.emailId}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableCell>
                            <TableCell menu>
                              <PopoverMenu id="department-market" data={{ market: item, deptId }} items={popoverActions} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Overflow>
            </Box>
          );
        })}
    </Box>
  );
}
