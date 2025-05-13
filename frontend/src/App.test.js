import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page with correct heading', () => {
  render(<App />);
  
  // Check if the 'Gems & Jewelry Inventory Management' text is rendered
  const headingElement = screen.getByText(/Gems & Jewelry Inventory Management/i);
  expect(headingElement).toBeInTheDocument();
});
