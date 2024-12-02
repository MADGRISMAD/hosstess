<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Izquierdo -->
    <Sidebar />

    <!-- Contenido principal -->
    <div class="flex-1 p-8 overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="order in orderList" :key="order.id"
          @click="verOrden(order)"
          class="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-4"
        > 
          <h3 class="font-semibold mb-2 text-gray-800 truncate">{{ order.description }}</h3>
          <p class="text-sm text-gray-600 mb-4">Modalidad: {{ order.modality === 1 ? "Comer aqui" : "Domicilio" }}</p>
          <div class="flex justify-between items-center">
            <p class="text-gray-800 font-bold text-lg">Total: ${{ order.total }}</p>
            <p 
              class="text-gray-800 font-bold text-lg"
              :class="[ 
                order.complete ? 'text-green-500' : 'text-blue-500'
              ]"
            >{{ order.complete ? "LISTO" : "PENDIENTE" }}</p>
          </div>
          <div class="flex justify-between mt-8 items-center">
            <button class="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600"
              @click.stop="borrarOrden(order)">
              Borrar Orden
            </button>
            <button class="px-3 py-1 text-sm bg-green-500 text-white rounded-full hover:bg-green-600"
              @click.stop="completarOrden(order)">
              Completar Orden
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import { apiService } from "../apiService";
import { OrderVM } from '../Interfaces/Orders/';

export default defineComponent({
  name: 'OrderComponent',
  components: {
    Sidebar
  },
  data(){
    return{
      search: '',
      orderList: [] as OrderVM[],
    }
  },
  mounted() {
    this.getOrders();
  },
  methods:{
    getOrders() {
      apiService.getOrders().then((response) => {
        this.orderList = response;
      });
    },
    completarOrden(order: OrderVM){
      apiService.editOrderAsCompleted(order.id).then(() => {
        this.getOrders();
      });
    },
    borrarOrden(order: OrderVM){
      apiService.editOrderAsCompleted(order.id).then(() => {
        apiService.deleteOrder(order.id).then(() => {
          this.getOrders();
        });
      });
    }
  },
  computed:{
    
  }
});
</script>