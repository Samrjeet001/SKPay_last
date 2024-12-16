import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Deposite from './pages/Deposite'
import Withdraw from './pages/Withdraw'
import Withdraw_redirect from './pages/Withdraw_redirect'
import Deposit_redirect from './pages/Deposit_redirect'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/deposit' element={<Deposite />}></Route>
        <Route path='/withdraw' element={<Withdraw />}></Route>
        <Route path='/withdrew' element={<Withdraw_redirect />}></Route>
        <Route path='/depositnow' element={<Deposit_redirect />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
