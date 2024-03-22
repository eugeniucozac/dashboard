import React from 'react';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';
import Accordion from './Accordion';
import { Delete, Edit, Refresh } from '@material-ui/icons';

describe('COMPONENTS › Accordion', () => {
  describe('@render', () => {
    it('renders the expansion panel title', () => {
      // arrange
      const { getByText } = render(<Accordion title="foo" />);

      // assert
      expect(getByText('foo')).toBeInTheDocument();
    });

    it('renders the panel content', () => {
      // arrange
      const { getByText } = render(<Accordion title="foo">bar</Accordion>);

      // assert
      expect(getByText('bar')).toBeInTheDocument();
    });

    it('renders the icon components by default', () => {
      // arrange
      const { container } = render(<Accordion title="foo">bar</Accordion>);

      // assert
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders the title without icon if set to false', () => {
      // arrange
      const { container } = render(
        <Accordion title="foo" icon={false}>
          bar
        </Accordion>
      );

      // assert
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders single text action link', () => {
      // arrange
      const onClick = () => {};
      const actions = [{ id: 1, text: 'Edit', onClick }];
      const { getByText, queryByText } = render(<Accordion title="foo" actions={actions} />);

      // assert
      expect(getByText('Edit')).toBeInTheDocument();
      expect(queryByText('Delete')).not.toBeInTheDocument();
    });

    it('renders multiple text action links', () => {
      // arrange
      const onClick = () => {};
      const actions = [
        { id: 1, text: 'Edit', onClick },
        { id: 2, text: 'Delete', onClick },
      ];
      const { getByText, queryByText } = render(<Accordion title="foo" actions={actions} />);

      // assert
      expect(getByText('Edit')).toBeInTheDocument();
      expect(getByText('Delete')).toBeInTheDocument();
    });

    it('renders single icon action link', () => {
      // arrange
      const onClick = () => {};
      const actions = [{ id: 1, icon: Edit, onClick }];
      const { getByTestId } = render(<Accordion title="foo" actions={actions} />);
      const actionsElem = getByTestId('accordion-actions');

      // assert
      expect(actionsElem.querySelectorAll('svg')).toHaveLength(1);
    });

    it('renders multiple icon action links', () => {
      // arrange
      const onClick = () => {};
      const actions = [
        { id: 1, icon: Edit, onClick },
        { id: 2, icon: Delete, onClick },
      ];
      const { getByTestId } = render(<Accordion title="foo" actions={actions} />);
      const actionsElem = getByTestId('accordion-actions');

      // assert
      expect(actionsElem.querySelectorAll('svg')).toHaveLength(2);
    });

    it('renders a mix of text and icon action links', () => {
      // arrange
      const onClick = () => {};
      const actions = [
        { id: 1, text: 'Up', onClick },
        { id: 2, text: 'Down', onClick },
        { id: 3, icon: Edit, onClick },
        { id: 4, icon: Refresh, onClick },
        { id: 5, text: 'Delete', onClick },
      ];
      const { getByText, getByTestId } = render(<Accordion title="foo" actions={actions} />);
      const actionsElem = getByTestId('accordion-actions');

      // assert
      expect(getByText('Up')).toBeInTheDocument();
      expect(getByText('Down')).toBeInTheDocument();
      expect(getByText('Delete')).toBeInTheDocument();
      expect(actionsElem.querySelectorAll('svg')).toHaveLength(2);
    });
  });

  describe('@actions', () => {
    it('triggers the onClick handlers', () => {
      // arrange
      const onClickEdit = jest.fn();
      const onClickRefresh = jest.fn();
      const actions = [
        { id: 1, text: 'Edit', onClick: onClickEdit },
        { id: 2, icon: Refresh, onClick: onClickRefresh },
      ];
      render(<Accordion title="foo" actions={actions} />);
      const actionsElem = screen.getByTestId('accordion-actions');

      // act
      userEvent.click(screen.getByText('Edit'));

      // assert
      expect(onClickEdit).toHaveBeenCalledTimes(1);
      expect(onClickRefresh).not.toHaveBeenCalled();

      // act
      userEvent.click(actionsElem.querySelector('svg'));

      // assert
      expect(onClickEdit).toHaveBeenCalledTimes(1);
      expect(onClickRefresh).toHaveBeenCalledTimes(1);
    });
  });
});
