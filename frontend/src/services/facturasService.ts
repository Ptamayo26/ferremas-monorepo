import axios from "axios";
const API_URL = "http://localhost:5000/api/facturas";

export const getFacturas = () => axios.get(API_URL);
export const getFacturaById = (id: number) => axios.get(`${API_URL}/${id}`);
export const createFactura = (data: any) => axios.post(API_URL, data);
export const anularFactura = (id: number) => axios.post(`${API_URL}/${id}/anular`); 