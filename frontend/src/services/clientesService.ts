import axios from "axios";
const API_URL = "http://localhost:5000/api/clientes"; // Ajusta la URL si es necesario

export const getClientes = () => axios.get(API_URL);
export const getClienteById = (id: number) => axios.get(`${API_URL}/${id}`);
export const createCliente = (data: any) => axios.post(API_URL, data);
export const updateCliente = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deleteCliente = (id: number) => axios.delete(`${API_URL}/${id}`); 