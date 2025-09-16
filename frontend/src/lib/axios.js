import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL : "http://localhost:5001/api",
//     withCredentials : true
// })

export const axiosInstance = axios.create({
  baseURL: "https://peer-chat-savb.onrender.com/api",
  withCredentials: true // send cookies automatically
});

