import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from '../components/Hello.js';

test('renders Hello, World! text', () => {
    render(<Hello />);
    const element = screen.getByText(/Hello, World!/i);
    expect(element).toBeInTheDocument();
});
