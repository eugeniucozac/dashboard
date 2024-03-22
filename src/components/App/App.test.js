import React from 'react';
import * as uiActions from 'stores/ui/ui.actions';
import App from './App';
import { render, renderWithAuth, waitFor, setLocation, resetLocation } from 'tests';
import fetchMock from 'fetch-mock';

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    setBrand: jest.fn(),
  };
});

fetchMock.config.overwriteRoutes = true;

describe('COMPONENTS › App', () => {
  const refDataState = {
    referenceData: {
      businessTypes: [],
      capacityTypes: [1, 2, 3],
      clients: [],
      countries: [],
      currencies: [],
      departments: [
        { id: 1, name: '1' },
        { id: 2, name: '2' },
        { id: 3, name: '3' },
      ],
      insureds: [],
      markets: [],
      offices: [],
      statuses: {
        account: [],
        placement: [],
        policy: [],
        policyMarketQuote: [],
      },
      underwriters: [],
      loaded: true,
    },
  };

  const uiState = {
    ui: {
      brand: '',
      nav: {
        expanded: false,
      },
      sidebar: {
        expanded: false,
      },
      modal: [],
      loader: {
        queue: [],
      },
      notification: {
        queue: [],
      },
    },
  };

  const stateUserAdmin = {
    user: {
      isAdmin: true,
      departmentIds: [1, 2, 3],
      auth: {
        accessToken: 'abc123',
      },
    },
    ...refDataState,
    ...uiState,
  };

  const stateExtendedUser = {
    user: {
      landingPage: 'administration',
      userDetails: {
        id: 1,
        name: 'Super Admin',
      },
      privilege: {},
      departmentIds: [1, 2, 3],
      auth: {
        accessToken: 'abc123',
      },
    },
    ...refDataState,
    ...uiState,
  };

  const stateUserWithoutDept = {
    user: {
      departmentIds: [],
      auth: {
        accessToken: 'abc123',
      },
    },
    ...refDataState,
    ...uiState,
  };

  const stateUserBrokerWithDept = {
    user: {
      role: 'BROKER',
      departmentIds: [1, 2, 3],
      auth: {
        accessToken: 'abc123',
      },
    },
    ...refDataState,
    ...uiState,
  };

  const stateUserFullAccess = {
    user: {
      role: 'BROKER',
      departmentIds: [1, 2, 3],
      departmentSelected: 1,
      auth: {
        accessToken: 'abc123',
      },
    },
    ...refDataState,
    ...uiState,
  };

  const stateUserMinimalAccess = {
    user: {
      role: 'COBROKER',
      departmentIds: [1],
      departmentSelected: 1,
      auth: {
        accessToken: 'abc123',
      },
    },
    ...refDataState,
    ...uiState,
  };

  const stateIsDev = {
    user: {
      departmentIds: [1, 2, 3],
      auth: {
        accessToken: 'abc123',
      },
    },
    config: {
      vars: {
        type: 'development',
      },
    },
    ...refDataState,
    ...uiState,
  };

  const getTimestamp = (hours) => {
    return new Date().getTime() + hours * 60 * 60 * 1000;
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 'abc123', expiresAt: getTimestamp(2) }));
    fetchMock.get('glob:*/api/client/parent*', { body: { status: 'success', data: { id: 1 } } });
    fetchMock.get('glob:*/api/placement/department/*?page=*', { body: { status: 'success', data: {} } });
    fetchMock.get('glob:*/api/locations/*', { body: { status: 'success', data: [] } });
    fetchMock.get('glob:*/api/referenceData', { body: { status: 'success', data: stateUserFullAccess.referenceData } });
    fetchMock.get('glob:*/api/comment/*', { body: { status: 'success', data: [] } });
    fetchMock.get('glob:*/api/document/folders', { body: { status: 'success', data: [] } });
    fetchMock.get('glob:*/api/user', { body: { status: 'success', data: { departmentIds: [1, 2, 3] } } });
    fetchMock.get('glob:*/authservice/user/role/info', { body: { status: 'ERROR', data: {} } });
    fetchMock.get('glob:*user?userId*', { body: { status: 'success', data: [] } });
    jest.spyOn(uiActions, 'setBrand').mockReturnValue({ type: 'BRAND_SET' });
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.restore();
  });

  describe('@title', () => {
    it('renders header and nav if user is logged in', () => {
      // arrange
      const { getByTestId } = render(<App />);

      // assert
      expect(getByTestId('header')).toBeInTheDocument();
      expect(getByTestId('nav-drawer')).toBeInTheDocument();
    });

    it('renders empty title by default', () => {
      // arrange
      render(<App />, { initialState: { ui: { brand: '' } } });

      // assert
      expect(window.document.title).toBe('');
    });

    it('renders default Price Forbes title if brand is not pre-defined valid value', () => {
      // arrange
      render(<App />, { initialState: { ui: { brand: 'foo' } } });

      // assert
      expect(document.title).toContain('EDGE Price Forbes Online');
    });

    it('renders default Price Forbes title if brand is set to priceforbes', () => {
      // arrange
      render(<App />, { initialState: { ui: { brand: 'priceforbes' } } });

      // assert
      expect(document.title).toContain('EDGE Price Forbes Online');
    });

    it('renders Bishopsgate title if brand is set to bishopsgate', () => {
      // arrange
      render(<App />, { initialState: { ui: { brand: 'bishopsgate' } } });

      // assert
      expect(document.title).toContain('EDGE Bishopsgate Online');
    });
  });

  describe('@current Edge user', () => {
    const placement = {
      id: 1,
      departmentId: 1,
      insureds: [{ id: 1, name: 'Insured 1' }],
      clients: [{ id: 1, name: 'Client 1' }],
      inceptionDate: '2020-11-30',
      policies: [],
      users: [],
      statusId: 1,
    };

    // describe('admin routes', () => {
    //   beforeEach(() => {
    //     fetchMock.get('glob:*/api/user/department*', { body: { status: 'success', data: [] } });
    //     fetchMock.get('glob:*/api/user/all*', { body: { status: 'success', data: [] } });
    //     fetchMock.get('glob:*/authservice/user/role/info', { body: { status: 'ERROR', data: {} } });
    //     fetchMock.get('glob:*/api/user', { body: { status: 'success', data: { id: 1, departmentIds: [1, 2, 3], isAdmin: true } } });
    //   });

    //   it('admin', async () => {
    //     const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserAdmin, route: ['/admin'] });

    //     // await waitFor(() => getByTestId('admin'));
    //     // expect(getByTestId('admin')).toBeInTheDocument();
    //   });
    // });

    describe('broker routes', () => {
      beforeEach(() => {
        fetchMock.get('glob:*/api/openingMemo/department*', { body: { status: 'success', data: {} } });
        fetchMock.get('glob:*/api/openingMemo*', { body: { status: 'success', data: {} } });
        fetchMock.get('glob:*/api/v1/mrcContracts*', { body: {} });
        fetchMock.get('glob:*/api/modelling*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/trip*', { body: { status: 'success', data: { id: 1 } } });
        fetchMock.get('glob:*/api/v1/risks*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/v1/clients*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/v1/insured*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/v1/facilities*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/v1/carriers*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/v1/products*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/user', { body: { status: 'success', data: { role: 'BROKER', departmentIds: [1, 2, 3] } } });
      });

      it('openingMemo', async () => {
        // arrange
        const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/checklist'] });

        // // assert
        // await waitFor(() => getByTestId('openingMemo'));
        // expect(getByTestId('openingMemo')).toBeInTheDocument();
      });

      // it('openingMemo/:id?', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/checklist/1'] });

      //   // assert
      //   await waitFor(() => getByTestId('openingMemo'));
      //   expect(getByTestId('openingMemo')).toBeInTheDocument();
      // });

      // it('modelling', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/modelling'] });

      //   // assert
      //   await waitFor(() => getByTestId('modelling'));
      //   expect(getByTestId('modelling')).toBeInTheDocument();
      // });

      // it('modelling/:id?', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/modelling/1'] });

      //   // assert
      //   await waitFor(() => getByTestId('modelling'));
      //   // expect(getByTestId('modelling')).toBeInTheDocument();
      // });

      // it('opportunity', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/opportunity'] });

      //   // assert
      //   await waitFor(() => getByTestId('opportunity'));
      //   expect(getByTestId('opportunity')).toBeInTheDocument();
      // });

      it('opportunity/:id?', async () => {
        // arrange
        //  const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/opportunity/1'] });
        // assert
        /*  await waitFor(() => getByTestId('opportunity'));
        expect(getByTestId('opportunity')).toBeInTheDocument(); */
      });

      // it('Quote & Bind', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/quote-bind'] });

      //   // assert
      //   await waitFor(() => getByTestId('products'));
      //   expect(getByTestId('products')).toBeInTheDocument();
      // });

      it('quote-bind/admin', async () => {
        // arrange
        const { queryByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/quote-bind/admin'] });

        // assert
        await waitFor(() => queryByTestId('products-admin'));
        expect(queryByTestId('products-admin')).not.toBeInTheDocument();
      });

      // it('trips', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserBrokerWithDept, route: ['/trips'] });

      //   // assert
      //   await waitFor(() => getByTestId('trips'));
      //   expect(getByTestId('trips')).toBeInTheDocument();
      // });
    });

    describe('un-protected routes', () => {
      beforeEach(() => {
        fetchMock.get('glob:*/api/placement/1', { body: { status: 'success', data: placement } });
        fetchMock.get('glob:*/api/placement/department/1?*', { body: { status: 'success', data: { content: [{ id: 1 }] } } });
        fetchMock.get('glob:*/api/placement/department/2*?*', { body: { status: 'success', data: { content: [{ id: 2 }] } } });
        fetchMock.get('glob:*/api/marketParent', { body: { status: 'success', data: { content: { id: 1 } } } });
        fetchMock.get('glob:*/api/marketParent/*/placements*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/marketParent/all*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'success', data: [] } });
      });

      it('clients', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/clients'] });

        // assert
        await waitFor(() => getByTestId('client'));
        expect(getByTestId('client')).toBeInTheDocument();
      });

      it('client/:id/', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/client/1'] });

        // assert
        await waitFor(() => getByTestId('client'));
        expect(getByTestId('client')).toBeInTheDocument();
      });

      it('client/:id/:slug?', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/client/1/foo'] });

        // assert
        await waitFor(() => getByTestId('client'));
        expect(getByTestId('client')).toBeInTheDocument();
      });

      it('client/:id/:slug/offices/:officeIds', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/client/1/foo/offices/100'] });

        // assert
        await waitFor(() => getByTestId('client'));
        expect(getByTestId('client')).toBeInTheDocument();
      });

      it('home', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/'] });

        // assert
        await waitFor(() => getByTestId('home'));
        expect(getByTestId('home')).toBeInTheDocument();
      });

      it('markets', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/markets'] });

        // assert
        await waitFor(() => getByTestId('market'));
        expect(getByTestId('market')).toBeInTheDocument();
      });

      it('market/:id/', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/market/1'] });

        // assert
        await waitFor(() => getByTestId('market'));
        expect(getByTestId('market')).toBeInTheDocument();
      });

      it('market/:id/:slug?', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/market/1/foo'] });

        // assert
        await waitFor(() => getByTestId('market'));
        expect(getByTestId('market')).toBeInTheDocument();
      });

      it('department', async () => {
        // arrange
        const { getByTestId, queryByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/department/2/two'] });

        // assert
        await waitFor(() => getByTestId('department'));
        expect(getByTestId('department')).toBeInTheDocument();
        expect(getByTestId('empty-placeholder')).toBeInTheDocument();
      });

      it('department (no departments)', async () => {
        // arrange
        fetchMock.get('glob:*/api/user', { body: { status: 'success', data: { departmentIds: [] } } });
        const { getByTestId, queryByTestId } = renderWithAuth(<App />, {
          initialState: stateUserWithoutDept,
          route: ['/department/2/two'],
        });

        // assert;
        // await waitFor(() => getByTestId('empty-placeholder'));
        // expect(queryByTestId('department')).toBeInTheDocument();
      });

      // it('placement overview', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserFullAccess, route: ['/placement/overview/1'] });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(getByTestId('page-header-placement-overview')).toBeInTheDocument();
      // });

      // it('placement market-sheet', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserFullAccess, route: ['/placement/market-sheet/1'] });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(getByTestId('page-header-placement-market-sheet')).toBeInTheDocument();
      // });

      // it('placement firm-order', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserFullAccess, route: ['/placement/firm-order/1'] });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(getByTestId('page-header-placement-firm-order')).toBeInTheDocument();
      // });

      // it('placement bound', async () => {
      //   // arrange
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserFullAccess, route: ['/placement/bound/1'] });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(getByTestId('page-header-placement-bound')).toBeInTheDocument();
      // });

      // it('placement modelling (broker)', async () => {
      //   // arrange
      //   fetchMock.get('glob:*/api/analytics/placement/*', { body: { status: 'success', data: [] } });
      //   fetchMock.get('glob:*/api/modelling/placement/*', { body: { status: 'success', data: [] } });
      //   fetchMock.get('glob:*/api/user', { body: { status: 'success', data: stateUserFullAccess.user } });
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserFullAccess, route: ['/placement/modelling/1'] });

      //   // assert
      //   //   await waitFor(() => getByTestId('placement'));
      //   //   expect(getByTestId('page-header-placement-modelling')).toBeInTheDocument();
      // });

      // it('placement modelling (co-broker)', async () => {
      //   // arrange
      //   fetchMock.get('glob:*/api/analytics/placement/*', { body: { status: 'success', data: [] } });
      //   fetchMock.get('glob:*/api/modelling/placement/*', { body: { status: 'success', data: [] } });
      //   const { getByTestId, queryByTestId } = renderWithAuth(<App />, {
      //     initialState: stateUserFullAccess,
      //     route: ['/placement/modelling/1'],
      //   });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(queryByTestId('page-header-placement-modelling')).not.toBeInTheDocument();
      //   // expect(getByTestId('placement-content')).toBeEmptyDOMElement();
      // });

      // it('placement checklist (broker)', async () => {
      //   // arrange
      //   fetchMock.get('glob:*/api/openingMemo/placement/*', { body: { status: 'success', data: [] } });
      //   fetchMock.get('glob:*/api/user', { body: { status: 'success', data: stateUserFullAccess.user } });
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserFullAccess, route: ['/placement/checklist/1'] });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(getByTestId('page-header-opening-memo')).toBeInTheDocument();
      // });

      // it('placement checklist (co-broker)', async () => {
      //   // arrange
      //   fetchMock.get('glob:*/api/openingMemo/placement/*', { body: { status: 'success', data: [] } });
      //   const { getByTestId, queryByTestId } = renderWithAuth(<App />, {
      //     initialState: stateUserFullAccess,
      //     route: ['/placement/checklist/1'],
      //   });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(queryByTestId('page-header-opening-memo')).not.toBeInTheDocument();
      //   // expect(getByTestId('placement-content')).toBeEmptyDOMElement();
      // });

      // it('placement documents', async () => {
      //   // arrange
      //   fetchMock.get('glob:*/api/placements/*', { body: { status: 'success', data: [] } });
      //   const { getByTestId } = renderWithAuth(<App />, { initialState: stateUserFullAccess, route: ['/placement/documents/1'] });

      //   // assert
      //   // await waitFor(() => getByTestId('placement'));
      //   // expect(getByTestId('page-header-placement-documents')).toBeInTheDocument();
      // });

      it('policy', async () => {
        // arrange
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/policy/123'] });

        // assert
        // await waitFor(() => getByTestId('policy'));
        // expect(getByTestId('policy')).toBeInTheDocument();
      });

      it('industry news', async () => {
        // arrange
        fetchMock.get('glob:https://widget.slipcase.com/*', { body: [] });
        const { getByTestId } = render(<App />, { initialState: stateUserMinimalAccess, route: ['/industry-news'] });

        // assert
        await waitFor(() => getByTestId('industryNews'));
        expect(getByTestId('industryNews')).toBeInTheDocument();
      });
    });

    xdescribe('new extended edge user routes', () => {
      beforeEach(() => {
        fetchMock.get('glob:*/api/user/department*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/api/user/all*', { body: { status: 'success', data: [] } });
        fetchMock.get('glob:*/authservice/user/role/info', { body: { status: 'ERROR', data: {} } });
        fetchMock.get('glob:*/api/user', { body: { status: 'success', data: { id: 1, departmentIds: [1, 2, 3], isAdmin: true } } });
        fetchMock.get('glob:*user?userId*', { body: { status: 'success', data: [] } });
      });

      it('administration', async () => {
        const { getByTestId, queryByTestId } = renderWithAuth(<App />, { initialState: stateUserAdmin, route: ['/administration'] });

        await waitFor(() => getByTestId('home'));
        expect(queryByTestId('administration')).not.toBeInTheDocument();
      });

      it('premiumProcessing', async () => {
        const { getByTestId, queryByTestId } = renderWithAuth(<App />, { initialState: stateUserAdmin, route: ['/premiumProcessing'] });

        await waitFor(() => getByTestId('home'));
        expect(queryByTestId('premiumProcessing')).not.toBeInTheDocument();
      });

      it('processingInstructions', async () => {
        const { getByTestId, queryByTestId } = renderWithAuth(<App />, {
          initialState: stateUserAdmin,
          route: ['/processingInstructions'],
        });

        await waitFor(() => getByTestId('home'));
        expect(queryByTestId('processingInstructions')).not.toBeInTheDocument();
      });

      it('claims', async () => {
        const { getByTestId, queryByTestId } = renderWithAuth(<App />, { initialState: stateUserAdmin, route: ['/claims'] });

        await waitFor(() => getByTestId('home'));
        expect(queryByTestId('claims')).not.toBeInTheDocument();
      });
    });
  });

  xdescribe('@extended Edge user', () => {
    beforeEach(() => {
      fetchMock.get('glob:*/authservice/user/role/info', {
        body: {
          status: 'OK',
          data: {
            userDetails: { id: 1, name: 'John Smith' },
            role: { id: 2, name: 'Technician' },
          },
        },
      });
      fetchMock.get('glob:*/authservice/api/users*', { body: { status: 'OK', data: [] } });
      fetchMock.get('glob:*/authservice/user/refData/*', { body: { status: 'OK', data: [] } });
      fetchMock.get('glob:*user?userId*', { body: { status: 'success', data: [] } });
    });

    it('administration', async () => {
      const { getByTestId } = renderWithAuth(<App />, { initialState: stateExtendedUser, route: ['/administration'] });

      await waitFor(() => getByTestId('administration'));
      expect(getByTestId('administration')).toBeInTheDocument();
    });

    it('premiumProcessing', async () => {
      fetchMock.get('glob:*/dataservice/api/gui/PremiumProcessing/workbasket/summaryOfCasesByStatus/*', {
        body: { status: 'OK', data: { caseProgressList: [] } },
      });
      fetchMock.post('glob:*/dataservice/case/summary/taskList', { body: { status: 'OK', data: [] } });
      fetchMock.post('glob:*/dataservice/api/gui/screen/rfi', { body: { status: 'OK', data: {} } });
      fetchMock.get('glob:*localhost:9000/api/*', { body: { status: 'OK', data: {} } });
      const { getByTestId } = renderWithAuth(<App />, { initialState: stateExtendedUser, route: ['/premium-processing'] });

      await waitFor(() => getByTestId('premium-processing'));
      expect(getByTestId('premium-processing')).toBeInTheDocument();
    });

    it('processingInstructions', async () => {
      fetchMock.post('glob:*/dataservice/home/processingInstructionGrid', { body: { status: 'OK', data: [] } });
      fetchMock.get('glob:*/dataservice/processInstruction/create/getProcessType', { body: { status: 'OK', data: [] } });
      const { getByTestId } = renderWithAuth(<App />, {
        initialState: stateExtendedUser,
        route: ['/processing-instructions'],
      });

      await waitFor(() => getByTestId('processing-instructions'));
      expect(getByTestId('processing-instructions')).toBeInTheDocument();
    });

    it('processingInstructions/new', async () => {
      fetchMock.post('glob:*/dataservice/home/processingInstructionGrid', { body: { status: 'OK', data: [] } });
      fetchMock.get('glob:*/premium-processing/instruction/get/broking/details/*', { body: { status: 'OK', data: {} } });
      fetchMock.get('glob:*/premium-processing/data/advanceSearch/departments', { body: { status: 'OK', data: [] } });
      const { getByTestId } = renderWithAuth(<App />, {
        initialState: stateExtendedUser,
        route: ['/processing-instructions/new/123'],
      });

      await waitFor(() => getByTestId('new-processing-instructions'));
      expect(getByTestId('new-processing-instructions')).toBeInTheDocument();
    });

    it('processingInstructions/1234', async () => {
      fetchMock.post('glob:*/dataservice/home/processingInstructionGrid', { body: { status: 'OK', data: [] } });
      fetchMock.get('glob:*/premium-processing/instruction/get/broking/details/*', { body: { status: 'OK', data: {} } });
      fetchMock.get('glob:*/premium-processing/data/advanceSearch/departments', { body: { status: 'OK', data: [] } });
      fetchMock.get('glob:*/premium-processing/instruction/1234', { body: { status: 'OK', data: {} } });
      const { getByTestId } = renderWithAuth(<App />, {
        initialState: stateExtendedUser,
        route: ['/processing-instructions/1234'],
      });

      await waitFor(() => getByTestId('new-processing-instructions'));
      expect(getByTestId('new-processing-instructions')).toBeInTheDocument();
    });

    it('claims', async () => {
      const { getByTestId } = renderWithAuth(<App />, { initialState: stateExtendedUser, route: ['/claims'] });

      await waitFor(() => getByTestId('claims'));
      expect(getByTestId('claims')).toBeInTheDocument();
    });

    it('other Edge routes are not available', async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<App />, { initialState: stateExtendedUser, route: ['/department/2/two'] });

      // assert
      await waitFor(() => getByTestId('administration'));
      expect(queryByTestId('department')).not.toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('sets the brand based on the hostname', () => {
      // arrange
      const loc = setLocation('foo');
      const spySetBrand = jest.spyOn(uiActions, 'setBrand').mockReturnValue({ type: 'BRAND_SET' });
      render(<App />);

      // assert
      expect(spySetBrand).toHaveBeenCalledTimes(1);
      expect(spySetBrand).toHaveBeenCalledWith('foo');

      // revert
      resetLocation(loc);
    });
  });
});
