import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Activity, Brain, User, Settings, Plus, BarChart3, Crown, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import SubscriptionManager from './SubscriptionManager'

const AppShell = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, userProfile, signOut, isPremium, isDemo } = useAuth()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentPath = location.pathname

  const handleNavigation = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-text-secondary border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-text-primary">SymptomSense AI</h1>
                {isDemo() && (
                  <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                    Demo
                  </span>
                )}
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === '/dashboard' 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/symptom-checker')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === '/symptom-checker' 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Check Symptoms
              </button>
              <button
                onClick={() => handleNavigation('/analytics')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  currentPath === '/analytics' 
                    ? 'bg-primary text-white' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
                {!isPremium() && <Crown className="h-3 w-3 text-accent" />}
              </button>
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {!isPremium() && (
                <Button 
                  variant="primary" 
                  onClick={() => setShowUpgrade(true)} 
                  className="text-sm flex items-center space-x-1"
                >
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Premium</span>
                </Button>
              )}
              {isPremium() && (
                <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Premium</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-text-secondary" />
                <span className="text-sm text-text-secondary">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-text-secondary border-opacity-20">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath === '/dashboard' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation('/symptom-checker')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath === '/symptom-checker' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Check Symptoms
            </button>
            <button
              onClick={() => handleNavigation('/analytics')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentPath === '/analytics' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
              {!isPremium() && <Crown className="h-3 w-3 text-accent" />}
            </button>
            <div className="border-t border-text-secondary border-opacity-20 pt-2 mt-2">
              <div className="flex items-center space-x-2 px-3 py-2">
                <User className="h-4 w-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">{user?.email}</span>
              </div>
              {!isPremium() && (
                <button
                  onClick={() => {
                    setShowUpgrade(true)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-md flex items-center space-x-2"
                >
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Premium</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Subscription Manager Modal */}
      {showUpgrade && (
        <SubscriptionManager onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}

export default AppShell
