import React, { useState } from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { useFlexiColumns } from 'hooks';
import { useForm } from 'react-hook-form';

// app
import { Button, TableActions, TableFilters, TableToolbar, TableCell, TableHead, FormDate, MultiSelect } from 'components';
import * as utils from 'utils';

// mui
import { Table, TableRow, TableBody } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

export default {
  title: 'TableToolbar',
  component: TableToolbar,
  decorators: [withKnobs],
};

export const Default = () => {
  const [search] = useState('');
  const [columns] = useState([
    { id: 'id', label: 'Id', visible: true, compact: true, bold: true },
    { id: 'name', label: 'Name', visible: true },
    { id: 'city', label: 'City', visible: true, right: true },
    { id: 'country', label: 'Country', visible: true },
    { id: 'number', label: 'Number', nowrap: true, ellipsis: true },
    { id: 'status', label: 'Status', center: true },
    { id: 'actions', menu: true },
  ]);

  const options = [
    { id: 'astonmartin', name: 'Aston Martin' },
    { id: 'audi', name: 'Audi' },
    { id: 'bentley', name: 'Bentley' },
    { id: 'bmw', name: 'BMW (Bayerische Motoren Werke AG)' },
    { id: 'chevrolet', name: 'Chevrolet' },
    { id: 'citroen', name: 'Citroen' },
    { id: 'dodge', name: 'Dodge' },
    { id: 'ferrari', name: 'Ferrari' },
    { id: 'ford', name: 'Ford' },
    { id: 'honda', name: 'Honda' },
    { id: 'hyundai', name: 'Hyundai' },
    { id: 'infiniti', name: 'Infiniti' },
    { id: 'jaguar', name: 'Jaguar' },
    { id: 'kia', name: 'Kia' },
    { id: 'lotus', name: 'Lotus' },
    { id: 'lexus', name: 'Lexus' },
    { id: 'maseratti', name: 'Maseratti' },
    { id: 'mercedesbenz', name: 'Mercedes-Benz' },
    { id: 'nissan', name: 'Nissan' },
    { id: 'porsche', name: 'Porsche' },
    { id: 'renault', name: 'Renault' },
    { id: 'rollsroyce', name: 'Rolls Royce' },
    { id: 'saab', name: 'Saab' },
    { id: 'subaru', name: 'Subaru' },
    { id: 'tesla', name: 'Tesla' },
    { id: 'toyota', name: 'Toyota' },
    { id: 'vw', name: 'Volkswagen' },
    { id: 'volvo', name: 'Volvo' },
  ];

  const rows = [
    {
      id: 1,
      name: 'Peadar Snowball',
      city: 'La Esperanza',
      country: 'Honduras',
      number: '578-813-0616',
      status: 'Cancelled',
    },
    {
      id: 2,
      name: 'Ursulina Barnwille',
      city: 'Rače',
      country: 'Slovenia',
      number: '621-438-7405 extension #100009987654321',
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'Brion Breffitt',
      city: 'Jetis',
      country: 'Indonesia',
      number: '297-789-1555',
      status: 'In Progress',
    },
    {
      id: 4,
      name: 'Michaelina Readings',
      city: 'Passo',
      country: 'Indonesia',
      number: '353-995-1297',
      status: 'In Progress',
    },
    {
      id: 5,
      name: 'Gisella Platt',
      city: 'Mooka',
      country: 'Japan',
      number: '794-683-8651',
      status: 'Done',
    },
    {
      id: 6,
      name: 'Edward Vayro',
      city: 'Tabio',
      country: 'Philippines',
      number: '848-681-5169',
      status: 'In Progress',
    },
    {
      id: 7,
      name: 'Antone Reeme',
      city: 'Cempaka',
      country: 'Indonesia',
      number: '341-288-6292',
      status: 'Cancelled',
    },
    {
      id: 8,
      name: 'Rae Doran',
      city: 'Tegalgunung',
      country: 'Indonesia',
      number: '408-202-1198',
      status: 'In Progress',
    },
    {
      id: 9,
      name: 'Reeta Kilvington',
      city: 'Jiajiaying',
      country: 'China',
      number: '526-687-1998',
      status: 'Pending',
    },
    {
      id: 10,
      name: 'Karrie Lubman',
      city: 'Belūsovka',
      country: 'Kazakhstan',
      number: '672-940-4130',
      status: 'In Progress',
    },
  ];

  const onSubmitSearch = (values) => {
    console.log('[submitSearch]', values);
  };

  const onApplyFilters = (values) => {
    console.log('[applyFilters]', values);
  };

  const onToggleColumn = (column) => {
    console.log('[onToggleColumn]', column);
  };

  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);
  const dateFields = [
    {
      name: 'dateFilter1',
      type: utils.string.t('app.datepicker'),
      value: null,
    },
    {
      name: 'dateFilter2',
      type: utils.string.t('app.datepicker'),
      value: null,
    },
  ];
  const defaultValues = utils.form.getInitialValues(dateFields);
  const { control } = useForm({ defaultValues });

  const handleDatePickerUpdate = (name, date) => {
    console.log(`[DATE PICKER UPDATE] ${name} - ${date} `);
  };
  const tableFilterFields = [
    {
      id: 'one',
      type: 'multiSelect',
      label: 'Filter 1',
      value: [],
      options: options,
      content: <MultiSelect id="one" search options={options} />,
      maxHeight: 200,
    },
    {
      id: 'two',
      type: 'multiSelect',
      label: 'Filter 2',
      placeholder: 'Custom placeholder',
      value: [],
      options: options,
      content: <MultiSelect id="two" search options={options} />,
    },
    {
      id: 'three',
      type: 'multiSelect',
      label: 'Filter 3',
      value: [{ id: 'astonmartin', name: 'Aston Martin' }],
      options: options,
      content: <MultiSelect id="three" options={options} />,
    },
    {
      id: 'four',
      type: 'multiSelect',
      label: 'Filter 4',
      text: { label: 'Hard coded text property' },
      value: [
        { id: 'bmw', name: 'BMW (Bayerische Motoren Werke AG)' },
        { id: 'bentley', name: 'Bentley' },
        { id: 'rollsroyce', name: 'Rolls Royce' },
      ],
      options: options,
      content: <MultiSelect id="four" options={options} />,
      maxHeight: 450,
    },
    {
      id: 'dateFilter1',
      type: utils.string.t('app.datepicker'),
      label: 'Date Filter 1',
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(dateFields, 'dateFilter1')}
          id="datepicker"
          label={''}
          plainText={true}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          handlers={{
            toggelDatePicker: handleDatePickerUpdate,
          }}
          muiPickerProps={{
            disableToolbar: true,
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },
    {
      id: 'dateFilter2',
      type: utils.string.t('app.datepicker'),
      label: 'Date Filter 2',
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(dateFields, 'dateFilter2')}
          id="datepicker"
          label={''}
          plainText={true}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          handlers={{
            toggelDatePicker: handleDatePickerUpdate,
          }}
          muiPickerProps={{
            disableToolbar: true,
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },
  ];

  const withActions = boolean('Actions', true);
  const withSearch = boolean('Search', true);
  const withFilters = boolean('Filter', true);
  const withColumns = boolean('Flexi Columns', true);

  return (
    <div>
      <TableToolbar>
        {withActions && (
          <TableActions>
            <Button text="Add" size="small" variant="outlined" type="submit" icon={AddIcon} iconPosition="right" color="primary" />
          </TableActions>
        )}
        {(withFilters || withSearch || withColumns) && (
          <TableFilters
            search={withSearch}
            searchQuery={search}
            filters={withFilters}
            filtersArray={tableFilterFields}
            columns={withColumns}
            columnsArray={columnsArray}
            handlers={{ onSearch: onSubmitSearch, onFilter: onApplyFilters, onToggleColumn: toggleColumn }}
          />
        )}
      </TableToolbar>

      <Table size="small">
        <TableHead columns={columnsArray} />

        <TableBody>
          {rows.map((location) => {
            return (
              <TableRow key={location.id} hover>
                <TableCell {...columnProps('id')}>{location.id}</TableCell>
                <TableCell {...columnProps('name')}>{location.name}</TableCell>
                <TableCell {...columnProps('city')}>{location.city}</TableCell>
                <TableCell {...columnProps('country')}>{location.country}</TableCell>
                <TableCell {...columnProps('number')} style={{ minWidth: 60 }}>
                  {location.number}
                </TableCell>
                <TableCell {...columnProps('status')}>{location.status}</TableCell>
                <TableCell menu>
                  <Button
                    size="small"
                    variant="text"
                    icon={SettingsIcon}
                    style={{
                      padding: '0 6px',
                      maxWidth: '100%',
                      minHeight: 24,
                      minWidth: 24,
                      color: '#666',
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
