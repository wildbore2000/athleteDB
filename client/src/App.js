// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AssessmentList from './components/AssessmentList';
import AthleteAssessmentForm from './components/AthleteAssessmentForm';
import AssessmentDetail from './components/AssessmentDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/add" element={<AthleteAssessmentForm />} />
          <Route path="/assessments/edit/:id" element={<AthleteAssessmentForm />} />
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;