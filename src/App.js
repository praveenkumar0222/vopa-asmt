import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import TableData from './screens/TableData';
import TenderDetails from './screens/TenderDetails';
import WelcomeScreen from './screens/WelcomeScreen';

const App = () => {
  return (
    <BrowserRouter basename="https://github.com/praveenkumar0222/vopa-asmt.git">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/tender" element={<TableData />} />
        <Route path="/tender/:id" element={<TenderDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
