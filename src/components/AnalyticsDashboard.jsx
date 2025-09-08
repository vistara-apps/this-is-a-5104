import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { analyticsService } from '../services/supabaseService'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, AlertTriangle, Calendar, Activity, Brain, Target } from 'lucide-react'
import Button from './Button'
import SubscriptionManager from './SubscriptionManager'

const AnalyticsDashboard = () => {
  const { getUserId, canAccessFeature, isFeatureLimited, getUpgradeMessage } = useAuth()
  const { symptomEntries } = useData()
  const [insights, setInsights] = useState(null)
  const [patterns, setPatterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [timeRange, setTimeRange] = useState(30) // days

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      
      if (canAccessFeature('advancedInsights')) {
        // Load advanced analytics from Supabase
        const [healthInsights, symptomPatterns] = await Promise.all([
          analyticsService.getHealthInsights(userId),
          analyticsService.getSymptomPatterns(userId, timeRange)
        ])
        
        setInsights(healthInsights)
        setPatterns(symptomPatterns)
      } else {
        // Basic analytics from local data
        setInsights(generateBasicInsights())
        setPatterns(generateBasicPatterns())
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      // Fallback to basic analytics
      setInsights(generateBasicInsights())
      setPatterns(generateBasicPatterns())
    } finally {
      setLoading(false)
    }
  }

  const generateBasicInsights = () => {
    const recentEntries = symptomEntries.slice(0, 10)
    const totalEntries = symptomEntries.length
    
    return {
      totalEntries,
      recurringSymptoms: 0,
      averageConfidenceScore: recentEntries.reduce((sum, entry) => sum + (entry.confidenceScore || 0), 0) / recentEntries.length || 0,
      mostCommonSymptoms: [],
      recentTrends: { newSymptoms: [], improvedSymptoms: [], persistentSymptoms: [] },
      riskFactors: []
    }
  }

  const generateBasicPatterns = () => {
    const symptomCounts = {}
    symptomEntries.slice(0, 20).forEach(entry => {
      entry.symptoms?.forEach(symptom => {
        const normalizedSymptom = symptom.toLowerCase()
        symptomCounts[normalizedSymptom] = (symptomCounts[normalizedSymptom] || 0) + 1
      })
    })

    return Object.entries(symptomCounts)
      .filter(([_, count]) => count >= 2)
      .map(([symptom, frequency]) => ({
        symptom,
        frequency,
        trend: 'stable',
        lastOccurrence: new Date(),
        totalOccurrences: frequency
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
  }

  const generateChartData = () => {
    if (!symptomEntries.length) return []

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        entries: 0,
        symptoms: 0
      }
    })

    symptomEntries.forEach(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0]
      const dayData = last30Days.find(day => day.date === entryDate)
      if (dayData) {
        dayData.entries += 1
        dayData.symptoms += entry.symptoms?.length || 0
      }
    })

    return last30Days.map(day => ({
      ...day,
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))
  }

  const getSymptomFrequencyData = () => {
    return patterns.slice(0, 8).map(pattern => ({
      name: pattern.symptom.charAt(0).toUpperCase() + pattern.symptom.slice(1),
      value: pattern.frequency,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }))
  }

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isFeatureLimited('advancedInsights')) {
    return (
      <div className="text-center py-12">
        <Brain className="h-16 w-16 text-text-secondary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">Advanced Analytics</h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          {getUpgradeMessage('advancedInsights')}
        </p>
        <Button variant="primary" onClick={() => setShowUpgrade(true)}>
          Upgrade to Premium
        </Button>
        {showUpgrade && <SubscriptionManager onClose={() => setShowUpgrade(false)} />}
      </div>
    )
  }

  const chartData = generateChartData()
  const symptomFrequencyData = getSymptomFrequencyData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Health Analytics</h2>
          <p className="text-text-secondary mt-1">Advanced insights into your health patterns</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="bg-surface border border-surface rounded-md px-3 py-2 text-text-primary"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Total Entries</p>
              <p className="text-2xl font-bold text-text-primary">{insights?.totalEntries || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-accent" />
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Recurring Symptoms</p>
              <p className="text-2xl font-bold text-text-primary">{insights?.recurringSymptoms || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Avg. Confidence</p>
              <p className="text-2xl font-bold text-text-primary">
                {Math.round((insights?.averageConfidenceScore || 0) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-accent" />
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Risk Factors</p>
              <p className="text-2xl font-bold text-text-primary">{insights?.riskFactors?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Entries Over Time */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Symptom Entries Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="entries" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Symptom Frequency */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Most Common Symptoms</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={symptomFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patterns and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Patterns */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Symptom Patterns</h3>
          {patterns.length > 0 ? (
            <div className="space-y-3">
              {patterns.slice(0, 5).map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-bg rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary capitalize">{pattern.symptom}</p>
                    <p className="text-sm text-text-secondary">
                      {pattern.frequency} occurrences • {pattern.trend}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pattern.trend === 'increasing' 
                        ? 'bg-accent/20 text-accent' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {pattern.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">No patterns detected yet. Add more symptom entries to see patterns.</p>
          )}
        </div>

        {/* Risk Factors */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Health Insights</h3>
          {insights?.riskFactors?.length > 0 ? (
            <div className="space-y-3">
              {insights.riskFactors.map((risk, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  risk.severity === 'high' 
                    ? 'bg-red-500/10 border-red-500' 
                    : 'bg-yellow-500/10 border-yellow-500'
                }`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 mr-3 ${
                      risk.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-text-primary">{risk.description}</p>
                      <p className="text-sm text-text-secondary mt-1">
                        Symptoms: {risk.symptoms.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No risk factors identified</p>
              <p className="text-sm text-text-secondary mt-1">Keep tracking your symptoms for better insights</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Trends */}
      {insights?.recentTrends && (
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">New Symptoms</h4>
              {insights.recentTrends.newSymptoms?.length > 0 ? (
                <ul className="space-y-1">
                  {insights.recentTrends.newSymptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-accent capitalize">{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-secondary">None detected</p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Improved</h4>
              {insights.recentTrends.improvedSymptoms?.length > 0 ? (
                <ul className="space-y-1">
                  {insights.recentTrends.improvedSymptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-green-400 capitalize">{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-secondary">None detected</p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Persistent</h4>
              {insights.recentTrends.persistentSymptoms?.length > 0 ? (
                <ul className="space-y-1">
                  {insights.recentTrends.persistentSymptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-yellow-400 capitalize">{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-secondary">None detected</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsDashboard
