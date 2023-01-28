import { Route, Routes } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import UpdateProfile from "./components/Auth/UpdateProfile";
import Login from "./components/Auth/Login";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/update" element={<UpdateProfile />} />
      </Routes>
    </div>
  );
}

export default App;
