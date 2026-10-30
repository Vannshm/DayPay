import { Routes , Route , Navigate } from 'react-router-dom';
import  SignupPage  from './Pages/Signin/SigninPage';
import { useAuthStore } from './Pages/authStore'
import LoginPage from './Pages/Login/LoginPage'
import HomePage from './Pages/Home/HomePage'
import { useEffect } from 'react';

function App() {
  const { checkAuth , isCheckingAuth } = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth){
    return <div>Loading...</div>;
  }

  return (
    <>
    <Routes>
      <Route path='/signup' element={<SignupPage/> }/>
      <Route path='/login' element={<LoginPage/> }/>
      <Route path='/home' element={<HomePage/> }/>
    </Routes>
    </>
  );
}

export default App;