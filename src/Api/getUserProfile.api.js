import axios from "axios";

export function getUserProfile() {
  return axios.get(
    "https://route-posts.routemisr.com/users/profile-data",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
}