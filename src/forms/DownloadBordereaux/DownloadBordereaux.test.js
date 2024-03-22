import React from 'react';
import { render, getFormSelect, getFormDatepicker, screen } from 'tests';
import DownloadBordereaux from './DownloadBordereaux';
import fetchMock from 'fetch-mock';

describe('FORMS › DownloadBordereaux', () => {
  const props = {
    handleClose: () => {},
  };

  const initialState = {
    risk: {
      productsWithReports: {
        items: [
          {
            value: 'FOO',
            label: 'FOO',
            reports: [
              {
                label: 'Risk Data',
                value: 'DATA_DUMP',
              },
              {
                label: 'Premium Bordereaux',
                value: 'PREMIUM_BDX',
              },
            ],
          },
          {
            value: 'BAR',
            label: 'BAR',
            reports: [
              {
                label: 'Risk Data',
                value: 'DATA_DUMP',
              },
            ],
          },
        ],
        loading: false,
      },
    },
  };

  describe('@render', () => {
    beforeEach(() => {
      fetchMock.get('glob:*/api/v1/products/reports*', { body: { status: 'success', data: [] } });
      fetchMock.get('glob:*/api/v1/facilities*', { body: { pagination: {}, content: [] } });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('renders without crashing', () => {
      // arrange
      const { container } = render(<DownloadBordereaux {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form inputs and buttons', () => {
      // arrange
      const { container, getByLabelText, getByText } = render(<DownloadBordereaux {...props} />, { initialState });

      // assert
      expect(screen.getByTestId('form-download-bordereaux')).toBeInTheDocument();
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.download')).toBeInTheDocument();

      expect(getByText('products.product', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('product'))).toBeInTheDocument();

      expect(getByText('products.report', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('type'))).toBeInTheDocument();

      expect(getByText('products.facility', { selector: 'label' })).toBeInTheDocument();
      expect(getByText('products.facilityHint')).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('facility'))).toBeInTheDocument();

      expect(getByLabelText('form.dateFrom.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('from'))).toBeInTheDocument();

      expect(getByLabelText('form.dateTo.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('to'))).toBeInTheDocument();
    });
  });
});
