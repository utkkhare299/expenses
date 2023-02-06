import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth";
import UpdateProfile from "./Auth/UpdateProfile";
import Expenses from "./Expense/Expenses";
import { themeActions } from "../store/theme";

function Home() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);
  const onClick = () => {
    dispatch(themeActions.darkMode());
  };
  const handleLogout = () => {
    // localStorage.removeItem("token");
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleClick = async () => {
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCCBbOKNdCKFTzfFaVssnidTzE7FXWbWxM";
    const options = {
      method: "POST",
      body: JSON.stringify({
        requestType: "VERIFY_EMAIL",
        idToken: user.idToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          borderBottom: "2px solid gray",
        }}
      >
        <h1>Welcome to Expense Tracker</h1>
        {/* <p>
          Your Profile is Incomplete. <Link to="/update">Complete Now</Link>
        </p> */}
        <button onClick={handleClick}>Verify Email</button>
        <button onClick={handleLogout}>Logout</button>
        <p>
          Your Profile is Incomplete.{" "}
          <a href="#" onClick={() => setShow((prev) => !prev)}>
            Complete Now
          </a>
        </p>
        <button onClick={onClick}>Toggle Theme</button>
      </div>
      {show && <UpdateProfile />}
      <Expenses />
    </>
  );
}

export default Home;
