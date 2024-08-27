import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import Toolbar from "./components/Toolbar";
import Profile from "./pages/Profile";


function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Toolbar/>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
