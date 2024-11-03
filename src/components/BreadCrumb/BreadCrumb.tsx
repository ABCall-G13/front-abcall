import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import './BreadCrumb.css';

const routeNameMap: { [key: string]: string } = {
    'incident-list': 'Incidentes',
    dashboard: 'Tableros',
    'directory-list': 'Directorio',
    'common-issue-list': 'Problemas comunes',
};

const CustomBreadcrumb = () => {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <div className="breadcrumb-container">
            <Breadcrumbs
                separator=" / "
                aria-label="breadcrumb"
                className="breadcrumb"
                color="white"
            >
                <Link
                    underline="hover"
                    color="white"
                    component={RouterLink}
                    to="/"
                >
                    Inicio
                </Link>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    const displayName =
                        routeNameMap[value] || capitalize(value);

                    return last ? (
                        <Typography color="white" key={to}>
                            {displayName}
                        </Typography>
                    ) : (
                        <Link
                            underline="hover"
                            color="inherit"
                            component={RouterLink}
                            to={to}
                            key={to}
                        >
                            {displayName}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </div>
    );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default CustomBreadcrumb;
