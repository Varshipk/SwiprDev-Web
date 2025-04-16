import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  const reviewRequest = async (status, id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(id));
    } catch (error) {
      console.error(error.message);
    }
  };
  if (!requests) {
    return;
  }
  if (requests.length === 0) {
    return (
      <h1 className="text-center m-8 text-red-500">No connection request</h1>
    );
  }
  return (
    <div>
      <h1 className="text-center text-lg font-bold text-pink-600">
        My Requests
      </h1>
      <div className="flex justify-center">
        <ul className="list bg-base-100 min-w-1/3  m-4 rounded-box shadow-lg">
          {requests.map((request) => {
            const { photoUrl, age, _id, about, lastName, firstName, gender } =
              request.senderId;
            return (
              <div className="flex justify-evenly items-center " key={_id}>
                <li className="list-row">
                  <div>
                    <img className="size-10 rounded-box" src={photoUrl} />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {firstName + " " + lastName}
                    </div>
                    {age && (
                      <div className="text-xs  font-semibold opacity-60">
                        {age + " " + gender}
                      </div>
                    )}
                    {about && (
                      <div className="text-xs  font-semibold opacity-60">
                        {about}
                      </div>
                    )}
                  </div>
                </li>
                <div>
                  <button
                    onClick={() => reviewRequest("accepted", request._id)}
                    className="btn btn-primary mx-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reviewRequest("rejected", request._id)}
                    className="btn btn-secondary mx-2"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Requests;
