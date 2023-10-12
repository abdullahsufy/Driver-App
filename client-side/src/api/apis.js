import axios from "axios";

const refreshUserToken = () => {
  apiForUser.defaults.headers["auth-token"] = localStorage.getItem("auth-token");
};
const refreshAdminToken = () => {
  apiForAdmin.defaults.headers["admin-token"] = localStorage.getItem("admin-token");
};

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const apiForLogin = axios.create({
  baseURL: REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiForUser = axios.create({
  baseURL: REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("auth-token"),
  },
});

const apiForAdmin = axios.create({
  baseURL: REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "admin-token": localStorage.getItem("admin-token"),
  },
});

// =================User site==================//

export const login = async (data) => {
  try {
    const response = await apiForLogin.post("/login", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDetail = async (id) => {
  refreshUserToken();
  try {
    const response = await apiForUser.get(`/user/details/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// =================Admin site==================//

export const adminLogin = async (data) => {
  try {
    const response = await apiForLogin.post("/login/admin", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const gettAllUsers = async () => {
  refreshAdminToken();
  try {
    const response = await apiForAdmin.get("/fetch/all/users");
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (data) => {
  refreshAdminToken();
  try {
    const response = await apiForAdmin.post("/register", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateAdminPassword = async (data) => {
  refreshAdminToken();
  try {
    const response = await apiForAdmin.put("/update/admin/password", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  refreshAdminToken();
  try {
    const response = await apiForAdmin.delete(`/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDataToUpdate = async (id) => {
  refreshAdminToken();
  try {
    const response = await apiForAdmin.get(`/get/data/to/update/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDetails = async (details) => {
  refreshAdminToken();
  try {
    const response = await apiForAdmin.put("/update/data", details);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (data) => {
  refreshAdminToken();
  try {
    const response = await apiForAdmin.put("/update/password", data);
    return response;
  } catch (error) {
    throw error;
  }
};
