import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import get from 'lodash/get';

//app
import * as utils from 'utils';
import styles from './PremiumProcessingCaseTeamModuleDetails.styles';
import { ContentHeader, Translate, Info, Warning, Tooltip, ErrorMessage } from 'components';

//mui
import { makeStyles, Box } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

PremiumProcessingCaseTeamModuleDetailsView.propTypes = {
  caseTeamModule: PropTypes.object,
};

export function PremiumProcessingCaseTeamModuleDetailsView({ caseTeamModule }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseTeamModuleDetails' })();
  const teamListForCase = caseTeamModule;
  const isCaseTeamModuleLoading = caseTeamModule?.isCaseTeamModuleLoading || false;
  const isAPIErrorMsg = caseTeamModule?.error;
  return (
    <>
      <Box mt={6}>
        <ContentHeader title={utils.string.t('premiumProcessing.caseTeamModule.title')} marginBottom={0} />
        {get(teamListForCase, 'caseId') ? (
          <section className={classes.details}>
            <Box display="flex" flexDirection="row" flex="1">
              <Info
                showSkeleton={isCaseTeamModuleLoading}
                title={
                  <Translate
                    label={
                      teamListForCase.technicianDetails?.title
                        ? teamListForCase.technicianDetails?.title
                        : utils.string.t('premiumProcessing.caseTeam.role')
                    }
                  />
                }
                description={
                  <Tooltip
                    title={teamListForCase.technicianDetails?.emailId && teamListForCase.technicianDetails?.emailId}
                    placement="bottom"
                    arrow
                  >
                    {teamListForCase.technicianDetails?.name
                      ? teamListForCase.technicianDetails?.name
                      : utils.string.t('premiumProcessing.caseTeam.unassigned')}
                  </Tooltip>
                }
                avatarIcon={PeopleIcon}
                data-testid="teamList1"
                nestedClasses={{ root: classnames(classes.teamCaseList) }}
              />
              <Info
                showSkeleton={isCaseTeamModuleLoading}
                description={
                  <Tooltip
                    title={teamListForCase.contactDetails?.emailId && teamListForCase.contactDetails?.emailId}
                    placement="bottom"
                    arrow
                  >
                    {teamListForCase.contactDetails.name
                      ? teamListForCase.contactDetails.name
                      : utils.string.t('premiumProcessing.caseTeam.unassigned')}
                  </Tooltip>
                }
                title={
                  <Translate
                    label={
                      teamListForCase.contactDetails?.title
                        ? teamListForCase.contactDetails?.title
                        : utils.string.t('premiumProcessing.caseTeam.role')
                    }
                  />
                }
                avatarIcon={PeopleIcon}
                data-testid="teamList2"
                nestedClasses={{ root: classnames(classes.teamCaseList) }}
              />
            </Box>
          </section>
        ) : (
          <>
            {!isAPIErrorMsg &&
              <Box display="flex" flexDirection="row" flex="1">
                <Info
                  showSkeleton={isCaseTeamModuleLoading}
                  title={utils.string.t(`premiumProcessing.caseTeam.role`)}
                  description={null}
                  avatarIcon={PeopleIcon}
                  nestedClasses={{ root: classnames(classes.teamCaseList) }}
                />
                <Info
                  showSkeleton={isCaseTeamModuleLoading}
                  description={null}
                  title={utils.string.t(`premiumProcessing.caseTeam.role`)}
                  avatarIcon={PeopleIcon}
                  nestedClasses={{ root: classnames(classes.teamCaseList) }}
                />
              </Box>
            }
            { !isAPIErrorMsg  && !isCaseTeamModuleLoading &&
              <Warning text={utils.string.t('premiumProcessing.caseTeam.noResults')} align="left" />
            }
            { isAPIErrorMsg &&
              <Box p={2} display="flex">
                <ReportProblemOutlinedIcon className={classes.apiFetchErrorIcon} />
                <ErrorMessage size="md" bold error={{message: utils.string.t('premiumProcessing.apiErrorMsg')}} />
              </Box>
            }
          </>
        )}
      </Box>
    </>
  );
}
