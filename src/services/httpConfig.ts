import axios from "axios";
import Toast from "../components/toast";

let SERVER = "http://57.128.183.230:7020";

if (import.meta.env.MODE === "development") {
  SERVER = "http://192.168.70.80:7010";
}

const instance = axios.create({
  baseURL: SERVER,
  headers: { authorization: window.localStorage.getItem("token") },
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      Toast.showToast("Unauthorized");
      window.localStorage.setItem("token", "");
      window.history.replaceState(null, "", "login");
      window.location.reload();
    }

    let msg = "";
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message;
    } else {
      msg = "Unexpected Error:";
    }
    Toast.showToast(msg);
    return Promise.reject(error);
  }
);

export default instance;
