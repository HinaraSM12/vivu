import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the Vivu platform shell', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /acompañamiento académico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Vivu')).toBeInTheDocument();
  });
});
