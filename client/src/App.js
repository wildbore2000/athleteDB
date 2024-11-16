import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { Button } from './components/ui/button';
import { Link } from 'react-router-dom';

// Pages and Components
import Dashboard from './components/Dashboard';
import { AthleteList } from './components/AthleteList';
import { AthleteForm } from './components/AthleteForm';
import { AthleteDetail } from './components/AthleteDetail';
import AssessmentList from './components/AssessmentList';
import AssessmentForm from './components/AssessmentForm';
import AssessmentDetail from './components/AssessmentDetail';

// Default Mobile Buttons Component for Dashboard
const DashboardMobileButtons = () => (
  <>
    <Link to="/athletes/new" className="flex-1">
      <Button variant="outline" className="w-full">Add Athlete</Button>
    </Link>
    <Link to="/assessments/new" className="flex-1">
      <Button className="w-full">New Assessment</Button>
    </Link>
  </>
);

// Attach MobileButtons to Dashboard if it doesn't exist
if (!Dashboard.MobileButtons) {
  Dashboard.MobileButtons = DashboardMobileButtons;
}

const AppContent = () => {
  const location = useLocation();
  
  const getMobileButtons = () => {
    // Get the first matching route segment
    const path = location.pathname.split('/')[1];
    
    // Return appropriate buttons based on route
    switch (path) {
      case '':
        return <DashboardMobileButtons />;
      case 'athletes':
        return AthleteList.MobileButtons ? <AthleteList.MobileButtons /> : null;
      case 'assessments':
        return AssessmentList.MobileButtons ? <AssessmentList.MobileButtons /> : null;
      default:
        return null;
    }
  };

  return (
    <Layout mobileButtons={getMobileButtons()}>
      <Routes>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;