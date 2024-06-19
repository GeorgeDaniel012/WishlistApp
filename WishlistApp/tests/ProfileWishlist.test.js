import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileWishlist from './ProfileWishlist';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('{"uid": 1}'),
}));

jest.mock('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator', () => 'ActivityIndicator');

describe('ProfileWishlist', () => {
  test('renders correctly', async () => {
    const { getByText, getByTestId } = render(<ProfileWishlist route={{}} />);
    
    // Verificam daca apare indicator de loading
    expect(getByTestId('loading-indicator')).toBeTruthy();

    // Asteptam sa se incarce
    await waitFor(() => expect(getByTestId('loading-indicator')).toBeNull());

    // Verificam existenta butonului de Settings
    expect(getByText('Settings')).toBeTruthy();
  });

  test('applies sort and filter correctly', async () => {
    const { getByText, getByTestId } = render(<ProfileWishlist route={{}} />);

    // Asteptam sa se incarce
    await waitFor(() => expect(getByTestId('loading-indicator')).toBeNull());

    // Apasa pe buton
    fireEvent.press(getByText('Settings'));

    // Selecteaza sortare dupa type
    fireEvent.press(getByText('type'));

    // Verifica sortarea
    expect(getByText('type ✔️')).toBeTruthy();

    // Inchide modal-ul
    fireEvent.press(getByTestId('modal-background'));

    // Filtreaza dupa statusul de planning
    fireEvent.press(getByText('Status: planning'));

    // Verifica filtrul de status
    expect(getByText('Status: planning')).toBeTruthy();
  });
});
