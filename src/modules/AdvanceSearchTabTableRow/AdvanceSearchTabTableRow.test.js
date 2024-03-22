import React from 'react';
import { render, screen } from 'tests';
import AdvanceSearchTabTableRow from './AdvanceSearchTabTableRow';

const defaultProps = {
  columnProps: () => {},
};
const lossObj = {
  lossRef: 'XLCLIA2020NC',
  lossName: 'Loss fund of 60k',
  lossFromDate: null,
  lossToDate: null,
  claimRef: 'XLCLIA2020NC',
  claimStatusID: 1,
  claimStatusName: 'Open',
  policyRef: 'XLCLIA2020',
  insured: 'BISHOPSGATE INSURANCE BROKERS LTD - 1707541C',
  division: 'Commercial',
  company: 'XB_BIG',
  createdBy: 'Nick Miller',
  pasEventID: null,
  lossDetailID: 422676,
  lossDetail: 'Loss fund of 60k',
  lossQualifier: 'Various',
  claimLossFromDate: null,
  claimLossToDate: null,
  claimReceivedDate: '2021-11-09T00:00:00.000+00:00',
  catCodesID: null,
  catCodeDescription: null,
  ucr: 'B0831XLCLIA2020NC',
  claimantID: null,
  claimantName: 'Various',
  beAdjuster: null,
  umr: 'B0831XLCLIA2020',
  policyType: 'Third Party Binder',
  reInsured: 'NA',
  client: 'BISHOPSGATE INSURANCE BROKERS LTD',
  coverHolder: 'BISHOPSGATE INSURANCE BROKERS LTD - 1707541C',
  team: null,
  priority: null,
  policyID: 5603,
  sourceID: 1,
  xbPolicyID: 5603,
  xbInstanceID: 1,
  divisionID: 33,
  claimID: 0,
};
const renderTaskDetails = (props) => {
  return render(<AdvanceSearchTabTableRow {...defaultProps} {...props} />);
};

describe('MODULES  AdvanceSearchTabTableRow', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      renderTaskDetails();
    });
    it('renders with taskObject', () => {
      renderTaskDetails({ data: lossObj });

      expect(screen.getAllByText('XLCLIA2020NC').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Loss fund of 60k').length).toBeGreaterThan(0);
      expect(screen.getAllByText('BISHOPSGATE INSURANCE BROKERS LTD - 1707541C').length).toBeGreaterThan(0);
      expect(screen.getAllByText('XB_BIG').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Nick Miller').length).toBeGreaterThan(0);
    });
  });
});
