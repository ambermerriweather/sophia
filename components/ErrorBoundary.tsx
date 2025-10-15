import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Mascot } from './Mascot';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: Rewrote state initialization to use a constructor for broader compatibility, which can resolve obscure type errors regarding `this.props`.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-rose-50 p-4">
            <Card className="max-w-lg w-full text-center shadow-2xl border-red-300">
                <CardHeader>
                    <Mascot className="w-24 h-24 mx-auto" />
                    <CardTitle className="text-2xl text-red-800 mt-4">Oops! Something Went Wrong</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-slate-700">
                    An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <Button onClick={() => window.location.reload()}>
                    Refresh Page
                    </Button>
                    {this.state.error && (
                        <details className="p-2 bg-slate-100 rounded-lg text-left text-xs mt-4">
                        <summary className="cursor-pointer font-semibold">Error Details</summary>
                        <pre className="mt-2 whitespace-pre-wrap break-all">
                            {this.state.error.toString()}
                            <br />
                            {this.state.error.stack}
                        </pre>
                        </details>
                    )}
                </CardContent>
            </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;