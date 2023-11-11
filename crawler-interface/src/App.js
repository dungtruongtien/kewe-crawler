import React, { createContext, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { protectedRoutes } from './config/routes'
import { ProtectedPage } from './components/protectedPage'
import RegisterPage from './layouts/pages/register.page'
import LoginPage from './layouts/pages/login.page'
import './App.css'

export const AuthContext = createContext();

export default function App() {
    const [userInfo, setUserInfo] = useState(null);

    return (
        <AuthContext.Provider value={{ userInfo, setUserInfo }}>
            <Router>
                <div>
                    <Routes>
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
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

                            )))}
                    </Routes>
                </div>
            </Router>
        </AuthContext.Provider>
    )
}