export interface IErrorBoundaryState {
  /** Indicates whether an error has occurred */
  hasError: boolean;
  /** The error object if an error occurred, null otherwise */
  error: Error | null;
}
