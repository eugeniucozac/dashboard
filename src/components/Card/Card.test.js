import React from 'react';
import { render, within } from 'tests';
import Card from './Card';

describe('COMPONENTS › Card', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<Card />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders nothing if missing props and children', () => {
      // arrange
      const { container } = render(<Card />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    describe('using props', () => {
      it('renders the title', () => {
        // arrange
        const { container } = render(<Card title="Title" />);
        const title = container.querySelector('.MuiCardHeader-title');

        // assert
        expect(title).toBeInTheDocument();
        expect(within(title).getByText('Title')).toBeInTheDocument();
      });

      it('renders the subheader', () => {
        // arrange
        const { container } = render(<Card subheader="Subheader" />);
        const subheader = container.querySelector('.MuiCardHeader-subheader');

        // assert
        expect(subheader).toBeInTheDocument();
        expect(within(subheader).getByText('Subheader')).toBeInTheDocument();
      });

      it('renders the text', () => {
        // arrange
        const { container } = render(<Card text="Text" />);
        const content = container.querySelector('.MuiCardContent-root');

        // assert
        expect(content).toBeInTheDocument();
        expect(within(content).getByText('Text')).toBeInTheDocument();
      });

      it('renders all props and additional content inside MuiCardContent', () => {
        // arrange
        const { container, getByText } = render(
          <Card title="Title" subheader="Subheader" text="Text">
            Foo
          </Card>
        );
        const content = container.querySelector('.MuiCardContent-root');

        // assert
        expect(getByText('Text')).toBeInTheDocument();
        expect(getByText('Subheader')).toBeInTheDocument();
        expect(within(content).getByText('Text')).toBeInTheDocument();
        expect(within(content).getByText('Foo')).toBeInTheDocument();
      });
    });

    describe('using children content', () => {
      it('renders content', () => {
        // arrange
        const { getByText } = render(<Card>Foo</Card>);

        // assert
        expect(getByText('Foo')).toBeInTheDocument();
      });
    });
  });
});
