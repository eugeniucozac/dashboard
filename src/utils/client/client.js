// app
import * as utils from 'utils';
import config from 'config';

const utilsClient = {
  getClientDetail: ({ gxbBeReference, offices }) => {
    const officeName = utils.office.getMainOfficeName(offices);
    if (!gxbBeReference && !officeName) return;

    return (
      <>
        {gxbBeReference && (
          <span>
            {utils.string.t('placement.generic.gxbBeReference')}: {gxbBeReference}
            <br />
          </span>
        )}
        {officeName && (
          <span>
            {utils.string.t('app.office')}: {officeName}
          </span>
        )}
      </>
    );
  },
  offices: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((client) => id === client.id);
    },
    getNameList: (arr) => {
      if (!utils.generic.isValidArray(arr, true)) return;
      return arr
        .map((office) => {
          if (!utils.generic.isValidObject(office)) return '';
          return office.name;
        })
        .filter((name) => !!name)
        .join(', ');
    },
  },
  parent: {
    getName: (parent) => {
      if (!parent || !utils.generic.isValidObject(parent)) return;
      return parent && parent.name;
    },
    getLogoFilePath: (parent) => {
      if (!parent || !utils.generic.isValidObject(parent)) return;
      return parent && parent.logoFileName && `${config.assets}/logo/${parent.logoFileName}`;
    },
  },
};

export default utilsClient;
