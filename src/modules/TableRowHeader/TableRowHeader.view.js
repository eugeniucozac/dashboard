import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';

// app
import styles from './TableRowHeader.styles';
import { TableCell, Button } from 'components';
import { STATUS_CLAIMS_DRAFT } from 'consts';
import { getClaimsPreviewInformation, setClaimsTabSelectedItem } from 'stores';
import config from 'config';

// mui
import { makeStyles, Box, TableRow, Typography } from '@material-ui/core';
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

TableRowHeaderView.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  claimInformation: PropTypes.object,
  handlers: PropTypes.shape({
    selectTab: PropTypes.func,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export function TableRowHeaderView({ title, subtitle, isOpen, onClick, children, claimInformation, handlers }) {
  const classes = makeStyles(styles, { name: 'TableRowHeader' })({ expanded: isOpen });
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const handleEditClaim = (claim) => {
    async function getClaimInfo() {
      const claimInfo = await dispatch(
        getClaimsPreviewInformation({
          claimId: claim?.claimId,
          claimRefParams: claim?.actionID,
          sourceIdParams: claim?.instanceID,
          divisionIDParams: claim?.divisionID,
        })
      );

      await dispatch(setClaimsTabSelectedItem(claimInfo, true));
      const claimActionTab = `${config.routes.claimsFNOL.claim}/${claim?.actionID}`;
      if (location.pathname === claimActionTab) {
        handlers.selectTab('claimRefDetail');
      } else {
        await history.push({
          pathname: claimActionTab,
        });
      }
    }
    getClaimInfo();
  };

  return (
    <>
      <TableRow className={classes.wrapper} onClick={onClick} data-testid="table-row-header">
        <TableCell colSpan="100" className={classes.cell}>
          <Box display="flex">
            <Box className={classes.arrow}>
              <KeyboardArrowDownIcon />
            </Box>
            <Box className={classes.content}>
              <Typography variant="h2" className={classes.title}>
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            </Box>
            <Box className={classes.button}>
              <Button
                icon={OpenInNewOutlinedIcon}
                color="default"
                size="medium"
                variant="outlined"
                style={{ border: 'none' }}
                nestedClasses={{ btn: classes.button }}
                onClick={() => handleEditClaim(claimInformation)}
                disabled={claimInformation?.claimStatus === STATUS_CLAIMS_DRAFT}
              />
            </Box>
          </Box>
        </TableCell>
      </TableRow>
      {children}
    </>
  );
}
