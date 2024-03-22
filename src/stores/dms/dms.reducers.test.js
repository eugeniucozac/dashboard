import reducer from './dms.reducers';

describe('STORES › REDUCERS › dms', () => {
  const initialState = {
    view: {
      files: [],
      versionHistory: {},
      fileMetaData: {},
      isDmsFileViewGridDataLoading: false,
      isDmsWidgetDocsLoading: false,
    },
    search: {
      files: [],
      isDmsSearchDataLoading: false,
    },
    upload: {
      metaData: {
        requestParams: { referenceId: '', sectionRef: '' },
        data: {},
        isLoading: false,
      },
      documentsUploaded: {},
    },
    contextSubType: {
      type: '',
      caseIncidentID: '',
      caseIncidentNotesID: '',
      refId: '',
    },
    dmsWidgetExpanded: false,
    docViewer: {
      isOpen: false,
    },
    advanceSearchValues: {},
    claimDocsMetaData: {},
    widgetDocDetails: {},
    clientSideUploadFiles: {
      uploadFileDetails: {},
      documentTableList: [],
      documentNameList: [],
      linkedDocumentList: [],
    },
    multipleContextDocs: {
      files: [],
      versionHistory: {},
      fileMetaData: {},
      isLoading: false,
    },
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('DMS UPLOAD', () => {
    it('should handle DMS_METADATA_GET_REQUEST', () => {
      const currentState = { ...initialState };

      const state = reducer(currentState, {
        type: 'DMS_METADATA_GET_REQUEST',
        payload: { referenceId: 9168, sectionRef: 'DAA06974' },
      });

      expect(state?.upload?.metaData?.requestParams).toEqual({ referenceId: 9168, sectionRef: 'DAA06974' });
      expect(state?.upload?.metaData?.isLoading).toEqual(true);
    });

    it('should handle DMS_METADATA_GET_SUCCESS', () => {
      const currentState = {
        ...initialState,
        upload: {
          metaData: {
            requestParams: { referenceId: 9168, sectionRef: 'DAA06974' },
            data: {},
          },
          documentsUploaded: {},
        },
      };

      const state = reducer(currentState, {
        type: 'DMS_METADATA_GET_SUCCESS',
        payload: {
          policyId: 0,
          claimId: 0,
          lossId: 9168,
          insuredId: 0,
          departmentId: 0,
          xbInstanceId: 0,
          year: 2022,
          createdBy: 0,
          createdDate: '2022-01-12T17:00:43.323+00:00',
          catCodesID: 0,
          lossName: 'car crash',
          lossDescription: 'car crash',
          lossCreatedDate: '2022-01-12T17:00:27.430+00:00',
          taskId: 0,
          lossRef: 'DAA06974',
        },
      });

      expect(state?.upload?.metaData).toEqual({
        requestParams: { referenceId: 9168, sectionRef: 'DAA06974' },
        data: {
          policyId: 0,
          claimId: 0,
          lossId: 9168,
          insuredId: 0,
          departmentId: 0,
          xbInstanceId: 0,
          year: 2022,
          createdBy: 0,
          createdDate: '2022-01-12T17:00:43.323+00:00',
          catCodesID: 0,
          lossName: 'car crash',
          lossDescription: 'car crash',
          lossCreatedDate: '2022-01-12T17:00:27.430+00:00',
          taskId: 0,
          lossRef: 'DAA06974',
        },
        isLoading: false,
      });
    });

    it('should handle DMS_METADATA_GET_ERROR', () => {
      const currentState = {
        ...initialState,
        upload: {
          metaData: {
            requestParams: { referenceId: 9168, sectionRef: 'DAA06974' },
            data: {},
            isLoading: true,
          },
          documentsUploaded: {},
        },
      };

      const state = reducer(currentState, {
        type: 'DMS_METADATA_GET_ERROR',
        payload: { error: 'some backend error' },
      });

      expect(state?.upload?.metaData).toEqual({
        requestParams: { referenceId: '', sectionRef: '' },
        data: {},
        isLoading: false,
      });
    });

    it('should handle DMS_POST_DOCUMENTS_REQUEST', () => {
      const currentState = { ...initialState };

      const state = reducer(currentState, {
        type: 'DMS_POST_DOCUMENTS_REQUEST',
        payload: {
          context: 'Loss',
          documentTypeKey: 'Claims',
          submitData: {
            lossId: 9168,
            lossName: 'car crash',
            catCodesID: 0,
            lossCreatedDate: '2022-01-12T17:00:43.323+00:00',
            policyId: 0,
            year: 2022,
            xbInstanceId: 0,
            departmentId: 0,
            claimId: 0,
            uniqueMarketRef: null,
            ucr: null,
            documentDto: [
              {
                documentName: 'DMS-Test - Copy (2).txt',
                documentTypeId: 1421,
                documentTypeDescription: 'Mud Map',
                fileLastModifiedDate: '2021-11-24T19:37:35.078Z',
                docClassification: 3,
                tags: [],
                metadataFields: [
                  {
                    prop: 'Payment Reference',
                    value: '',
                  },
                  {
                    prop: 'Loss Payee',
                    value: '',
                  },
                  {
                    prop: 'Amount',
                    value: '',
                  },
                  {
                    prop: 'Currency',
                    value: '',
                  },
                  {
                    prop: 'Payment date',
                    value: '2022-01-12T17:00:44.721Z',
                  },
                ],
              },
            ],
          },
          submitFiles: [
            {
              path: 'DMS-Test - Copy (2).txt',
            },
          ],
        },
      });

      expect(state?.upload?.documentsUploaded).toEqual({});
    });

    it('should handle DMS_POST_DOCUMENTS_SUCCESS', () => {
      const currentState = {
        ...initialState,
        upload: {
          metaData: {
            requestParams: { referenceId: 9168, sectionRef: 'DAA06974' },
            data: {},
            isLoading: false,
          },
          documentsUploaded: {},
        },
      };

      const state = reducer(currentState, {
        type: 'DMS_POST_DOCUMENTS_SUCCESS',
        payload: {
          policyId: 0,
          claimId: 0,
          lossId: 9168,
          departmentId: 0,
          xbInstanceId: 1,
          sectionType: 'Loss',
          referenceId: 'DAA06974',
          documentDto: [
            {
              documentId: 1264274,
              documentObjectId: 0,
              spDocumentid: '2JKUN5PU2PZY-105918524-5149',
              documentPath: 'https://abc.sharepoint.com/sites//LossLibrary/2022/1/12/DAA06974/DMS-Test%20-%20Copy%20(2).txt',
              documentName: 'DMS-Test - Copy (2).txt',
              documentExtType: '.txt',
              documentTypeId: 1421,
              documentVersion: '1.0',
              xbInstanceId: 1,
              createdBy: 863,
              createdDate: '2022-01-12T17:00:44.952+00:00',
              updatedBy: 863,
              updatedDate: '2022-01-12T17:00:44.952+00:00',
              isActive: 1,
              year: 2022,
              fileByte: '<fileByte>',
              uniqueObjectId: 0,
              sectionType: 'Loss',
              policyId: 0,
              srcApplication: 'EDGE',
              createdByName: 'Arun Arumugam',
              insuredId: 0,
              referenceId: 'DAA06974',
              departmentId: 0,
              tags: [],
              lossName: 'car crash',
              catCodesID: 0,
              documentTypeDescription: 'Mud Map',
              isLinked: 0,
              metadataFields: [
                { prop: 'Payment Reference', value: '' },
                { prop: 'Loss Payee', value: '' },
                { prop: 'Amount', value: '' },
                { prop: 'Currency', value: '' },
                { prop: 'Payment date', value: '2022-01-12T17:00:44.721Z' },
              ],
              claimRef: '',
              taskId: 0,
              folderName: 'Analysis',
              lossRef: 'DAA06974',
              claimId: 0,
              lossId: 9168,
              docClassification: '3',
              fileName: 'DMS-Test - Copy (2).txt',
              lossCreatedDate: '2022-01-12T17:00:43.323+00:00',
              fileLastModifiedDate: '2021-11-24T19:37:35.078+00:00',
              isLinkedFromLoss: 0,
              isSendToGxb: 0,
              isLinkedToMultipleContexts: 0,
              documentUploaded: true,
            },
          ],
          srcApplication: 'EDGE',
          createdBy: 863,
          createdDate: '2022-01-12T17:00:44.952+00:00',
          lossName: 'car crash',
          lossCreatedDate: '2022-01-12T17:00:43.323+00:00',
          claimRef: '',
          taskId: 0,
          lossRef: 'DAA06974',
        },
      });

      expect(state?.upload?.documentsUploaded).toEqual({
        policyId: 0,
        claimId: 0,
        lossId: 9168,
        departmentId: 0,
        xbInstanceId: 1,
        sectionType: 'Loss',
        referenceId: 'DAA06974',
        documentDto: [
          {
            documentId: 1264274,
            documentObjectId: 0,
            spDocumentid: '2JKUN5PU2PZY-105918524-5149',
            documentPath: 'https://abc.sharepoint.com/sites//LossLibrary/2022/1/12/DAA06974/DMS-Test%20-%20Copy%20(2).txt',
            documentName: 'DMS-Test - Copy (2).txt',
            documentExtType: '.txt',
            documentTypeId: 1421,
            documentVersion: '1.0',
            xbInstanceId: 1,
            createdBy: 863,
            createdDate: '2022-01-12T17:00:44.952+00:00',
            updatedBy: 863,
            updatedDate: '2022-01-12T17:00:44.952+00:00',
            isActive: 1,
            year: 2022,
            fileByte: '<fileByte>',
            uniqueObjectId: 0,
            sectionType: 'Loss',
            policyId: 0,
            srcApplication: 'EDGE',
            createdByName: 'Arun Arumugam',
            insuredId: 0,
            referenceId: 'DAA06974',
            departmentId: 0,
            tags: [],
            lossName: 'car crash',
            catCodesID: 0,
            documentTypeDescription: 'Mud Map',
            isLinked: 0,
            metadataFields: [
              {
                prop: 'Payment Reference',
                value: '',
              },
              {
                prop: 'Loss Payee',
                value: '',
              },
              {
                prop: 'Amount',
                value: '',
              },
              {
                prop: 'Currency',
                value: '',
              },
              {
                prop: 'Payment date',
                value: '2022-01-12T17:00:44.721Z',
              },
            ],
            claimRef: '',
            taskId: 0,
            folderName: 'Analysis',
            lossRef: 'DAA06974',
            claimId: 0,
            lossId: 9168,
            docClassification: '3',
            fileName: 'DMS-Test - Copy (2).txt',
            lossCreatedDate: '2022-01-12T17:00:43.323+00:00',
            fileLastModifiedDate: '2021-11-24T19:37:35.078+00:00',
            isLinkedFromLoss: 0,
            isSendToGxb: 0,
            isLinkedToMultipleContexts: 0,
            documentUploaded: true,
          },
        ],
        srcApplication: 'EDGE',
        createdBy: 863,
        createdDate: '2022-01-12T17:00:44.952+00:00',
        lossName: 'car crash',
        lossCreatedDate: '2022-01-12T17:00:43.323+00:00',
        claimRef: '',
        taskId: 0,
        lossRef: 'DAA06974',
      });
    });

    it('should handle DMS_POST_DOCUMENTS_ERROR', () => {
      const currentState = {
        ...initialState,
        upload: {
          metaData: {
            requestParams: { referenceId: 9168, sectionRef: 'DAA06974' },
            data: {},
            isLoading: false,
          },
          documentsUploaded: {},
        },
      };

      const state = reducer(currentState, {
        type: 'DMS_POST_DOCUMENTS_ERROR',
        payload: { error: 'some backend error' },
      });

      expect(state?.upload?.documentsUploaded).toEqual({});
    });

    it('should handle DMS_TASK_CONTEXT_TYPE_SET', () => {
      const currentState = {
        ...initialState,
      };

      const state = reducer(currentState, {
        type: 'DMS_TASK_CONTEXT_TYPE_SET',
        payload: { type: 'RfiResponse', refId: 'a12345-b1234-c123-d12-e123456' },
      });
      const expectedState = {
        ...initialState,
        contextSubType: {
          type: 'RfiResponse',
          caseIncidentID: '',
          caseIncidentNotesID: '',
          refId: 'a12345-b1234-c123-d12-e123456',
        },
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle DMS_TASK_CONTEXT_TYPE_SET overwrites', () => {
      const currentState = {
        ...initialState,
        contextSubType: {
          type: 'RfiResponse',
          caseIncidentID: '',
          caseIncidentNotesID: '',
          refId: 'a12345-b1234-c123-d12-e123456',
        },
      };

      const state = reducer(currentState, {
        type: 'DMS_TASK_CONTEXT_TYPE_SET',
        payload: { caseIncidentID: 1309, caseIncidentNotesID: 2291 },
      });
      const expectedState = {
        ...initialState,
        contextSubType: {
          type: 'RfiResponse',
          caseIncidentID: 1309,
          caseIncidentNotesID: 2291,
          refId: 'a12345-b1234-c123-d12-e123456',
        },
      };
      expect(state).toEqual(expectedState);

      const newOverridenState = reducer(currentState, {
        type: 'DMS_TASK_CONTEXT_TYPE_SET',
        payload: { caseIncidentID: 1309, caseIncidentNotesID: 2292 },
      });
      const expectedOverridenState = {
        ...initialState,
        contextSubType: {
          type: 'RfiResponse',
          caseIncidentID: 1309,
          caseIncidentNotesID: 2292,
          refId: 'a12345-b1234-c123-d12-e123456',
        },
      };
      expect(newOverridenState).toEqual(expectedOverridenState);
    });

    it('should handle DMS_TASK_CONTEXT_TYPE_RESET', () => {
      const currentState = {
        ...initialState,
        upload: {
          documentMetaData: {},
          document: {},
          documentUploaded: {
            data: {
              fileName: 'foobar.jpg',
            },
            error: false,
            status: 'SUCCESS',
          },
        },
        contextSubType: {
          type: 'RfiResponse',
          caseIncidentID: 1309,
          caseIncidentNotesID: 2291,
          refId: 'a12345-b1234-c123-d12-e123456',
        },
      };

      const state = reducer(currentState, { type: 'DMS_TASK_CONTEXT_TYPE_RESET' });
      const expectedState = {
        ...initialState,
        upload: {
          documentMetaData: {},
          document: {},
          documentUploaded: {
            data: {
              fileName: 'foobar.jpg',
            },
            error: false,
            status: 'SUCCESS',
          },
        },
        contextSubType: {
          type: '',
          caseIncidentID: '',
          caseIncidentNotesID: '',
          refId: '',
        },
      };

      expect(state).toEqual(expectedState);
    });
  });
});
