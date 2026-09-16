import axios from "axios";

export const getComments = (id) => {
  return axios.get(
    `https://route-posts.routemisr.com/posts/${id}/comments`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
};