import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export class MapBoxTooltipPortal extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    elem: PropTypes.object.isRequired, // DOM node
  };

  constructor(props) {
    super(props);
    this.container = document.getElementById(props.id);
  }

  componentWillMount() {
    const { elem } = this.props;

    if (this.container && elem) {
      this.container.appendChild(elem);
    }
  }

  componentWillUnmount() {
    const { elem } = this.props;

    // mapbox might have move this elem somewhere else in the DOM
    // try to get the parent and if found, remove "elem"
    if (elem && elem.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  }

  render() {
    const { elem, children } = this.props;

    return ReactDOM.createPortal(children, elem);
  }
}

export default MapBoxTooltipPortal;
