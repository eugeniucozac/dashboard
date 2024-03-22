import i18n, { initialiseI18n, format } from './i18n';
import moment from 'moment';
import config from 'config';

jest.mock('moment');

describe('UTILS › i18n', () => {
  it('should export i18n and initialiseI18n', () => {
    expect(i18n).toBeDefined();
    expect(initialiseI18n).toBeDefined();
    expect(format).toBeDefined();
  });

  it('should set the moment locale', () => {
    initialiseI18n();
    expect(moment.locale.mock.calls).toHaveLength(1);
    expect(moment.locale).toBeCalledWith(config.locale);
  });

  describe('should format the value based on the type and options', () => {
    it('lowercase', () => {
      expect(format({ label: '' }, 'lowercase')).toEqual('');
      expect(format({ label: ' ' }, 'lowercase')).toEqual(' ');
      expect(format({ label: 'hello' }, 'lowercase')).toEqual('hello');
      expect(format({ label: 'Hello' }, 'lowercase')).toEqual('hello');
      expect(format({ label: 'HELLO' }, 'lowercase')).toEqual('hello');

      // plural
      expect(format({ label: 'app.account' }, 'lowercase')).toEqual('account');
      expect(format({ label: 'app.account', count: 0 }, 'lowercase')).toEqual('accounts');
      expect(format({ label: 'app.account', count: 1 }, 'lowercase')).toEqual('account');
      expect(format({ label: 'app.account', count: 2 }, 'lowercase')).toEqual('accounts');
    });

    it('uppercase', () => {
      expect(format({ label: '' }, 'uppercase')).toEqual('');
      expect(format({ label: ' ' }, 'uppercase')).toEqual(' ');
      expect(format({ label: 'hello' }, 'uppercase')).toEqual('HELLO');
      expect(format({ label: 'Hello' }, 'uppercase')).toEqual('HELLO');
      expect(format({ label: 'HELLO' }, 'uppercase')).toEqual('HELLO');

      // plural
      expect(format({ label: 'app.account' }, 'uppercase')).toEqual('ACCOUNT');
      expect(format({ label: 'app.account', count: 0 }, 'uppercase')).toEqual('ACCOUNTS');
      expect(format({ label: 'app.account', count: 1 }, 'uppercase')).toEqual('ACCOUNT');
      expect(format({ label: 'app.account', count: 2 }, 'uppercase')).toEqual('ACCOUNTS');
    });

    // not testing mocked moment
    // it('date', () => {});
    // it('dateFromNow', () => {});

    it('number', () => {
      expect(format({ number: '' }, 'number')).toEqual('');
      expect(format({ number: '', default: 'n/a' }, 'number')).toEqual('n/a');
      expect(format({ number: 'hello' }, 'number')).toEqual('');
      expect(format({ number: 'hello', default: 'n/a' }, 'number')).toEqual('n/a');
      expect(format({ number: '100000' }, 'number')).toEqual('100,000');
      expect(format({ number: 100000 }, 'number')).toEqual('100,000');
      expect(format({ number: 100000.123456789 }, 'number')).toEqual('100,000.12');
      expect(format({ number: 100000.0 }, 'number')).toEqual('100,000');
    });

    it('percent', () => {
      expect(format({ number: '' }, 'percent')).toEqual('');
      expect(format({ number: '', default: 'n/a' }, 'percent')).toEqual('n/a');
      expect(format({ number: 'hello' }, 'percent')).toEqual('');
      expect(format({ number: 'hello', default: 'n/a' }, 'percent')).toEqual('n/a');
      expect(format({ number: '10' }, 'percent')).toEqual('10%');
      expect(format({ number: 10 }, 'percent')).toEqual('10%');
      expect(format({ number: 10.12345678 }, 'percent')).toEqual('10.1235%');
      expect(format({ number: 10.0 }, 'percent')).toEqual('10%');
    });

    it('currency', () => {
      expect(format({ number: '' }, 'currency')).toEqual('');
      expect(format({ number: '', default: 'n/a' }, 'currency')).toEqual('n/a');
      expect(format({ number: 'hello' }, 'currency')).toEqual('');
      expect(format({ number: 'hello', default: 'n/a' }, 'currency')).toEqual('n/a');
      expect(format({ number: '100000' }, 'currency')).toEqual(' 100,000');
      expect(format({ number: 100000 }, 'currency')).toEqual(' 100,000');
      expect(format({ number: 100000.123456789 }, 'currency')).toEqual(' 100,000.12');
      expect(format({ number: 100000.0 }, 'currency')).toEqual(' 100,000');
    });

    it('missing format type', () => {
      expect(format('')).toEqual('');
      expect(format(' ')).toEqual(' ');
      expect(format('hello')).toEqual('hello');
      expect(format('100000')).toEqual('100000');
      expect(format(100000)).toEqual(100000);
      expect(format(100000.123456789)).toEqual(100000.123456789);
      expect(format(100000.0)).toEqual(100000.0);
    });
  });
});
