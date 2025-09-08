import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database schema setup SQL (for reference)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status VARCHAR(50) DEFAULT 'free',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptom entries table
CREATE TABLE IF NOT EXISTS symptom_entries (
  entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  symptoms TEXT[] NOT NULL,
  details TEXT,
  potential_diagnosis JSONB,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health recommendations table
CREATE TABLE IF NOT EXISTS health_recommendations (
  recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recommendation_text TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own symptom entries" ON symptom_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own symptom entries" ON symptom_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" ON health_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON health_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
`

// User operations
export const userService = {
  async getCurrentUser() {
    if (!supabase) return null
    
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async signUp(email, password) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    // Create user profile
    if (data.user) {
      await this.createUserProfile(data.user.id, email)
    }
    
    return data
  },

  async signIn(email, password) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    if (!supabase) return
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async createUserProfile(userId, email) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          user_id: userId,
          email,
          subscription_status: 'free'
        }
      ])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserProfile(userId) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateSubscriptionStatus(userId, status) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_status: status, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Symptom entries operations
export const symptomService = {
  async createSymptomEntry(userId, entry) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .insert([
        {
          user_id: userId,
          symptoms: entry.symptoms,
          details: entry.details,
          potential_diagnosis: entry.potentialDiagnosis,
          confidence_score: entry.confidenceScore
        }
      ])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserSymptomEntries(userId, limit = 50) {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },

  async getSymptomEntry(entryId) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .eq('entry_id', entryId)
      .single()
    
    if (error) throw error
    return data
  },

  async deleteSymptomEntry(entryId) {
    if (!supabase) return null
    
    const { error } = await supabase
      .from('symptom_entries')
      .delete()
      .eq('entry_id', entryId)
    
    if (error) throw error
    return true
  }
}

// Health recommendations operations
export const recommendationService = {
  async createRecommendation(userId, recommendation) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('health_recommendations')
      .insert([
        {
          user_id: userId,
          recommendation_text: recommendation.text,
          type: recommendation.type
        }
      ])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserRecommendations(userId, limit = 20) {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('health_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },

  async deleteRecommendation(recommendationId) {
    if (!supabase) return null
    
    const { error } = await supabase
      .from('health_recommendations')
      .delete()
      .eq('recommendation_id', recommendationId)
    
    if (error) throw error
    return true
  }
}

// Analytics and pattern analysis
export const analyticsService = {
  async getSymptomPatterns(userId, days = 30) {
    if (!supabase) return []
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('symptoms, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Analyze patterns
    const symptomCounts = {}
    const symptomDates = {}
    
    data.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        const normalizedSymptom = symptom.toLowerCase().trim()
        symptomCounts[normalizedSymptom] = (symptomCounts[normalizedSymptom] || 0) + 1
        
        if (!symptomDates[normalizedSymptom]) {
          symptomDates[normalizedSymptom] = []
        }
        symptomDates[normalizedSymptom].push(new Date(entry.created_at))
      })
    })
    
    // Find recurring patterns
    const patterns = Object.entries(symptomCounts)
      .filter(([_, count]) => count >= 2)
      .map(([symptom, count]) => {
        const dates = symptomDates[symptom]
        const daysBetween = dates.length > 1 
          ? Math.abs(dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24)
          : 0
        
        return {
          symptom,
          frequency: count,
          trend: count >= 3 ? 'increasing' : 'recurring',
          averageDaysBetween: daysBetween / (dates.length - 1) || 0,
          lastOccurrence: dates[0],
          totalOccurrences: count
        }
      })
      .sort((a, b) => b.frequency - a.frequency)
    
    return patterns
  },

  async getHealthInsights(userId) {
    if (!supabase) return null
    
    const patterns = await this.getSymptomPatterns(userId)
    const entries = await symptomService.getUserSymptomEntries(userId, 10)
    
    const insights = {
      totalEntries: entries.length,
      recurringSymptoms: patterns.filter(p => p.frequency >= 3).length,
      averageConfidenceScore: entries.reduce((sum, entry) => sum + (entry.confidence_score || 0), 0) / entries.length || 0,
      mostCommonSymptoms: patterns.slice(0, 5),
      recentTrends: this.analyzeTrends(entries),
      riskFactors: this.identifyRiskFactors(patterns)
    }
    
    return insights
  },

  analyzeTrends(entries) {
    if (entries.length < 2) return []
    
    const recentEntries = entries.slice(0, 5)
    const olderEntries = entries.slice(5, 10)
    
    const recentSymptoms = new Set()
    const olderSymptoms = new Set()
    
    recentEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => recentSymptoms.add(symptom.toLowerCase()))
    })
    
    olderEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => olderSymptoms.add(symptom.toLowerCase()))
    })
    
    const newSymptoms = [...recentSymptoms].filter(s => !olderSymptoms.has(s))
    const improvedSymptoms = [...olderSymptoms].filter(s => !recentSymptoms.has(s))
    
    return {
      newSymptoms,
      improvedSymptoms,
      persistentSymptoms: [...recentSymptoms].filter(s => olderSymptoms.has(s))
    }
  },

  identifyRiskFactors(patterns) {
    const riskFactors = []
    
    // High frequency symptoms
    const highFrequencySymptoms = patterns.filter(p => p.frequency >= 5)
    if (highFrequencySymptoms.length > 0) {
      riskFactors.push({
        type: 'high_frequency',
        description: 'Multiple recurring symptoms detected',
        symptoms: highFrequencySymptoms.map(p => p.symptom),
        severity: 'medium'
      })
    }
    
    // Concerning symptom combinations
    const concerningSymptoms = ['chest pain', 'shortness of breath', 'severe headache', 'high fever']
    const presentConcerningSymptoms = patterns.filter(p => 
      concerningSymptoms.some(cs => p.symptom.includes(cs))
    )
    
    if (presentConcerningSymptoms.length > 0) {
      riskFactors.push({
        type: 'concerning_symptoms',
        description: 'Potentially serious symptoms detected',
        symptoms: presentConcerningSymptoms.map(p => p.symptom),
        severity: 'high'
      })
    }
    
    return riskFactors
  }
}

export default supabase
