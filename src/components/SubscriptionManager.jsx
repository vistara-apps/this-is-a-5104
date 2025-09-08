import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { stripeService, SUBSCRIPTION_PLANS, subscriptionUtils } from '../services/stripeService'
import Button from './Button'
import { Crown, Check, X, Loader2, CreditCard, Shield, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const SubscriptionManager = ({ onClose }) => {
  const { userProfile, updateSubscription, getUserId, getUserEmail, isPremium, isDemo } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true)
      setSelectedPlan(planId)

      const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()]
      if (!plan) {
        throw new Error('Invalid plan selected')
      }

      if (isDemo()) {
        // Demo mode - simulate upgrade
        await stripeService.simulateUpgrade(getUserId())
        await updateSubscription('premium')
        toast.success('🎉 Upgraded to Premium! (Demo Mode)')
        onClose?.()
      } else {
        // Real Stripe integration
        await stripeService.createSubscription(
          getUserId(),
          plan.priceId,
          getUserEmail()
        )
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      if (error.message.includes('Stripe not configured')) {
        // Fallback to demo mode
        try {
          await stripeService.simulateUpgrade(getUserId())
          await updateSubscription('premium')
          toast.success('🎉 Upgraded to Premium! (Demo Mode)')
          onClose?.()
        } catch (demoError) {
          toast.error('Failed to upgrade subscription')
        }
      } else {
        toast.error(error.message || 'Failed to upgrade subscription')
      }
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  const handleCancel = async () => {
    try {
      setLoading(true)

      if (isDemo()) {
        // Demo mode - simulate cancellation
        await stripeService.simulateCancel()
        await updateSubscription('free')
        toast.success('Subscription canceled (Demo Mode)')
        onClose?.()
      } else {
        // Real cancellation would require subscription ID
        toast.error('Cancellation not implemented in demo')
      }
    } catch (error) {
      console.error('Cancel error:', error)
      toast.error('Failed to cancel subscription')
    } finally {
      setLoading(false)
    }
  }

  const PlanCard = ({ plan, isCurrentPlan, isPopular }) => (
    <div className={`relative bg-surface rounded-lg p-6 shadow-card border-2 transition-all duration-200 ${
      isCurrentPlan 
        ? 'border-primary bg-primary/5' 
        : isPopular 
          ? 'border-accent' 
          : 'border-transparent hover:border-primary/30'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            Current Plan
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-text-primary">
            {subscriptionUtils.formatPrice(plan.price)}
          </span>
          {plan.price > 0 && (
            <span className="text-text-secondary">/month</span>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        {isCurrentPlan ? (
          <>
            {plan.id === 'premium' && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCancel}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Cancel Subscription
              </Button>
            )}
            <div className="text-center text-sm text-text-secondary">
              You're currently on this plan
            </div>
          </>
        ) : (
          <Button
            variant={isPopular ? "primary" : "secondary"}
            className="w-full"
            onClick={() => handleUpgrade(plan.id)}
            disabled={loading || plan.price === 0}
          >
            {loading && selectedPlan === plan.id ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            {plan.price === 0 ? 'Current Plan' : 'Upgrade Now'}
          </Button>
        )}
      </div>
    </div>
  )

  const currentPlan = userProfile?.subscriptionStatus || 'free'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-surface">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Choose Your Plan</h2>
              <p className="text-text-secondary mt-2">
                Unlock advanced health insights and personalized recommendations
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Advanced Analysis</h3>
              <p className="text-sm text-text-secondary">
                Get deeper insights into your health patterns with AI-powered analysis
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Unlimited Entries</h3>
              <p className="text-sm text-text-secondary">
                Track as many symptoms as you need without any restrictions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Premium Support</h3>
              <p className="text-sm text-text-secondary">
                Get priority support and access to exclusive health resources
              </p>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PlanCard
              plan={SUBSCRIPTION_PLANS.FREE}
              isCurrentPlan={currentPlan === 'free'}
              isPopular={false}
            />
            <PlanCard
              plan={SUBSCRIPTION_PLANS.PREMIUM}
              isCurrentPlan={currentPlan === 'premium'}
              isPopular={true}
            />
          </div>

          {/* Demo Notice */}
          {isDemo() && (
            <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-accent mr-2" />
                <span className="font-medium text-accent">Demo Mode</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                You're currently in demo mode. Subscription changes will be simulated for testing purposes.
                In production, this would integrate with real Stripe payments.
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            <p>
              🔒 Secure payments powered by Stripe. Cancel anytime.
              {isDemo() && ' (Demo mode - no real charges)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager
