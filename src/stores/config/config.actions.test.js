import * as actions from './config.actions';
import { i18n } from 'utils';
import moment from 'moment';

jest.mock('moment');

describe('STORES › ACTIONS › config', () => {
  it('should create an action for vars', () => {
    // arrange
    const payload = { env: 'local' };
    const expectedAction = {
      type: 'CONFIG_VARS_SET',
      payload,
    };

    // assert
    expect(actions.setConfigVars(payload)).toEqual(expectedAction);
  });

  it('should create an action for locale', () => {
    // arrange
    const payload = 'de';
    const expectedAction = {
      type: 'CONFIG_LOCALE_SET',
      payload,
    };

    // assert
    expect(actions.setConfigLocale(payload)).toEqual(expectedAction);
    expect(moment.locale.mock.calls).toHaveLength(1);
    expect(moment.locale).toBeCalledWith('de');
    expect(i18n.changeLanguage.mock.calls).toHaveLength(1);
    expect(i18n.changeLanguage).toBeCalledWith('de');
  });
});
