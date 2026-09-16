import axios from "axios";

export const getAllPosts = async () => {
  try {
    const userToken = localStorage.getItem("userToken");

    const { data } = await axios.get(
      "https://route-posts.routemisr.com/posts",
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};