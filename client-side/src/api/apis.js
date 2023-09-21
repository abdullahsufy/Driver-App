import axios from "axios";

const apiForLogin = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiForUser = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("auth-token"),
  },
});

const apiForAdmin = axios.create({
  baseURL: "http://localhost:5000",
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

export const register = async (data) => {
  try {
    const response = await apiForAdmin.post("/register", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiForAdmin.delete(`/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const gettAllUsers = async () => {
  try {
    const response = await apiForAdmin.get("/fetch/all/users");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDataToUpdate = async (id) => {
  try {
    const response = await apiForAdmin.get(`/get/data/to/update/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDetails = async (details) => {
  try {
    const response = await apiForAdmin.put("/update/data", details);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await apiForAdmin.put("/update/password", data);
    return response;
  } catch (error) {
    throw error;
  }
};
