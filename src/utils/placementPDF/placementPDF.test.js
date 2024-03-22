import * as utils from 'utils';
import { addCommentPages, getRowCount, getNoteCount, marketChunk, getMarketRowCount } from './placementPDF';

const longMessage =
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam';

describe('getNoteCount', () => {
  it('returns count of accumulated subjectivities/comments', () => {
    expect(getNoteCount()).toEqual(0);
    expect(getNoteCount('foo')).toEqual(0);
    expect(getNoteCount([])).toEqual(0);
    expect(getNoteCount([{ subjectivities: 'foo', comments: [{ message: longMessage }] }])).toEqual(7);
    expect(getNoteCount([{ subjectivities: 'foo', comments: [{ message: longMessage }, { message: longMessage }] }])).toEqual(12);
    expect(getNoteCount([{ comments: [{ message: longMessage }] }])).toEqual(5);
    expect(getNoteCount([{ subjectivities: undefined, comments: [] }])).toEqual(0);
    expect(getNoteCount([{ subjectivities: 'foo', comments: [{ message: 'short' }] }])).toEqual(3);
  });
});

describe('getMarketRowCount', () => {
  it('returns count of total markets, and an additional count for those with seeNoteMessage', () => {
    expect(getMarketRowCount()).toEqual(0);
    expect(getMarketRowCount('foo')).toEqual(0);
    expect(getMarketRowCount([])).toEqual(0);
    expect(getMarketRowCount([{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }])).toEqual(5);
    expect(getMarketRowCount([{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2', seeNoteMessage: 'foo' }, { id: 'm3' }])).toEqual(7);
  });
});

describe('marketChunk', () => {
  it('returns grouped arrays of max count rowLimit', () => {
    expect(marketChunk()).toEqual([]);
    expect(marketChunk('foo')).toEqual([]);
    expect(marketChunk([])).toEqual([]);
    expect(marketChunk([{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }], 5)).toEqual([
      [{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }],
    ]);
    expect(marketChunk([{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }, { id: 'm4', seeNoteMessage: 'foo' }], 5)).toEqual([
      [{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }],
      [{ id: 'm4', seeNoteMessage: 'foo' }],
    ]);
  });
});

describe('getRowCount', () => {
  it('returns count of all policies', () => {
    expect(getRowCount()).toEqual(0);
    expect(getRowCount('foo')).toEqual(0);
    expect(getRowCount([])).toEqual(0);
    expect(getRowCount([{ id: 'p1', markets: [{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }] }])).toEqual(6);
    expect(
      getRowCount([
        { id: 'p1', markets: [{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }] },
        { id: 'p2', markets: [{ id: 'm2', seeNoteMessage: 'foo' }] },
      ])
    ).toEqual(10);
  });
});

describe('addCommentPages', () => {
  it('counts markets and subjectivities', () => {
    // arrange
    const businessType = {
      businessTypeName: 'Property',
      policies: [
        { id: 1, markets: [{ id: 11, seeNoteMessage: '1.11' }] },
        {
          id: 2,
          markets: [
            { id: 21, seeNoteMessage: '2.21' },
            { id: 22, subjectivities: 'subjectivities 2.22', seeNoteMessage: '2.22' },
          ],
        },
        { id: 3, markets: [{ id: 41, subjectivities: 'subjectivities 3.41', seeNoteMessage: '3.41' }] },
        { id: 4, markets: [{ id: 51 }] },
      ],
    };
    const comments = {
      'placement/123/policyMarket/11': [
        { id: 1, message: 'Short 11' },
        { id: 2, message: 'Short 12' },
      ],
      'placement/123/policyMarket/21': [
        { id: 2, message: `21 ${longMessage}` },
        { id: 22, message: `22 ${longMessage}` },
        { id: 23, message: `23 ${longMessage}` },
        { id: 24, message: `24 ${longMessage}` },
        { id: 25, message: `25 ${longMessage}` },
        { id: 26, message: `26 ${longMessage}` },
      ],
      'placement/123/policyMarket/41': [{ id: 4, message: 'Short 41' }],
    };
    const pdfPages = [];
    const placementId = 123;
    const rowLimit = 20;

    const result = [
      {
        title: 'Property (continued)',
        notes: [
          {
            title: '1.11',
            subjectivities: undefined,
            comments: [
              { id: 1, message: 'Short 11' },
              { id: 2, message: 'Short 12' },
            ],
          },
        ],
      },
      {
        title: 'Property (continued)',
        notes: [
          {
            title: '2.21',
            subjectivities: undefined,
            comments: [
              { id: 2, message: `21 ${longMessage}` },
              { id: 22, message: `22 ${longMessage}` },
              { id: 23, message: `23 ${longMessage}` },
              { id: 24, message: `24 ${longMessage}` },
              { id: 25, message: `25 ${longMessage}` },
              { id: 26, message: `26 ${longMessage}` },
            ],
          },
        ],
      },
      {
        title: 'Property (continued)',
        notes: [
          {
            title: '2.22',
            subjectivities: 'subjectivities 2.22',
            comments: undefined,
          },
          {
            title: '3.41',
            subjectivities: 'subjectivities 3.41',
            comments: [{ id: 4, message: 'Short 41' }],
          },
        ],
      },
    ];

    // act
    addCommentPages(businessType, comments, pdfPages, placementId, rowLimit);

    // assert
    expect(pdfPages).toEqual(result);
  });
});

describe('UTILS › placementPDF', () => {
  const getArray = (length) => [...new Array(length + 1).keys()].map((i) => ({ id: i }));
  const arr5 = getArray(5);
  const arr10 = getArray(10);
  const arr25 = getArray(25);

  describe('getAccumulatedRowCount', () => {
    it('returns row count', () => {
      // arrange
      const markets = [
        { id: 'm1', seeNoteMessage: 'foo' },
        { id: 'm2' },
        { id: 'm3' },
        { id: 'm4', seeNoteMessage: 'foo' },
        { id: 'm5', seeNoteMessage: 'foo' },
      ];

      // act
      const response = utils.placementPDF.getAccumulatedRowCount(markets, 5);

      // assert
      expect(utils.placementPDF.getAccumulatedRowCount()).toEqual([]);
      expect(utils.placementPDF.getAccumulatedRowCount('foo')).toEqual([]);
      expect(utils.placementPDF.getAccumulatedRowCount('foo', 'bar')).toEqual([]);
      expect(utils.placementPDF.getAccumulatedRowCount([], 'bar')).toEqual([]);
      expect(response).toEqual([{ id: 'm1', seeNoteMessage: 'foo' }, { id: 'm2' }, { id: 'm3' }]);
    });
  });

  describe('getPDFMarkets', () => {
    it('returns ordered markets with `seeNoteMessage`', () => {
      // arrange
      const policy = { id: 3, markets: [{ id: 41, subjectivities: 'subjectivities 3.41' }] };
      const comments = {
        'placement/123/policyMarket/11': [
          { id: 1, message: 'Short 11' },
          { id: 2, message: 'Short 12' },
        ],
        'placement/123/policyMarket/21': [
          { id: 2, message: `21 ${longMessage}` },
          { id: 22, message: `22 ${longMessage}` },
          { id: 23, message: `23 ${longMessage}` },
          { id: 24, message: `24 ${longMessage}` },
          { id: 25, message: `25 ${longMessage}` },
          { id: 26, message: `26 ${longMessage}` },
        ],
        'placement/123/policyMarket/41': [{ id: 4, message: 'Short 41' }],
      };
      const placementId = 123;
      const lIndex = 2;
      const pIndex = 3;

      // act
      const response = utils.placementPDF.getPDFMarkets(policy.markets, comments, placementId, lIndex, pIndex);

      // assert
      expect(utils.placementPDF.getPDFMarkets()).toEqual([]);
      expect(utils.placementPDF.getPDFMarkets('foo')).toEqual([]);
      expect(utils.placementPDF.getPDFMarkets('foo', 'bar')).toEqual([]);
      expect(utils.placementPDF.getPDFMarkets([], 'bar')).toEqual([]);
      expect(response).toEqual([{ id: 41, seeNoteMessage: '3.4.1', subjectivities: 'subjectivities 3.41' }]);
    });
  });

  describe('getPages', () => {
    it('returns one page', () => {
      // arrange
      const formValues = { showMudmap: false };
      const groups = [{ id: 'bt1', businessTypeName: 'bt1 name', policies: [{ id: 'p1_1', markets: [...arr5] }] }];
      const response = utils.placementPDF.getPages(groups, formValues, [], 123);

      // assert
      expect(response).toEqual([{ title: 'bt1 name', policies: groups[0].policies }]);
    });

    it('splits into three pages', () => {
      // arrange
      const formValues = { showMudmap: false };
      const groups = [
        { id: 'bt1', businessTypeName: 'bt1 name', policies: [{ id: 'p1_1', markets: [...arr5] }] },
        { id: 'bt2', businessTypeName: 'bt2 name', policies: [{ id: 'p2_1', markets: [...arr10] }] },
        { id: 'bt3', businessTypeName: 'bt3 name', policies: [{ id: 'p3_1', markets: [...arr10] }] },
      ];

      // act
      const response = utils.placementPDF.getPages(groups, formValues, [], 123);

      // assert
      expect(response).toEqual([
        { title: 'bt1 name', policies: groups[0].policies },
        { title: 'bt2 name', policies: groups[1].policies },
        { title: 'bt3 name', policies: groups[2].policies },
      ]);
    });

    it('splits into four pages (with mudmap)', () => {
      // arrange
      const formValues = { showMudmap: true };
      const groups = [
        { id: 'bt1', businessTypeName: 'bt1 name', mudmap: [{ id: 'mud1' }], policies: [{ id: 'p1_1', markets: [...arr5] }] },
        { id: 'bt2', businessTypeName: 'bt2 name', mudmap: [], policies: [{ id: 'p2_1', markets: [...arr10] }] },
        { id: 'bt3', businessTypeName: 'bt3 name', mudmap: [], policies: [{ id: 'p3_1', markets: [...arr10] }] },
      ];

      // act
      const response = utils.placementPDF.getPages(groups, formValues, [], 123);

      // assert
      expect(response).toEqual([
        { title: 'bt1 name', mudmap: [{ id: 'mud1' }] },
        { title: 'bt1 name (continued)', policies: groups[0].policies },
        { title: 'bt2 name', policies: groups[1].policies },
        { title: 'bt3 name', policies: groups[2].policies },
      ]);
    });

    it('splits into five pages (with mudmap)', () => {
      // arrange
      const formValues = { showMudmap: true };
      const businessTypes = [
        { id: 'bt1', businessTypeName: 'bt1 name', mudmap: [{ id: 'mud1' }], policies: [{ id: 'p1_1', markets: [...arr25] }] },
        { id: 'bt2', businessTypeName: 'bt2 name', mudmap: [], policies: [{ id: 'p2_1', markets: [...arr10] }] },
        { id: 'bt3', businessTypeName: 'bt3 name', mudmap: [], policies: [{ id: 'p3_1', markets: [...arr10] }] },
      ];

      // act
      const response = utils.placementPDF.getPages(businessTypes, formValues, [], 123);

      // assert
      expect(response).toEqual([
        { title: 'bt1 name', mudmap: [{ id: 'mud1' }] },
        { title: 'bt1 name (continued)', policies: businessTypes[0].policies },
        {
          title: 'bt1 name (continued)',
          policies: [
            { id: 'p1_1', showHeaderRow: false, markets: [{ id: 20 }, { id: 21 }, { id: 22 }, { id: 23 }, { id: 24 }, { id: 25 }] },
          ],
        },
        { title: 'bt2 name', policies: businessTypes[1].policies },
        { title: 'bt3 name', policies: businessTypes[2].policies },
      ]);
    });

    it('splits into five pages (without mudmap)', () => {
      // arrange
      const formValues = { showMudmap: false };
      const businessTypes = [
        { id: 'bt1', businessTypeName: 'bt1 name', mudmap: [{ id: 'mud1' }], policies: [{ id: 'p1_1', markets: [...arr25] }] },
        { id: 'bt2', businessTypeName: 'bt2 name', mudmap: [], policies: [{ id: 'p2_1', markets: [...arr10] }] },
        { id: 'bt3', businessTypeName: 'bt3 name', mudmap: [], policies: [{ id: 'p3_1', markets: [...arr10] }] },
      ];

      // act
      const response = utils.placementPDF.getPages(businessTypes, formValues, [], 123);

      // assert
      expect(response).toEqual([
        { title: 'bt1 name', policies: businessTypes[0].policies },
        {
          title: 'bt1 name (continued)',
          policies: [
            { id: 'p1_1', showHeaderRow: false, markets: [{ id: 20 }, { id: 21 }, { id: 22 }, { id: 23 }, { id: 24 }, { id: 25 }] },
          ],
        },
        { title: 'bt2 name', policies: businessTypes[1].policies },
        { title: 'bt3 name', policies: businessTypes[2].policies },
      ]);
    });
  });
});
