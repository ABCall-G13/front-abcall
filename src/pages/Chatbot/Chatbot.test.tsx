import {
    render,
    screen,
    act,
    waitFor,
    fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import Chatbot from './Chatbot';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

beforeEach(() => {
    // Simular valores en localStorage
    Storage.prototype.getItem = jest.fn((key) => {
        if (key === 'currency') return 'USD';
        if (key === 'language') return 'en';
        return null;
    });
});

beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('Chatbot component', () => {
    beforeEach(() => {
        mockAxiosInstance.get.mockReset();
    });

    test('should render Chatbot component', async () => {
        render(<Chatbot />);
        expect(screen.getByText('Chat en línea')).toBeInTheDocument();
    });
});