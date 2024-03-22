import React from 'react';
import { render } from 'tests';
import Avatar from './Avatar';
import { List as ListIcon } from '@material-ui/icons';

describe('COMPONENTS › Avatar', () => {
  describe('@render', () => {
    it('renders nothing if not passed any props', () => {
      const { container } = render(<Avatar />);
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the text initials', () => {
      const { container } = render(<Avatar text="AA" />);
      expect(container).toHaveTextContent('AA');
    });

    it('renders the icon', () => {
      const { container } = render(<Avatar icon={ListIcon} />);
      expect(container.querySelectorAll('svg')).toHaveLength(1);
    });

    it('renders the image', () => {
      const { container } = render(<Avatar src="https://placekitten.com/160/160" />);
      expect(container.querySelectorAll('img')).toHaveLength(1);
    });

    it('renders the icon if text and icon props are both defined', () => {
      const { container } = render(<Avatar text="AA" icon={ListIcon} />);
      expect(container).toHaveTextContent('');
      expect(container.querySelectorAll('svg')).toHaveLength(1);
    });

    it('renders the image if text and image props are both defined', () => {
      const { container } = render(<Avatar text="AA" src="https://placekitten.com/160/160" />);
      expect(container).toHaveTextContent('');
      expect(container.querySelectorAll('img')).toHaveLength(1);
    });

    it('renders the image if all props are both defined', () => {
      const { container } = render(<Avatar text="AA" icon={ListIcon} src="https://placekitten.com/160/160" />);
      expect(container).toHaveTextContent('');
      expect(container.querySelectorAll('svg')).toHaveLength(0);
      expect(container.querySelectorAll('img')).toHaveLength(1);
    });
  });
});
