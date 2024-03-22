import React from 'react';
import { render, screen } from 'tests';
import { Nav } from './Nav';
import { mockClasses, mockTheme, mockUi } from 'setupMocks';

describe('COMPONENTS › Nav', () => {
  const defaultProps = {
    classes: mockClasses,
    theme: mockTheme,
    ui: mockUi,
    collapseNav: jest.fn(() => 'collapse'),
    expandNav: jest.fn(() => 'expand'),
  };

  it('renders without crashing', () => {
    render(<Nav {...defaultProps} />);
  });

  it('renders Drawer component on tablet & desktop', () => {
    render(<Nav {...defaultProps} />);

    expect(screen.getByTestId('nav-drawer')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-swipeable-drawer')).not.toBeInTheDocument();
  });
  it('handles Window Resize', () => {
    render(<Nav {...defaultProps} />);

    expect(screen.getByTestId('nav-drawer')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-swipeable-drawer')).not.toBeInTheDocument();

    window.resizeTo(500);

    expect(screen.queryByTestId('nav-drawer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-swipeable-drawer')).not.toBeInTheDocument();
  });

  describe('mobile', () => {
    beforeEach(() => {
      window.resizeTo(320);
    });

    it('renders SwipeableDrawer component on mobile', () => {
      render(<Nav {...defaultProps} />);

      expect(screen.queryByTestId('nav-swipeable-drawer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('nav-drawer')).not.toBeInTheDocument();
    });

    it('renders SwipeableDrawer expanded if uiNavExpanded=true ', () => {
      render(<Nav {...defaultProps} uiNavExpanded={true} />);

      expect(screen.queryByTestId('nav-swipeable-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('nav-swipeable-drawer').className).toContain('MuiDrawer');
    });
  });
});
