import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Marketing.styles';
import { Button, Restricted, SectionHeader, Translate } from 'components';
import { MarketingStructuring, MarketingMarkets, MarketingMudmap } from 'modules';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';

MarketingView.propTypes = {
  placementId: PropTypes.string.isRequired,
  isDev: PropTypes.bool,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
  handlers: PropTypes.shape({
    addLayer: PropTypes.func.isRequired,
    addMarket: PropTypes.func.isRequired,
    selectSection: PropTypes.func.isRequired,
  }).isRequired,
};

MarketingView.defaultProps = {
  handlers: {},
};

export function MarketingView({ placementId, isDev, sections, handlers }) {
  const classes = makeStyles(styles, { name: 'Marketing' })();

  const getActiveSection = () => {
    const item = sections.find((s) => s.active) || {};

    return item.value;
  };

  const isMarkets = getActiveSection() === 'markets';
  const isStructuring = getActiveSection() === 'structuring';
  const isMudmap = getActiveSection() === 'mudmap';
  return (
    <>
      <SectionHeader
        testid="placement-marketing-markets"
        content={
          <ToggleButtonGroup
            exclusive
            value={getActiveSection()}
            onChange={handlers.selectSection}
            aria-label="marketing-sections"
            data-testid="toggle-button-group-marketing"
          >
            {sections.map((section) => (
              <ToggleButton key={section.value} value={section.value} classes={{ root: classes.buttons }}>
                {section.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
      >
        <Restricted include={[constants.ROLE_BROKER]}>
          {isMarkets && (
            <Button
              icon={AddIcon}
              color="primary"
              variant="outlined"
              size="medium"
              text={<Translate label="placement.marketing.addMarket" />}
              onClick={handlers.addMarket()}
            />
          )}

          {isStructuring && (
            <Button
              icon={AddIcon}
              color="primary"
              variant="outlined"
              size="medium"
              text={<Translate label="placement.marketing.addLayer" />}
              onClick={handlers.addLayer()}
            />
          )}
        </Restricted>
      </SectionHeader>

      {isMarkets && <MarketingMarkets placementId={placementId} />}
      {isStructuring && <MarketingStructuring placementId={placementId} />}
      {isMudmap && <MarketingMudmap placementId={placementId} />}
    </>
  );
}
