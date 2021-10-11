import React, { useState } from 'react';
import { CsvTable } from '../CsvTable';
import { csv } from '../../csv25_test_header';

import './CsvReader.scss';

export const CsvReader: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File>();
  const [csvArrayData, setCsvArrayData] = useState<Table[] | null>(null);
  const [csvHeader, setCsvHeader] = useState<string[]>([]);
  const [isFileValid, setValidFile] = useState(true);

  const processingCsv = (str: string) => {
    const csvHeaders = str.slice(0, str.indexOf('\n')).split(',')
      .map(item => item.trim());
    const csvRows = str.slice(str.indexOf('\n') + 1).split('\n')
      .map(item => item.trim());

    setValidFile(csvHeaders.length === 10);

    const arrayData: Table[] = csvRows.map((row, index) => {
      const values = row.split(',');
      const getObject = csvHeaders.reduce((obj, key, i) => ({
        ...obj,
        Id: index + 1,
        [key.toLowerCase()]: values[i],
      }), {});

      return getObject as Table;
    });

    setValidFile(arrayData.every(item => item.email && item.phone && item['full name']));

    setCsvArrayData(arrayData);
    setCsvHeader(csvHeaders);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidFile(true);

    if (!isFileValid) {
      setCsvArrayData(null);
    }

    if (event.target.files) {
      setValidFile(event.target.files[0].name.slice(-4) === '.csv');
      setCsvFile(event.target.files[0]);
    }
  };

  const getSubmit = () => {
    if (csvFile) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          const text = event.target.result;

          processingCsv(text.toString());
        }
      };

      reader.readAsText(csvFile);
    }
  };

  return (
    <div>
      <form className="form" id="csv-form">
        <fieldset className="form_fieldset">
          <legend className="form_legend">
            Choose csv file
          </legend>

          <input
            type="file"
            accept=".csv"
            id="csv-file"
            className="form__input-file btn btn-info"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="btn btn-info"
            disabled={!isFileValid}
            onClick={(event) => {
              event.preventDefault();
              if (csvFile) {
                getSubmit();
              }
            }}
          >
            Submit
          </button>
        </fieldset>

        <fieldset className="form_fieldset">
          <legend className="form_legend">
            Load current users
          </legend>

          <button
            type="submit"
            className="btn btn-info"
            onClick={(event) => {
              event.preventDefault();
              processingCsv(csv);
            }}
          >
            Import Users
          </button>
        </fieldset>
      </form>

      {!isFileValid ? (
        <div className="p-3 mb-2 bg-danger text-white">
          File format is not correct
        </div>
      ) : (
        csvArrayData && <CsvTable csvHeader={csvHeader} csvArrayData={csvArrayData} />
      )}
    </div>
  );
};
