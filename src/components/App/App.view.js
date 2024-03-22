import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

// app
import styles from './App.styles';
import { AccessControl, Button, Header, Loader, Modal, Nav, Notification, SessionExpired } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';

// dynamic async imports
const Admin = lazy(() => import('pages/Admin/Admin'));
const Administration = lazy(() => import('pages/Administration/Administration'));
const Blank = lazy(() => import('pages/Blank/Blank'));
const Claims = lazy(() => import('pages/Claims/Claims'));
const ClaimsComplexityRules = lazy(() => import('pages/ClaimsComplexityRules/ClaimsComplexityRules'));
const ClaimsNewLoss = lazy(() => import('pages/ClaimsNewLoss/ClaimsNewLoss'));
const ClaimsProcessing = lazy(() => import('pages/ClaimsProcessing/ClaimsProcessing'));
const Client = lazy(() => import('pages/Client/Client'));
const ClaimDashboard = lazy(() => import('pages/ClaimDashboard/ClaimDashboard'));
const Department = lazy(() => import('pages/Department/Department'));
const DmsDocViewer = lazy(() => import('pages/DmsDocViewer/DmsDocViewer'));
const Home = lazy(() => import('pages/Home/Home'));
const Icons = lazy(() => import('pages/Icons/Icons'));
const IndustryNews = lazy(() => import('pages/IndustryNews/IndustryNews'));
const Market = lazy(() => import('pages/Market/Market'));
const Modelling = lazy(() => import('pages/Modelling/Modelling'));
const OpeningMemo = lazy(() => import('pages/OpeningMemo/OpeningMemo'));
const Opportunity = lazy(() => import('pages/Opportunity/Opportunity'));
const Placement = lazy(() => import('pages/Placement/Placement'));
const Policy = lazy(() => import('pages/Policy/Policy'));
const PremiumProcessing = lazy(() => import('pages/PremiumProcessing/PremiumProcessing'));
const PremiumProcessingTasks = lazy(() => import('pages/PremiumProcessingTasks/PremiumProcessingTasks'));
const PremiumProcessingCaseDetails = lazy(() => import('pages/PremiumProcessingCaseDetails/PremiumProcessingCaseDetails'));
const ProcessingInstructions = lazy(() => import('pages/ProcessingInstructions/ProcessingInstructions'));
const ProcessingInstructionsSteps = lazy(() => import('pages/ProcessingInstructionsSteps/ProcessingInstructionsSteps'));
const QuoteBind = lazy(() => import('pages/QuoteBind/QuoteBind'));
const QuoteBindAdmin = lazy(() => import('pages/QuoteBindAdmin/QuoteBindAdmin'));
const QuoteBindAggregate = lazy(() => import('pages/QuoteBindAggregate/QuoteBindAggregate'));
const Reporting = lazy(() => import('pages/Reporting/Reporting'));
const ReportingDetails = lazy(() => import('modules/ReportingDetails/ReportingDetails'));
const ReportingGroup = lazy(() => import('modules/ReportingGroup/ReportingGroup'));
const ReportDetailsExtended = lazy(() => import('pages/ReportDetailsExtended/ReportDetailsExtended'));
const ReportGroupExtended = lazy(() => import('pages/ReportGroupExtended/ReportGroupExtended'));
const ReportsExtended = lazy(() => import('pages/ReportsExtended/ReportsExtended'));
const RfiDashboard = lazy(() => import('pages/RfiDashboard/RfiDashboard'));
const RiskDetails = lazy(() => import('pages/RiskDetails/RiskDetails'));
const TaskDashboard = lazy(() => import('pages/TaskDashboard/TaskDashboard'));
const Trips = lazy(() => import('pages/Trips/Trips'));
const LossDashboard = lazy(() => import('pages/LossDashboard/LossDashboard'));

AppView.propTypes = {
  isBroker: PropTypes.bool.isRequired,
  isUnderwriter: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isExtendedEdge: PropTypes.bool,
  isCurrentEdge: PropTypes.bool,
  isUserLoaded: PropTypes.bool,
  isDev: PropTypes.bool.isRequired,
  isDmsDocViewerModeOn: PropTypes.bool.isRequired,
  landingPage: PropTypes.string.isRequired,
  hasLoader: PropTypes.bool.isRequired,
};

export function AppView({
  isBroker,
  isUnderwriter,
  isAdmin,
  isExtendedEdge,
  isUserLoaded,
  isCurrentEdge,
  isDev,
  isDmsDocViewerModeOn,
  landingPage,
  hasLoader,
  sw,
}) {
  const classes = makeStyles(styles, { name: 'App' })();

  return (
    <div id="root" className={classes.root} data-testid="root">
      <Header />

      <div id="body" className={classes.body} data-testid="body">
        {isUserLoaded && !isDmsDocViewerModeOn && <Nav />}

        <div id="content" className={classes.content} data-testid="content">
          {/* New Mphasis routes */}
          {isExtendedEdge && (
            <Suspense fallback={<Loader visible />}>
              <Switch>
                {isDev && <Route exact path="/blank" component={Blank} />}
                <Route exact path="/document/:id?/:name?" component={DmsDocViewer} />

                {/* Reports for extended users */}
                <Route
                  exact
                  path={`${config.routes.reportingExtended.root}`}
                  render={() => (
                    <AccessControl route="reporting">
                      <ReportGroupExtended />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.reportingExtended.root}/:groupId`}
                  render={() => (
                    <AccessControl route="reporting">
                      <ReportsExtended />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.reportingExtended.root}/:groupId/:reportId`}
                  render={() => (
                    <AccessControl route="reporting">
                      <ReportDetailsExtended />
                    </AccessControl>
                  )}
                />

                {/* Premium Processing */}
                <Route
                  exact
                  path={`${config.routes.premiumProcessing.root}/:refId?/:refType?`}
                  render={() => (
                    <AccessControl route="premiumProcessing">
                      <PremiumProcessingTasks />
                    </AccessControl>
                  )}
                />
                {/* Added new route for backup, Once QA signoff's for new PP willbe deleting this Old PP pages */}
                <Route
                  exact
                  path={`${config.routes.premiumProcessing.old}`}
                  render={() => (
                    <AccessControl route="premiumProcessing">
                      <PremiumProcessing />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.premiumProcessing.case}/:id/:tab?/:subtab?`}
                  render={() => (
                    <AccessControl route="premiumProcessing">
                      <PremiumProcessingCaseDetails />
                    </AccessControl>
                  )}
                />

                {/* Processing Instructions */}
                <Route
                  exact
                  path={`${config.routes.processingInstructions.root}`}
                  render={() => (
                    <AccessControl route="processingInstructions">
                      <ProcessingInstructions />
                    </AccessControl>
                  )}
                />

                <Route
                  exact
                  path={`${config.routes.processingInstructions.steps}/:id/:step?/:tab?`}
                  render={() => (
                    <AccessControl route="processingInstructionsSteps">
                      <ProcessingInstructionsSteps />
                    </AccessControl>
                  )}
                />

                {/* Claims FNOL*/}
                <Route
                  exact
                  path={[`${config.routes.claimsFNOL.root}`, `${config.routes.claimsFNOL.root}/tab/:tabDashboard`]}
                  render={() => (
                    <AccessControl route="claimsFNOL">
                      <Claims />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsFNOL.newLoss}`}
                  render={() => (
                    <AccessControl route="claimsFNOL">
                      <ClaimsNewLoss />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsFNOL.complexityRules}`}
                  render={() => (
                    <AccessControl route="claimsFNOL">
                      <ClaimsComplexityRules />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsFNOL.loss}/:id/:tab?`}
                  render={() => (
                    <AccessControl route="claimsFNOL">
                      <LossDashboard />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsFNOL.claim}/:id/:tab?`}
                  render={() => (
                    <AccessControl route="claimsFNOL">
                      <ClaimDashboard />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsFNOL.task}/:id/:tab?`}
                  render={() => (
                    <AccessControl route="claimsFNOL">
                      <TaskDashboard />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsFNOL.rfi}/:id/:tab?`}
                  render={() => (
                    <AccessControl route="claimsFNOL">
                      <RfiDashboard />
                    </AccessControl>
                  )}
                />

                {/* Claims Processing */}
                <Route
                  exact
                  path={`${config.routes.claimsProcessing.root}/:refId?`}
                  render={() => (
                    <AccessControl route="claimsProcessing">
                      <ClaimsProcessing />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsProcessing.claim}/:id/:tab?`}
                  render={() => (
                    <AccessControl route="claimsProcessing">
                      <ClaimDashboard />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsProcessing.task}/:id/:tab?`}
                  render={() => (
                    <AccessControl route="claimsProcessing">
                      <TaskDashboard />
                    </AccessControl>
                  )}
                />
                <Route
                  exact
                  path={`${config.routes.claimsProcessing.rfi}/:id/:tab?`}
                  render={() => (
                    <AccessControl route="claimsProcessing">
                      <RfiDashboard />
                    </AccessControl>
                  )}
                />

                {/* Admin */}
                <Route
                  exact
                  path={`${config.routes.admin.edgeAdmin}`}
                  render={() => (
                    <AccessControl route="admin">
                      <Administration />
                    </AccessControl>
                  )}
                />
              </Switch>
            </Suspense>
          )}

          {/* Existing Ardonagh routes */}
          {isCurrentEdge && (
            <>
              <Suspense fallback={<Loader visible />}>
                <Switch>
                  {/* Dev routes */}
                  {isDev && <Route exact path="/blank" component={Blank} />}
                  {isDev && <Route exact path="/icons" component={Icons} />}

                  {/* Admin routes */}
                  {isAdmin && <Route exact path={`${config.routes.admin.currentAdmin}`} component={Admin} />}

                  {/* Broker routes */}
                  {isBroker && <Route exact path={`${config.routes.checklist.root}/:openingMemoId?`} component={OpeningMemo} />}
                  {isBroker && <Route exact path={`${config.routes.modelling.root}/:modellingId?`} component={Modelling} />}
                  {isBroker && isDev && <Route exact path={`${config.routes.opportunity.root}/:id?`} component={Opportunity} />}
                  {(isBroker || isUnderwriter) && <Route exact path={`${config.routes.quoteBind.root}`} component={QuoteBind} />}
                  {(isBroker || isUnderwriter) && (
                    <Route exact path={`${config.routes.quoteBind.riskDetails}/:id?`} component={RiskDetails} />
                  )}
                  {isBroker && isAdmin && <Route exact path={`${config.routes.quoteBind.admin}`} component={QuoteBindAdmin} />}

                  {(isBroker || isUnderwriter) && (
                    <Route exact path={`${config.routes.quoteBind.aggregate}`} component={QuoteBindAggregate} />
                  )}

                  {isBroker && isDev && <Route exact path={`${config.routes.trip.root}`} component={Trips} />}

                  {!isUnderwriter && <Route exact path={`${config.routes.client.root}`} component={Client} />}
                  {!isUnderwriter && <Route exact path={`${config.routes.client.item}/:id/:slug?`} component={Client} />}
                  {!isUnderwriter && <Route exact path={`${config.routes.client.item}/:id/:slug/offices/:officeIds`} component={Client} />}
                  {!isUnderwriter && <Route exact path={`${config.routes.market.root}`} component={Market} />}

                  {!isUnderwriter && <Route exact path={`${config.routes.market.item}/:id/:slug?`} component={Market} />}
                  {!isUnderwriter && <Route exact path={`${config.routes.department.root}/:id/:slug?`} component={Department} />}

                  {!isUnderwriter && <Route exact path={`${config.routes.department.root}/:id/:slug?`} component={Department} />}
                  {!isUnderwriter && (
                    <Route
                      exact
                      path={[
                        `${config.routes.placement.root}/:step/:id/`,
                        `${config.routes.placement.root}/openingMemo/:id/:policyId?`,
                        `${config.routes.placement.root}/marketing/:section/:id`,
                      ]}
                      component={Placement}
                    />
                  )}
                  {!isUnderwriter && <Route exact path={`${config.routes.placement.root}/:step/:section/:id`} component={Placement} />}
                  {!isUnderwriter && <Route exact path={`${config.routes.policy.root}/:id`} component={Policy} />}
                  {isDev && <Route exact path={`${config.routes.industryNews.root}`} component={IndustryNews} />}

                  {!isUnderwriter && <Route exact path={`${config.routes.reporting.root}`} component={Reporting} />}
                  {!isUnderwriter && <Route exact path={`${config.routes.reporting.root}/:id`} component={ReportingGroup} />}
                  {!isUnderwriter && <Route exact path={`${config.routes.reporting.root}/:slug/:id`} component={ReportingDetails} />}
                </Switch>
              </Suspense>
            </>
          )}

          <Suspense fallback={<Loader visible />}>
            <Switch>
              {/* Un-protected routes or If nothing matches, redirect to home component... */}
              <Route exact path={`${config.routes.home.root}`} component={Home} />
            </Switch>
          </Suspense>
        </div>
      </div>
      <Loader visible={hasLoader} label={utils.string.t('app.loading')} />
      <SessionExpired />
      <Notification />
      <Modal />
      {sw.isServiceWorkerUpdated ? (
        <Alert
          className={classes.alertRoot}
          variant="filled"
          severity="info"
          action={
            <Button icon={CheckIcon} size="small" text="Update" variant="contained" color="secondary" onClick={sw.updateServiceWorker} />
          }
        >
          {utils.string.t('app.updateApp')}
        </Alert>
      ) : null}
    </div>
  );
}
