import toast from "react-hot-toast";

export const errorHandler = (error) => {
  console.error(error);
  toast.error(
    error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "An error occurred"
  );
};
