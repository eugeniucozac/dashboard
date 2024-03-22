import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ClaimsEnterLossInformationForm } from './ClaimsEnterLossInformationForm';
import { selectCatCodes, selectLossInformation, selectorDmsViewFiles, selectDmsDocDetails } from 'stores';

ClaimsEnterLossInformation.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default function ClaimsEnterLossInformation(props) {
  const lossInformation = useSelector(selectLossInformation);
  const hasLossRef = Boolean(lossInformation.lossRef);
  const catCodes = useSelector(selectCatCodes);
  const formattedCatCodes = catCodes.map((list) => {
    const name = `${list.name} - ${list.description.substring(0, 99)}`;
    return { id: list.id, name };
  });
  const [validation, setValidation] = useState(false);
  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);

  return (
      <ClaimsEnterLossInformationForm
        {...props}
        validation={validation}
        setValidation={setValidation}
        formattedCatCodes={formattedCatCodes || []}
        hasLossRef={hasLossRef}
        lossDocsList={viewDocumentList?.length > 0 ? viewDocumentList : savedDmsDocList?.lossDocDetails}
      />
  );
}
