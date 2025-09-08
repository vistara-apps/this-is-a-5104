# SymptomSense AI - API Documentation

## Overview

SymptomSense AI provides a comprehensive API for health symptom analysis, pattern identification, and personalized health recommendations. The application integrates with multiple services to deliver a complete health tracking experience.

## Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Notifications**: React Hot Toast

### Backend Services
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth
- **AI Processing**: OpenAI API (via OpenRouter)
- **Payments**: Stripe
- **File Storage**: Supabase Storage (for future features)

## API Endpoints

### Authentication Endpoints

#### Sign Up
```javascript
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### Sign In
```javascript
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "user": { ... },
  "session": { ... }
}
```

#### Sign Out
```javascript
POST /auth/signout
Authorization: Bearer <access_token>

Response: 204 No Content
```

### User Management

#### Get User Profile
```javascript
GET /api/users/{userId}
Authorization: Bearer <access_token>

Response:
{
  "user_id": "uuid",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z",
  "subscription_status": "free|premium",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update Subscription Status
```javascript
PUT /api/users/{userId}/subscription
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "subscription_status": "premium"
}

Response:
{
  "user_id": "uuid",
  "subscription_status": "premium",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Symptom Entries

#### Create Symptom Entry
```javascript
POST /api/symptom-entries
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "symptoms": ["headache", "fatigue", "nausea"],
  "details": "Started this morning, mild intensity",
  "potential_diagnosis": {
    "conditions": ["Common cold", "Stress"],
    "confidence": 0.75
  },
  "confidence_score": 0.75
}

Response:
{
  "entry_id": "uuid",
  "user_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z",
  "symptoms": ["headache", "fatigue", "nausea"],
  "details": "Started this morning, mild intensity",
  "potential_diagnosis": { ... },
  "confidence_score": 0.75,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Get User Symptom Entries
```javascript
GET /api/symptom-entries?user_id={userId}&limit=50
Authorization: Bearer <access_token>

Response:
{
  "entries": [
    {
      "entry_id": "uuid",
      "user_id": "uuid",
      "timestamp": "2024-01-01T00:00:00Z",
      "symptoms": ["headache", "fatigue"],
      "details": "...",
      "potential_diagnosis": { ... },
      "confidence_score": 0.75,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 50
}
```

#### Get Symptom Entry
```javascript
GET /api/symptom-entries/{entryId}
Authorization: Bearer <access_token>

Response:
{
  "entry_id": "uuid",
  "user_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z",
  "symptoms": ["headache", "fatigue"],
  "details": "...",
  "potential_diagnosis": { ... },
  "confidence_score": 0.75,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Delete Symptom Entry
```javascript
DELETE /api/symptom-entries/{entryId}
Authorization: Bearer <access_token>

Response: 204 No Content
```

### Health Recommendations

#### Create Recommendation
```javascript
POST /api/recommendations
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "recommendation_text": "Consider increasing water intake to 8 glasses per day",
  "type": "Lifestyle"
}

Response:
{
  "recommendation_id": "uuid",
  "user_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z",
  "recommendation_text": "Consider increasing water intake to 8 glasses per day",
  "type": "Lifestyle",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Get User Recommendations
```javascript
GET /api/recommendations?user_id={userId}&limit=20
Authorization: Bearer <access_token>

Response:
{
  "recommendations": [
    {
      "recommendation_id": "uuid",
      "user_id": "uuid",
      "timestamp": "2024-01-01T00:00:00Z",
      "recommendation_text": "...",
      "type": "Lifestyle",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

### Analytics & Patterns

#### Get Symptom Patterns
```javascript
GET /api/analytics/patterns?user_id={userId}&days=30
Authorization: Bearer <access_token>

Response:
{
  "patterns": [
    {
      "symptom": "headache",
      "frequency": 5,
      "trend": "increasing",
      "average_days_between": 3.2,
      "last_occurrence": "2024-01-01T00:00:00Z",
      "total_occurrences": 5
    }
  ],
  "analysis_period": 30,
  "total_entries": 25
}
```

#### Get Health Insights
```javascript
GET /api/analytics/insights?user_id={userId}
Authorization: Bearer <access_token>

Response:
{
  "total_entries": 25,
  "recurring_symptoms": 3,
  "average_confidence_score": 0.78,
  "most_common_symptoms": [
    {
      "symptom": "headache",
      "frequency": 8,
      "trend": "stable"
    }
  ],
  "recent_trends": {
    "new_symptoms": ["dizziness"],
    "improved_symptoms": ["nausea"],
    "persistent_symptoms": ["headache", "fatigue"]
  },
  "risk_factors": [
    {
      "type": "high_frequency",
      "description": "Multiple recurring symptoms detected",
      "symptoms": ["headache", "fatigue"],
      "severity": "medium"
    }
  ]
}
```

### AI Analysis

#### Analyze Symptoms
```javascript
POST /api/ai/analyze
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "symptoms": ["headache", "fatigue", "nausea"],
  "details": "Started this morning after poor sleep",
  "user_history": [
    {
      "symptoms": ["headache"],
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}

Response:
{
  "analysis": {
    "explanation": "Based on your symptoms and history...",
    "possible_conditions": [
      {
        "condition": "Tension headache",
        "probability": 0.75,
        "description": "Common type of headache..."
      }
    ],
    "urgency_level": "low",
    "confidence_score": 0.78,
    "key_insights": [
      "Symptoms appear to be stress-related",
      "Pattern suggests tension headaches"
    ],
    "recommended_actions": [
      "Rest and hydration",
      "Monitor symptoms",
      "Consider stress management"
    ]
  },
  "recommendations": [
    {
      "text": "Get adequate sleep (7-9 hours)",
      "type": "Lifestyle",
      "priority": "high"
    }
  ]
}
```

### Subscription Management

#### Create Checkout Session
```javascript
POST /api/stripe/create-checkout-session
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "price_id": "price_premium_monthly",
  "user_id": "uuid",
  "user_email": "user@example.com",
  "success_url": "https://app.com/subscription/success",
  "cancel_url": "https://app.com/subscription/cancel"
}

Response:
{
  "session_id": "cs_stripe_session_id",
  "url": "https://checkout.stripe.com/pay/cs_..."
}
```

#### Get Subscription Status
```javascript
GET /api/stripe/subscription-status/{userId}
Authorization: Bearer <access_token>

Response:
{
  "subscription": {
    "id": "sub_stripe_id",
    "status": "active",
    "current_period_end": "2024-02-01T00:00:00Z",
    "cancel_at_period_end": false,
    "plan": {
      "id": "premium",
      "name": "Premium",
      "price": 5.00
    }
  }
}
```

#### Cancel Subscription
```javascript
POST /api/stripe/cancel-subscription
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "subscription_id": "sub_stripe_id"
}

Response:
{
  "subscription": {
    "id": "sub_stripe_id",
    "status": "canceled",
    "canceled_at": "2024-01-01T00:00:00Z"
  }
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status VARCHAR(50) DEFAULT 'free',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Symptom Entries Table
```sql
CREATE TABLE symptom_entries (
  entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  symptoms TEXT[] NOT NULL,
  details TEXT,
  potential_diagnosis JSONB,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Health Recommendations Table
```sql
CREATE TABLE health_recommendations (
  recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recommendation_text TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling

### Standard Error Response
```javascript
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": "Specific error details here"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "request_id": "uuid"
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `INVALID_REQUEST` (400): Malformed request
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error
- `SERVICE_UNAVAILABLE` (503): External service unavailable

## Rate Limiting

### Free Tier Limits
- Symptom entries: 5 per month
- AI analysis requests: 10 per month
- Pattern analysis: Basic only

### Premium Tier Limits
- Symptom entries: Unlimited
- AI analysis requests: 1000 per month
- Pattern analysis: Advanced features enabled
- API requests: 10,000 per month

## Authentication

### JWT Token Structure
```javascript
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "subscription": "free|premium",
  "iat": 1640995200,
  "exp": 1640998800
}
```

### Required Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Webhooks

### Stripe Webhooks
```javascript
POST /api/webhooks/stripe
Content-Type: application/json
Stripe-Signature: signature

{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_session_id",
      "customer_email": "user@example.com",
      "subscription": "sub_id"
    }
  }
}
```

### Supported Webhook Events
- `checkout.session.completed`: Subscription created
- `invoice.payment_succeeded`: Payment successful
- `invoice.payment_failed`: Payment failed
- `customer.subscription.updated`: Subscription modified
- `customer.subscription.deleted`: Subscription canceled

## SDK Examples

### JavaScript/TypeScript
```javascript
import { SymptomSenseClient } from '@symptomsense/sdk'

const client = new SymptomSenseClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.symptomsense.ai'
})

// Analyze symptoms
const analysis = await client.analyzeSymptoms({
  symptoms: ['headache', 'fatigue'],
  details: 'Started this morning'
})

// Get user patterns
const patterns = await client.getSymptomPatterns({
  userId: 'user-id',
  days: 30
})
```

### Python
```python
from symptomsense import SymptomSenseClient

client = SymptomSenseClient(
    api_key='your-api-key',
    base_url='https://api.symptomsense.ai'
)

# Analyze symptoms
analysis = client.analyze_symptoms(
    symptoms=['headache', 'fatigue'],
    details='Started this morning'
)

# Get user patterns
patterns = client.get_symptom_patterns(
    user_id='user-id',
    days=30
)
```

## Environment Variables

### Required
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI/OpenRouter
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=https://your-app-domain.com
```

### Optional
```bash
# Analytics
VITE_ANALYTICS_ID=your_analytics_id

# Monitoring
VITE_SENTRY_DSN=your_sentry_dsn

# Feature Flags
VITE_ENABLE_BETA_FEATURES=true
```

## Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Stripe webhooks configured
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Rate limiting configured
- [ ] Security headers configured

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Support

For API support and questions:
- Documentation: https://docs.symptomsense.ai
- Support Email: support@symptomsense.ai
- Status Page: https://status.symptomsense.ai
- GitHub Issues: https://github.com/symptomsense/api/issues
