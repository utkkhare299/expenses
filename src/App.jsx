import { Route, Routes } from "react-router-dom";
import Signup from "./components/Auth/Signup";
// import UpdateProfile from "./components/Auth/UpdateProfile";
import Login from "./components/Auth/Login";
import Home from "./components/Home";
import "./App.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    !isDark
      ? (document.body.className = "dark")
      : (document.body.className = "");
  }, [isDark]);
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        {/* <Route path="/update" element={<UpdateProfile />} /> */}
      </Routes>
    </div>
  );
}

export default App;
