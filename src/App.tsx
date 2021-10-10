import React from 'react';
import './App.scss';
import { CsvReader } from './components/CsvReader';

export const App: React.FC = () => {
  return (
    <div className="starter">
      <CsvReader />
    </div>
  );
};
