import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <h2>Something went wrong.</h2>
          <p className="text-muted">{this.state.error?.message}</p>
          <a href="/" className="btn btn-danger mt-3">Back to home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
