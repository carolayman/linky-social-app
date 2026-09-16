import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {

  if (localStorage.getItem('userToken')) {
    return children
  }

  return <Navigate to="/login" /> 
  // we se navigate component because we need to return  component
  // we cant use useNavigate لانه مش هيرجع كومبوننت
}