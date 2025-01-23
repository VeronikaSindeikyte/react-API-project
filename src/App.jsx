import './index.css'
import Create from './components/Create';
import Home from './components/Home';
import Navbar from './components/Navbar';
import AddProduct from './components/AddProduct';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {


  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<Create />} />
            <Route path='/AddProduct' element={<AddProduct />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
