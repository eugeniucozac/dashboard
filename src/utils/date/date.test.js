import * as utils from 'utils';
import MockDate from 'mockdate';

describe('UTILS › date', () => {
  beforeEach(() => {
    MockDate.set('2019-01-10 20:00:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should export the required methods', () => {
    expect(utils.date).toHaveProperty('formatISO');
    expect(utils.date).toHaveProperty('fromNow');
    expect(utils.date).toHaveProperty('today');
  });

  describe('formatISO', () => {
    it('should return date in ISO format', () => {
      // invalid dates
      expect(utils.date.formatISO()).toBeUndefined();
      expect(utils.date.formatISO('')).toEqual('');
      expect(utils.date.formatISO('foo')).toEqual('foo');
      expect(utils.date.formatISO('foo bar')).toEqual('foo bar');

      // incomplete dates
      expect(utils.date.formatISO('dd')).toEqual('dd');
      expect(utils.date.formatISO('dd/mm')).toEqual('dd/mm');

      // valid dates
      expect(utils.date.formatISO('dd/mm/yy')).toEqual('yy-mm-dd');
      expect(utils.date.formatISO('dd/mm/yyyy')).toEqual('yyyy-mm-dd');
      expect(utils.date.formatISO('dd/mm/yyyy hh')).toEqual('yyyy-mm-dd hh');
      expect(utils.date.formatISO('dd/mm/yyyy hh:mm')).toEqual('yyyy-mm-dd hh:mm');
      expect(utils.date.formatISO('dd/mm/yyyy hh:mm:ss')).toEqual('yyyy-mm-dd hh:mm:ss');
      expect(utils.date.formatISO('dd/mm/yyyyThh')).toEqual('yyyy-mm-dd hh');
      expect(utils.date.formatISO('dd/mm/yyyyThh:mm')).toEqual('yyyy-mm-dd hh:mm');
      expect(utils.date.formatISO('dd/mm/yyyyThh:mm:ss')).toEqual('yyyy-mm-dd hh:mm:ss');
    });
  });

  describe('fromNow', () => {
    it('should return a string representing the amount of time from now', () => {
      const translations = {
        yesterday: 'Hier',
        tomorrow: 'Demain',
      };

      // past
      expect(utils.date.fromNow('2009-01-10', {})).toEqual('10 years ago');
      expect(utils.date.fromNow('2018-01-10', {})).toEqual('a year ago');
      expect(utils.date.fromNow('2018-06-10', {})).toEqual('7 months ago');
      expect(utils.date.fromNow('2018-12-10', {})).toEqual('a month ago');
      expect(utils.date.fromNow('2019-01-05', {})).toEqual('6 days ago');
      expect(utils.date.fromNow('2019-01-09', {})).toEqual('Yesterday');
      expect(utils.date.fromNow('2019-01-09', translations)).toEqual('Hier');
      expect(utils.date.fromNow('2019-01-10 04:00:00', {})).toEqual('16 hours ago');
      expect(utils.date.fromNow('2019-01-10 19:00:00', {})).toEqual('an hour ago');
      expect(utils.date.fromNow('2019-01-10 19:40:00', {})).toEqual('20 minutes ago');
      expect(utils.date.fromNow('2019-01-10 19:59:00', {})).toEqual('a minute ago');
      expect(utils.date.fromNow('2019-01-10 19:59:30', {})).toEqual('a few seconds ago');

      // future
      expect(utils.date.fromNow('2019-01-10 20:00:30', {})).toEqual('in a few seconds');
      expect(utils.date.fromNow('2019-01-10 20:01:00', {})).toEqual('in a minute');
      expect(utils.date.fromNow('2019-01-10 20:20:00', {})).toEqual('in 20 minutes');
      expect(utils.date.fromNow('2019-01-10 21:00:00', {})).toEqual('in an hour');
      expect(utils.date.fromNow('2019-01-10 23:00:00', {})).toEqual('in 3 hours');
      expect(utils.date.fromNow('2019-01-11', translations)).toEqual('Demain');
      expect(utils.date.fromNow('2019-01-11', {})).toEqual('Tomorrow');
      expect(utils.date.fromNow('2019-01-17', {})).toEqual('in 6 days');
      expect(utils.date.fromNow('2019-02-10', {})).toEqual('in a month');
      expect(utils.date.fromNow('2019-08-10', {})).toEqual('in 7 months');
      expect(utils.date.fromNow('2020-01-10', {})).toEqual('in a year');
      expect(utils.date.fromNow('2029-01-10', {})).toEqual('in 10 years');
    });
  });

  describe('today', () => {
    it("should return today's date formatted", () => {
      expect(utils.date.today()).toEqual('2019-01-10');
      expect(utils.date.today('MMMM Do YYYY')).toEqual('January 10th 2019');
    });
  });

  describe('isBefore', () => {
    it('should return true for past date', () => {
      expect(utils.date.isBefore('2018-01-08')).toEqual(true);
    });
    it('should return false for feature date', () => {
      expect(utils.date.isBefore('2025-01-08')).toEqual(false);
    });
  });
});
