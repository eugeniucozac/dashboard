import React from 'react';
import { render, screen } from 'tests';
import TaskCheckList from './TaskCheckList';

describe('MODULES › TaskCheckList', () => {
    const props = {
        task: {},
        currencyPurchasedValue: '',
        isCurrencyChanged: false,
        isDirtyRef: false,
        setIsDirty: ()=>{},
        handleDirtyCheck: ()=>{},
        sanctionCheckStatus: '',
        formHandlers: {
            getValues: ()=>{},
            setValue: ()=>{}
        },
    };

    describe('@render', () => {
    
      it('renders without crashing', () => {
        // arrange
        render(<TaskCheckList {...props} />);
  
        // assert
        expect(screen.getByTestId('task-checklist')).toBeInTheDocument();
      });

      it('renders Complete Button', () => {
        // arrange
        render(<TaskCheckList {...props} />);
  
        // assert
        expect(screen.getByTestId('complete-button')).toBeInTheDocument();
      });

      it('renders Modal Popup Warning Info', () => {
        // arrange
        render(<TaskCheckList {...props} />);
  
        // assert
        expect(screen.getByTestId('warning-info')).toBeInTheDocument();
      });
    
    });
});