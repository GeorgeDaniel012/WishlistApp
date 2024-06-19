import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileWishlist from './ProfileWishlist';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('{"uid": 1}'),
}));

jest.mock('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator', () => 'ActivityIndicator'); // Mock ActivityIndicator

describe('ProfileWishlist', () => {
  test('renders correctly', async () => {
    const { getByText, getByTestId } = render(<ProfileWishlist route={{}} />);
    
    // Check if loading indicator appears
    expect(getByTestId('loading-indicator')).toBeTruthy();

    // Wait for data to load
    await waitFor(() => expect(getByTestId('loading-indicator')).toBeNull());

    // Check if the "Settings" button is present
    expect(getByText('Settings')).toBeTruthy();
  });

  test('applies sort and filter correctly', async () => {
    const { getByText, getByTestId } = render(<ProfileWishlist route={{}} />);

    // Wait for data to load
    await waitFor(() => expect(getByTestId('loading-indicator')).toBeNull());

    // Click on "Settings" button to open modal
    fireEvent.press(getByText('Settings'));

    // Select a sort option from the modal
    fireEvent.press(getByText('type'));
    // Check if the type sorting is applied
    expect(getByText('type ✔️')).toBeTruthy();

    // Close the modal
    fireEvent.press(getByTestId('modal-background'));

    // Add filter by status
    fireEvent.press(getByText('Status: planning'));
    // Check if status filter is applied
    expect(getByText('Status: planning')).toBeTruthy();
  });
});
