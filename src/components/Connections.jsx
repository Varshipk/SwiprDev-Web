import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import { Link } from "react-router";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);
  if (!connections) {
    return;
  }
  if (connections.length === 0) {
    return <h1>No connection found</h1>;
  }

  return (
    <div>
      <h1 className="text-center text-lg font-bold text-pink-600">
        My Connections
      </h1>
      <div className="flex justify-center">
        <ul className="list bg-base-100 min-w-1/2 m-4 rounded-box shadow-lg">
          {connections.map((connection) => (
            <div key={connection._id}>
              <li className="list-row">
                <div>
                  <img
                    className="size-10 rounded-box"
                    src={connection.photoUrl}
                  />
                </div>
                <div>
                  <div className="font-semibold">
                    {connection.firstName + " " + connection.lastName}
                  </div>
                  {connection.age && (
                    <div className="text-xs  font-semibold opacity-60">
                      {connection.age + " " + connection.gender}
                    </div>
                  )}
                  {connection.about && (
                    <div className="text-xs  font-semibold opacity-60">
                      {connection.about}
                    </div>
                  )}
                </div>
                <Link
                  to={`/chat/${connection._id}`}
                  state={{
                    firstName: connection.firstName,
                    photoUrl: connection.photoUrl,
                  }}
                >
                  <div className="btn text-md text-blue-500">chat</div>{" "}
                </Link>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Connections;
