import React from 'react';
import { render } from 'tests';
import { Autocomplete } from './Autocomplete';
import AutocompleteControl from './Autocomplete.control';
import AutocompleteMenu from './Autocomplete.menu';
import AutocompleteNoOptions from './Autocomplete.noOptions';
import AutocompleteOption from './Autocomplete.option';
import AutocompletePlaceholder from './Autocomplete.placeholder';
import AutocompleteSingleValue from './Autocomplete.singleValue';
import AutocompleteValueContainer from './Autocomplete.valueContainer';
import { mockClasses } from 'setupMocks';

describe('COMPONENTS › Autocomplete', () => {
  const label = 'autocomplete';
  const suggestions = [
    { label: 'foo', value: 'foo' },
    { label: 'bar', value: 'bar' },
  ];

  const defaultSelectProps = {
    selectProps: {
      classes: {},
      textFieldProps: {},
    },
  };

  it('renders without crashing', () => {
    // arrange
    render(<Autocomplete label={label} suggestions={suggestions} classes={mockClasses} />);
  });

  it('renders single select by default', () => {
    // arrange
    const { getAllByText } = render(<Autocomplete label={label} suggestions={suggestions} classes={mockClasses} />);

    expect(getAllByText('autocomplete')).toHaveLength(2);
  });

  // these sub-components where taken from Material-UI auto-complete example
  // so not spending too much time testing these renders
  it('renders control component without crashing', () => {
    // arrange
    render(<AutocompleteControl {...defaultSelectProps} />);
  });

  describe('AutocompleteMenu', () => {
    it('hides the menu if async and no inputValue', () => {
      // arrange
      const props = {
        selectProps: {
          classes: {},
          async: {},
          inputValue: '',
          textFieldProps: {},
        },
        children: <div>mock content</div>,
      };
      const { queryByText } = render(<AutocompleteMenu {...props} />);

      // assert
      expect(queryByText('mock content')).not.toBeInTheDocument();
    });
    it('shows the menu if async and inputValue entered', () => {
      // arrange
      const props = {
        selectProps: {
          classes: {},
          async: {},
          inputValue: 'foo',
          textFieldProps: {},
        },
        children: <div>mock content</div>,
      };
      const { getByText } = render(<AutocompleteMenu {...props} />);

      // assert
      expect(getByText('mock content')).toBeInTheDocument();
    });
    it('shows the menu if not async', () => {
      // arrange
      const props = {
        selectProps: {
          classes: {},
          inputValue: '',
          textFieldProps: {},
        },
        children: <div>mock content</div>,
      };
      const { getByText } = render(<AutocompleteMenu {...props} />);

      // assert
      expect(getByText('mock content')).toBeInTheDocument();
    });
  });

  describe('AutocompleteNoOptions', () => {
    it('renders custom message', () => {
      // arrange
      const props = {
        selectProps: {
          classes: {},
          inputValue: '',
          textFieldProps: {},
          noOptionsFoundMessage: 'custom message',
        },
        children: <div>mock content</div>,
      };
      const { getByText } = render(<AutocompleteNoOptions {...props} />);

      // assert
      expect(getByText('custom message')).toBeInTheDocument();
    });
    it('renders mock content', () => {
      // arrange
      const props = {
        selectProps: {
          classes: {},
          inputValue: '',
          textFieldProps: {},
        },
        children: <div>mock content</div>,
      };
      const { getByText } = render(<AutocompleteNoOptions {...props} />);

      // assert
      expect(getByText('mock content')).toBeInTheDocument();
    });
    it('renders nothing', () => {
      // arrange
      const props = {
        selectProps: {
          classes: {},
          inputValue: '',
          textFieldProps: {},
        },
      };
      const { container } = render(<AutocompleteNoOptions {...props} />);

      // assert
      expect(container.getElementsByTagName('p')[0]).toBeEmptyDOMElement();
    });
  });

  it('renders option component without crashing', () => {
    // arrange
    const props = {
      selectProps: {
        classes: {},
      },
      innerProps: {},
      innerRef: {},
    };
    render(<AutocompleteOption isSelected={true} {...props} />);
  });

  it('renders placeholder component without crashing', () => {
    // arrange
    render(<AutocompletePlaceholder {...defaultSelectProps} />);
  });

  it('renders singleValue component without crashing', () => {
    // arrange
    render(<AutocompleteSingleValue {...defaultSelectProps} />);
  });

  it('renders valueContainer component without crashing', () => {
    // arrange
    const props = {
      selectProps: {
        classes: {},
      },
    };
    render(<AutocompleteValueContainer {...props} />);
  });
});
