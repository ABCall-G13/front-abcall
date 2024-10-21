import React from 'react';
import { render, screen } from '@testing-library/react';
import LookerDashboard from './Dashboard';

describe('LookerDashboard', () => {
    it('renders the dashboard title', () => {
        render(<LookerDashboard />);
        const titleElement = screen.getByText(/Tablero de control/i);
        expect(titleElement).toBeInTheDocument();
    });

    it('renders the iframe with the correct src', () => {
        render(<LookerDashboard />);
        const iframeElement = screen.getByTitle('Looker Studio Dashboard');
        expect(iframeElement).toBeInTheDocument();
        expect(iframeElement).toHaveAttribute(
            'src',
            expect.stringContaining(
                'https://lookerstudio.google.com/embed/reporting/639d9b14-f68b-443c-8698-3be0916f0906/page/2TRFE'
            )
        );
    });

    it('renders the iframe with the correct styles', () => {
        render(<LookerDashboard />);
        const iframeElement = screen.getByTitle('Looker Studio Dashboard');
        expect(iframeElement).toHaveStyle('border: 0');
        expect(iframeElement).toHaveAttribute('width', '100%');
        expect(iframeElement).toHaveAttribute('height', '100%');
    });

    it('renders the container with the correct styles', () => {
        render(<LookerDashboard />);
        const titleElement = screen.getByText(/Tablero de control/i);
        // eslint-disable-next-line testing-library/no-node-access
        const containerElement = titleElement.closest('div');
        expect(containerElement).toHaveStyle('width: 100%');
        expect(containerElement).toHaveStyle('height: 100%');
        expect(containerElement).toHaveStyle('padding-inline: 10px');
    });
});
