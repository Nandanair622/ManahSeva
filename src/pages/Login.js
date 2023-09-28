import {React, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button'
import {GoogleAuthProvider, signInWithRedirect} from 'firebase/auth'

const style = {
  error: "font-bold text-[0.875rem] text-red-600 text-center", 
  wrapper: `flex justify-center`
};

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [values, setValues] = useState({
    email: "",
    pass: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const signIn = (e) => {
    e.preventDefault();
    if (!values.email || !values.pass) {
      setErrorMsg("Please fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);

    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
    };

    const googleSignIn = () => {
      const provider = new GoogleAuthProvider()
      signInWithRedirect(auth, provider)
      navigate('/')
    }

    const handleShowPasswordChange = () => {
        setShowPassword(!showPassword)
    }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={signIn}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                onChange={(event) =>setValues((prev) => ({ ...prev, pass: event.target.value }))}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <p>
            <a href="#" onClick={handleShowPasswordChange}>
            {showPassword ? 'Hide Password' : 'Show Password'}
            </a>
          </p>
          <div>
            <b className={style.error}>{errorMsg}</b>
            <button
              disabled={submitButtonDisabled}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <br />
        <p className={style.wrapper}>or</p>
        <br />
        <div className={style.wrapper}>
          <GoogleButton onClick={googleSignIn} />
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member? 
          <Link
            to="/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
          Signup
          </Link>
        </p>
        
      </div>
    </div>
  )
}

export default Login
