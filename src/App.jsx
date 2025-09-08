import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import AppShell from './components/AppShell'
import Dashboard from './components/Dashboard'
import SymptomChecker from './components/SymptomChecker'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import SubscriptionManager from './components/SubscriptionManager'

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-bg text-text-primary">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-text-secondary">Loading SymptomSense AI...</p>
    </div>
  </div>
)

// Main app content component
const AppContent = () => {
  const { loading, isAuthenticated } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoadingScreen />
  }

  return (
    <AppShell 
      currentView={currentView} 
      onViewChange={setCurrentView}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/subscription" element={<SubscriptionManager onClose={() => window.history.back()} />} />
        <Route path="/subscription/success" element={
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Welcome to Premium!</h2>
            <p className="text-text-secondary mb-6">Your subscription has been activated successfully.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </div>
        } />
        <Route path="/subscription/cancel" element={
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Subscription Canceled</h2>
            <p className="text-text-secondary mb-6">You can try again anytime.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </div>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-bg">
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1F2937',
                  color: '#F3F4F6',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#F3F4F6',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#F3F4F6',
                  },
                },
              }}
            />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
