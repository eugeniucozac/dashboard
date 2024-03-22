import React from 'react';
import { useSelector } from 'react-redux';

//app
import { selectcaseTeamModule } from 'stores';
import { PremiumProcessingCaseTeamModuleDetailsView } from './PremiumProcessingCaseTeamModuleDetails.view';

export default function PremiumProcessingCaseTeamModuleDetails() {
  const caseTeamModule = useSelector(selectcaseTeamModule);

  return (
    <>
      <PremiumProcessingCaseTeamModuleDetailsView caseTeamModule={caseTeamModule} />
    </>
  );
}
