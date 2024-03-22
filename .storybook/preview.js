import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addDecorator } from '@storybook/react';
import { StylesProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Theme } from 'components';
import '../src/index.css';
import { initialiseI18n } from 'utils';

initialiseI18n();

addDecorator(storyFn => {
  return (
    <StylesProvider injectFirst>
      <Theme>
        <BrowserRouter>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div style={{display:'flex', justifyContent:'center', margin:'30px', lineHeight:1}}>
              {storyFn()}
            </div>
          </MuiPickersUtilsProvider>
        </BrowserRouter>
      </Theme>
    </StylesProvider>
  );
});
