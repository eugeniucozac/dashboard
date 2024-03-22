import React from 'react';
import { render, waitFor } from 'tests';
import fetchMock from 'fetch-mock';
import PowerBiReport from './PowerBiReport';

describe('COMPONENTS › PowerBiReport', () => {
  describe('@render', () => {
    beforeEach(() => {
      fetchMock.get('*', {
        body: {
          status: 'success',
          data: [
            {
              embedUrl: 'mock-url-1',
              embedToken: 'mockToken1',
              reportId: '12343242',
              expiration: '2020-06-12T17:31:23Z',
              insuredName: 'Insured 1',
              modellingDueDate: '2020-03-17',
            },
            {
              embedUrl: 'mock-url-2',
              embedToken: 'mockToken2',
              reportId: '6456353',
              expiration: '2020-06-12T17:31:23Z',
              insuredName: 'Insured 2',
              modellingDueDate: '2020-04-20',
            },
          ],
        },
      });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('renders without crashing', () => {
      // arrange
      const { container } = render(<PowerBiReport />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders first report on load', async () => {
      // arrange
      const props = {
        placementId: '1',
      };
      const { getByText, container } = render(<PowerBiReport {...props} />);
      await waitFor(() => getByText('Insured 1 - format.date(2020-03-17)'));

      // assert
      expect(container.querySelectorAll('svg')).toHaveLength(2);
      expect(getByText('Insured 1 - format.date(2020-03-17)')).toBeInTheDocument();
    });
  });
});
