import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { showModal } from 'stores';
import * as utils from 'utils';

useConfirmNavigation.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  cancel: PropTypes.string,
  confirm: PropTypes.string,
};

export default function useConfirmNavigation({ title, subtitle, cancel, confirm } = {}) {
  const dispatch = useDispatch();

  const showConfirm = (onConfirm, onCancel) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: title || utils.string.t('navigation.page.title'),
          subtitle: subtitle || utils.string.t('navigation.page.subtitle'),
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            cancelLabel: cancel || utils.string.t('app.cancel'),
            confirmLabel: confirm || utils.string.t('app.yes'),
            submitHandler: onConfirm,
            cancelHandler: onCancel,
          },
        },
      })
    );
  };

  return {
    confirmNavigation: showConfirm,
  };
}
