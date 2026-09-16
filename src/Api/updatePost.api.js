import axios from "axios";

export function updatePostApi({ postId, content, imageFile }) {
  const formData = new FormData();

  if (content.trim()) {
    formData.append("body", content);
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
}