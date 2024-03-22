import schemas, { validateSchema } from './schemas';
import { openingMemoSchema } from 'schemas';

describe('UTILS › schemas', () => {
  describe('validateSchema', () => {
    it('should return false if schema not valid', () => {
      // arrange
      const schema = {
        invalidSchema: { foo: 'bar' },
      };
      // assert
      expect(validateSchema({ schema })).toBe(false);
    });
  });

  describe('parseArticles', () => {
    it('should return only valid articles', () => {
      // arrange
      const schema = {
        validSchema: [
          {
            id: 123,
            heading: 'Mock heading',
            excerpt: 'Mock excerpt',
            external_url: 'mock-external-url',
            topics: [
              { id: 9, slug: 'aviation', name: 'Aerospace', category: 1 },
              { id: 90, slug: 'ratings', name: 'Rates', category: 2 },
            ],
            date: '2020-04-17T08:05:10+0000',
            featured_image_url: 'mock-image-url',
            organisation_logo_url: 'mock-logo-url',
            random: 'mock random',
          },
        ],
        invalidSchema: [
          {
            excerpt: 'Mock excerpt',
            external_url: 'mock-external-url',
            topics: [
              { id: 9, slug: 'aviation', name: 'Aerospace', category: 1 },
              { id: 90, slug: 'ratings', name: 'Rates', category: 2 },
            ],
            date: '2020-04-17T08:05:10+0000',
            featured_image_url: 'mock-image-url',
            organisation_logo_url: 'mock-logo-url',
          },
        ],
      };
      const { random, ...expected } = schema.validSchema[0];

      // assert
      expect(schemas.parseArticles(schema.validSchema)).toEqual([expected]);
      expect(schemas.parseArticles(schema.invalidSchema)).toEqual([]);
    });
  });

  describe('parseOpeningMemo', () => {
    it('should return a hydrated model', () => {
      // arrange
      const response = schemas.parseOpeningMemo(openingMemoSchema, {
        lineItems: [
          {
            itemKey: 'quotesPutUp',
            isAuthorised: true,
            accountHandler: 'yes',
            itemDate: '2020-02-18',
          },
        ],
      });

      // assert
      expect(response.defaultTab).toBe('prePlacing');
      expect(response.tabs).toHaveLength(4);
      expect(response.tabs[0]).toEqual({
        label: 'placement.openingMemo.prePlacing.label',
        value: 'prePlacing',
      });
      expect(response.columnHeaders).toHaveLength(3);
      expect(response.columnHeaders[0]).toEqual({
        id: 'detail',
        align: 'center',
        label: 'placement.openingMemo.columnNames.detail',
      });
      expect(response.rows[0]).toEqual({
        rowKey: 'quotesPutUp',
        rowStyles: {},
        tabKey: 'prePlacing',
        cells: [
          {
            label: 'placement.openingMemo.prePlacing.rows.quotesPutUp.label',
            columnName: 'itemDate',
            name: 'lineItems.quotesPutUp.itemDate',
            outputFormat: 'iso',
            type: 'datepicker',
            cellProps: {},
            value: '2020-02-18',
          },
          {
            columnName: 'accountHandler',
            name: 'lineItems.quotesPutUp.accountHandler',
            type: 'toggle',
            optionsKey: 'yesNoNa',
            defaultValue: '',
            value: 'yes',
            cellProps: {},
          },
          {
            columnName: 'isAuthorised',
            name: 'lineItems.quotesPutUp.isAuthorised',
            type: 'checkbox',
            defaultValue: false,
            value: true,
            cellProps: {
              center: true,
            },
          },
        ],
      });
    });
  });

  describe('removeIcons', () => {
    it('should return the fields without the icon property', () => {
      // arrange
      const fields = [
        {
          id: '1',
          name: '1',
          transform: 'date',
          type: 'datepicker',
          label: 'one',
          icon: 'DummyIcon',
        },
        {
          id: '2',
          name: '2',
          transform: 'date',
          type: 'datepicker',
          label: 'two',
        },
        {
          id: '3',
          name: '3',
          transform: 'date',
          type: 'datepicker',
          label: 'three',
          icon: 'DummyIcon',
        },
      ];

      // assert
      expect(schemas.removeIcons(fields)).toEqual([
        { id: '1', name: '1', transform: 'date', type: 'datepicker', label: 'one' },
        { id: '2', name: '2', transform: 'date', type: 'datepicker', label: 'two' },
        { id: '3', name: '3', transform: 'date', type: 'datepicker', label: 'three' },
      ]);
    });
  });
});
