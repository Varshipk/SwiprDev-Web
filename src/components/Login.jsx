import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogInForm, setIsLogInForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [err, setErr] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogIn = async () => {
    try {
      const result = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(result.data));
      return navigate("/");
    } catch (error) {
      setErr(error?.response?.data || "Something went wrong");
    }
  };
  const handleSignUp = async () => {
    const res = await axios.post(
      BASE_URL + "/signup",
      {
        firstName,
        lastName,
        age,
        gender,
        password,
        email,
      },
      { withCredentials: true }
    );
    dispatch(addUser(res.data));
    navigate("/profile");
  };
  return (
    <div className="flex justify-center my-8">
      <div className="card bg-base-100 w-96 shadow-sm flex justify-center items-center ">
        <div className="card-body">
          <h2 className="card-title">{isLogInForm ? "LogIn" : "SignUp"}</h2>
        </div>
        {!isLogInForm && (
          <>
            <label className="input validator my-3">
              <input
                type="input"
                required
                placeholder="First Name"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <p className="validator-hint hidden">
              First Name must be 3 to 30 characters
              <br />
              containing only letters, numbers or dash
            </p>
            <label className="input validator my-3">
              <input
                type="input"
                required
                placeholder="Last Name"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="2"
                maxLength="30"
                title="Only letters, numbers or dash"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <p className="validator-hint hidden">
              Last Name must be 3 to 30 characters
              <br />
              containing only letters, numbers or dash
            </p>
            <input
              type="number"
              className="input validator"
              required
              placeholder="Age"
              min="16"
              max="90"
              title="Must be between be 16 to 90"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <p className="validator-hint hidden">
              Age must be between be 16 to 90
            </p>
            <select
              onChange={(e) => setGender(e.target.value)}
              className="select validator m-2"
              required
              value={gender}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
            <p className="validator-hint hidden">Required</p>
          </>
        )}
        <label className="input validator my-3 ">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          <input
            type="email"
            placeholder="mail@site.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <div className="validator-hint hidden">Enter valid email address</div>
        <label className="input validator my-3">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
          <input
            type="password"
            required
            placeholder="Password"
            minLength="8"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title=" Password must be more than 8 characters, including number, lowercase letter, uppercase letter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <p className="validator-hint hidden">
          Must be more than 8 characters, including
          <br />
          At least one number
          <br />
          At least one lowercase letter
          <br />
          At least one uppercase letter
        </p>

        <p className="text-red-500">{err}</p>
        <div
          onClick={isLogInForm ? handleLogIn : handleSignUp}
          className="btn my-2"
        >
          {isLogInForm ? "LogIn" : "SignUp"}
        </div>
        <p
          className="cursor-pointer  text-red-500 mb-2"
          onClick={() => setIsLogInForm((value) => !value)}
        >
          {isLogInForm ? "New User ? Sign Up now " : "Already member? LogIn"}
        </p>
      </div>
    </div>
  );
};

export default LogIn;
