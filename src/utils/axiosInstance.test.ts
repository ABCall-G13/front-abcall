import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './axiosInstance';

describe('axiosInstance', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axiosInstance);
    });

    afterEach(() => {
        mock.restore();
    });

    it('should include Authorization header if token is present', async () => {
        const token = 'test-token';
        localStorage.setItem('token', token);

        mock.onGet('/test').reply(200);

        await axiosInstance.get('/test');

        expect(mock.history.get[0].headers?.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not include Authorization header if token is not present', async () => {
        localStorage.removeItem('token');

        mock.onGet('/test').reply(200);

        await axiosInstance.get('/test');

        expect(mock.history.get[0].headers?.Authorization).toBeUndefined();
    });

    it('should handle request errors', async () => {
        mock.onGet('/test').networkError();

        await expect(axiosInstance.get('/test')).rejects.toThrow('Network Error');
    });
});