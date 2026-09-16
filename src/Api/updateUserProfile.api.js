import axios from "axios";

export const updateUserProfile = async (formData) => {
    const token = localStorage.getItem("userToken");

    const response = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};