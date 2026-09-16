import axios from "axios";

export function followUser(userId) {
  return axios.put(
    `https://route-posts.routemisr.com/users/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
}