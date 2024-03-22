import React from 'react';
import { render } from 'tests';
import RfiQueryResponse from './RfiQueryResponse';

describe('FORMS › RfiQueryResponse', () => {
  const props = {
    fields: [],
    actions: [],
    isLoading: false,
    queryId: 'Q3456',
    expectedResponseDate: '03/09/21',
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<RfiQueryResponse {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the RfiQueryResponse Form', () => {
      // arrange
      const { getByTestId } = render(<RfiQueryResponse {...props} />);

      // assert
      expect(getByTestId('form-rfiQueryResponse')).toBeInTheDocument();
    });

    it('render querid and expected response date not editable fields', () => {
      const { getByText } = render(<RfiQueryResponse {...props} />);
      // expect(getByText('premiumProcessing.rfi.queryId')).toBeInTheDocument();
      // expect(getByText('premiumProcessing.rfi.expectedResponseDate')).toBeInTheDocument();
    });
  });
});
