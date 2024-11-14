// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages and Components
import Dashboard from './components/Dashboard';
import { AthleteList } from './components/AthleteList';
import { AthleteForm } from './components/AthleteForm';
import { AthleteDetail } from './components/AthleteDetail';
import AssessmentList from './components/AssessmentList';
import AssessmentForm from './components/AssessmentForm';
import AssessmentDetail from './components/AssessmentDetail';
import { Analytics } from './components/Analytics';
import { ComparisonChart } from './components/ComparisonChart';
import { TrendsChart } from './components/TrendsChart';

// Analytics Layout Component
const AnalyticsLayout = ({ children }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Analytics</h1>
    </div>
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Athletes Routes */}
          <Route path="/athletes" element={<AthleteList />} />
          <Route path="/athletes/new" element={<AthleteForm />} />
          <Route path="/athletes/:id" element={<AthleteDetail />} />
          <Route path="/athletes/:id/edit" element={<AthleteForm />} />

          {/* Assessment Routes */}
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/new" element={<AssessmentForm />} />
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
          <Route path="/assessments/:id/edit" element={<AssessmentForm />} />
          <Route path="/athletes/:athleteId/assessments" element={<AssessmentList />} />
          <Route path="/athletes/:athleteId/assessments/new" element={<AssessmentForm />} />
          <Route path="/athletes/:athleteId/assessments/:id" element={<AssessmentDetail />} />
          <Route path="/athletes/:athleteId/assessments/:id/edit" element={<AssessmentForm />} />

          {/* Analytics Routes */}
          <Route path="/analytics" element={
            <AnalyticsLayout>
              <Analytics />
            </AnalyticsLayout>
          } />
          <Route path="/analytics/comparison" element={
            <AnalyticsLayout>
              <ComparisonChart />
            </AnalyticsLayout>
          } />
          <Route path="/analytics/trends" element={
            <AnalyticsLayout>
              <TrendsChart />
            </AnalyticsLayout>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;