import * as utils from 'utils';
import * as constants from 'consts';

// mui
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

describe('UTILS > dms', () => {
  it('should format document meta data', () => {
    const recievedData = {
      policyId: 0,
      claimRef: 'DDAAA11AAJP',
      lossRef: 'DD11AAJP',
      insuredId: 0,
      departmentId: 0,
      xbInstanceId: '1',
      year: 2019,
      createdBy: 'nemesis',
      catCodesID: 'A0223',
      uniqueMarketRef: '48ssg4',
      insuredName: 'department1',
      claimantName: 'John Doe',
      ucr: 1234,
      policyRef: 'A8j490be',
      inceptionDate: '24/08/2021',
      lossDescription: 'lorem ipsum',
    };

    const context = 'Loss';

    const refDataXbInstances = [
      { sourceID: '1', sourceName: 'London', edgeSourceName: 'XB_London' },
      { sourceID: '2', sourceName: 'Bermuda', edgeSourceName: 'XB_Bermuda' },
    ];

    const expectedFormat = {
      claimInfo: [
        { id: 10, name: 'dms.upload.claimInfoSection.claimRef', value: 'DDAAA11AAJP' },
        { id: 11, name: 'dms.upload.claimInfoSection.policyId', value: 0 },
        { id: 12, name: 'dms.upload.claimInfoSection.umr', value: '48ssg4' },
        { id: 13, name: 'dms.upload.claimInfoSection.insuredName', value: 'department1' },
        { id: 14, name: 'dms.upload.claimInfoSection.claimant', value: 'John Doe' },
        { id: 15, name: 'dms.upload.claimInfoSection.ucr', value: 1234 },
      ],
      commonInfo: [
        { id: 1, name: 'dms.upload.commonInfoSection.gxbInstance', value: 'XB_London' },
        { id: 2, name: 'dms.upload.commonInfoSection.sectionType', value: 'Loss' },
        { id: 3, name: 'dms.upload.commonInfoSection.yearOfInception', value: 2019 },
        { id: 4, name: 'dms.upload.commonInfoSection.department', value: undefined },
        { id: 5, name: 'dms.upload.commonInfoSection.uploadOn', value: `format.date()` },
      ],
      lossInfo: [
        { id: 6, name: 'dms.upload.lossInfoSection.lossRef', value: 'DD11AAJP' },
        { id: 7, name: 'dms.upload.lossInfoSection.dateOfLoss', value: 'format.date()' },
        { id: 8, name: 'dms.upload.lossInfoSection.lossDescription', value: 'lorem ipsum' },
        {
          id: 9,
          name: 'dms.upload.lossInfoSection.catCode',
          value: 'A0223',
        },
      ],
      policyInfo: [
        { id: 16, name: 'dms.upload.policyInfoSection.policyRef', value: 'A8j490be' },
        { id: 17, name: 'dms.upload.policyInfoSection.umr', value: '48ssg4' },
        { id: 18, name: 'dms.upload.policyInfoSection.insuredName', value: 'department1' },
        { id: 19, name: 'dms.upload.policyInfoSection.inceptionDate', value: '24/08/2021' },
      ],
    };

    expect(utils.dmsFormatter.formatDocumentMetaData(recievedData, context, refDataXbInstances)).toEqual(expectedFormat);
  });

  it('should test if an Action was not dispatched', () => {
    let isPending = false;
    let isFulfilled = false;
    let isRejected = false;

    expect(utils.dmsFormatter.getActionDispatched(isPending, isFulfilled, isRejected)).toEqual(true);

    isFulfilled = true;

    expect(utils.dmsFormatter.getActionDispatched(isPending, isFulfilled, isRejected)).toEqual(false);
  });

  it('should test that payment document type was selected', () => {
    const documentTypes = {
      documentTypeID: 244,
      documentTypeDescription: 'Payment',
      sourceID: 3,
      sectionKey: 'Claim',
      documentTypeSource: 'GXB',
    };

    expect(utils.dmsFormatter.getPaymentDocumentType(documentTypes)).toEqual(true);
  });

  it('should check for duplicate file names', () => {
    const filesArray = [
      {
        id: '04f94c95-7b1b-4d70-92f1-20a269add8b3',
        file: {
          path: 'ClaimsViewDoc4(1).png',
        },
        name: 'ClaimsViewDoc4(1).png',
        type: null,
      },
      {
        id: '04f94c95-7b1b-4d70-92f1-oigfgnlka',
        file: {
          path: 'eternals.txt',
        },
        name: 'eternals.txt',
        type: null,
      },
      {
        id: '04f94c95-7b1b-4d70-92f1-toiyjtf343',
        file: {
          path: 'bond007.jpg',
        },
        name: 'bond007.jpg',
        type: null,
      },
    ];

    const recievedDocuments = [
      {
        documentId: 123,
        caseIncidentId: null,
        objectId: 1097,
        objectType: 'Claim',
        spDocumentId: 'FWQPNP258317-559oji0jio',
        documentTypeId: 39,
        documentTypeDescription: 'PolicyEndorsmentDocuments',
        documentName: 'ClaimsViewDoc4(1).png',
      },
      {
        documentId: 456,
        caseIncidentId: 'gnaka',
        objectId: 1278,
        objectType: 'Claim',
        spDocumentId: 'FWQPNPJSHSDL-98fgfg88af',
        documentTypeId: 40,
        documentTypeDescription: 'ClaimEndorsmentDocuments',
        documentName: 'bond007.jpg',
      },
    ];

    expect(utils.dmsFormatter.getDuplicateIndexes(filesArray, recievedDocuments)).toStrictEqual([0, 2]);
  });

  it('shouid test getSelectedDocumentType()', () => {
    const mockUploadedFiles = [
      {
        file: {},
        name: 'foobar.txt',
        type: null,
      },
      {
        file: {},
        name: 'bar.jpg',
        type: null,
      },
    ];

    const mockValue = undefined;

    expect(utils.dmsFormatter.getSelectedDocumentType(mockValue, mockUploadedFiles)).toEqual([0, 1]);
  });

  it('should return current field values', () => {
    const index = 1;
    const documentTypeDescription = {
      documentTypeDescription: 'Bordereaux',
      documentTypeID: 795,
      documentTypeSource: 'Edge',
      folderName: 'Claims',
      sectionKey: 'Claim',
      sourceID: 7,
    };
    const mockGetValues = jest.fn();
    mockGetValues
      .mockReturnValueOnce(documentTypeDescription)
      .mockReturnValueOnce(documentTypeDescription)
      .mockReturnValueOnce('foobar.png')
      .mockReturnValue({ id: 1, value: 'low' });

    const expectedShape = {
      files1: {
        documentTypeDescription: 'Bordereaux',
        documentTypeID: 795,
      },
      files1name: 'foobar.png',
      filesClassification1: { id: 1, value: 'low' },
    };

    expect(utils.dmsFormatter.setCurrentFieldValues(index, mockGetValues)).toStrictEqual(expectedShape);
    expect(mockGetValues.mock.calls.length).toBe(4);
  });

  describe('getMetaDataParams()', () => {
    describe('Loss context', () => {
      it("check 'loss' context", () => {
        let dmsContext = 'Loss';

        let currentState = {
          claims: {
            lossInformation: { lossDetailID: 812, lossRef: 'SA312' },
          },
        };
        expect(utils.dmsFormatter.getMetaDataParams(currentState, dmsContext)).toEqual({
          sectionType: 'Loss',
          sourceId: 1,
          divisionId: null,
          referenceId: 812,
          sectionRef: 'SA312',
        });
      });
    });

    describe('Claim context', () => {
      let dmsContext = 'Claim';

      it("check 'Claim' context FNOL Create Flow", () => {
        let currentState = {
          claims: {
            claimData: { claimId: 8127, claimRef: 'SA31200' },
            claimDetailInformationSuccess: { sourceID: 7 },
            policyInformation: { divisionID: 21 },
          },
        };
        expect(utils.dmsFormatter.getMetaDataParams(currentState, dmsContext)).toEqual({
          sectionType: 'Claim',
          sourceId: 7,
          divisionId: 21,
          referenceId: 8127,
          sectionRef: 'SA31200',
        });
      });

      it("check 'Claim' context FNOL Edit Flow", () => {
        let currentState = {
          claims: {
            claimData: { claimId: 8127, claimRef: 'SA31200' },
            claimsInformation: { sourceID: 7 },
            policyInformation: { divisionID: 21 },
          },
        };
        expect(utils.dmsFormatter.getMetaDataParams(currentState, dmsContext)).toEqual({
          sectionType: 'Claim',
          sourceId: 7,
          divisionId: 21,
          referenceId: 8127,
          sectionRef: 'SA31200',
        });
      });

      //   it("check 'Claim' context Processing Flow", () => {
      //     let currentState = {
      //       claims: {
      //         processing: {
      //           selected: [{ sourceId: 5, divisionID: 23, claimID: 8127, claimRef: 'SA31200' }],
      //         },
      //       },
      //     };
      //     expect(utils.dmsFormatter.getMetaDataParams(currentState, dmsContext)).toEqual({
      //       sectionType: 'Claim',
      //       sourceId: 5,
      //       divisionId: 23,
      //       referenceId: 8127,
      //       sectionRef: 'SA31200',
      //     });
      //   });
      // });

      it("check 'Claim' context Processing Flow", () => {
        let currentState = {
          claims: {
            claimsTab: {
              tableDetails: {
                selected: [{ sourceId: 5, divisionId: 23, claimId: 8127, claimReference: 'SA31200' }],
              },
            },
          },
        };
        expect(utils.dmsFormatter.getMetaDataParams(currentState, dmsContext)).toEqual({
          sectionType: 'Claim',
          sourceId: 5,
          divisionId: 23,
          referenceId: 8127,
          sectionRef: 'SA31200',
        });
      });
    });

    describe('Task context', () => {
      let dmsContext = 'Task';

      it("check 'Task' context on Claims Processing", () => {
        let currentState = {
          claims: {
            processing: {
              selected: [{ sourceId: 5, divisionID: 23, claimID: 8127, claimRef: 'SA31200' }],
            },
          },
        };
        expect(utils.dmsFormatter.getMetaDataParams(currentState, dmsContext)).toEqual({
          sectionType: 'Claim',
          sourceId: 5,
          divisionId: 23,
          referenceId: 8127,
          sectionRef: 'SA31200',
        });
      });

      it("check 'Task' context on Task Dashboard", () => {
        let currentState = {
          claims: {
            policyInformation: { divisionID: 23 },
            claimsInformation: { sourceID: 5, claimID: 8127, claimReference: 'SA31200' },
          },
        };
        expect(utils.dmsFormatter.getMetaDataParams(currentState, dmsContext)).toEqual({
          sectionType: 'Claim',
          sourceId: 5,
          divisionId: 23,
          referenceId: 8127,
          sectionRef: 'SA31200',
        });
      });
    });
  });

  describe('getUploadMetaDataParams()', () => {
    describe('Loss context', () => {
      it("check 'loss' context", () => {
        let dmsContext = 'Loss';
        let currentState = { claims: {} };
        expect(utils.dmsFormatter.getUploadMetaDataParams(currentState, dmsContext, 'SAE06174')).toEqual({
          lossRef: 'SAE06174',
          claimRef: '',
          uniqueMarketRef: null,
          ucr: null,
          expiryDate: null,
        });
      });
    });

    describe('Claim context', () => {
      let dmsContext = 'Claim';

      it("check 'Claim' context FNOL Create/Edit Flow", () => {
        let currentState = { claims: { lossInformation: { lossRef: 'SAE06174' } } };
        expect(utils.dmsFormatter.getUploadMetaDataParams(currentState, dmsContext, 'SAE06174A01')).toEqual({
          lossRef: 'SAE06174',
          claimRef: 'SAE06174A01',
          uniqueMarketRef: null,
          ucr: null,
          expiryDate: null,
        });
      });
    });

    describe('Task context', () => {
      let dmsContext = 'Task';

      it("check 'Claim' context Claim/Task (types) Processing Flow", () => {
        let currentState = { claims: { processing: { selected: [{ lossRef: 'SAE06174', claimRef: 'SA31200A01' }] } } };
        expect(utils.dmsFormatter.getUploadMetaDataParams(currentState, dmsContext, 'abcedfg-111a-11ab-efgh-abcedfg')).toEqual({
          lossRef: 'SAE06174',
          claimRef: 'SA31200A01',
          uniqueMarketRef: null,
          ucr: null,
          expiryDate: null,
        });
      });
    });
  });

  describe('getIcon - should test that the correct icon is displayed based on the upload status', () => {
    let isFulfilled;
    let isRejected;
    let hasPartialSuccess;
    it('should display MUI CheckCircleIcon', () => {
      isFulfilled = true;
      isRejected = false;
      hasPartialSuccess = true;

      expect(utils.dmsFormatter.getIcons(isFulfilled, isRejected, hasPartialSuccess)).toBe(CheckCircleIcon);
    });

    it('should display MUI ErrorOutlineIcon', () => {
      isFulfilled = false;
      isRejected = true;
      hasPartialSuccess = false;

      expect(utils.dmsFormatter.getIcons(isFulfilled, isRejected, hasPartialSuccess)).toBe(ErrorOutlineIcon);
    });

    it('should display MUI HighlightOffIcon', () => {
      isFulfilled = false;
      isRejected = false;

      expect(utils.dmsFormatter.getIcons(isFulfilled, isRejected)).toBe(HighlightOffIcon);
    });
  });

  describe('getDocumentTypeInfo', () => {
    const documentTypeKeyEndorsement = constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement;
    const sourceId = 1;

    it('get document type info for piEndorsement', () => {
      expect(utils.dmsFormatter.getDocumentTypeInfo(documentTypeKeyEndorsement, sourceId)).toEqual({
        documentTypeDescription: 'Endorsement',
        sectionKey: 'Policy',
        dmsSourceID: sourceId,
      });
    });
  });

  describe('getDmsFrom', () => {
    it('check dms from pi', () => {
      let documentTypeKeyEndorsement = constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement;
      expect(utils.dmsFormatter.isDmsFromPi(documentTypeKeyEndorsement)).toEqual(true);
    });
    it('check dms not from pi', () => {
      let documentTypeKeyPolicy = constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy;
      expect(utils.dmsFormatter.isDmsFromPi(documentTypeKeyPolicy)).toEqual(false);
    });
  });

  describe('getDmsFrom', () => {
    it('check dms from piRiskRef', () => {
      let documentTypeKeyEndorsement = constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement;
      expect(utils.dmsFormatter.isDmsFromPiRiskRef(documentTypeKeyEndorsement)).toEqual(true);
    });
    it('check dms not from piRiskRef', () => {
      let documentTypeKeyPiPremiumCalculation = constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation;
      expect(utils.dmsFormatter.isDmsFromPiRiskRef(documentTypeKeyPiPremiumCalculation)).toEqual(false);
    });
  });

  describe('getDmsFrom', () => {
    it('check dms from piInstruction', () => {
      let documentTypeKeyPiPremiumCalculation = constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation;
      expect(utils.dmsFormatter.isDmsFromPiInstruction(documentTypeKeyPiPremiumCalculation)).toEqual(true);
    });
    it('check dms not from piInstruction', () => {
      let documentTypeKeyEndorsement = constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement;
      expect(utils.dmsFormatter.isDmsFromPiInstruction(documentTypeKeyEndorsement)).toEqual(false);
    });
  });
});
