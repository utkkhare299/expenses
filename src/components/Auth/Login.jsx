import { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import classes from "./auth.module.css";
import { AuthContext } from "../../context/authContext";

const Login = () => {
  const { token, setToken } = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  // const [token, setToken] = useState("");

  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCCBbOKNdCKFTzfFaVssnidTzE7FXWbWxM";

    if (enteredEmail != "" && enteredPassword != "") {
      setIsLoading(true);

      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then(() => {
              let errorMessage = "Login failed";

              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          setToken(data.idToken);
          localStorage.setItem("token", data.idToken);
          navigate("/home");
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>Log In</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>

        <div className={classes.actions}>
          {isLoading && <p>Sending request...</p>}
          <button
            type="submit"
            className={classes.toggle}
            onClick={submitHandler}
          >
            Login
          </button>

          <p>
            Or <Link to={"/Signup"}> signUp </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Login;
