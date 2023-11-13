import React, { createContext, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { preventAuthenticatedRoutes, protectedRoutes } from './config/routes'
import { ProtectedPage } from './components/protectedPage'
import { ToastProvider } from 'react-toast-notifications';
import './App.css'
import { PreventAuthenticatedPage } from './components/preventAuthenticatedPage'

export const AuthContext = createContext();

export default function App() {
    const [userInfo, setUserInfo] = useState(null);
    return (
        <AuthContext.Provider value={{ userInfo, setUserInfo }}>
            <ToastProvider>
                <Router>
                    <div>
                        <Routes>
                            <Route index element={<Navigate to="/home" />} />
                            {
                                preventAuthenticatedRoutes.map((route => (
                                    <Route
                                        key={route.key}
                                        element={
                                            <PreventAuthenticatedPage>
                                                {route.component}
                                            </PreventAuthenticatedPage>
                                        }
                                        path={route.path}
                                    />

                                )))
                            }
                            {
                                protectedRoutes.map((route => (
                                    <Route
                                        key={route.key}
                                        element={
                                            <ProtectedPage>
                                                {route.component}
                                            </ProtectedPage>
                                        }
                                        path={route.path}
                                    />

                                )))
                            }
                        </Routes>
                    </div>
                </Router>
            </ToastProvider>
        </AuthContext.Provider>
    )
}