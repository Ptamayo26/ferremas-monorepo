import axios from "axios";
const API_URL = "http://localhost:5000/api/pedidos";

export const getPedidos = () => axios.get(API_URL);
export const getPedidoById = (id: number) => axios.get(`${API_URL}/${id}`);
export const createPedido = (data: any) => axios.post(API_URL, data);
export const updatePedido = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deletePedido = (id: number) => axios.delete(`${API_URL}/${id}`); 