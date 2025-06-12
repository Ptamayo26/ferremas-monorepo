import axios from "axios";
const API_URL = "http://localhost:5000/api/usuarios";

export const getUsuarios = () => axios.get(API_URL);
export const getUsuarioById = (id: number) => axios.get(`${API_URL}/${id}`);
export const createUsuario = (data: any) => axios.post(API_URL, data);
export const updateUsuario = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deleteUsuario = (id: number) => axios.delete(`${API_URL}/${id}`); 