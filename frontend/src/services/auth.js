import { api } from "./api";

export const loginUser = (data) =>
  api.post("/users/login", data);

export const createUser = (data) =>
  api.post("/users/create_user", data);

export const getCurrentUser = () => 
  api.get("/users/me");
