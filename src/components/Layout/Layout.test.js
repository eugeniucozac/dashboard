import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, within, fireEvent } from 'tests';
import * as uiActions from 'stores/ui/ui.actions';
import Layout from './Layout';

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    collapseSidebar: jest.fn(),
    expandSidebar: jest.fn(),
  };
});

describe('COMPONENTS › Layout', () => {
  const defaultLayout = (
    <Layout>
      <Layout main>Alien</Layout>
      <Layout sidebar>Prometheus</Layout>
    </Layout>
  );

  const stateUiSidebarExpanded = {
    initialState: {
      ui: {
        sidebar: {
          expanded: true,
        },
      },
    },
  };

  describe('@render', () => {
    it('renders the overlay', () => {
      // arrange
      const { getByTestId } = render(<Layout />);

      // assert
      expect(getByTestId('layout-overlay')).toBeInTheDocument();
      expect(getByTestId('layout-overlay')).not.toBeVisible();
    });

    it('renders the overlay hidden if sidebar is collapsed', () => {
      // arrange
      const { getByTestId } = render(<Layout />);

      // assert
      expect(getByTestId('layout-overlay')).not.toBeVisible();
    });

    it('renders the overlay visible if sidebar is expanded', () => {
      // arrange
      const { getByTestId } = render(<Layout />, stateUiSidebarExpanded);

      // assert
      expect(getByTestId('layout-overlay')).toBeVisible();
    });

    it('renders the container', () => {
      // arrange
      const { getByTestId } = render(<Layout />);

      // assert
      expect(getByTestId('layout-container')).toBeInTheDocument();
    });

    it('renders the child main Layout components and its content', () => {
      // arrange
      const { getByTestId } = render(
        <Layout>
          <Layout main>Alien</Layout>
        </Layout>
      );
      const main = getByTestId('layout-main');

      // assert
      expect(getByTestId('layout-container')).toBeInTheDocument();
      expect(getByTestId('layout-main')).toBeInTheDocument();
      expect(within(main).getByText('Alien')).toBeInTheDocument();
    });

    it('renders the child sidebar Layout components and its content', () => {
      // arrange
      const { getByTestId } = render(
        <Layout>
          <Layout sidebar>Prometheus</Layout>
        </Layout>
      );
      const sidebar = getByTestId('layout-sidebar');

      // assert
      expect(getByTestId('layout-container')).toBeInTheDocument();
      expect(getByTestId('layout-sidebar')).toBeInTheDocument();
      expect(within(sidebar).getByText('Prometheus')).toBeInTheDocument();
    });

    it('renders all children components together', () => {
      // arrange
      const { getByTestId } = render(defaultLayout);
      const main = getByTestId('layout-main');
      const sidebar = getByTestId('layout-sidebar');

      // assert
      expect(getByTestId('layout-container')).toBeInTheDocument();
      expect(getByTestId('layout-main')).toBeInTheDocument();
      expect(getByTestId('layout-sidebar')).toBeInTheDocument();
      expect(within(main).getByText('Alien')).toBeInTheDocument();
      expect(within(sidebar).getByText('Prometheus')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    afterEach(() => {
      jest.resetAllMocks();
      window.resizeTo(1024, 768);
    });

    describe('mobile', () => {
      beforeEach(() => {
        window.resizeTo(320);
      });

      describe('click handle', () => {
        it('should expand the sidebar', () => {
          // arrange
          const { getByTestId } = render(defaultLayout);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.click(getByTestId('layout-handle'));

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(1);
        });

        it('should collapse the sidebar', () => {
          // arrange
          const { getByTestId } = render(defaultLayout, stateUiSidebarExpanded);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.click(getByTestId('layout-handle'));

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(1);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
        });
      });

      describe('click away', () => {
        it('should collapse the sidebar', () => {
          // arrange
          const { getByTestId } = render(defaultLayout, stateUiSidebarExpanded);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.click(getByTestId('layout-handle'));

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(1);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
        });
      });

      describe('key press escape', () => {
        it('should collapse the sidebar', () => {
          // arrange
          const { container } = render(defaultLayout, stateUiSidebarExpanded);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.keyDown(container, { key: 'Escape', keyCode: 27 });

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(1);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('tablet', () => {
      beforeEach(() => {
        window.resizeTo(640);
      });

      describe('click handle', () => {
        it('should expand the sidebar', () => {
          // arrange
          const { getByTestId } = render(defaultLayout);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.click(getByTestId('layout-handle'));

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(1);
        });

        it('should collapse the sidebar', () => {
          // arrange
          const { getByTestId } = render(defaultLayout, stateUiSidebarExpanded);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.click(getByTestId('layout-sidebar').children[0]);

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(1);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
        });
      });

      describe('click away', () => {
        it('should collapse the sidebar', () => {
          // arrange
          const { getByTestId } = render(defaultLayout, stateUiSidebarExpanded);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.click(getByTestId('layout-handle'));

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(1);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
        });
      });

      describe('key press escape', () => {
        it('should collapse the sidebar', () => {
          // arrange
          const { container } = render(defaultLayout, stateUiSidebarExpanded);
          const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
          const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

          // act
          fireEvent.keyDown(container, { key: 'Escape', keyCode: 27 });

          // assert
          expect(spyCollapseSidebar).toHaveBeenCalledTimes(1);
          expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('desktop', () => {
      beforeEach(() => {
        window.resizeTo(1000);
      });

      describe('without sidebar controls', () => {
        const layoutWithoutControls = (
          <Layout>
            <Layout main>Alien</Layout>
            <Layout sidebar>Prometheus</Layout>
          </Layout>
        );

        describe('click handle', () => {
          it('should not expand the sidebar', () => {
            // arrange
            const { getByTestId } = render(layoutWithoutControls);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.click(getByTestId('layout-handle'));

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });

          it('should not collapse the sidebar', () => {
            // arrange
            const { getByTestId } = render(layoutWithoutControls, stateUiSidebarExpanded);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.click(getByTestId('layout-sidebar').children[0]);

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });
        });

        describe('key press escape', () => {
          it('should not collapse the sidebar', () => {
            // arrange
            const { container } = render(layoutWithoutControls, stateUiSidebarExpanded);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.keyDown(container, { key: 'Escape', keyCode: 27 });

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });
        });
      });

      describe('with sidebar controls', () => {
        const layoutWithControls = (
          <Layout showDesktopControls>
            <Layout main>Alien</Layout>
            <Layout sidebar>Prometheus</Layout>
          </Layout>
        );

        describe('click handle', () => {
          it('should expand the sidebar', () => {
            // arrange
            const { getByTestId } = render(layoutWithControls);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.click(getByTestId('layout-handle'));

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(1);
          });

          it('should collapse the sidebar', () => {
            // arrange
            const { getByTestId } = render(layoutWithControls, stateUiSidebarExpanded);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.click(getByTestId('layout-sidebar').children[0]);

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(1);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });
        });

        describe('key press escape', () => {
          it('should not collapse the sidebar', () => {
            // arrange
            const { container } = render(layoutWithControls, stateUiSidebarExpanded);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.keyDown(container, { key: 'Escape', keyCode: 27 });

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });
        });
      });

      describe('with sidebar controls disabled', () => {
        const layoutWithControlsDisabled = (
          <Layout showDesktopControls disableDesktopControls>
            <Layout main>Alien</Layout>
            <Layout sidebar>Prometheus</Layout>
          </Layout>
        );

        describe('click handle', () => {
          it('should not expand the sidebar', () => {
            // arrange
            const { getByTestId } = render(layoutWithControlsDisabled);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.click(getByTestId('layout-handle'));

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });

          it('should not collapse the sidebar', () => {
            // arrange
            const { getByTestId } = render(layoutWithControlsDisabled, stateUiSidebarExpanded);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.click(getByTestId('layout-sidebar').children[0]);

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });
        });

        describe('key press escape', () => {
          it('should not collapse the sidebar', () => {
            // arrange
            const { container } = render(layoutWithControlsDisabled, stateUiSidebarExpanded);
            const spyCollapseSidebar = jest.spyOn(uiActions, 'collapseSidebar').mockReturnValue({ type: 'SIDEBAR_COLLAPSE' });
            const spyExpandSidebar = jest.spyOn(uiActions, 'expandSidebar').mockReturnValue({ type: 'SIDEBAR_EXPAND' });

            // act
            fireEvent.keyDown(container, { key: 'Escape', keyCode: 27 });

            // assert
            expect(spyCollapseSidebar).toHaveBeenCalledTimes(0);
            expect(spyExpandSidebar).toHaveBeenCalledTimes(0);
          });
        });
      });
    });
  });
});
