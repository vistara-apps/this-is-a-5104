# SymptomSense AI

<div align="center">
  <img src="https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=SymptomSense+AI" alt="SymptomSense AI Logo" width="200" height="200">
  
  **Understand your symptoms, predict your health.**
  
  An AI-powered web application that provides initial health diagnoses based on user-reported symptoms and offers personalized health recommendations.

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
</div>

## 🌟 Features

### Core Features
- **🤖 Symptom Triage Bot**: Conversational AI that takes user-inputted symptoms and provides potential causes and initial diagnostic information
- **📊 Symptom Pattern Identifier**: Analyzes historical symptom data to identify potential underlying chronic conditions or recurring health trends
- **💡 Personalized Health Recommendations**: Offers tailored lifestyle, dietary, and treatment suggestions based on AI analysis

### Premium Features
- **📈 Advanced Analytics Dashboard**: Comprehensive health insights with interactive charts and trend analysis
- **🔍 Pattern Recognition**: Advanced AI-powered pattern identification for chronic conditions
- **⚡ Unlimited Symptom Entries**: Track as many symptoms as needed without restrictions
- **🎯 Proactive Health Forecasting**: Predictive insights for potential health issues
- **📱 Priority Support**: Get help when you need it most

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system tokens
- **State Management**: React Context API for global state
- **Routing**: React Router DOM for navigation
- **Charts**: Recharts for data visualization
- **Notifications**: React Hot Toast for user feedback

### Backend Services
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with JWT tokens
- **AI Processing**: OpenAI API for symptom analysis
- **Payments**: Stripe for subscription management
- **Storage**: Supabase Storage for future file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5104.git
   cd this-is-a-5104
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```bash
   # OpenAI API Configuration
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Configuration (optional for demo mode)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Stripe Configuration (optional for demo mode)
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # App Configuration
   VITE_APP_URL=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Demo Mode

The app works perfectly in **demo mode** without any API keys! It includes:
- ✅ Simulated AI responses for symptom analysis
- ✅ Mock user authentication and profiles
- ✅ Sample data for testing all features
- ✅ Subscription simulation for premium features

Perfect for development, testing, and demonstrations.

## 🔧 Configuration

### Required Environment Variables
```bash
# Minimum required for basic functionality
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Optional Environment Variables
```bash
# For full production functionality
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_APP_URL=https://your-domain.com
```

### Service Setup

#### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema from `src/services/supabaseService.js`
3. Configure Row Level Security (RLS) policies
4. Add your project URL and anon key to `.env`

#### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create product and price IDs for subscription plans
3. Set up webhooks for subscription events
4. Add your publishable key to `.env`

#### OpenAI Setup
1. Get an API key from [OpenAI](https://platform.openai.com) or [OpenRouter](https://openrouter.ai)
2. Add your API key to `.env`

## 📱 Usage

### For Users
1. **Sign Up/Sign In**: Create an account or use demo mode
2. **Check Symptoms**: Describe your symptoms in natural language
3. **View Analysis**: Get AI-powered insights and recommendations
4. **Track Patterns**: Monitor recurring symptoms over time
5. **Upgrade to Premium**: Unlock advanced analytics and unlimited entries

### For Developers
1. **Explore the Code**: Well-structured React components with TypeScript support
2. **Customize Design**: Modify Tailwind config for your brand
3. **Extend Features**: Add new AI models or health data sources
4. **Deploy**: Use the included Docker configuration

## 🏢 Business Model

### Freemium Subscription Model
- **Free Tier**: Basic symptom triage, up to 5 entries/month
- **Premium Tier**: $5/month for unlimited entries, advanced analytics, and priority support

### Revenue Streams
- Monthly subscriptions
- Annual subscription discounts
- Enterprise plans for healthcare providers
- API access for third-party integrations

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Project Structure
```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main app layout
│   ├── Dashboard.jsx   # User dashboard
│   ├── SymptomChecker.jsx
│   └── AnalyticsDashboard.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── DataContext.jsx
├── services/           # API and external services
│   ├── aiService.js
│   ├── supabaseService.js
│   └── stripeService.js
├── styles/            # CSS and styling
└── utils/             # Utility functions
```

### Design System
The app uses a comprehensive design system with:
- **Colors**: Primary blue, accent red, dark theme
- **Typography**: Responsive text scales
- **Components**: Reusable UI components
- **Spacing**: Consistent spacing system
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t symptomsense-ai .

# Run the container
docker run -p 3000:3000 symptomsense-ai
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- User engagement tracking
- Symptom entry patterns
- Feature usage statistics
- Subscription conversion rates

### Health Insights
- Symptom frequency analysis
- Pattern recognition algorithms
- Risk factor identification
- Trend analysis over time

## 🔒 Security & Privacy

### Data Protection
- End-to-end encryption for sensitive data
- HIPAA-compliant data handling
- User data anonymization options
- Secure API communications

### Authentication
- JWT-based authentication
- Row-level security in database
- Session management
- Password encryption

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 API Documentation

Comprehensive API documentation is available in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md).

### Key Endpoints
- `POST /api/symptom-entries` - Create symptom entry
- `GET /api/analytics/patterns` - Get symptom patterns
- `POST /api/ai/analyze` - Analyze symptoms with AI
- `POST /api/stripe/create-checkout-session` - Create subscription

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Test Coverage
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for API endpoints
- E2E tests with Playwright

## 📈 Roadmap

### Version 2.0
- [ ] Mobile app (React Native)
- [ ] Wearable device integration
- [ ] Telemedicine consultations
- [ ] Multi-language support

### Version 3.0
- [ ] AI-powered health coaching
- [ ] Integration with EHR systems
- [ ] Advanced predictive analytics
- [ ] Healthcare provider dashboard

## 🆘 Support

### Getting Help
- 📖 [Documentation](docs/)
- 💬 [GitHub Discussions](https://github.com/vistara-apps/this-is-a-5104/discussions)
- 🐛 [Issue Tracker](https://github.com/vistara-apps/this-is-a-5104/issues)
- 📧 Email: support@symptomsense.ai

### FAQ

**Q: Is this a replacement for professional medical advice?**
A: No, SymptomSense AI is for informational purposes only and should not replace professional medical consultation.

**Q: How accurate is the AI analysis?**
A: Our AI provides preliminary insights based on symptom patterns. Always consult healthcare professionals for accurate diagnosis.

**Q: Is my health data secure?**
A: Yes, we use enterprise-grade security measures and comply with healthcare data protection standards.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing advanced AI capabilities
- Supabase for the excellent backend-as-a-service platform
- Stripe for secure payment processing
- The React and Tailwind CSS communities
- All contributors and beta testers

---

<div align="center">
  <p>Made with ❤️ for better health outcomes</p>
  <p>
    <a href="https://symptomsense.ai">Website</a> •
    <a href="https://docs.symptomsense.ai">Documentation</a> •
    <a href="https://github.com/vistara-apps/this-is-a-5104">GitHub</a>
  </p>
</div>
