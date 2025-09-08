import React, { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services/supabaseService'
import { subscriptionUtils } from '../services/stripeService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)
      
      // Try to get current user from Supabase
      const currentUser = await userService.getCurrentUser()
      
      if (currentUser) {
        // User is authenticated with Supabase
        setUser(currentUser)
        setIsAuthenticated(true)
        
        // Get user profile
        const profile = await userService.getUserProfile(currentUser.id)
        setUserProfile(profile)
      } else {
        // Check for demo user in localStorage
        const demoUserData = localStorage.getItem('symptomsense_user')
        if (demoUserData) {
          const demoUser = JSON.parse(demoUserData)
          setUser(demoUser)
          setUserProfile(demoUser)
          setIsAuthenticated(true)
        } else {
          // Create demo user for development
          await createDemoUser()
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      // Fallback to demo mode
      await createDemoUser()
    } finally {
      setLoading(false)
    }
  }

  const createDemoUser = async () => {
    const demoUser = {
      id: 'demo-user-1',
      userId: 'demo-user-1',
      email: 'demo@symptomsense.ai',
      createdAt: new Date().toISOString(),
      subscriptionStatus: 'free',
      isDemo: true
    }
    
    localStorage.setItem('symptomsense_user', JSON.stringify(demoUser))
    setUser(demoUser)
    setUserProfile(demoUser)
    setIsAuthenticated(true)
  }

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      const { user: newUser } = await userService.signUp(email, password)
      
      if (newUser) {
        setUser(newUser)
        setIsAuthenticated(true)
        
        // Get the created profile
        const profile = await userService.getUserProfile(newUser.id)
        setUserProfile(profile)
        
        toast.success('Account created successfully! Please check your email to verify your account.')
        return { user: newUser, error: null }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'Failed to create account')
      return { user: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { user: signedInUser } = await userService.signIn(email, password)
      
      if (signedInUser) {
        setUser(signedInUser)
        setIsAuthenticated(true)
        
        // Get user profile
        const profile = await userService.getUserProfile(signedInUser.id)
        setUserProfile(profile)
        
        toast.success('Welcome back!')
        return { user: signedInUser, error: null }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Failed to sign in')
      return { user: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      if (!user?.isDemo) {
        await userService.signOut()
      }
      
      // Clear local storage
      localStorage.removeItem('symptomsense_user')
      localStorage.removeItem('symptomsense_entries')
      localStorage.removeItem('symptomsense_recommendations')
      
      setUser(null)
      setUserProfile(null)
      setIsAuthenticated(false)
      
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const updateSubscription = async (newStatus) => {
    try {
      if (!user) return

      let updatedProfile
      
      if (user.isDemo) {
        // Update demo user in localStorage
        const updatedUser = { ...user, subscriptionStatus: newStatus }
        localStorage.setItem('symptomsense_user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setUserProfile(updatedUser)
        updatedProfile = updatedUser
      } else {
        // Update in Supabase
        updatedProfile = await userService.updateSubscriptionStatus(user.id, newStatus)
        setUserProfile(updatedProfile)
      }
      
      toast.success(`Subscription updated to ${newStatus}`)
      return updatedProfile
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast.error('Failed to update subscription')
      throw error
    }
  }

  const refreshUserProfile = async () => {
    try {
      if (!user) return null

      if (user.isDemo) {
        const demoUserData = localStorage.getItem('symptomsense_user')
        if (demoUserData) {
          const profile = JSON.parse(demoUserData)
          setUserProfile(profile)
          return profile
        }
      } else {
        const profile = await userService.getUserProfile(user.id)
        setUserProfile(profile)
        return profile
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error)
      return null
    }
  }

  // Subscription helper functions
  const canAccessFeature = (feature) => {
    if (!userProfile) return false
    return subscriptionUtils.canAccessFeature(userProfile.subscriptionStatus || 'free', feature)
  }

  const isFeatureLimited = (feature) => {
    if (!userProfile) return true
    return subscriptionUtils.isFeatureLimited(userProfile.subscriptionStatus || 'free', feature)
  }

  const getUpgradeMessage = (feature) => {
    return subscriptionUtils.getUpgradeMessage(feature)
  }

  const isPremium = () => {
    return userProfile?.subscriptionStatus === 'premium'
  }

  const isFree = () => {
    return !userProfile || userProfile.subscriptionStatus === 'free'
  }

  const value = {
    // User state
    user,
    userProfile,
    loading,
    isAuthenticated,
    
    // Auth methods
    signUp,
    signIn,
    signOut,
    
    // Profile methods
    updateSubscription,
    refreshUserProfile,
    
    // Subscription helpers
    canAccessFeature,
    isFeatureLimited,
    getUpgradeMessage,
    isPremium,
    isFree,
    
    // User info helpers
    getUserId: () => user?.id || user?.userId,
    getUserEmail: () => user?.email,
    getSubscriptionStatus: () => userProfile?.subscriptionStatus || 'free',
    isDemo: () => user?.isDemo === true
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
