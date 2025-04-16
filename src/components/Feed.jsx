import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import Card from "./Card";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const loading = true;

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);
  if (!feed) {
    return;
  }
  if (feed.length <= 0) {
    return (
      <h1 className="text-center m-8 text-2xl font-semibold text-pink-500">
        No new user found
      </h1>
    );
  }
  return (
    <div className="flex justify-center my-4">
      {feed && <Card user={feed[0]} />}
    </div>
  );
};

export default Feed;
