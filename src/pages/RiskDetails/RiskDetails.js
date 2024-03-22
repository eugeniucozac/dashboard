import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import isEmpty from 'lodash/isEmpty';

// app
import {
  getRiskDetails,
  getRiskDefinitions,
  getCoverageDefinition,
  getCoverages,
  selectRiskSelected,
  selectRiskSelectedLoading,
  getRiskCountries,
  selectRiskCountries,
  selectRiskDefinitionsFieldsByType,
  selectCoverageDefinitionsFieldsByType,
  selectCoverageDefinitionsLoading,
  getRiskProducts,
  selectProductsSorted,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

import RiskDetailsView from './RiskDetailsView';

const RiskDetails = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const brand = useSelector((state) => state.ui.brand);
  const risk = useSelector(selectRiskSelected);
  const riskIsLoading = useSelector(selectRiskSelectedLoading);
  const riskProducts = useSelector(selectProductsSorted);
  const countries = useSelector(selectRiskCountries);
  const definitionsFieldsWithLabel = useSelector(selectRiskDefinitionsFieldsByType(risk && risk.riskType));
  const coverageDefinitionLoading = useSelector(selectCoverageDefinitionsLoading);
  const definitionsFields = definitionsFieldsWithLabel.filter((definition) => definition.type !== 'LABEL');

  const countryOfOrigin = countries?.filter((country) => country.value === risk?.risk?.countryOfOrigin);
  const coverageDefinition = useSelector(selectCoverageDefinitionsFieldsByType(risk?.riskType));
  const pageTitle = risk?.insured?.name ? risk.insured.name : '';

  useEffect(() => {
    if (!utils.generic.isValidObject(risk, 'id') || risk?.id !== id) dispatch(getRiskDetails(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (risk.riskType) {
      dispatch(getRiskDefinitions(risk.riskType));
    }
  }, [dispatch, risk.riskType]);

  useEffect(() => {
    if (isEmpty(riskProducts)) {
      dispatch(getRiskProducts());
    }
  }, [dispatch, riskProducts]);

  useEffect(() => {
    if (risk.riskType && isEmpty(countries)) {
      dispatch(getRiskCountries());
    }
  }, [countries, dispatch, risk.riskType]);

  useEffect(() => {
    if (!coverageDefinitionLoading && risk.riskType && utils.generic.isInvalidOrEmptyArray(coverageDefinition)) {
      dispatch(getCoverageDefinition(risk.riskType, 'COVERAGE_COMPARISON'));
    }
  }, [coverageDefinition, dispatch, risk.riskType, coverageDefinitionLoading]);

  useEffect(() => {
    if (risk.id) {
      dispatch(getCoverages(risk.id));
    }
  }, [risk.id, dispatch]);

  const groups = Object.keys(utils.risk.getGroups(definitionsFields)) || [];

  const locations =
    Object.values(risk?.risk || {})?.find((item) => {
      return utils.generic.isValidArray(item, true) && item?.every((l) => Boolean(l?.latitude) && Boolean(l?.longitude));
    }) || [];

  const locationKey =
    Object.keys(risk?.risk || {})?.find((key) => {
      return (
        utils.generic.isValidArray(risk.risk[key], true) && risk.risk[key]?.every((l) => Boolean(l?.latitude) && Boolean(l?.longitude))
      );
    }) || [];
  const locationDefinitions = definitionsFields.find((definition) => definition.name === locationKey);

  const formattedLocations = locations?.map((location, index) => {
    return {
      id: index + 1,
      lat: location.latitude,
      lng: location.longitude,
      locationsFound: 1,
      ...location,
    };
  });

  const breadcrumbs = [
    {
      name: 'quote-bind',
      label: utils.string.t('admin.quoteBindTitle'),
      link: `${config.routes.quoteBind.root}`,
    },
    {
      name: 'risk',
      label: risk?.insured?.name,
      link: `${config.routes.quoteBind.riskDetails}/${id}`,
      active: true,
      largeFont: true,
    },
  ];

  return id ? (
    <>
      <Helmet>
        <title>{`${pageTitle} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <RiskDetailsView
        breadcrumbs={breadcrumbs}
        riskIsLoading={riskIsLoading}
        risk={risk}
        riskProducts={riskProducts}
        countries={countries}
        countryOfOrigin={countryOfOrigin}
        groups={groups}
        definitionsFields={definitionsFields}
        coverageDefinition={coverageDefinition}
        locations={formattedLocations}
        locationDefinitions={locationDefinitions}
        locationKey={locationKey}
      />
    </>
  ) : null;
};

export default RiskDetails;
