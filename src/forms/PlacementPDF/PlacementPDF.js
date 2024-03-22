import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import PropTypes from 'prop-types';

// app
import { PlacementPDFView } from './PlacementPDF.view';
import * as utils from 'utils';
import { getCommentsByPlacement } from 'stores';

PlacementPDF.propTypes = {
  handleClose: PropTypes.func,
  component: PropTypes.func,
};

export function PlacementPDF({ handleClose, component, ...componentProps }) {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const [isRenderingPDF, setIsRenderingPDF] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [commentsFetched, setCommentsFetched] = useState(false);

  useEffect(
    () => {
      if (!componentProps || !componentProps.placement) return;
      const fetchAllComments = async () => {
        await dispatch(getCommentsByPlacement(`placement/${componentProps.placement.id}/policyMarket`));
        setCommentsFetched(true);
      };
      fetchAllComments();
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => handleCancel(),
  });

  const handleSubmit = () => {
    return new Promise((resolve) => {
      setIsGenerating(true);

      setTimeout(() => {
        setIsRenderingPDF(true);
        generatePDF();
        resolve();
      }, 0);
    });
  };

  const fields = [
    {
      type: 'textarea',
      label: utils.string.t('placement.sheet.introduction'),
      value: '',
      name: 'introduction',
      muiComponentProps: {
        multiline: true,
        minRows: 2,
        maxRows: 6,
      },
    },
    {
      type: 'checkbox',
      label: utils.string.t('placement.sheet.displayMudmapOnPDF'),
      value: true,
      name: 'showMudmap',
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.download'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return (
    <PlacementPDFView
      fields={fields}
      actions={actions}
      component={component}
      componentProps={componentProps}
      componentRef={componentRef}
      isRenderingPDF={isRenderingPDF}
      showLoader={!commentsFetched || isGenerating}
    />
  );
}

export default PlacementPDF;
