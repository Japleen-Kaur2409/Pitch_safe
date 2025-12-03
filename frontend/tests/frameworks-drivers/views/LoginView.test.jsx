// frameworks-drivers/views/LoginView.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginView from '../../../src/frameworks-drivers/views/LoginView';

describe('LoginView', () => {
  const mockOnLogin = jest.fn();
  const mockOnNavigateToSignup = jest.fn();
  const mockOnNavigateToLanding = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <LoginView
        onLogin={mockOnLogin}
        onNavigateToSignup={mockOnNavigateToSignup}
        onNavigateToLanding={mockOnNavigateToLanding}
      />
    );

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginView
        onLogin={mockOnLogin}
        onNavigateToSignup={mockOnNavigateToSignup}
        onNavigateToLanding={mockOnNavigateToLanding}
      />
    );

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('displays error message', () => {
    render(
      <LoginView
        onLogin={mockOnLogin}
        onNavigateToSignup={mockOnNavigateToSignup}
        onNavigateToLanding={mockOnNavigateToLanding}
        error="Invalid credentials"
      />
    );

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginView
        onLogin={mockOnLogin}
        onNavigateToSignup={mockOnNavigateToSignup}
        onNavigateToLanding={mockOnNavigateToLanding}
      />
    );

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /👁️/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('disables form during loading', () => {
    render(
      <LoginView
        onLogin={mockOnLogin}
        onNavigateToSignup={mockOnNavigateToSignup}
        onNavigateToLanding={mockOnNavigateToLanding}
        isLoading={true}
      />
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  test('navigates to signup', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginView
        onLogin={mockOnLogin}
        onNavigateToSignup={mockOnNavigateToSignup}
        onNavigateToLanding={mockOnNavigateToLanding}
      />
    );

    const signupLink = screen.getByText(/sign up now/i);
    await user.click(signupLink);

    expect(mockOnNavigateToSignup).toHaveBeenCalled();
  });
});
