import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Controller } from 'react-hook-form';
import classnames from 'classnames';

// app
import * as utils from 'utils';
import styles from './FormFileDrop.styles';
import { ErrorMessage, Button, Warning } from 'components';

// mui
import { makeStyles, Box } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';

FormFileDrop.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  dragLabel: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.object,
  showUploadPreview: PropTypes.bool,
  fileNameLength: PropTypes.number,

  componentProps: PropTypes.object,
  showDragLabel: PropTypes.bool,
  showButton: PropTypes.bool,
  showMaxFilesError: PropTypes.bool,
  nestedClasses: PropTypes.shape({
    dragArea: PropTypes.string,
    dragLabel: PropTypes.string,
    icon: PropTypes.string,
  }),
};

FormFileDrop.defaultProps = {
  showUploadPreview: true,
  fileNameLength: 48,
  showDragLabel: true,
  showButton: true,
  showMaxFilesError: true,
  componentProps: {
    multiple: false,
    maxFiles: 1,
  },
  nestedClasses: {},
};

export function FormFileDrop({
  name,
  label,
  error,
  hint,
  control,
  onChange,
  dragLabel,
  showUploadPreview,
  fileNameLength,
  showDragLabel,
  showButton,
  showMaxFilesError,
  componentProps,
  nestedClasses,
}) {
  const classes = makeStyles(styles, { name: 'FormFileDrop' })();
  const [acceptedFileList, setAcceptedFileList] = useState([]);
  const [rejectedFileList, setRejectedFileList] = useState([]);

  const props = {
    ...componentProps,
    multiple: componentProps?.multiple || false,
    maxFiles: componentProps?.multiple ? componentProps?.maxFiles || 0 : 1,
  };
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      onChange(acceptedFiles, fileRejections);
      setAcceptedFileList([...acceptedFiles]);
      setRejectedFileList([...fileRejections]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    ...props,
  });

  const onRemove = (index) => {
    const newArray = acceptedFileList.filter((item, itemIndex) => itemIndex !== index);
    setAcceptedFileList(newArray);
  };

  const UploadedFileList = () => {
    return (
      <ul className={classes.uploadedFileList}>
        {acceptedFileList.map((file, index) => (
          <li key={`accepted-${index}`}>
            <CheckCircleIcon className={classes.successIcon} /> {utils.file.truncate(file.name, fileNameLength)}
            <Box justifyContent="right">
              <Button icon={HighlightOffRoundedIcon} size="xsmall" variant="text" color="primary" onClick={() => onRemove(index)} />
            </Box>
          </li>
        ))}
        {rejectedFileList.map((file, index) => (
          <li key={`rejected-${index}`}>
            <InfoIcon className={classes.errorIcon} /> {file.name}
          </li>
        ))}
      </ul>
    );
  };

  const maxFilesError =
    props.multiple && props.maxFiles && acceptedFileList.length + rejectedFileList.length > props?.maxFiles
      ? utils.string.t('validation.fileUpload.tooManyFiles', { count: props.maxFiles })
      : '';

  const dragInstruction = (
    <>
      <CloudUploadIcon
        className={classnames({
          [classes.uploadIcon]: true,
          [nestedClasses.icon]: Boolean(nestedClasses.icon),
        })}
      />
      {showDragLabel && (
        <p
          className={classnames({
            [classes.dragFile]: true,
            [nestedClasses.dragLabel]: Boolean(nestedClasses.dragLabel),
          })}
        >
          {dragLabel || utils.string.t('form.dragDrop.dragFileHere')}
        </p>
      )}
      {showDragLabel && showButton && <p className={classes.or}>{utils.string.t('app.or')}</p>}
      {showButton && <p className={classes.browseFile}>{utils.string.t('form.dragDrop.browseFile')}</p>}
    </>
  );

  return (
    <div className={classes.root}>
      {label && <label className={classes.formLabel}>{label}</label>}
      {control ? (
        <Controller
          control={control}
          name={name}
          as={
            <div
              className={classnames({
                [classes.dragArea]: true,
                [nestedClasses.dragArea]: Boolean(nestedClasses.dragArea),
              })}
              {...getRootProps()}
              data-form-type="file"
            >
              <input {...getInputProps()} />
              {dragInstruction}
            </div>
          }
        />
      ) : (
        <div
          className={classnames({
            [classes.dragArea]: true,
            [nestedClasses.dragArea]: Boolean(nestedClasses.dragArea),
          })}
          {...getRootProps()}
          data-form-type="file"
        >
          <input {...getInputProps()} />
          {dragInstruction}
        </div>
      )}
      {showUploadPreview && (acceptedFileList.length > 0 || rejectedFileList.length > 0) && <UploadedFileList />}
      <ErrorMessage error={error} hint={hint} />
      {showMaxFilesError && maxFilesError ? <Warning type="error" icon text={maxFilesError} /> : null}
    </div>
  );
}

export default FormFileDrop;
