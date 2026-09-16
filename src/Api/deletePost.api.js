import axios from "axios";

 export function deletePost({id}) {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }