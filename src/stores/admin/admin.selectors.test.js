import { selectAdminOffices } from 'stores';

describe('STORES › SELECTORS › admin', () => {
  const initialState = {
    admin: {
      parentOfficeListAll: {
        items: [
          {
            id: 1,
            name: 'Parent 1',
            offices: [
              {
                id: 2,
                name: 'Office 1.1',
                clients: [
                  { id: 3, name: 'Client 3' },
                  { id: 4, name: 'Client 4' },
                ],
              },
              {
                id: 5,
                name: 'Office 1.2',
                clients: [{ id: 6, name: 'Client 6' }],
              },
              {
                id: 10,
                name: 'Office 1.3',
                clients: [{ id: 6, name: 'Client 6' }],
              },
            ],
          },
          {
            id: 7,
            name: 'Parent 2',
            offices: [
              {
                id: 8,
                name: 'Office 2.1',
                clients: [{ id: 9, name: 'Client 9' }],
              },
            ],
          },
        ],
      },
    },
  };
  it('selectAdminOffices', () => {
    // assert
    expect(selectAdminOffices(initialState)).toEqual([
      {
        id: 2,
        name: 'Parent 1 - Office 1.1',
      },
      {
        id: 5,
        name: 'Parent 1 - Office 1.2',
      },
      {
        id: 10,
        name: 'Parent 1 - Office 1.3',
      },
      {
        id: 8,
        name: 'Parent 2 - Office 2.1',
      },
    ]);
  });
});
