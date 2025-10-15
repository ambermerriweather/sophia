import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button.tsx';
import { Mascot } from './Mascot.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Re-introduced the constructor to explicitly initialize state.
  // The class property syntax was causing a TypeScript error where `this.props` was not being recognized.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 text-center">
            <Mascot className="w-32 h-32" />
            <h1 className="mt-4 text-3xl font-bold text-slate-800">Oops! Something went wrong.</h1>
            <p className="mt-2 text-slate-600">Sophia the Owl is on it! Please try refreshing the page to continue.</p>
            <Button onClick={this.handleReset} className="mt-6">
                Refresh Page
            </Button>
            <details className="mt-4 text-left bg-white p-4 rounded-lg border w-full max-w-2xl">
                <summary className="cursor-pointer font-semibold text-sm text-slate-500">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-all">
                    {this.state.error?.toString()}
                </pre>
            </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
