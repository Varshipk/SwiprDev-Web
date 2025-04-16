import React from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const Card = ({ user }) => {
  const dispatch = useDispatch();
  const {
    firstName,
    lastName,
    gender,
    age,
    photoUrl,
    about,
    skills,
    loading,
    _id,
  } = user;

  const handleClick = async (status, id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(id));
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img src={photoUrl} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p>{age + " " + gender}</p>}
          {about && <p>{about}</p>}
          {skills && <p>{skills}</p>}

          {!loading && (
            <div className="card-actions flex justify-center">
              <button
                onClick={() => {
                  handleClick("interested", _id);
                }}
                className="btn btn-primary"
              >
                interested
              </button>
              <button
                onClick={() => {
                  handleClick("ignored", _id);
                }}
                className="btn btn-secondary"
              >
                ignored
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
