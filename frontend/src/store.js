import { reactive } from "vue";

export const store = reactive({
  platillosSeleccionados: [], // Lista de productos seleccionados
  mesaSeleccionada: null, // Información de la mesa seleccionada
});
