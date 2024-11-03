import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomBreadcrumb from './BreadCrumb'; // Ajusta la ruta según tu estructura

describe('CustomBreadcrumb component', () => {
    test('renders "Inicio" as the first link', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                {' '}
                {/* Simula la ruta inicial */}
                <CustomBreadcrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Inicio' })
        ).toBeInTheDocument();
    });

    test('renders breadcrumb with correct links for a nested route', () => {
        render(
            <MemoryRouter initialEntries={['/incident-list']}>
                <CustomBreadcrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Inicio' })
        ).toBeInTheDocument();

        // El último breadcrumb debe ser texto (Typography), no un link
        expect(screen.getByText('Incidentes')).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Incidentes' })
        ).not.toBeInTheDocument();
    });

    test('renders the last breadcrumb as Typography and not as a Link', () => {
        render(
            <MemoryRouter initialEntries={['/incident-list']}>
                <CustomBreadcrumb />
            </MemoryRouter>
        );

        // El último breadcrumb es Typography (se renderiza como un <p>)
        expect(screen.getByText('Incidentes')).toBeInstanceOf(
            HTMLParagraphElement
        );
        expect(
            screen.queryByRole('link', { name: 'Incidentes' })
        ).not.toBeInTheDocument();
    });

    test('renders capitalized path names correctly', () => {
        render(
            <MemoryRouter initialEntries={['/custom-route']}>
                <CustomBreadcrumb />
            </MemoryRouter>
        );

        // Verifica que "Custom-route" se haya capitalizado correctamente
        expect(screen.getByText('Custom-route')).toBeInTheDocument();
    });

    test('handles multiple levels of routes correctly', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard/incident-list']}>
                <CustomBreadcrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(screen.getByText('Incidentes')).toBeInTheDocument();

        // El último breadcrumb es Typography (se renderiza como un <p>)
        expect(screen.getByText('Incidentes')).toBeInstanceOf(
            HTMLParagraphElement
        );
    });
});
