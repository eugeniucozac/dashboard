import React from 'react';
import PremiumProcessing from './PremiumProcessing';
import { render, waitFor, within } from 'tests';
import { useParams } from 'react-router';
import fetchMock from 'fetch-mock';
import merge from 'lodash/merge';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('PAGES › PremiumProcessing', () => {
  it('should reset the form on clicking cancel', () => {});
});
