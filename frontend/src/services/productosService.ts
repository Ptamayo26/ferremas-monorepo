import axios from "axios";
const API_URL = "http://localhost:5000/api/productos";

export const getProductos = () => axios.get(API_URL);
export const getProductoById = (id: number) => axios.get(`${API_URL}/${id}`);
export const createProducto = (data: any) => axios.post(API_URL, data);
export const updateProducto = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deleteProducto = (id: number) => axios.delete(`${API_URL}/${id}`); 