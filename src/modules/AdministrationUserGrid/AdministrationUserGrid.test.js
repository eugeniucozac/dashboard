import React from 'react';

// app
import { render, waitFor, within } from 'tests';
import AdministrationUserGrid from './AdministrationUserGrid';

describe('MODULES › AdministrationUserGrid', () => {
  const initialState = {
    administration: {
      userList: {
        items: [
          {
            id: 7,
            fullName: 'David Payne',
            email: 'anitha.m@mphasis.com',
            role: 'Technician manager',
            departments: 'Healthcare',
            groups: 'Back Office',
            xbInstances: 'GBX 5, GXB 3', //entity
            businessProcesses: 'Premium Processing', //team
          },
          {
            id: 5,
            fullName: 'Hazel ',
            email: 'anitha.m@mphasis.com',
            role: 'Main Front-End Contact',
            departments: 'Cargo',
            groups: 'Middle Office',
            xbInstances: 'GBX 5',
            businessProcesses: 'Premium Processing',
          },
          {
            id: 2,
            fullName: 'James Tylor',
            email: 'James@mphasis.com',
            role: 'Admin',
            departments: 'department1, department2',
            groups: 'Front Office, Back Office',
            xbInstances: 'GBX 5, GXB 3',
            businessProcesses: 'Potato Farming',
          },
        ],
        itemsTotal: 25,
        page: 1,
        pageSize: 10,
        pageTotal: 3,
        sortBy: 'fullName',
        sortType: 'lexical',
        sortDirection: 'asc',
        query: '',
      },
    },
  };

  describe('@renders', () => {
    /*it('renders the table column headers', () => {
      // given
      const { getByText } = render(<AdministrationUserGrid />, { initialState });

      // then
      expect(getByText('administration.users.table.cols.fullName')).toBeInTheDocument();
      expect(getByText('administration.users.table.cols.email')).toBeInTheDocument();
      expect(getByText('administration.users.table.cols.businessProcess')).toBeInTheDocument();
      expect(getByText('administration.users.table.cols.xbInstance')).toBeInTheDocument();
      expect(getByText('administration.users.table.cols.departments')).toBeInTheDocument();
      expect(getByText('administration.users.table.cols.groups')).toBeInTheDocument();
      expect(getByText('administration.users.table.cols.role')).toBeInTheDocument();
    });*/

    /*it('renders the table rows', () => {
      // given
      const { getByTestId } = render(<AdministrationUserGrid />, { initialState });

      // then
      let row2 = getByTestId('2');
      expect(row2).toBeInTheDocument();
      expect(row2.children.length).toBe(8);
      expect(row2.querySelector(':nth-child(1)')).toHaveTextContent('James Tylor');
      expect(row2.querySelector(':nth-child(2)')).toHaveTextContent('James@mphasis.com');
      expect(row2.querySelector(':nth-child(3)')).toHaveTextContent('Potato Farming');
      expect(row2.querySelector(':nth-child(4)')).toHaveTextContent('GBX 5, GXB 3');
      expect(row2.querySelector(':nth-child(5)')).toHaveTextContent('department1, department2');
      expect(row2.querySelector(':nth-child(6)')).toHaveTextContent('Front Office, Back Office');
      expect(row2.querySelector(':nth-child(7)')).toHaveTextContent('Admin');

      expect(getByTestId('pagination')).toBeInTheDocument();
    });*/

    /*it('doesnt show pagination if pagination prop is incorrect', () => {
      const noPaginationState = {
        administration: {
          userList: {
            items: [],
            // these following fields are needed for pagination to render correctly
            // "totalPages": 3,
            // "totalElements": 25,
            // "number": 0,
            // "size": 10,
          },
        },
      };

      // given
      const { queryByTestId } = render(<AdministrationUserGrid />, { noPaginationState });

      // then
      expect(queryByTestId('pagination')).toBeNull();
    });*/

    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AdministrationUserGrid />);

      // assert
      expect(container).toBeInTheDocument();
    });
  });
});
