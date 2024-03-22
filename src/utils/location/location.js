import get from 'lodash/get';

const utilsLocation = {
  getTiv: (locations) => {
    if (!locations || !Array.isArray(locations) || locations.length < 0) return 0;

    return locations.reduce((sum, location) => {
      return sum + get(location, 'totalInsurableValues', 0);
    }, 0);
  },
  isValidTIV: (location) => {
    return location?.totalInsurableValues ? parseFloat(location.totalInsurableValues) > 0 : false;
  },
  isValidLocation: (location) => {
    const coordinatesPopulated = location?.longitude && location?.longitude;
    if (coordinatesPopulated) {
      return location.latitude >= -90 && location.latitude <= 90 && location.longitude >= -180 && location.longitude <= 180;
    } else {
      return location?.streetAddress?.trim()?.length > 0;
    }
  },
};

export default utilsLocation;
