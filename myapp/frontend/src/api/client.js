// api/client.js
import axios from "axios";

// axios instance -> همه درخواست‌ها از این می‌رن
const client = axios.create({
  baseURL: "http://localhost:3000/api", // آدرس بک‌اند
  withCredentials: true, // برای کوکی/سشن اگه لازم شد
});

export default client;
