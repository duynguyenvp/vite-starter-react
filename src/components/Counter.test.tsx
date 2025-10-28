import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import Counter from './Counter';

describe('Counter', () => {
  it('renders with default initial value', () => {
    render(<Counter />);
    expect(screen.getByTestId('count-value').textContent).toBe('0');
  });

  it('renders with custom initial value', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByTestId('count-value').textContent).toBe('5');
  });

  it('increments count when + button is clicked', () => {
    render(<Counter />);
    const incrementButton = screen.getByTestId('increment-button');

    fireEvent.click(incrementButton);
    expect(screen.getByTestId('count-value').textContent).toBe('1');
  });

  it('decrements count when - button is clicked', () => {
    render(<Counter />);
    const decrementButton = screen.getByTestId('decrement-button');

    fireEvent.click(decrementButton);
    expect(screen.getByTestId('count-value').textContent).toBe('-1');
  });
});
