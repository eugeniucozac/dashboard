import get from 'lodash/get';

// app
import styles from './RiskDetails.styles';
import { RiskData, RiskPolicy, RiskMap, RiskQuotes } from 'modules';
import { Breadcrumb, FormGrid, Layout, Info, SeparatedList, Tooltip, Translate, Skeleton } from 'components';
import { RISK_STATUS_BOUND, RISK_QUOTE_STATUS_QUOTING } from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ClassIcon from '@material-ui/icons/Class';

const RiskDetailsView = ({
  breadcrumbs,
  risk,
  riskProducts,
  riskIsLoading,
  countries,
  countryOfOrigin,
  groups,
  definitionsFields,
  coverageDefinition,
  locations,
  locationDefinitions,
  locationKey,
}) => {
  const classes = makeStyles(styles, { name: 'RiskDetail' })();
  const riskStatus = (risk.riskStatus && risk.riskStatus.toLowerCase()) || RISK_QUOTE_STATUS_QUOTING.toLowerCase();

  const typeNewOrRenewal = risk.type === 'NEW' || risk.newRenewal === 'NEW' ? utils.string.t('app.new') : utils.string.t('app.renewal');
  const partyTypeOptions = ['BUSINESS', 'INDIVIDUAL'];
  const partyTypeValue = get(risk, 'insured.partyType', '');
  const partyType = partyTypeOptions.includes(partyTypeValue) ? partyTypeValue.toLowerCase() : '';
  const reInsuredPartyTypeValue = get(risk, 'reinsured.partyType', '');
  const reInsuredParty = partyTypeOptions.includes(reInsuredPartyTypeValue) ? reInsuredPartyTypeValue.toLowerCase() : '';
  const client = risk?.client ? [{ ...risk.client }] : null;
  const hasClient = Boolean(utils.generic.isValidArray(client, true) && client.some((c) => c.id) && client.some((c) => c.name));
  const isRiskBound = risk?.riskStatus === RISK_STATUS_BOUND;

  const valuesByID = {
    clientId: risk?.client,
    insuredId: risk?.insured,
    reinsuredId: risk?.reinsured,
  };

  const insuredDetails = (
    <>
      <Box className={classes.party} component="div" mb={'-6px'} style={{ maxWidth: 200 }}>
        <Typography variant="h3" style={{ fontWeight: 600 }}>
          {get(risk, 'insured.name', '')}
        </Typography>
        <Box>{utils.risk.getInsuredAddress(risk?.insured, countries)}</Box>
        <Typography variant="h4" style={{ fontWeight: 500 }}>
          {partyType && utils.string.t(`products.admin.insureds.typeOptions.${partyType}`)}
        </Typography>
      </Box>
    </>
  );

  const reInsuredDetails = (
    <>
      {risk?.reinsured ? (
        <Box className={classes.party} component="div" mb={'-6px'} style={{ maxWidth: 200 }}>
          <Typography variant="h3" style={{ fontWeight: 600 }}>
            {get(risk, 'reinsured.name', '')}
          </Typography>
          <Box>{utils.risk.getInsuredAddress(risk?.reinsured, countries)}</Box>
          <Typography variant="h4" style={{ fontWeight: 500 }}>
            {reInsuredParty && utils.string.t(`products.admin.insureds.typeOptions.${reInsuredParty}`)}
          </Typography>
        </Box>
      ) : null}
    </>
  );

  return (
    <>
      <Box className={classes.pageContainer}>
        <Layout testid="risk" isCentered>
          <Layout main padding={false}>
            {riskIsLoading ? (
              <>
                <div className={classes.root} data-testid={`riskDetail}`}>
                  <div className={classes.header} style={{ paddingLeft: 20 }}>
                    <Skeleton height={50} width={400} displayNumber={1} />
                  </div>
                </div>
                <div className={classes.info}>
                  <FormGrid container>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Skeleton height={40} displayNumber={1} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Skeleton height={40} displayNumber={1} />
                    </FormGrid>
                  </FormGrid>
                </div>
                <div className={classes.info}>
                  <FormGrid container>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Skeleton height={40} displayNumber={1} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Skeleton height={40} displayNumber={1} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Skeleton height={40} displayNumber={1} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Skeleton height={40} displayNumber={1} />
                    </FormGrid>
                  </FormGrid>
                </div>
              </>
            ) : (
              <>
                <div className={classes.root} data-testid={`riskDetail}`}>
                  <div className={classes.header}>
                    <Breadcrumb links={breadcrumbs} />
                  </div>
                </div>
                <div className={classes.info}>
                  <FormGrid container>
                    {risk?.insured?.name ? (
                      <FormGrid item xs={12} sm={6} md={3}>
                        <Tooltip rich placement="bottom" title={insuredDetails}>
                          <Info
                            title={utils.string.t('app.insured')}
                            avatarText={risk?.insured?.name[0]}
                            description={risk?.insured?.name}
                            data-testid="risk-summary-client"
                          />
                        </Tooltip>
                      </FormGrid>
                    ) : null}
                    {risk?.reinsured?.name ? (
                      <FormGrid item xs={12} sm={6} md={3}>
                        <Tooltip rich placement="bottom" title={reInsuredDetails}>
                          <Info
                            title={utils.string.t('app.reInsured')}
                            avatarText={risk?.reinsured?.name[0]}
                            description={risk?.reinsured?.name}
                            data-testid="risk-summary-client"
                          />
                        </Tooltip>
                      </FormGrid>
                    ) : null}
                    {hasClient ? (
                      <FormGrid item xs={12} sm={6} md={3}>
                        <Info
                          title={utils.string.t('app.client')}
                          avatarText={risk?.client?.name[0]}
                          description={<SeparatedList list={client} />}
                          data-testid="risk-summary-client"
                        />
                      </FormGrid>
                    ) : null}
                  </FormGrid>
                </div>
                <div className={classes.info}>
                  <FormGrid container>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Info
                        title={utils.string.t('app.product')}
                        avatarIcon={LocalOfferIcon}
                        description={utils.risk.getRiskName(risk.riskType, riskProducts)}
                        nestedClasses={{
                          avatar: classes.typeIcon,
                        }}
                        data-testid="risk-summary-type"
                      />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Info
                        title={utils.string.t('app.type')}
                        avatarIcon={ClassIcon}
                        description={typeNewOrRenewal}
                        data-testid="risk-summary-new-renewal"
                      />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Info
                        title={utils.string.t('app.inceptionDate')}
                        avatarIcon={TodayIcon}
                        description={<Translate label="format.date" options={{ value: { date: risk.inceptionDate, default: '-' } }} />}
                        data-testid="risk-summary-inception-date"
                      />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <Info
                        title={utils.string.t('app.expiryDate')}
                        avatarIcon={EventIcon}
                        description={<Translate label="format.date" options={{ value: { date: risk.expiryDate, default: '-' } }} />}
                        data-testid="risk-summary-expiry-date"
                      />
                    </FormGrid>
                  </FormGrid>
                </div>
              </>
            )}
            {isRiskBound ? (
              <>
                <Box className={classes.quotesContainer}>
                  <RiskPolicy risk={risk} riskIsLoading={riskIsLoading} />
                </Box>
              </>
            ) : (
              <Box className={classes.quotesContainer}>
                <RiskQuotes risk={risk} riskStatus={riskStatus} coverageDefinition={coverageDefinition} riskIsLoading={riskIsLoading} />
              </Box>
            )}
            {utils.generic.isValidArray(locations, true) ? (
              <Box>
                <RiskMap title={locationKey} locations={locations} locationDefinitions={locationDefinitions} />
              </Box>
            ) : null}
            <Box className={classes.quotesContainer}>
              <RiskData
                riskIsLoading={riskIsLoading}
                riskValues={risk?.risk}
                groups={groups}
                definitionsFields={definitionsFields}
                valuesByID={valuesByID}
                countryOfOrigin={countryOfOrigin}
                locationKey={locationKey}
              />
            </Box>
          </Layout>
        </Layout>
      </Box>
    </>
  );
};

export default RiskDetailsView;
