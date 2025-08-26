# Multi-Model Chat Application

A sophisticated web application that enables round-table conversations with multiple Large Language Models (LLMs) simultaneously. Users can configure which models participate, assign them specific roles, and engage in dynamic multi-perspective discussions.

## Features

- **Multi-Model Conversations**: Chat with GPT-4 and Claude simultaneously
- **Role-Based Responses**: Assign roles like Devil's Advocate, Summarizer, Creative Thinker, etc.
- **Dynamic Participation**: Toggle models on/off during conversations
- **Session Management**: Save and revisit conversation transcripts
- **Color-Coded Interface**: Easily distinguish between different models
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## Setup

### Prerequisites

- Node.js 18+ and npm
- API keys for OpenAI and/or Anthropic (optional for demo mode)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` and add your API keys:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_APP_MODE=production
```

4. Start the development server:
```bash
npm run dev
```

## Usage

### Demo Mode
The application works out of the box with simulated responses. Set `VITE_APP_MODE=development` or leave API keys empty to use mock responses.

### Production Mode
Configure your API keys and set `VITE_APP_MODE=production` to use real LLM APIs.

### Available Roles

- **Neutral**: Balanced and objective responses
- **Devil's Advocate**: Challenges ideas and presents counterarguments
- **Summarizer**: Focuses on synthesizing key points
- **Creative Thinker**: Brings innovative perspectives
- **Analyst**: Systematic, data-driven analysis
- **Optimist**: Emphasizes positive aspects and possibilities

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **State Management**: React hooks with local storage persistence
- **API Integration**: Modular service layer supporting multiple LLM providers
- **Storage**: Browser localStorage for session persistence

## API Integration

The application supports:
- **OpenAI GPT-4**: Via OpenAI API
- **Anthropic Claude**: Via Anthropic API
- **Extensible**: Easy to add new model providers

## Security Notes

- API keys are stored in environment variables
- All API calls are made client-side (consider server-side proxy for production)
- Session data is stored locally in the browser

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details