import { Component, ReactNode } from 'react';
import { MdError } from 'react-icons/md';
import type { IErrorBoundaryState } from './ErrorBoundary.interface';

interface IProps {
  /** Child components to be wrapped by the error boundary */
  children: ReactNode;
}

export class ErrorBoundary extends Component<IProps, IErrorBoundaryState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center p-8 bg-slate-800 rounded-lg max-w-md">
            <MdError className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-300 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
