import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import ClientListView from 'src/views/client/ClientListView';
import HomeView from 'src/views/home/HomeView';
import LoginView from 'src/views/auth/LoginView';
import ResetPasswordView from 'src/views/auth/ResetPasswordView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';

import ProgramasView from 'src/views/programas/ProgramasView';
import ContenidosView from 'src/views/contenidos/ContenidosView';
import ObjetivoView from 'src/views/objetivo/ObjetivoView';
import ProgramaView from 'src/views/programa/ProgramaView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'programas', element: <ProgramasView /> },
      { path: 'contenidos', element: <ContenidosView /> },
      { path: 'objetivo/:objetivoId', element: <ObjetivoView /> },
      { path: 'programa/:programaId', element: <ProgramaView /> },
      { path: 'clients', element: <ClientListView /> },
      { path: 'home', element: <HomeView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'reset-password', element: <ResetPasswordView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/home" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
