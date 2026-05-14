"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "48px 24px",
          textAlign: "center",
          fontFamily: "'Manrope', system-ui, sans-serif",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💎</div>
          <h2 style={{
            fontFamily: "'Noto Serif', Georgia, serif",
            fontSize: "28px",
            fontWeight: 400,
            marginBottom: "12px",
            color: "#201b11",
          }}>
            Something went wrong
          </h2>
          <p style={{
            color: "#7f7663",
            fontSize: "16px",
            maxWidth: "400px",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}>
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background: "#D4AF37",
              color: "#201b11",
              border: "2px solid #D4AF37",
              padding: "16px 32px",
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
