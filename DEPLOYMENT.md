# Vercel Deployment Guide

This guide will help you deploy the React AI Chatbot to Vercel with chat streaming functionality.

## Prerequisites

1. **Google AI API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Git Repository**: Your project should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Project

The project is now fully configured for Vercel deployment with the following structure:

```
├── api/
│   ├── chat.js          # Serverless function for regular chat
│   └── chat-stream.js   # Serverless function for streaming chat
├── src/
│   ├── assistants/
│   │   └── vercel-ai.js # Vercel AI assistant class
│   └── ...              # React components
├── package.json
├── vite.config.js
└── vercel.json          # Vercel deployment configuration
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. **Import Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect it as a Vite project

2. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add the following variable:
     - **Name**: `GOOGLE_AI_API_KEY`
     - **Value**: Your Google AI API key
     - **Environment**: Production, Preview, Development

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add GOOGLE_AI_API_KEY
   ```

### 3. Configure Domain (Optional)

1. Go to your project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Configure DNS settings as instructed

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_AI_API_KEY` | Your Google AI API key | Yes |

## Project Structure

### API Routes (`/api/`)

- **`chat.js`**: Handles chat streaming with Google AI
  - Supports message history for context
  - Streams responses in real-time
  - Error handling and validation

### Frontend (`/src/`)

- **`assistants/vercel-ai.js`**: Client-side assistant class
  - Communicates with the serverless API
  - Handles streaming responses
  - Error handling

## Features

### ✅ Chat Streaming
- Real-time response streaming
- Smooth user experience
- No waiting for complete responses

### ✅ Message History
- Context-aware conversations
- Maintains chat history
- Better AI responses

### ✅ Error Handling
- Graceful error handling
- User-friendly error messages
- API key validation

### ✅ Mobile Responsive
- Optimized for mobile devices
- Touch-friendly interface
- Adaptive layout

### ✅ Theme Support
- Light/Dark mode
- System theme detection
- Persistent theme preferences

## Troubleshooting

### Common Issues

1. **API Key Not Found**:
   - Ensure `GOOGLE_AI_API_KEY` is set in Vercel environment variables
   - Check that the variable name is exactly as specified

2. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible (18+ recommended)

3. **Streaming Not Working**:
   - Verify the API route is accessible
   - Check browser console for errors
   - Ensure CORS is properly configured

4. **Mobile Layout Issues**:
   - Test on different screen sizes
   - Check CSS media queries
   - Verify viewport meta tag

### Debugging

1. **Check Vercel Logs**:
   - Go to your project dashboard
   - Navigate to Functions tab
   - Check function logs for errors

2. **Test API Endpoint**:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello", "history": []}'
   ```

3. **Browser Developer Tools**:
   - Check Network tab for API calls
   - Look for errors in Console tab
   - Test responsive design in Device toolbar

## Performance Optimization

### Build Optimization
- Vite automatically optimizes the build
- Code splitting for better loading
- Tree shaking removes unused code

### API Optimization
- Serverless functions scale automatically
- Cold start optimization
- Response streaming for better UX

### Frontend Optimization
- Lazy loading of components
- Optimized images and assets
- Efficient state management

## Security Considerations

1. **API Key Security**:
   - Never expose API keys in client-side code
   - Use environment variables
   - Rotate keys regularly

2. **Input Validation**:
   - Validate all user inputs
   - Sanitize messages before sending to AI
   - Implement rate limiting if needed

3. **CORS Configuration**:
   - Configure CORS for your domain
   - Restrict access to trusted origins

## Monitoring and Analytics

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Track user interactions
- Monitor API usage

### Error Tracking
- Set up error tracking (Sentry, LogRocket)
- Monitor API errors
- Track user experience issues

## Updates and Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Update API endpoints as needed

### Backup Strategy
- Regular database backups (if applicable)
- Version control for all changes
- Environment variable backups

## Support

For issues related to:
- **Vercel Deployment**: [Vercel Support](https://vercel.com/support)
- **Google AI API**: [Google AI Documentation](https://ai.google.dev/docs)
- **Project Issues**: Check the project repository

---

**Note**: This deployment guide assumes you're using the Google AI API. If you switch to a different AI provider, update the API endpoint and environment variables accordingly.
