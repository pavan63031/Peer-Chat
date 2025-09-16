import React from 'react'
import {Navigate, Route,Routes} from "react-router-dom";
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import NotificationPage from './pages/NotificationPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnboardingPage from './pages/OnboardingPage';
import toast, { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader';
import useAuthUser from './hooks/useAuthUser';
import Design from './components/Design';
import { useThemeStore } from './store/useThemeStore';


export default function App() {

  const {isLoading , authUser} = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  const {theme} = useThemeStore();

  // const authUser = authData?.user
  // console.log({authData});
  // console.log({isLoading});
  // console.log({error});

  if(isLoading) return <PageLoader />

  return (
    <div data-theme={theme}>
      <Routes>
  {/* Protected routes */}
  <Route
  path="/"
  element={
    isAuthenticated && isOnboarded ? (
      <Design>
      <HomePage />
      </Design>
      
    ) : (
      <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
    )
  }
/>

 <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Design showSidebar={true}>
                <NotificationPage />
              </Design>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

<Route
  path="/call/:id"
  element={
            isAuthenticated && isOnboarded ? (
              <Design showSidebar={false}>
                <ChatPage/>
              </Design>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
/>

<Route
  path="/chat/:id"
   element={
            isAuthenticated && isOnboarded ? (
              <Design showSidebar={false}>
                <ChatPage/>
              </Design>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
/>

<Route
  path="/onboarding"
  element={
    isAuthenticated ? (
      !isOnboarded ? (
        <OnboardingPage />
      ) : (
        <Navigate to="/" replace />
      )
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

<Route
  path="/signup"
  element={!authUser ? <Signup /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />}
/>

<Route
  path="/login"
  element={!authUser ? <Login /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />}
/>

</Routes>

       <Toaster />
    </div>
  )
}