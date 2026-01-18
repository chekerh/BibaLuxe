'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging and monitoring
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log structured error info for production monitoring
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    };
    
    // In production, this could be sent to an error tracking service like Sentry
    // For now, log to console in a structured format
    if (process.env.NODE_ENV === 'production') {
      console.error('Production Error Report:', JSON.stringify(errorReport, null, 2));
      // TODO: Send to error tracking service
      // Example: Sentry.captureException(error, { extra: errorReport });
    } else {
      console.error('Development Error Report:', errorReport);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try again or return to the homepage.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

