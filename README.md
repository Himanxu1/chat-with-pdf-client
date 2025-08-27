# PDF Chat Assistant - Modern UI

A modern, clean chat interface for interacting with PDF documents using AI. Built with Next.js, shadcn/ui, and TypeScript.

## Features

### 🎨 Modern Design
- **Clean & Professional UI**: Built with shadcn/ui components
- **Gradient Accents**: Beautiful blue-to-purple gradients throughout the interface
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Smooth Animations**: Subtle animations and transitions for better UX

### 💬 Chat Interface
- **Real-time Messaging**: Instant message display with typing indicators
- **Message History**: Persistent conversation history with timestamps
- **Avatar System**: Distinct avatars for user and AI messages
- **Auto-scroll**: Automatic scrolling to latest message
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines

### 📁 File Upload
- **Drag & Drop**: Easy PDF file upload with visual feedback
- **Progress Indicators**: Loading states and success notifications
- **File Validation**: PDF format validation and error handling

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Built with React 19 and Next.js 15
- **API Integration**: Seamless integration with the backend chat API
- **Error Handling**: Graceful error handling with user-friendly messages

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS v4

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**: Navigate to `http://localhost:3000`

## API Integration

The application integrates with the backend API at `http://localhost:3001`:

- **POST /pdf/upload**: Upload PDF documents
- **POST /chat**: Send chat messages and receive AI responses

## Component Structure

```
app/
├── components/
│   ├── ChatInterface.tsx      # Main chat component
│   ├── FileUpload.tsx         # PDF upload component
│   └── LoadingSpinner.tsx     # Reusable loading component
├── page.tsx                   # Main page layout
└── globals.css               # Global styles and CSS variables
```

## Design System

### Colors
- **Primary**: Blue to Purple gradients (`from-blue-600 to-purple-600`)
- **Background**: Light slate gradients (`from-slate-50 to-slate-100`)
- **Cards**: White with backdrop blur (`bg-white/80 backdrop-blur-sm`)

### Typography
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable fonts with proper spacing
- **Messages**: Optimized for readability with proper line height

### Spacing
- **Consistent**: Using Tailwind's spacing scale
- **Responsive**: Adapts to different screen sizes
- **Comfortable**: Generous padding and margins for better UX

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Implement proper error handling
4. Test on different screen sizes
5. Ensure accessibility standards are met

## License

This project is part of the PDF Chat Assistant application. 