import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Protected from "./features/auth/components/Protected"
import ChatPage from "./pages/ChatPage"
import AuthPage from "./pages/AuthPage"

// shadcn is a rapper over radix-ui

function App() {
  const routes = [
    {
      path: '/auth',
      element: <AuthPage />,
    },
    {
      path: '/',
      element: <Protected><ChatPage /></Protected>,
    },
    {
      path: '*',
      element: <Navigate to={'/auth'} replace />
    },
  ]



  return (

    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App