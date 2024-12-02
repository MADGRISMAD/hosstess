import { TableVM } from "../Tables";

export interface OrderDTO {
  mesa: string; // Id of the table
  description: string;
  creationDate: string;
  ready: boolean;
  complete: boolean;
  modality: number;
  foods: OrderItem[];
}

export interface OrderItem {
  food: string; // Id of the food
  quantity: number;
}

export interface OrderVM {
  id: string;
  table: TableVM;
  description: string;
  creationDate: string;
  complete: boolean;
  ready: boolean;
  modality: number;
  fee: number;
  iva: number;
  subtotal: number;	
  total: number;
}

