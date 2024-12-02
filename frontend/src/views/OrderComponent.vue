<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Izquierdo -->
    <Sidebar />

    <!-- Contenido principal -->
    <div class="flex-1 p-8 overflow-y-auto">
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import { apiService } from "../apiService";

export default defineComponent({
  name: 'OrderComponent',
  components: {
    Sidebar
  },
  data(){
    return{
      search: '',
    }
  },
  mounted() {
    this.getOrders();
  },
  methods:{
    getOrders() {
      apiService.getOrders().then((response) => {
        console.log(response);
      });
    }
  },
  computed:{
    
  }
});
</script>