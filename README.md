# 🏐 Volleyball Tracker - Frontend

A modern, responsive web application for tracking volleyball match scores with real-time scoring and professional volleyball rules implementation.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://volleyball-tracker-frontend.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github)](https://github.com/Terry7788/volleyball-tracker-frontend)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Scoring**: Live match tracking with instant updates
- **Professional Rules**: Official volleyball scoring (best of 5 sets, first to 25/15)
- **Match Management**: Create, pause, resume, and complete matches
- **Set History**: View and edit completed sets
- **Undo System**: Mistake-proof scoring with undo functionality

### 👥 User Experience
- **Guest Mode**: Start playing immediately without registration
- **User Accounts**: Save matches permanently with registration
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Theme**: Modern, eye-friendly interface
- **Landscape Mode**: Full-screen scoring for mobile devices

### 🎨 Design
- **Material-UI Components**: Clean, professional interface
- **Custom Volleyball Theme**: Green/red team colors with dark background
- **Mobile-First**: Touch-friendly controls and responsive layouts
- **Accessibility**: WCAG compliant with proper contrast ratios

## 🚀 Live Demo

**Frontend**: [volleyball-tracker-frontend.vercel.app](https://volleyball-tracker-frontend.vercel.app)

Try it now:
1. Click "New Match" to create a game
2. Enter team names and start scoring
3. Experience the responsive design on different devices

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features

### UI & Styling
- **Material-UI (MUI) v5** - Component library
- **Custom Theme** - Volleyball-specific color scheme
- **Responsive Design** - Mobile-first approach
- **Google Fonts (Roboto)** - Typography

### State Management
- **React Context** - Authentication and app state
- **React Hooks** - Local component state
- **Custom Hooks** - Reusable logic

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vercel** - Deployment and hosting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Terry7788/volleyball-tracker-frontend.git
   cd volleyball-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp .env.production .env.local
   
   # Edit the API URL for local development
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AuthModal.tsx      # Login/Register modal
│   ├── CreateMatch.tsx    # Match creation dialog
│   ├── EditSet.tsx        # Set editing functionality
│   ├── ScoreBoard.tsx     # Main scoring display
│   ├── ScoreControls.tsx  # Scoring buttons
│   └── UserMenu.tsx       # User authentication menu
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state
├── services/              # API services
│   ├── authService.ts     # Authentication API
│   └── matchService.ts    # Match management API
├── theme/                 # MUI theme configuration
│   └── theme.ts          # Custom volleyball theme
└── types/                 # TypeScript definitions
    └── match.ts          # Match data types
```

## 🎮 How to Use

### Quick Start (Guest Mode)
1. Open the app
2. Click "New Match"
3. Enter team names
4. Start scoring by clicking "+1 [Team Name]"

### With Account
1. Click the user icon → "Create Account"
2. Register with username, email, and password
3. Your matches will be saved permanently
4. Access match history and statistics

### Scoring Rules
- **Regular Sets (1-4)**: First to 25 points, win by 2
- **Deciding Set (5)**: First to 15 points, win by 2
- **Match**: Best of 5 sets (first to win 3 sets)

### Features
- **Undo**: Remove the last point scored
- **Reset Set**: Start current set over at 0-0
- **Edit Sets**: Modify completed set scores
- **Match History**: View all previous matches

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://api.example.com/api` |

### Customization

**Theme Colors** (`src/theme/theme.ts`):
```typescript
primary: {
  main: '#22c55e', // Team 1 color (green)
},
secondary: {
  main: '#ef4444', // Team 2 color (red)
}
```

## 📱 Mobile Experience

### Responsive Features
- **Portrait Mode**: Stacked team layout with large scores
- **Landscape Mode**: Side-by-side layout, full-screen scoring
- **Touch-Friendly**: Large buttons optimized for fingers
- **Swipe Navigation**: Easy match switching on mobile

### Progressive Web App (PWA) Ready
- Installable on mobile devices
- Offline-capable (future enhancement)
- Native app-like experience

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub**
   - Fork this repository
   - Import to Vercel
   - Auto-deploys on push to main

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   ```

3. **Deploy**
   - Automatic deployments
   - Preview deployments for PRs
   - Edge network distribution

### Alternative Platforms
- **Netlify**: Zero-config Next.js support
- **Railway**: Full-stack deployment
- **AWS Amplify**: Enterprise-grade hosting

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Use TypeScript for all new code
- Follow Material-UI design patterns
- Ensure mobile responsiveness
- Add proper error handling
- Update tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI Team** - For the excellent component library
- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment and hosting
- **Volleyball Community** - For inspiration and rules guidance

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Terry7788/volleyball-tracker-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Terry7788/volleyball-tracker-frontend/discussions)


---

**Built with ❤️ for volleyball enthusiasts worldwide** 🏐