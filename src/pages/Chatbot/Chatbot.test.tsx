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

describe('Open chatbot', () => {
    test('should open chatbot', async () => {
        // Mockear respuesta de Axios
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: {
                solutions: [
                    { solucion: 'Reinicia tu router.' },
                    { solucion: 'Verifica los cables.' },
                ],
            },
        });

        render(<Chatbot />);

        // Buscar y hacer clic en el botón para abrir el chatbot
        const openChatbotButton = screen.getByText('Chat en línea');
        fireEvent.click(openChatbotButton);

        // Esperar a que el contenido del chatbot sea visible
        await waitFor(() =>
            expect(screen.getByText('Asistente Virtual')).toBeInTheDocument()
        );
    });
});
