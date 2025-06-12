import axios from "axios";
const API_URL = "http://localhost:5000/api/pagos";

export const getPagos = () => axios.get(API_URL);
export const getPagoById = (id: number) => axios.get(`${API_URL}/${id}`);
export const createPago = (data: any) => axios.post(API_URL, data);
export const updatePago = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deletePago = (id: number) => axios.delete(`${API_URL}/${id}`); 