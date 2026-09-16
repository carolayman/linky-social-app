import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import Profile from './Components/Profile/Profile'
import NotFound from './Components/NotFound/NotFound'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import AuthRoute from './Components/AuthRoute/AuthRoute'
import Login from './Auth/Login/Login'
import Register from './Auth/Register/Register'
import UserContextProvider from './Context/UserContext'
import './App.css'
import {QueryClientProvider , QueryClient} from '@tanstack/react-query'
import PostDetails from './Components/PostDetails/PostDetails'
import toast, { Toaster } from 'react-hot-toast';
import {useNetworkState} from "react-use"
import { FaWifi } from 'react-icons/fa'
import ChangePassword from './Components/ChangePassword/ChangePassword'

const queryClient = new QueryClient({
  
})

let router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { index: true, element: <AuthRoute> <Register /> </AuthRoute>},
      { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'postDetails/:id', element: <ProtectedRoute><PostDetails /></ProtectedRoute> }, // : --> for dynamic id
      { path: 'profile', element:<ProtectedRoute><Profile /></ProtectedRoute>  },
      { path: 'changePassword', element:<ProtectedRoute><ChangePassword /></ProtectedRoute>  },
      { path: 'login', element: <AuthRoute> <Login /> </AuthRoute> },
      { path: '*', element: <NotFound /> },
    ],
  },
],{ basename:'/linky-social-app'});

function App() {

  const {online} = useNetworkState()

  const [count, setCount] = useState(0)

  return (
    <>
    {/* // may be componant  */}
    {!online && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-rose-500 text-white px-4 py-2.5 shadow-md flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300">
          <FaWifi className="animate-pulse" />
          <span>You are currently offline. Please check your internet connection.</span>
        </div>
      )}


    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterProvider router={router}></RouterProvider>
         <Toaster />
      </UserContextProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
