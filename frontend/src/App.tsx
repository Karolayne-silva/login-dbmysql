import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./screens/Login";
import Home from "./screens/Home";
import Cadastro from "./screens/Cadastro";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Cadastro/>}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
