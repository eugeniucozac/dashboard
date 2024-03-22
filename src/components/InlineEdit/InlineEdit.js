import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './InlineEdit.styles';
import { FormTextFormik } from 'components';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { withStyles } from '@material-ui/core';

export class InlineEdit extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'textarea', 'number']).isRequired,
    variant: PropTypes.oneOf(['text', 'percent', 'currency', 'number']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    currency: PropTypes.string,
    error: PropTypes.bool,
    editing: PropTypes.bool,
    compact: PropTypes.bool,
    title: PropTypes.bool,
    multiline: PropTypes.bool,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
      input: PropTypes.string,
      label: PropTypes.string,
    }),
    muiComponentProps: PropTypes.object,
    onClick: PropTypes.func,
    onClickAway: PropTypes.func,
  };

  static defaultProps = {
    type: 'text',
    variant: 'text',
    nestedClasses: {},
    muiComponentProps: {},
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  handleFocus = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { onClick } = this.props;

    this.inputRef.current && this.inputRef.current.select();

    if (utils.generic.isFunction(onClick)) {
      onClick(this.inputRef.current);
    }
  };

  handleClick = (event) => {
    event.stopPropagation();
  };

  handleClickAway = (event) => {
    const { editing, onClickAway } = this.props;

    if (editing && utils.generic.isFunction(onClickAway)) {
      onClickAway(event);
      this.inputRef.current && this.inputRef.current.blur();
    }
  };

  handleKeyDown = (event) => {
    const { editing } = this.props;

    // enter
    if (editing && event.keyCode === constants.KEYCODE.Enter) {
      event.preventDefault();
      this.handleClickAway();
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  showTitle = () => {
    const { title, value } = this.props;

    return title && value && value.trim();
  };

  render() {
    const { name, type, variant, value, currency, error, compact, editing, multiline, muiComponentProps, nestedClasses, classes } =
      this.props;

    let labelValue = value ? value.toString().trim() : <span>&nbsp;</span>;
    const isPercent = variant === 'percent';
    const isNumber = variant === 'number';
    const isCurrency = variant === 'currency';

    if (isPercent) {
      labelValue = utils.string.t('format.percent', { value: { number: value, default: '-' } });
    } else if (isNumber) {
      labelValue = utils.string.t('format.number', { value: { number: value, default: '-' } });
    } else if (isCurrency) {
      labelValue = utils.string.t('format.currency', { value: { number: value, currency: currency, default: '-' } });
    }

    const classesRoot = {
      [classes.root]: true,
      [nestedClasses.root]: Boolean(nestedClasses.root),
    };

    const classesFormControl = {
      [classes.formControl]: true,
      [classes.formControlEditing]: editing,
    };

    const classesBase = {
      [classes.base]: true,
      [classes.baseCompact]: compact,
      [classes.baseMultiline]: multiline,
    };

    const classesInput = {
      [classes.input]: true,
      [classes.inputEditing]: editing,
      [classes.inputCompact]: compact,
      [classes.inputError]: error,
      [classes.inputMultiline]: multiline,
      [nestedClasses.input]: Boolean(nestedClasses.input),
    };

    const classesLabel = {
      [classes.label]: true,
      [nestedClasses.label]: Boolean(nestedClasses.label),
      [classes.labelCompact]: compact,
      [classes.labelNumber]: editing && (isNumber || (isCurrency && !currency)),
      [classes.labelPercent]: editing && isPercent,
      [classes.labelCurrency]: editing && isCurrency && currency,
      [classes.labelHidden]: editing,
      [classes.labelMultiline]: multiline,
    };

    return (
      <div className={classnames(classesRoot)} title={this.showTitle() ? value : undefined}>
        <FormTextFormik
          name={name}
          type={type}
          classes={{
            root: classnames(classesFormControl),
          }}
          muiComponentProps={{
            autoComplete: 'off',
            ...(multiline && { multiline: true }),
            ...muiComponentProps,
            inputRef: this.inputRef,
            InputProps: {
              ...muiComponentProps.InputProps,
              className: classnames(classesBase),
              onBlur: this.handleClickAway,
              onFocus: this.handleFocus,
              onClick: this.handleClick,
            },
            inputProps: {
              ...muiComponentProps.inputProps,
              className: classnames(classesInput),
            },
          }}
        />

        <div className={classnames(classesLabel)}>{labelValue}</div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(InlineEdit);
