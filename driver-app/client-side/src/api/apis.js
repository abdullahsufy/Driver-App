import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiForDetail = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("auth-token"),
  },
});

// =================User site==================//

export const login = async (data) => {
  try {
    const response = await api.post("/login", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDetail = async (id) => {
  try {
    const response = await apiForDetail.get(`/user/details/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// =================Admin site==================//

export const register = async (data) => {
  try {
    const response = await api.post("/register", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const gettAllUsers = async () => {
  try {
    const response = await api.get("/fetch/all/users");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDataToUpdate = async (id) => {
  try {
    const response = await api.get(`/get/data/to/update/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDetails = async (details) => {
  try {
    const response = await api.put("/update/data", details);
    return response;
  } catch (error) {
    throw error;
  }
};
