import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'

// Initialize Stripe
let stripePromise = null
if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey)
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Basic symptom triage',
      'Up to 5 symptom entries per month',
      'Basic health insights',
      'Community support'
    ],
    limits: {
      monthlyEntries: 5,
      patternAnalysis: false,
      personalizedRecommendations: false,
      advancedInsights: false
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 5,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited symptom entries',
      'Advanced pattern identification',
      'Personalized health recommendations',
      'Proactive health forecasting',
      'Priority support',
      'Export health data',
      'Advanced analytics dashboard'
    ],
    limits: {
      monthlyEntries: -1, // Unlimited
      patternAnalysis: true,
      personalizedRecommendations: true,
      advancedInsights: true
    }
  }
}

// Stripe service functions
export const stripeService = {
  async getStripe() {
    if (!stripePromise) {
      throw new Error('Stripe not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.')
    }
    return await stripePromise
  },

  async createCheckoutSession(priceId, userId, userEmail) {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll simulate the checkout process
      if (!stripePublishableKey) {
        throw new Error('Stripe not configured')
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
          successUrl: `${appUrl}/subscription/success`,
          cancelUrl: `${appUrl}/subscription/cancel`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json()
      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  },

  async redirectToCheckout(sessionId) {
    try {
      const stripe = await this.getStripe()
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      throw error
    }
  },

  async createSubscription(userId, priceId, userEmail) {
    try {
      const session = await this.createCheckoutSession(priceId, userId, userEmail)
      await this.redirectToCheckout(session.id)
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  },

  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      return await response.json()
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  },

  async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting subscription status:', error)
      throw error
    }
  },

  // Demo mode functions (when Stripe is not configured)
  simulateUpgrade(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful upgrade
        const mockSubscription = {
          id: `sub_demo_${Date.now()}`,
          status: 'active',
          plan: SUBSCRIPTION_PLANS.PREMIUM,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          cancelAtPeriodEnd: false
        }
        resolve(mockSubscription)
      }, 1000)
    })
  },

  simulateCancel() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'canceled' })
      }, 500)
    })
  }
}

// Utility functions
export const subscriptionUtils = {
  getPlanById(planId) {
    return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId) || SUBSCRIPTION_PLANS.FREE
  },

  canAccessFeature(userPlan, feature) {
    const plan = this.getPlanById(userPlan)
    return plan.limits[feature] === true || plan.limits[feature] === -1
  },

  getRemainingEntries(userPlan, usedEntries) {
    const plan = this.getPlanById(userPlan)
    if (plan.limits.monthlyEntries === -1) return -1 // Unlimited
    return Math.max(0, plan.limits.monthlyEntries - usedEntries)
  },

  isFeatureLimited(userPlan, feature) {
    const plan = this.getPlanById(userPlan)
    return !plan.limits[feature]
  },

  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  },

  getUpgradeMessage(feature) {
    const messages = {
      patternAnalysis: 'Upgrade to Premium to unlock advanced pattern identification and track recurring symptoms over time.',
      personalizedRecommendations: 'Get personalized health recommendations based on your symptom history with Premium.',
      advancedInsights: 'Access detailed health analytics and proactive forecasting with Premium.',
      monthlyEntries: 'You\'ve reached your monthly limit. Upgrade to Premium for unlimited symptom entries.'
    }
    
    return messages[feature] || 'Upgrade to Premium to unlock this feature.'
  }
}

// Webhook handler utilities (for backend implementation)
export const webhookUtils = {
  // These would be implemented on your backend
  handleCheckoutCompleted(session) {
    // Update user subscription status in database
    console.log('Checkout completed:', session)
  },

  handleSubscriptionUpdated(subscription) {
    // Update subscription details in database
    console.log('Subscription updated:', subscription)
  },

  handleSubscriptionDeleted(subscription) {
    // Handle subscription cancellation
    console.log('Subscription deleted:', subscription)
  },

  handleInvoicePaymentSucceeded(invoice) {
    // Handle successful payment
    console.log('Payment succeeded:', invoice)
  },

  handleInvoicePaymentFailed(invoice) {
    // Handle failed payment
    console.log('Payment failed:', invoice)
  }
}

export default stripeService
