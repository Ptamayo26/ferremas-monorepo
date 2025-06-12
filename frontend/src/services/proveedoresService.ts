import axios from "axios";
const API_URL = "http://localhost:5000/api/proveedores";

export const getProveedores = () => axios.get(API_URL);
export const getProveedorById = (id: number) => axios.get(`${API_URL}/${id}`);
export const createProveedor = (data: any) => axios.post(API_URL, data);
export const updateProveedor = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deleteProveedor = (id: number) => axios.delete(`${API_URL}/${id}`); 