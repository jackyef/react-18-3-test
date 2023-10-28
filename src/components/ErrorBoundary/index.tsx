import { ReactNode, Component } from 'react'

export type ErrorProps = {
  error?: Error
  onDismissError?: () => void
}

type Props = {
  fallback: (props: ErrorProps) => ReactNode
  children?: React.ReactNode
}

type State = {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.state = { error };
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return this.props.fallback({ 
        error: this.state.error, 
        onDismissError: () => this.setState({ error: null }) 
      });
    }

    return this.props.children;
  }
}
