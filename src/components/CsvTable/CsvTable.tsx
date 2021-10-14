import React, { useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import {
  regexLicenseNumber, regexLicenseStates, regexEmail, regexPhone,
} from '../validations/Regex';

import './CsvTable.scss';

type Props = {
  csvHeader: string[],
  csvArrayData: Table[] | null,
};

export const CsvTable: React.FC<Props> = (props) => {
  const { csvHeader, csvArrayData } = props;

  const findDuplicate = useMemo(() => (forValidate: string, id: number) => {
    const getId: number[] = [];

    if (!Number.isNaN(+forValidate.slice(-1))) {
      csvArrayData?.forEach(item => {
        if (item.Id !== id && item.phone.slice(-10) === forValidate.slice(-10)) {
          getId.push(item.Id);
        }
      });

      return getId.join(', ');
    }

    csvArrayData?.forEach(item => {
      if (item.Id !== id && item.email.toLowerCase() === forValidate.toLowerCase()) {
        getId.push(item.Id);
      }
    });

    return `${getId.join(', ')}\n`;
  }, []);

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Id</th>
          {csvHeader.map(head => (
            <th key={head}>
              {head}
            </th>
          ))}
          <th>Duplicate with</th>
        </tr>
      </thead>
      <tbody>
        {csvArrayData && (
          csvArrayData.map((item: Table) => (
            <tr key={item.Id}>
              <td>
                {item.Id}
              </td>
              <td>
                {item['full name']}
              </td>
              <td className={classNames(
                'table_item', {
                  'table_item--red': !regexPhone.test(item.phone),
                },
              )}
              >
                {item.phone}
              </td>
              <td className={classNames({
                'table_item--red': !regexEmail.test(item.email),
              })}
              >
                {item.email}
              </td>
              <td className={classNames({
                'table_item--red': +item.age <= 21 || Number.isNaN(+item.age),
              })}
              >
                {+item.age > 0 ? item.age : 'incorrect'}
              </td>
              <td className={classNames({
                'table_item--red': (+item.experience < 0) || (+item.experience >= +item.age) || Number.isNaN(+item.experience),
              })}
              >
                {item.experience}
              </td>
              <td className={classNames({
                'table_item--red': +item['yearly income'] < 0 || Number.isNaN(+item['yearly income']),
              })}
              >
                {(+item['yearly income']).toFixed(2)}
              </td>
              <td>
                {item['has children'] === 'TRUE' ? 'TRUE' : 'FALSE'}
              </td>
              <td className={classNames({
                'table_item--red': !regexLicenseStates.test(item['license states']),
              })}
              >
                {item['license states']}
              </td>
              <td className={classNames({
                'table_item--red': !moment(item['expiration date'], ['MM/DD/YYYY', 'YYYY-MM-DD'], true).isValid(),
              })}
              >
                {item['expiration date']}
              </td>
              <td className={classNames({
                'table_item--red': !regexLicenseNumber.test(item['license number']),
              })}
              >
                {item['license number']}
              </td>
              <td>
                <b>{findDuplicate(item.email, item.Id)}</b>
                <b>{findDuplicate(item.phone, item.Id)}</b>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
