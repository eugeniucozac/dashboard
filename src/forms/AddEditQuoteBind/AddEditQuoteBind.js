import React, { useState, useEffect } from 'react';
import MultiStepForm from './MultiStepForm';
import { useSelector, useDispatch } from 'react-redux';

// app
import {
  getRiskDefinitions,
  selectRiskDefinitionsFieldsByType,
  selectRiskFieldOptionsByType,
  selectRiskProduct,
  getClients,
  getInsureds,
  getReinsureds,
  selectPartyOptions,
  postRisk,
  patchRisk,
  postRiskDraft,
} from 'stores';
import * as utils from 'utils';

const AddEditQuoteBind = ({ fullScreen, product, riskData, draftId, riskId }) => {
  const dispatch = useDispatch();
  const type = product?.value;
  const insuredsLoading = useSelector((store) => store.party.insureds.loading);
  const clientsLoading = useSelector((store) => store.party.clients.loading);
  const reinsuredsLoading = useSelector((store) => store.party.reinsureds.loading);
  const riskDefinitionsLoading = useSelector((store) => store.risk.definitions.loading);

  const [isLoading, setIsLoading] = useState(true);

  const isReQuote = Boolean(riskId);

  const riskDefinitionsFieldsByType = useSelector(selectRiskDefinitionsFieldsByType(type));
  const definitionsFields = riskDefinitionsFieldsByType.filter((definition) => definition.type !== 'LABEL');
  const riskFieldOptionsByType = useSelector(selectRiskFieldOptionsByType(type));
  const partyOptions = useSelector(selectPartyOptions);
  const countries = riskFieldOptionsByType?.countryOfOrigin ? riskFieldOptionsByType.countryOfOrigin : [];

  useEffect(() => {
    let isSubscribed = true;

    const isLoadingValue =
      [insuredsLoading, clientsLoading, reinsuredsLoading, riskDefinitionsLoading].filter((loading) => loading === false).length !== 4;

    isSubscribed && setIsLoading(isLoadingValue);

    return () => (isSubscribed = false);
  }, [insuredsLoading, clientsLoading, reinsuredsLoading, riskDefinitionsLoading]);

  useEffect(
    () => {
      let isSubscribed = true;
      if (isSubscribed) {
        dispatch(selectRiskProduct(type));
        if (type && (utils.generic.isInvalidOrEmptyArray(riskDefinitionsFieldsByType) || utils.generic.isInvalidOrEmptyArray(countries))) {
          dispatch(getRiskDefinitions(type));
        }

        dispatch(getClients({ size: 1000 }));
        dispatch(getInsureds({ size: 1000 }));
        dispatch(getReinsureds({ size: 1000 }));
      }
      // cleanup
      return () => {
        isSubscribed = false;
      };
    },
    [type] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fields = utils.risk.parseFields(riskDefinitionsFieldsByType, {
    ...partyOptions,
    countryOfOrigin: countries,
  });

  const handlePostRisk = (values) => {
    return isReQuote ? dispatch(patchRisk(values, type, fields, riskId)) : dispatch(postRisk(values, type, fields, draftId));
  };

  const handlePostDraftRisk = (values) => {
    draftId ? dispatch(postRiskDraft(values, type, fields, draftId)) : dispatch(postRiskDraft(values, type, fields));
  };

  return (
    <>
      <MultiStepForm
        isReQuote={isReQuote}
        fullScreen={fullScreen}
        productType={type}
        fields={fields}
        defaultValues={riskData ? utils.form.getFormattedValues(riskData, fields) : utils.form.getInitialValues(fields)}
        riskDataValues={riskData}
        definitionsFields={definitionsFields}
        hasCountryOfOrigin={countries.length ? true : false}
        isLoading={isLoading}
        handleSubmit={handlePostRisk}
        handleDraftSave={handlePostDraftRisk}
      />
    </>
  );
};

export default AddEditQuoteBind;
