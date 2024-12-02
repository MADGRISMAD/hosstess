<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Izquierdo -->
    <Navbar />
    <!-- Contenido principal -->
    <div class="flex-1 p-8 overflow-y-auto">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Gourmet Delicatessen</h1>
          <p class="text-sm text-gray-500">Martes, 2 de Febrero 2023</p>
        </div>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input v-model="search"
            class="w-64 pl-10 bg-white border border-gray-300 rounded-full shadow-md focus:ring focus:ring-indigo-500"
            placeholder="Buscar productos gourmet..." />
        </div>
      </div>
      <!-- Selección de Mesa -->
      <!-- Selección de Mesa -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Selecciona una Mesa</h2>
        <div class="flex flex-wrap gap-4 justify-start">
          <div
            v-for="mesa in availableTables"
            :key="mesa.id"
            @click="seleccionarMesa(mesa)"
            :class="[
              'flex items-center p-4 w-64 h-20 rounded-lg shadow cursor-pointer transition-all border',
              mesaSeleccionada?.id === mesa.id ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white hover:bg-gray-100'
            ]"
          >
            <div
              class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full"
              :class="mesaSeleccionada?.id === mesa.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'"
            >
              🪑
            </div>
            <div class="ml-4">
              <h3 class="font-bold text-gray-800">{{ mesa.nombre }}</h3>
              <p class="text-sm text-gray-500">Capacidad: {{ mesa.capacidad }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Categorías y vista principal -->
      <div>
        <!-- Categorías -->
        <div class="mb-8">
          <div class="flex space-x-4 mb-6 overflow-x-auto pb-2">
            <button v-for="menu in menus" :key="menu.id || menu.name"
              class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 shadow"
              @click="loadMenuProducts(menu.id)">
              {{ menu.name || 'Sin Nombre' }}
            </button>
          </div>
        </div>

        <!-- Productos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="producto in productosFiltrados" :key="producto.id || producto.name"
            @click="agregarAOrden(producto)"
            class="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-4">
            <div class="h-40 bg-gray-200 rounded-md mb-4 overflow-hidden flex items-center justify-center">
              <img v-if="producto.imgURL" :src="producto.imgURL" alt="Imagen del producto"
                class="object-cover w-full h-full" @error="producto.imgURL = 'ruta_de_respaldo.jpg'" />
            </div>
            <h3 class="font-semibold mb-2 text-gray-800 truncate">{{ producto.name || 'Producto Desconocido' }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ producto.description || 'Sin descripción disponible' }}</p>
            <div class="flex justify-between items-center">
              <p class="text-gray-800 font-bold text-lg">${{ producto.price || '0.00' }}</p>
              <button class="px-3 py-1 text-sm bg-green-500 text-white rounded-full hover:bg-green-600"
                @click.stop="agregarAOrden(producto)">
                Agregar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Sidebar Derecho -->
    <LSidebar :mesaSeleccionada="mesaSeleccionada" />
  </div>
</template>




<script>
import Navbar from "../components/Sidebar.vue";
import LSidebar from "../components/LSidebar.vue";
import { ref, computed, onMounted } from "vue";
import { apiService } from "../apiService";
import { store } from "../store";

export default {
  components: {
    Navbar,
    LSidebar,
  },
  setup() {
    const search = ref("");
    const menus = ref([]);
    const productos = ref([]);
    const tables = ref([]); // Todas las mesas

    // Mesa seleccionada (estado compartido con el store)
    const mesaSeleccionada = computed(() => store.mesaSeleccionada);

    // Computados
    const availableTables = computed(() =>
      tables.value.filter((table) => table.disponible)
    );

    const productosFiltrados = computed(() => {
      if (!search.value) return productos.value;
      return productos.value.filter((producto) =>
        producto.name?.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    // Métodos
    const fetchMenus = async () => {
      try {
        const data = await apiService.getAllMenus();
        menus.value = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error al obtener los menús:", error);
      }
    };

    const fetchTables = async () => {
      try {
        const data = await apiService.getTables();
        tables.value = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error al obtener las mesas:", error);
      }
    };

    const loadMenuProducts = async (menuId) => {
      if (!menuId) {
        console.error("El ID del menú no es válido.");
        return;
      }
      try {
        const menu = await apiService.getMenuById(menuId);
        productos.value = Array.isArray(menu.foods) ? menu.foods : [];
      } catch (error) {
        console.error(`Error al cargar productos del menú con ID ${menuId}:`, error);
      }
    };

    const agregarAOrden = (producto) => {
      if (!mesaSeleccionada.value) {
        alert("Por favor selecciona una mesa antes de agregar productos.");
        return;
      }

      store.platillosSeleccionados.push({
        ...producto,
        quantity: 1,
        tableId: mesaSeleccionada.value.id, // Agregar el ID de la mesa al producto
      });
    };

    const seleccionarMesa = (mesa) => {
      store.mesaSeleccionada = mesa; // Actualiza la mesa seleccionada en el store
    };

    onMounted(() => {
      fetchMenus();
      fetchTables();
    });

    return {
      search,
      menus,
      productos,
      tables,
      availableTables,
      mesaSeleccionada,
      productosFiltrados,
      loadMenuProducts,
      agregarAOrden,
      seleccionarMesa,
    };
  },
};

</script>
