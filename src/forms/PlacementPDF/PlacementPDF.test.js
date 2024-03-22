import React from 'react';
import { render } from 'tests';
import PlacementPDF from './PlacementPDF';

describe('FORMS › PlacementPDF', () => {
  const props = {
    handleClose: () => {},
    component: () => <div>mock component</div>,
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<PlacementPDF {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<PlacementPDF {...props} />);

      // assert
      expect(getByTestId('form-placement-pdf')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<PlacementPDF {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.download')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { getByLabelText } = render(<PlacementPDF {...props} />);

      // assert
      expect(getByLabelText('placement.sheet.introduction')).toBeInTheDocument();
      expect(getByLabelText('placement.sheet.displayMudmapOnPDF')).toBeInTheDocument();
    });
  });
});
