import React from 'react';
import { render } from 'tests';
import Mudmap from './Mudmap';
import * as mudmapUtils from './Mudmap.utils';

describe('COMPONENTS › Mudmap', () => {
  const quotes = [
    { id: 1, order: 1, market: 'AXA', amount: 100, xs: 0, written: 0.1, signed: 0.2, premium: 1000 },
    { id: 2, order: 2, market: 'Brit', amount: 20, xs: 0, written: 0.2, signed: 0.3, premium: 1000, leads: [] },
    {
      id: 3,
      order: 3,
      market: 'Fisk',
      amount: 20,
      xs: 20,
      written: 0.3,
      signed: 0.4,
      premium: 1000,
      capacityId: 1,
      leads: [{ id: '3a', name: '3a Fisk Market' }],
    },
    {
      id: 4,
      order: 4,
      market: 'AIG',
      amount: 40,
      xs: 0,
      written: 0.4,
      signed: 0.5,
      premium: 1000,
      capacityId: 1,
      leads: [{ id: '4a', name: '4a AIG Market', notes: 'foo' }],
    },
    {
      id: 5,
      order: 5,
      market: 'Swiss',
      amount: 60,
      xs: 40,
      written: 0.5,
      signed: 0.6,
      premium: 1000,
      capacityId: 2,
      leads: [
        { id: '5a', name: '5a Swiss Market A', notes: 'foo' },
        { id: '5b', name: '5b Swiss Market B', notes: 'bar' },
      ],
    },
    { id: 6, order: 6, market: 'Hiscox', amount: 30, xs: 40, written: 0.6, signed: 0.7, premium: 1000, capacityId: 4 },
    { id: 7, order: 7, market: 'Munich', amount: 30, xs: 70, written: 0.7, signed: 0.8, premium: 1000, capacityId: 4 },
    { id: 8, order: 8, market: 'Talbot', amount: 30, xs: 70, written: 0.8, signed: 0.9, premium: 1000, capacityId: 3 },
  ];

  const limits = [
    { id: 1, name: 'foo', value: 400 },
    { id: 2, name: 'bar', value: 250 },
    { id: 3, name: 'baz', value: null },
    { id: 4, name: 'qwe', value: 0 },
    { id: 5, name: 'rty', value: 100 },
  ];

  const capacityTypes = [
    { id: 1, name: 'aaa', color: '#ffe5a8' },
    { id: 2, name: 'bbb', color: '#ffbfa5' },
    { id: 3, name: 'ccc', color: '#ffacff' },
    { id: 4, name: 'ddd', color: '#64e5ff' },
    { id: 5, name: 'eee', color: '#ffcb5e' },
  ];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<Mudmap />);

      // assert
      expect(container).toBeInTheDocument();
    });

    describe('written', () => {
      it('renders layers in correct position', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} />);

        // assert
        // we're not testing the left property because jsdom doesn't support values like "calc(100% - 20px)"
        // https://github.com/jsdom/jsdom/issues/1332
        expect(getByTestId('layer-1')).toHaveStyle({ top: '0%', width: '4.7619%', height: '100%' });
        expect(getByTestId('layer-2')).toHaveStyle({ top: '80%', width: '9.5238%', height: '20%' });
        expect(getByTestId('layer-3')).toHaveStyle({ top: '60%', width: '14.2857%', height: '20%' });
        expect(getByTestId('layer-4')).toHaveStyle({ top: '60%', width: '19.0476%', height: '40%' });
        expect(getByTestId('layer-5')).toHaveStyle({ top: '0%', width: '23.8095%', height: '60%' });
        expect(getByTestId('layer-6')).toHaveStyle({ top: '30%', width: '28.5714%', height: '30%' });
        expect(getByTestId('layer-7')).toHaveStyle({ top: '0%', width: '33.3333%', height: '30%' });
        expect(getByTestId('layer-8')).toHaveStyle({ top: '0%', width: '38.0952%', height: '30%' });
      });

      it('renders layers grey if not passed capacity types', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} />);

        // assert
        expect(getByTestId('layer-1')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-2')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-3')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-4')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-5')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-6')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-7')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-8')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
      });

      it('renders layers with the associated capacity types colour', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} capacities={capacityTypes} />);

        // assert
        expect(getByTestId('layer-1')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-2')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-3')).toHaveStyle({ backgroundColor: 'rgb(255, 229, 168)', border: '4px solid #e5cc90' });
        expect(getByTestId('layer-4')).toHaveStyle({ backgroundColor: 'rgb(255, 229, 168)', border: '4px solid #e5cc90' });
        expect(getByTestId('layer-5')).toHaveStyle({ backgroundColor: 'rgb(255, 191, 165)', border: '4px solid #e4a68d' });
        expect(getByTestId('layer-6')).toHaveStyle({ backgroundColor: 'rgb(100, 229, 255)', border: '4px solid #44cce5' });
        expect(getByTestId('layer-7')).toHaveStyle({ backgroundColor: 'rgb(100, 229, 255)', border: '4px solid #44cce5' });
        expect(getByTestId('layer-8')).toHaveStyle({ backgroundColor: 'rgb(255, 172, 255)', border: '4px solid #e593e5' });
      });

      it('renders the native browser tooltips (title attributes)', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} capacities={capacityTypes} />);

        // assert
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('AXA'));
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(10)'));
        expect(getByTestId('layer-1')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(100)'));
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency()'));

        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('Brit'));
        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(20)'));
        expect(getByTestId('layer-2')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(20)'));
        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency()'));

        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('Fisk'));
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('3a Fisk Market'));
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(30)'));
        expect(getByTestId('layer-3')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(20)'));
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(20)'));

        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('AIG'));
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('4a AIG Market: foo'));
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(40)'));
        expect(getByTestId('layer-4')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(40)'));
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency()'));

        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('Swiss'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('5a Swiss Market A: foo'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('5b Swiss Market B: bar'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(50)'));
        expect(getByTestId('layer-5')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(60)'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(40)'));

        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('Hiscox'));
        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(60)'));
        expect(getByTestId('layer-6')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(30)'));
        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(40)'));

        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('Munich'));
        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(70)'));
        expect(getByTestId('layer-7')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(30)'));
        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(70)'));

        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('Talbot'));
        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('placement.generic.written: format.percent(80)'));
        expect(getByTestId('layer-8')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(30)'));
        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(70)'));
      });

      it('renders Y axis', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} />);

        // assert
        expect(getByTestId('axis-y-0')).toBeInTheDocument();
        expect(getByTestId('axis-y-20')).toBeInTheDocument();
        expect(getByTestId('axis-y-40')).toBeInTheDocument();
        expect(getByTestId('axis-y-70')).toBeInTheDocument();
        expect(getByTestId('axis-y-100')).toBeInTheDocument();
      });

      it('renders X axis', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} />);

        // assert
        expect(getByTestId('axis-x-0')).toBeInTheDocument();
        expect(getByTestId('axis-x-100')).toBeInTheDocument();
        expect(getByTestId('axis-x-210')).toBeInTheDocument();
      });

      it('renders limits', () => {
        // arrange
        const { getByTestId, container } = render(<Mudmap items={quotes} limits={limits} />);

        // assert
        expect(getByTestId('limit-foo-400')).toBeInTheDocument();
        expect(getByTestId('limit-bar-250')).toBeInTheDocument();
        expect(container.querySelector('[data-testid*="limit-baz"]')).not.toBeInTheDocument();
        expect(getByTestId('limit-qwe-0')).toBeInTheDocument();
        expect(getByTestId('limit-rty-100')).toBeInTheDocument();
      });

      it('renders tranches', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} />);

        // assert
        expect(getByTestId('tranche-0-20')).toBeInTheDocument();
        expect(getByTestId('tranche-20-40')).toBeInTheDocument();
        expect(getByTestId('tranche-40-70')).toBeInTheDocument();
        expect(getByTestId('tranche-70-100')).toBeInTheDocument();
      });
    });

    describe('signed', () => {
      it('renders layers in correct position', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} type="signed" />);

        // assert
        // we're not testing the left property because jsdom doesn't support values like "calc(100% - 20px)"
        // https://github.com/jsdom/jsdom/issues/1332
        expect(getByTestId('layer-1')).toHaveStyle({ top: '0%', width: '8%', height: '100%' });
        expect(getByTestId('layer-2')).toHaveStyle({ top: '80%', width: '12%', height: '20%' });
        expect(getByTestId('layer-3')).toHaveStyle({ top: '60%', width: '16%', height: '20%' });
        expect(getByTestId('layer-4')).toHaveStyle({ top: '60%', width: '20%', height: '40%' });
        expect(getByTestId('layer-5')).toHaveStyle({ top: '0%', width: '24%', height: '60%' });
        expect(getByTestId('layer-6')).toHaveStyle({ top: '30%', width: '28%', height: '30%' });
        expect(getByTestId('layer-7')).toHaveStyle({ top: '0%', width: '32%', height: '30%' });
        expect(getByTestId('layer-8')).toHaveStyle({ top: '0%', width: '36%', height: '30%' });
      });

      it('renders layers grey if not passed capacity types', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} type="signed" />);

        // assert
        expect(getByTestId('layer-1')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-2')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-3')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-4')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-5')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-6')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-7')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-8')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
      });

      it('renders layers with the associated capacity types colour', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} type="signed" capacities={capacityTypes} />);

        // assert
        expect(getByTestId('layer-1')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-2')).toHaveStyle({ backgroundColor: 'rgb(227,227,227)', border: '4px solid #cacaca' });
        expect(getByTestId('layer-3')).toHaveStyle({ backgroundColor: 'rgb(255, 229, 168)', border: '4px solid #e5cc90' });
        expect(getByTestId('layer-4')).toHaveStyle({ backgroundColor: 'rgb(255, 229, 168)', border: '4px solid #e5cc90' });
        expect(getByTestId('layer-5')).toHaveStyle({ backgroundColor: 'rgb(255, 191, 165)', border: '4px solid #e4a68d' });
        expect(getByTestId('layer-6')).toHaveStyle({ backgroundColor: 'rgb(100, 229, 255)', border: '4px solid #44cce5' });
        expect(getByTestId('layer-7')).toHaveStyle({ backgroundColor: 'rgb(100, 229, 255)', border: '4px solid #44cce5' });
        expect(getByTestId('layer-8')).toHaveStyle({ backgroundColor: 'rgb(255, 172, 255)', border: '4px solid #e593e5' });
      });

      it('renders the native browser tooltips (title attributes)', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} type="signed" capacities={capacityTypes} />);

        // assert
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('AXA'));
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(20)'));
        expect(getByTestId('layer-1')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(100)'));
        expect(getByTestId('layer-1')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency()'));

        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('Brit'));
        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(30)'));
        expect(getByTestId('layer-2')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(20)'));
        expect(getByTestId('layer-2')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency()'));

        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('Fisk'));
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('3a Fisk Market'));
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(40)'));
        expect(getByTestId('layer-3')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(20)'));
        expect(getByTestId('layer-3')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(20)'));

        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('AIG'));
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('4a AIG Market: foo'));
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(50)'));
        expect(getByTestId('layer-4')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(40)'));
        expect(getByTestId('layer-4')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency()'));

        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('Swiss'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('5a Swiss Market A: foo'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('5b Swiss Market B: bar'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(60)'));
        expect(getByTestId('layer-5')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(60)'));
        expect(getByTestId('layer-5')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(40)'));

        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('Hiscox'));
        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(70)'));
        expect(getByTestId('layer-6')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(30)'));
        expect(getByTestId('layer-6')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(40)'));

        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('Munich'));
        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(80)'));
        expect(getByTestId('layer-7')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(30)'));
        expect(getByTestId('layer-7')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(70)'));

        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('Talbot'));
        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('placement.generic.signed: format.percent(90)'));
        expect(getByTestId('layer-8')).toHaveAttribute(
          'title',
          expect.stringContaining('placement.generic.premium: format.currency(1000)')
        );
        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('placement.generic.amount: format.currency(30)'));
        expect(getByTestId('layer-8')).toHaveAttribute('title', expect.stringContaining('placement.generic.excess: format.currency(70)'));
      });

      it('renders Y axis', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} type="signed" />);

        // assert
        expect(getByTestId('axis-y-0')).toBeInTheDocument();
        expect(getByTestId('axis-y-20')).toBeInTheDocument();
        expect(getByTestId('axis-y-40')).toBeInTheDocument();
        expect(getByTestId('axis-y-70')).toBeInTheDocument();
        expect(getByTestId('axis-y-100')).toBeInTheDocument();
      });

      it('renders X axis', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} type="signed" />);

        // assert
        expect(getByTestId('axis-x-0')).toBeInTheDocument();
        expect(getByTestId('axis-x-100')).toBeInTheDocument();
        expect(getByTestId('axis-x-250')).toBeInTheDocument();
      });

      it('renders limits', () => {
        // arrange
        const { getByTestId, container } = render(<Mudmap items={quotes} type="signed" limits={limits} />);

        // assert
        expect(getByTestId('limit-foo-400')).toBeInTheDocument();
        expect(getByTestId('limit-bar-250')).toBeInTheDocument();
        expect(container.querySelector('[data-testid*="limit-baz"]')).not.toBeInTheDocument();
        expect(getByTestId('limit-qwe-0')).toBeInTheDocument();
        expect(getByTestId('limit-rty-100')).toBeInTheDocument();
      });

      it('renders tranches', () => {
        // arrange
        const { getByTestId } = render(<Mudmap items={quotes} type="signed" />);

        // assert
        expect(getByTestId('tranche-0-20')).toBeInTheDocument();
        expect(getByTestId('tranche-20-40')).toBeInTheDocument();
        expect(getByTestId('tranche-40-70')).toBeInTheDocument();
        expect(getByTestId('tranche-70-100')).toBeInTheDocument();
      });
    });
  });

  describe('@utils', () => {
    it('setLefts', () => {
      // assert
      expect(mudmapUtils.setLefts()).toEqual([]);
      expect(mudmapUtils.setLefts([])).toEqual([]);
      expect(mudmapUtils.setLefts([{}])).toEqual([{ left: 0 }]);
      expect(mudmapUtils.setLefts([{ id: 1 }])).toEqual([{ id: 1, left: 0 }]);

      // written
      expect(mudmapUtils.setLefts(quotes, 'written')).toEqual([
        { id: 1, order: 1, left: 0, market: 'AXA', amount: 100, xs: 0, written: 0.1, signed: 0.2, premium: 1000 },
        { id: 2, order: 2, left: 0.1, market: 'Brit', leads: [], amount: 20, xs: 0, written: 0.2, signed: 0.3, premium: 1000 },
        {
          id: 3,
          order: 3,
          left: 0.1,
          market: 'Fisk',
          leads: [{ id: '3a', name: '3a Fisk Market' }],
          amount: 20,
          xs: 20,
          written: 0.3,
          signed: 0.4,
          premium: 1000,
          capacityId: 1,
        },
        {
          id: 4,
          order: 4,
          left: 0.4,
          market: 'AIG',
          leads: [{ id: '4a', name: '4a AIG Market', notes: 'foo' }],
          amount: 40,
          xs: 0,
          written: 0.4,
          signed: 0.5,
          premium: 1000,
          capacityId: 1,
        },
        {
          id: 5,
          order: 5,
          left: 0.1,
          market: 'Swiss',
          leads: [
            { id: '5a', name: '5a Swiss Market A', notes: 'foo' },
            { id: '5b', name: '5b Swiss Market B', notes: 'bar' },
          ],
          amount: 60,
          xs: 40,
          written: 0.5,
          signed: 0.6,
          premium: 1000,
          capacityId: 2,
        },
        { id: 6, order: 6, left: 0.6, market: 'Hiscox', amount: 30, xs: 40, written: 0.6, signed: 0.7, premium: 1000, capacityId: 4 },
        { id: 7, order: 7, left: 0.6, market: 'Munich', amount: 30, xs: 70, written: 0.7, signed: 0.8, premium: 1000, capacityId: 4 },
        { id: 8, order: 8, left: 1.3, market: 'Talbot', amount: 30, xs: 70, written: 0.8, signed: 0.9, premium: 1000, capacityId: 3 },
      ]);

      // signed
      expect(mudmapUtils.setLefts(quotes, 'signed')).toEqual([
        { id: 1, order: 1, left: 0, market: 'AXA', amount: 100, xs: 0, written: 0.1, signed: 0.2, premium: 1000 },
        { id: 2, order: 2, left: 0.2, market: 'Brit', leads: [], amount: 20, xs: 0, written: 0.2, signed: 0.3, premium: 1000 },
        {
          id: 3,
          order: 3,
          left: 0.2,
          market: 'Fisk',
          leads: [{ id: '3a', name: '3a Fisk Market' }],
          amount: 20,
          xs: 20,
          written: 0.3,
          signed: 0.4,
          premium: 1000,
          capacityId: 1,
        },
        {
          id: 4,
          order: 4,
          left: 0.6,
          market: 'AIG',
          leads: [{ id: '4a', name: '4a AIG Market', notes: 'foo' }],
          amount: 40,
          xs: 0,
          written: 0.4,
          signed: 0.5,
          premium: 1000,
          capacityId: 1,
        },
        {
          id: 5,
          order: 5,
          left: 0.2,
          market: 'Swiss',
          leads: [
            { id: '5a', name: '5a Swiss Market A', notes: 'foo' },
            { id: '5b', name: '5b Swiss Market B', notes: 'bar' },
          ],
          amount: 60,
          xs: 40,
          written: 0.5,
          signed: 0.6,
          premium: 1000,
          capacityId: 2,
        },
        { id: 6, order: 6, left: 0.8, market: 'Hiscox', amount: 30, xs: 40, written: 0.6, signed: 0.7, premium: 1000, capacityId: 4 },
        { id: 7, order: 7, left: 0.8, market: 'Munich', amount: 30, xs: 70, written: 0.7, signed: 0.8, premium: 1000, capacityId: 4 },
        { id: 8, order: 8, left: 1.6, market: 'Talbot', amount: 30, xs: 70, written: 0.8, signed: 0.9, premium: 1000, capacityId: 3 },
      ]);
    });

    it('mapById', () => {
      // assert
      expect(mudmapUtils.mapById()).toEqual({});
      expect(mudmapUtils.mapById([])).toEqual({});
      expect(mudmapUtils.mapById([{}])).toEqual({ undefined: {} });
      expect(mudmapUtils.mapById([{ foo: 1 }])).toEqual({ undefined: { foo: 1 } });
      expect(mudmapUtils.mapById([{ id: 1 }])).toEqual({ 1: { id: 1 } });
      expect(mudmapUtils.mapById([{ id: 1 }, { id: 2 }])).toEqual({ 1: { id: 1 }, 2: { id: 2 } });
    });

    it('sortByLeft', () => {
      // assert
      expect(mudmapUtils.sortByLeft()).toEqual([]);
      expect(mudmapUtils.sortByLeft()).toEqual([]);
      expect(mudmapUtils.sortByLeft([])).toEqual([]);

      // written
      expect(
        mudmapUtils.sortByLeft(
          [
            { id: 1, left: 5, written: 10, signed: 20 }, // 5 + (10/2) = 10
            { id: 2, left: 0, written: 10, signed: 20 }, // 0 + (10/2) = 5
            { id: 3, left: 8, written: 10, signed: 20 }, // 8 + (10/2) = 13
          ],
          'written'
        )
      ).toEqual([
        { id: 2, left: 0, written: 10, signed: 20, order: 1 }, // 5
        { id: 1, left: 5, written: 10, signed: 20, order: 2 }, // 10
        { id: 3, left: 8, written: 10, signed: 20, order: 3 }, // 13
      ]);

      expect(
        mudmapUtils.sortByLeft(
          [
            { id: 1, left: 5, written: 4, signed: 8 }, // 5 + (4/2) = 7
            { id: 2, left: 0, written: 10, signed: 15 }, // 0 + (10/2) = 5
            { id: 3, left: 2, written: 8, signed: 8 }, // 2 + (8/2) = 6
            { id: 4, left: 2, written: 10, signed: 10 }, // 2 + (10/2) = 7
            { id: 5, left: 8, written: 20, signed: 30 }, // 8 + (20/2) = 18
          ],
          'written'
        )
      ).toEqual([
        { id: 2, left: 0, written: 10, signed: 15, order: 1 }, // 5
        { id: 3, left: 2, written: 8, signed: 8, order: 2 }, // 6
        { id: 1, left: 5, written: 4, signed: 8, order: 3 }, // 7
        { id: 4, left: 2, written: 10, signed: 10, order: 4 }, // 7
        { id: 5, left: 8, written: 20, signed: 30, order: 5 }, // 18
      ]);

      // signed
      expect(
        mudmapUtils.sortByLeft(
          [
            { id: 1, left: 5, written: 10, signed: 20 }, // 5 + (20/2) = 15
            { id: 2, left: 0, written: 10, signed: 20 }, // 0 + (20/2) = 10
            { id: 3, left: 8, written: 10, signed: 20 }, // 8 + (20/2) = 18
          ],
          'signed'
        )
      ).toEqual([
        { id: 2, left: 0, written: 10, signed: 20, order: 1 }, // 15
        { id: 1, left: 5, written: 10, signed: 20, order: 2 }, // 10
        { id: 3, left: 8, written: 10, signed: 20, order: 3 }, // 18
      ]);

      expect(
        mudmapUtils.sortByLeft(
          [
            { id: 1, left: 5, written: 4, signed: 8 }, // 5 + (8/2) = 9
            { id: 2, left: 0, written: 10, signed: 15 }, // 0 + (15/2) = 7.5
            { id: 3, left: 2, written: 8, signed: 8 }, // 2 + (8/2) = 6
            { id: 4, left: 2, written: 10, signed: 10 }, // 2 + (10/2) = 7
            { id: 5, left: 8, written: 20, signed: 30 }, // 8 + (30/2) = 23
          ],
          'signed'
        )
      ).toEqual([
        { id: 3, left: 2, written: 8, signed: 8, order: 1 }, // 6
        { id: 4, left: 2, written: 10, signed: 10, order: 2 }, // 7
        { id: 2, left: 0, written: 10, signed: 15, order: 3 }, // 7.5
        { id: 1, left: 5, written: 4, signed: 8, order: 4 }, // 9
        { id: 5, left: 8, written: 20, signed: 30, order: 5 }, // 23
      ]);
    });

    it('calcMaxAmount', () => {
      // assert
      expect(mudmapUtils.calcMaxAmount()).toEqual(0);
      expect(mudmapUtils.calcMaxAmount()).toEqual(0);
      expect(mudmapUtils.calcMaxAmount([])).toEqual(0);
      expect(mudmapUtils.calcMaxAmount([{}])).toEqual(0);
      expect(mudmapUtils.calcMaxAmount([{ foo: 1 }])).toEqual(0);
      expect(mudmapUtils.calcMaxAmount(quotes)).toEqual(100);
    });

    it('calcMaxPercentage', () => {
      // assert
      expect(mudmapUtils.calcMaxPercentage()).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{}])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{ foo: 2 }])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{ left: 0 }])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{ written: 0 }])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{ left: 0, written: 0 }])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{ left: 0, written: 2 }])).toEqual(2);
      expect(mudmapUtils.calcMaxPercentage([{ left: 0.8, written: 1 }])).toEqual(1.8);
      expect(mudmapUtils.calcMaxPercentage([{ left: 0.4, written: 0.2 }])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{ left: 1, written: 0 }])).toEqual(1);
      expect(mudmapUtils.calcMaxPercentage([{ left: 1, written: 0.1 }])).toEqual(1.1);
      expect(
        mudmapUtils.calcMaxPercentage([
          { left: 0, written: 0 },
          { left: 0.2, written: 0.5 },
          { left: 0.7, written: 0.6 }, // max value here is 1.3 but JS returns 1.2999999999999998 ¯\_(ツ)_/¯
          { left: 0.9, written: 0.1 },
          { left: 0.2, written: 0.4 },
        ])
      ).toEqual(1.3);
    });

    it('getXaxis', () => {
      // assert
      expect(mudmapUtils.getXaxis()).toEqual([]);
      expect(mudmapUtils.getXaxis([])).toEqual([]);
      expect(mudmapUtils.getXaxis([null])).toEqual([]);
      expect(mudmapUtils.getXaxis(null)).toEqual([]);
      expect(mudmapUtils.getXaxis(0)).toEqual([0]);
      expect(mudmapUtils.getXaxis(0, 2, null)).toEqual([0, 2]);
      expect(mudmapUtils.getXaxis(null, 0, 10, 5, -30, undefined, true, false, 20)).toEqual([0, 10, 5, -30, 20]);
    });

    it('getYaxis', () => {
      // assert
      expect(mudmapUtils.getYaxis()).toEqual([0]);
      expect(mudmapUtils.getYaxis([])).toEqual([0]);
      expect(mudmapUtils.getYaxis([{}])).toEqual([0]);
      expect(mudmapUtils.getYaxis([{ foo: 1 }])).toEqual([0]);
      expect(mudmapUtils.getYaxis(quotes)).toEqual([0, 20, 40, 70, 100]);
    });

    it('getLimits', () => {
      // assert
      expect(mudmapUtils.getLimits()).toEqual([]);
      expect(mudmapUtils.getLimits([])).toEqual([]);
      expect(mudmapUtils.getLimits([{}])).toEqual([]);
      expect(mudmapUtils.getLimits([{ foo: 1 }])).toEqual([]);
      expect(mudmapUtils.getLimits(limits)).toEqual([0, 100, 250, 400]);
    });

    it('getTranches', () => {
      // assert
      expect(mudmapUtils.getTranches()).toEqual([]);
      expect(mudmapUtils.getTranches([])).toEqual([]);
      expect(mudmapUtils.getTranches([{}])).toEqual([]);
      expect(mudmapUtils.getTranches([{ foo: 1 }])).toEqual([]);
      expect(mudmapUtils.getTranches(quotes)).toEqual([
        { l: 0, u: 20, percentage: 0.7 },
        { l: 20, u: 40, percentage: 0.8 },
        { l: 40, u: 70, percentage: 1.2 },
        { l: 70, u: 100, percentage: 2.1 },
      ]);

      // written
      expect(mudmapUtils.getTranches(quotes, 'written')).toEqual([
        { l: 0, u: 20, percentage: 0.7 },
        { l: 20, u: 40, percentage: 0.8 },
        { l: 40, u: 70, percentage: 1.2 },
        { l: 70, u: 100, percentage: 2.1 },
      ]);

      // signed
      expect(mudmapUtils.getTranches(quotes, 'signed')).toEqual([
        { l: 0, u: 20, percentage: 1 },
        { l: 20, u: 40, percentage: 1.1 },
        { l: 40, u: 70, percentage: 1.5 },
        { l: 70, u: 100, percentage: 2.5 },
      ]);
    });

    it('percentageInTranche', () => {
      // assert
      expect(mudmapUtils.percentageInTranche()).toEqual(0);
      expect(mudmapUtils.percentageInTranche([])).toEqual(0);
      expect(mudmapUtils.percentageInTranche([], null)).toEqual(0);
      expect(mudmapUtils.percentageInTranche([], null, null)).toEqual(0);
      expect(mudmapUtils.percentageInTranche([], null, null)).toEqual(0);
      expect(mudmapUtils.percentageInTranche(quotes, null, null)).toEqual(0);
      expect(mudmapUtils.percentageInTranche(quotes, 0, null)).toEqual(0);

      // written
      expect(mudmapUtils.percentageInTranche(quotes, 0, 0, 'written')).toEqual(0);
      expect(mudmapUtils.percentageInTranche(quotes, 0, 10, 'written')).toEqual(0.7);
      expect(mudmapUtils.percentageInTranche(quotes, 10, 20, 'written')).toEqual(0.7);
      expect(mudmapUtils.percentageInTranche(quotes, 20, 30, 'written')).toEqual(0.8);
      expect(mudmapUtils.percentageInTranche(quotes, 30, 40, 'written')).toEqual(0.8);
      expect(mudmapUtils.percentageInTranche(quotes, 40, 50, 'written')).toEqual(1.2);
      expect(mudmapUtils.percentageInTranche(quotes, 50, 60, 'written')).toEqual(1.2);
      expect(mudmapUtils.percentageInTranche(quotes, 60, 70, 'written')).toEqual(1.2);
      expect(mudmapUtils.percentageInTranche(quotes, 70, 80, 'written')).toEqual(2.1);
      expect(mudmapUtils.percentageInTranche(quotes, 80, 90, 'written')).toEqual(2.1);
      expect(mudmapUtils.percentageInTranche(quotes, 90, 100, 'written')).toEqual(2.1);

      // signed
      expect(mudmapUtils.percentageInTranche(quotes, 0, 0, 'signed')).toEqual(0);
      expect(mudmapUtils.percentageInTranche(quotes, 0, 10, 'signed')).toEqual(1);
      expect(mudmapUtils.percentageInTranche(quotes, 10, 20, 'signed')).toEqual(1);
      expect(mudmapUtils.percentageInTranche(quotes, 20, 30, 'signed')).toEqual(1.1);
      expect(mudmapUtils.percentageInTranche(quotes, 30, 40, 'signed')).toEqual(1.1);
      expect(mudmapUtils.percentageInTranche(quotes, 40, 50, 'signed')).toEqual(1.5);
      expect(mudmapUtils.percentageInTranche(quotes, 50, 60, 'signed')).toEqual(1.5);
      expect(mudmapUtils.percentageInTranche(quotes, 60, 70, 'signed')).toEqual(1.5);
      expect(mudmapUtils.percentageInTranche(quotes, 70, 80, 'signed')).toEqual(2.5);
      expect(mudmapUtils.percentageInTranche(quotes, 80, 90, 'signed')).toEqual(2.5);
      expect(mudmapUtils.percentageInTranche(quotes, 90, 100, 'signed')).toEqual(2.5);
    });
  });
});
