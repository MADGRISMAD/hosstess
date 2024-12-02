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
