import React from 'react';
import { render } from 'tests';
import { ClientContent } from './ClientContent';
import { mockClasses, mockParent } from 'setupMocks';
import ApartmentIcon from '@material-ui/icons/Apartment';

describe('MODULES › ClientContent', () => {
  const defaultProps = {
    classes: mockClasses,
    parentList: mockParent.list,
    parentPlacements: mockParent.placements,
    parentSelected: mockParent.selected,
    type: 'client',
    pageIcon: ApartmentIcon,
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<ClientContent {...defaultProps} />);
    });
  });
});
