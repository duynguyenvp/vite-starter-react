import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Hello from './Hello';

describe('Hello', () => {
  it('renders hello message with given name', () => {
    const { container } = render(<Hello name="John" />);
    expect(container.textContent).toBe('Hello, John!');
  });

  it('renders with different name', () => {
    const { container } = render(<Hello name="Jane" />);
    expect(container.textContent).toBe('Hello, Jane!');
  });
});
