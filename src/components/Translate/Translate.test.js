import React from 'react';
import { render } from 'tests';
import Translate from './Translate';

describe('COMPONENTS › Translate', () => {
  describe('@render', () => {
    it('renders nothing if not passed a label', () => {
      const { container } = render(<Translate />);
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the text label', () => {
      const { container } = render(<Translate label="label.foo" />);
      expect(container).toHaveTextContent('label.foo');
    });

    it('renders the value with options', () => {
      const { container } = render(<Translate label="format.percent" options={{ value: { number: 50 } }} />);
      expect(container).toHaveTextContent('format.percent(50)');
    });

    it('renders the correct Typography variant', () => {
      const { container } = render(<Translate label="label.h1" variant="h1" />);
      expect(container.querySelector('.MuiTypography-h1')).toHaveTextContent('label.h1');
    });

    it('renders the default Typography if passed invalid variant', () => {
      const { container } = render(<Translate label="label.foo" variant="foo" />);

      expect(container.querySelector('.MuiTypography-h1')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-h1')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-h1')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-h2')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-h3')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-h4')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-h5')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-h6')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-subtitle1')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-subtitle2')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-body1')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-body2')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-caption')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-button')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-overline')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-srOnly')).not.toBeInTheDocument();
      expect(container.querySelector('.MuiTypography-inherit')).not.toBeInTheDocument();
    });

    it('renders the translated text in the defined component/element', () => {
      const { container } = render(<Translate label="label.strong" component="strong" />);
      expect(container.querySelector('strong')).toHaveTextContent('label.strong');
    });

    it('renders the text without parsed HTML by default', () => {
      const { container } = render(<Translate label="label with <span>HTML</span> content" />);
      expect(container).toHaveTextContent('label with <span>HTML</span> content');
    });

    it('renders the parsed HTML if passed the prop "parseDangerousHtml"', () => {
      const { container } = render(<Translate label="label with <strong>HTML</strong> content" parseDangerousHtml />);
      expect(container).toHaveTextContent('label with HTML content');
      expect(container.querySelector('strong')).toHaveTextContent('HTML');
    });
  });
});
