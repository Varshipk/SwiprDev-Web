import React, { useState } from "react";
import Card from "./Card";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [age, setAge] = useState(user?.age || 0);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");
  const loading = true;
  const dispatch = useDispatch();
  const handleClick = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          photoUrl,
          gender,
          about,
        },
        { withCredentials: true }
      );
      setToast(true);
      dispatch(addUser(res.data.data));
      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (error) {
      setError(error.response.data.split(":").pop());

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center gap-8 my-8">
      <div className="card bg-base-100 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Edit Profile</h2>
        </div>
        <form className="flex flex-col  items-center ">
          <label className="text-green-400">First Name</label>
          <input
            type="text"
            placeholder="Type here"
            className="input m-1"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label className="text-green-400">Last Name</label>
          <input
            type="text"
            placeholder="Type here"
            className="input m-1"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label className="text-green-400">Photo Url</label>
          <input
            type="url"
            placeholder="Type here"
            className="input m-1"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <label className="text-green-400">Age</label>
          <input
            type="number"
            className="input validator"
            required
            placeholder="Type a number "
            min="16"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <label className="text-green-400">About</label>
          <input
            type="text"
            placeholder="Type here"
            className="input m-1"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
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
          <p className="validator-hint">Required</p>

          <button
            onClick={handleClick}
            className="btn mb-2 btn-primary"
            type="submit"
          >
            Update Profile
          </button>
        </form>
      </div>

      <Card
        user={{ firstName, lastName, photoUrl, age, gender, about, loading }}
      />
      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>Profile update successfully</span>
          </div>
        </div>
      )}
      {error && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
