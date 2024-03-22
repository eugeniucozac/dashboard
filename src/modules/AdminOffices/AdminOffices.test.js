import React from 'react';

// app
import { render, fireEvent } from 'tests';
import AdminOffices from './AdminOffices';

describe('MODULES › AdminOffices', () => {
  const initialState = {
    admin: {
      parentOfficeList: {
        items: [
          {
            id: 1,
            name: 'Parent 1',
            logoFileName: 'image-1.png',
            clientId: 2,
            offices: [
              { id: 1, name: 'Office 1.1' },
              { id: 2, name: 'Office 1.2' },
            ],
          },
          {
            id: 2,
            name: 'Parent 2',
            logoFileName: 'image-2.png',
            clientId: 3,
            offices: [{ id: 1, name: 'Office 2.1' }],
          },
        ],
      },
    },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AdminOffices />);

      // assert
      expect(container).toBeInTheDocument();
    });
    it('renders the list of offices', () => {
      // arrange
      const { getByText, getByTestId, queryByText } = render(<AdminOffices />, { initialState });

      // assert
      expect(getByText('admin.office_plural')).toBeInTheDocument();
      expect(getByText('admin.client')).toBeInTheDocument();

      expect(getByText('Parent 1')).toBeInTheDocument();
      expect(queryByText('Office 1.1')).not.toBeInTheDocument();
      expect(queryByText('Office 1.2')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByTestId('parent-row-id-1'));

      // assert
      expect(getByText('Office 1.1')).toBeInTheDocument();
      expect(getByText('Office 1.2')).toBeInTheDocument();

      expect(getByText('Parent 2')).toBeInTheDocument();
      expect(queryByText('Office 2.1')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByTestId('parent-row-id-2'));

      expect(queryByText('Office 1.1')).not.toBeInTheDocument();
      expect(queryByText('Office 1.2')).not.toBeInTheDocument();
      expect(getByText('Office 2.1')).toBeInTheDocument();
    });
    it('renders the first row open if one client', () => {
      const initialState = {
        admin: {
          parentOfficeList: {
            items: [
              {
                id: 1,
                name: 'Parent 1',
                logoFileName: 'image-1.png',
                clientId: 2,
                offices: [
                  { id: 1, name: 'Office 1.1' },
                  { id: 2, name: 'Office 1.2' },
                ],
              },
            ],
          },
        },
      };
      // arrange
      const { getByText } = render(<AdminOffices />, { initialState });

      // assert
      expect(getByText('admin.office_plural')).toBeInTheDocument();
      expect(getByText('admin.client')).toBeInTheDocument();

      expect(getByText('Parent 1')).toBeInTheDocument();
      expect(getByText('Office 1.1')).toBeInTheDocument();
      expect(getByText('Office 1.2')).toBeInTheDocument();
    });
    it('renders message if no clients', () => {
      const initialState = {
        admin: {
          parentOfficeList: {
            items: [],
          },
        },
      };
      // arrange
      const { getByText } = render(<AdminOffices />, { initialState });

      // assert
      expect(getByText('admin.office_plural')).toBeInTheDocument();
      expect(getByText('admin.client')).toBeInTheDocument();

      expect(getByText('admin.noClients')).toBeInTheDocument();
    });
    it('renders message if no offices', () => {
      const initialState = {
        admin: {
          parentOfficeList: {
            items: [
              {
                id: 1,
                name: 'Parent 1',
                logoFileName: 'image-1.png',
                clientId: 2,
                offices: [],
              },
            ],
          },
        },
      };
      // arrange
      const { getByText } = render(<AdminOffices />, { initialState });

      // assert
      expect(getByText('admin.office_plural')).toBeInTheDocument();
      expect(getByText('admin.client')).toBeInTheDocument();

      expect(getByText('Parent 1')).toBeInTheDocument();
      expect(getByText('admin.noOffices')).toBeInTheDocument();
    });
  });
});
