import axios from "axios";

export const getPostDetails = (id) => {
  return axios.get(
    `https://route-posts.routemisr.com/posts/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
};

// How do we get the post ID?
// We could pass it as a prop, but that would make PostDetails a child of CardPost.

// Instead, we pass the post ID through the URL using <Link> inside CardPost.
// Example: <Link to={`/posts/${post._id}`}>

// Then, in PostDetails, we get the ID from the URL using useParams().
// Example: const { id } = useParams();