import React, { useState } from 'react';
import { FormAutocomplete } from 'components';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';

export default {
  title: 'Form',
  decorators: [withKnobs],
};

const countries = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'Angola', value: 'AO' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Armenia', value: 'AM' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Bahrain', value: 'BH' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Belize', value: 'BZ' },
  { label: 'Benin', value: 'BJ' },
  { label: 'Bermuda', value: 'BM' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Cambodia', value: 'KH' },
  { label: 'Cameroon', value: 'CM' },
  { label: 'Canada', value: 'CA' },
  { label: 'Cape Verde', value: 'CV' },
  { label: 'Central African Republic', value: 'CF' },
  { label: 'Chile', value: 'CL' },
  { label: 'China', value: 'CN' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Congo', value: 'CG' },
  { label: 'Costa Rica', value: 'CR' },
  { label: "Cote D'Ivoire", value: 'CI' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cuba', value: 'CU' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Dominican Republic', value: 'DO' },
  { label: 'Ecuador', value: 'EC' },
  { label: 'Egypt', value: 'EG' },
  { label: 'Equatorial Guinea', value: 'GQ' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Gabon', value: 'GA' },
  { label: 'Gambia', value: 'GM' },
  { label: 'Georgia', value: 'GE' },
  { label: 'Germany', value: 'DE' },
  { label: 'Ghana', value: 'GH' },
  { label: 'Greece', value: 'GR' },
  { label: 'Haiti', value: 'HT' },
  { label: 'Honduras', value: 'HN' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'India', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Iran, Islamic Republic Of', value: 'IR' },
  { label: 'Iraq', value: 'IQ' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Israel', value: 'IL' },
  { label: 'Italy', value: 'IT' },
  { label: 'Jamaica', value: 'JM' },
  { label: 'Japan', value: 'JP' },
  { label: 'Jordan', value: 'JO' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Kenya', value: 'KE' },
  { label: "Korea, Democratic People'S Republic of", value: 'KP' },
  { label: 'Korea, Republic of', value: 'KR' },
  { label: 'Kuwait', value: 'KW' },
  { label: 'Kyrgyzstan', value: 'KG' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lebanon', value: 'LB' },
  { label: 'Liechtenstein', value: 'LI' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' },
  { label: 'Madagascar', value: 'MG' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Malta', value: 'MT' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Micronesia, Federated States of', value: 'FM' },
  { label: 'Moldova, Republic of', value: 'MD' },
  { label: 'Mongolia', value: 'MN' },
  { label: 'Morocco', value: 'MA' },
  { label: 'Mozambique', value: 'MZ' },
  { label: 'Namibia', value: 'NA' },
  { label: 'Nepal', value: 'NP' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Nicaragua', value: 'NI' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'Norway', value: 'NO' },
  { label: 'Oman', value: 'OM' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'Panama', value: 'PA' },
  { label: 'Paraguay', value: 'PY' },
  { label: 'Peru', value: 'PE' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Qatar', value: 'QA' },
  { label: 'Romania', value: 'RO' },
  { label: 'Russian Federation', value: 'RU' },
  { label: 'Rwanda', value: 'RW' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Senegal', value: 'SN' },
  { label: 'Serbia and Montenegro', value: 'CS' },
  { label: 'Sierra Leone', value: 'SL' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Somalia', value: 'SO' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'Sudan', value: 'SD' },
  { label: 'Suriname', value: 'SR' },
  { label: 'Swaziland', value: 'SZ' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Tajikistan', value: 'TJ' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Tonga', value: 'TO' },
  { label: 'Tunisia', value: 'TN' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Turkmenistan', value: 'TM' },
  { label: 'Uganda', value: 'UG' },
  { label: 'Ukraine', value: 'UA' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
  { label: 'Uruguay', value: 'UY' },
  { label: 'Uzbekistan', value: 'UZ' },
  { label: 'Venezuela', value: 'VE' },
  { label: 'Vietnam', value: 'VN' },
  { label: 'Yemen', value: 'YE' },
  { label: 'Zambia', value: 'ZM' },
  { label: 'Zimbabwe', value: 'ZW' },
];

export const Autocomplete = () => {
  const [fieldValue, setFieldValue] = useState([]);

  const label = text('Label', 'Autocomplete Field');
  const hint = text('Hint', 'Type to refine options...');
  const placeholder = text('Placeholder', 'Custom autocomplete placeholder...');
  const error = boolean('Error', false) ? { message: 'Dummy error', type: 'required' } : undefined;
  const fullWidth = boolean('Fullwidth', true);
  const maxHeight = number('Max Height', 300, { range: true, min: 100, max: 600, step: 20 });
  const isClearable = boolean('Clearable', false);
  const isMulti = boolean('Multi', false);
  const isCreatable = boolean('Creatable', false);
  const isAsync = boolean('Async', false);
  const rhf = boolean('React Hook Form', true);

  // prettier-ignore
  const fields = [
    {
      name: 'fieldAutocomplete',
      type: 'autocomplete',
      value: [],
      options: countries,
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const { control, setValue } = useForm({ defaultValues });

  return (
    <Box width={1}>
      {rhf && (
        <FormAutocomplete
          control={control}
          {...fields[0]}
          label={label}
          hint={hint}
          error={error}
          placeholder={placeholder}
          handleUpdate={(id, value) => setValue(id, value)}
          muiComponentProps={{
            fullWidth: fullWidth,
          }}
          innerComponentProps={{
            maxMenuHeight: maxHeight,
            isMulti: isMulti,
            isClearable: isClearable,
            isCreatable: isCreatable,
            allowEmpty: isAsync,
            ...(isAsync && {
              async: {
                handler: (type, term) => {
                  return fetch(`https://restcountries.eu/rest/v2/name/${term}
`)
                    .then((response) => utils.api.handleResponse(response))
                    .then((data) => data.map((c) => ({ label: c.name, value: c.alpha2Code })));
                },
                type: '',
              },
            }),
          }}
        />
      )}

      {!rhf && (
        <FormAutocomplete
          {...fields[0]}
          value={fieldValue}
          label={label}
          hint={hint}
          error={error}
          placeholder={placeholder}
          handleUpdate={(id, value) => {
            console.log('[FormAutocomplete.stories]', id);
            console.log('[FormAutocomplete.stories]', value);

            setFieldValue(value);
          }}
          muiComponentProps={{
            fullWidth: fullWidth,
          }}
          innerComponentProps={{
            maxMenuHeight: maxHeight,
            isMulti: isMulti,
            isClearable: isClearable,
            isCreatable: isCreatable,
            allowEmpty: isAsync,
            ...(isAsync && {
              async: {
                handler: (type, term) => {
                  return fetch(`https://restcountries.eu/rest/v2/name/${term}
`)
                    .then((response) => utils.api.handleResponse(response))
                    .then((data) => data.map((c) => ({ label: c.name, value: c.alpha2Code })));
                },
                type: '',
              },
            }),
          }}
        />
      )}
    </Box>
  );
};
