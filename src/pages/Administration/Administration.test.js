import React from 'react';
import fetchMock from 'fetch-mock';
import { render, waitFor, screen } from 'tests';
import userEvent from '@testing-library/user-event';
import Administration from './Administration';

fetchMock.config.overwriteRoutes = true;

describe('PAGES › Administration', () => {
  const userWithoutPermission = { userDetails: { id: 1 } };
  const userWithFullAccess = { userDetails: { id: 1 }, privilege: { admin: { user: ['read', 'create', 'update', 'delete'] } } };

  const userWithPermissionRead = { userDetails: { id: 1 }, privilege: { admin: { user: ['read'] } } };
  const userWithPermissionCreate = { userDetails: { id: 1 }, privilege: { admin: { user: ['read', 'create'] } } };
  const userWithPermissionUpdate = { userDetails: { id: 1 }, privilege: { admin: { user: ['read', 'update'] } } };
  const userWithPermissionDelete = { userDetails: { id: 1 }, privilege: { admin: { user: ['read', 'delete'] } } };

  const userWithoutPermissionRead = { userDetails: { id: 1 }, privilege: { admin: { user: ['create', 'update', 'delete'] } } };
  const userWithoutPermissionCreate = { userDetails: { id: 1 }, privilege: { admin: { user: ['read', 'update', 'delete'] } } };
  const userWithoutPermissionUpdate = { userDetails: { id: 1 }, privilege: { admin: { user: ['read', 'create', 'delete'] } } };
  const userWithoutPermissionDelete = { userDetails: { id: 1 }, privilege: { admin: { user: ['read', 'create', 'update'] } } };

  beforeEach(() => {
    fetchMock.get('glob:*/authservice/user/role/info', {
      body: {
        status: 'OK',
        data: userWithoutPermission,
      },
    });
    fetchMock.get('glob:*/authservice/api/users*', { body: { status: 'OK', data: [{ id: 1 }] } });
    fetchMock.get('glob:*/authservice/user/refData/*', { body: { status: 'OK', data: [{ id: 1 }] } });
  });

  describe('generic', () => {
    it('renders the page title and icon', async () => {
      // arrange
      const { getByTestId } = render(<Administration />);

      // assert
      await waitFor(() => expect(document.title).toContain('administration.title'));
      expect(getByTestId('page-header-administration-title')).toBeInTheDocument();
      expect(getByTestId('page-header-administration-title')).toHaveTextContent('administration.title');
      expect(getByTestId('page-header-administration-icon')).toBeInTheDocument();
    });
  });

  describe('users list', () => {
    it("renders nothing if user doesn't have any permission", async () => {
      // arrange
      const { queryByTestId } = render(<Administration />, { initialState: { user: userWithoutPermission } });

      // assert
      await waitFor(() => expect(document.title).toContain('administration.title'));
      expect(queryByTestId('administration-user')).not.toBeInTheDocument();
    });

    it("renders nothing if user doesn't have READ permission", async () => {
      // arrange
      const { queryByTestId } = render(<Administration />, { initialState: { user: userWithoutPermissionRead } });

      // assert
      await waitFor(() => expect(document.title).toContain('administration.title'));
      expect(queryByTestId('administration-user')).not.toBeInTheDocument();
    });

    it('renders the users list and search if user has READ permission', async () => {
      // arrange
      const { getByTestId } = render(<Administration />, { initialState: { user: userWithPermissionRead } });

      // assert
      await waitFor(() => expect(getByTestId('administration-user')).toBeInTheDocument());
      expect(getByTestId('administration-user')).toBeInTheDocument();
      expect(getByTestId('users-grid')).toBeInTheDocument();
      expect(getByTestId('search-button-go')).toBeInTheDocument();
    });
  });

  describe('edit user button', () => {
    it("doesn't render button if user doesn't have UPDATE permission", async () => {
      // arrange
      const { queryByText } = render(<Administration />, { initialState: { user: userWithoutPermissionUpdate } });

      // assert
      await waitFor(() => expect(document.title).toContain('administration.title'));
      expect(queryByText('dministration.users.edit.title')).not.toBeInTheDocument();
    });

    it('renders edit popover link if user has UPDATE permission', async () => {
      // arrange
      const { getByText } = render(<Administration />, { initialState: { user: userWithPermissionUpdate } });
      await waitFor(() => screen.getByTestId('user-grid-popover-popover-ellipsis'));

      // act
      userEvent.click(screen.getByTestId('user-grid-popover-popover-ellipsis'));
      await waitFor(() => expect(getByText('administration.users.edit.title')).toBeInTheDocument());

      // assert
      expect(getByText('administration.users.edit.title')).toBeInTheDocument();
    });
  });

  describe('delete user button', () => {
    it("doesn't render button if user doesn't have DELETE permission", async () => {
      // arrange
      const { queryByText } = render(<Administration />, { initialState: { user: userWithoutPermissionDelete } });

      // assert
      await waitFor(() => expect(document.title).toContain('administration.title'));
      expect(queryByText('dministration.users.delete.title')).not.toBeInTheDocument();
    });

    it('renders delete popover link if user has DELETE permission', async () => {
      // arrange
      const { getByText } = render(<Administration />, { initialState: { user: userWithPermissionDelete } });
      await waitFor(() => expect(document.title).toContain('administration.title'));

      // act
      userEvent.click(screen.getByTestId('user-grid-popover-popover-ellipsis'));
      await waitFor(() => expect(getByText('administration.users.delete.title')).toBeInTheDocument());

      // assert
      expect(getByText('administration.users.delete.title')).toBeInTheDocument();
    });
  });

  describe('create user button', () => {
    it("doesn't render button if user doesn't have CREATE permission", async () => {
      // arrange
      const { queryByTestId } = render(<Administration />, { initialState: { user: userWithoutPermissionCreate } });

      // assert
      await waitFor(() => expect(document.title).toContain('administration.title'));
      expect(queryByTestId('admin-create-button')).not.toBeInTheDocument();
    });

    it('renders create button if user has CREATE permission', async () => {
      // arrange
      const { getByTestId } = render(<Administration />, { initialState: { user: userWithPermissionCreate } });

      // assert
      await waitFor(() => expect(document.title).toContain('administration.title'));
      expect(getByTestId('admin-create-button')).toBeInTheDocument();
    });
  });
});
