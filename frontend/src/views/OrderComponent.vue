<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Izquierdo -->
    <Sidebar />

    <!-- Contenido principal -->
    <div class="flex-1 p-8 overflow-y-auto">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">MeSSas</h1>
        <p class="text-sm text-gray-500">{{ new Date().toLocaleString() }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="order in orderList" :key="order.id"
          @click="verOrden(order)"
          class="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-4"
        > 
          {{ console.log(order) }}
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
    <div v-if="showCheckout" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-8 shadow-lg w-1/3">
        <h3 class="text-lg font-semibold mb-4">Detalle de orden {{ selectedOrder.description }}</h3>
        <p class="text-lg font-semibold mb-4">Mesa: <span class="text-base font-normal"> {{ selectedOrder.table.nombre }}</span></p>
        <p class="text-lg font-semibold mb-4"> Productos ordenados </p>
        <div class="flex flex-col w-full h-full justify-between space-y-8 overflow-y-auto max-h-96">
          <div v-for="product in selectedOrder.foods" class="flex space-x-4 text-center items-center" :key="product.id">
            <img :src="product.food.imgURL" :alt="product.food.name + ' Image'" class="w-32 h-32" />
            <div class="w-full text-left text-wrap break-words">
              <p class="font-semibold ">{{ product.food.name }}</p>
              <p>{{ product.food.description }}</p>
            </div>
            <div class="justify-self-end w-full">
              <div class="flex flex-col">
                <p>Cantidad: {{ product.quantity }}</p>
                <p>Total: ${{ product.totalPriceForItem }}</p> 
              </div>
            </div>
          </div>
        </div>
        <p>SubTotal: ${{ selectedOrder.subtotal }}</p>
        <p>IVA: ${{ selectedOrder.iva }}</p>
        <p>Total: ${{ selectedOrder.total }}</p>
        <div class="flex justify-between">
          <button @click="completarOrden(selectedOrder)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Completar Orden</button>
          <button @click="verOrden(selectedOrder)" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cerrar</button>
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
      selectedOrder: {} as OrderVM,
      showCheckout: false as boolean,
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
        this.showCheckout = false;
        this.getOrders();
      });
    },
    borrarOrden(order: OrderVM){
      apiService.editOrderAsCompleted(order.id).then(() => {
        apiService.deleteOrder(order.id).then(() => {
          this.getOrders();
        });
      });
    },
    verOrden(order: OrderVM) {
      this.selectedOrder = order;
      this.showCheckout = !this.showCheckout;
    }
  },
  computed:{
    
  }
});
</script>