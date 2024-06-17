<template>
  <div id="app">
    <NavbarComponent />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavbarComponent from './components/NavbarComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    NavbarComponent
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@media (max-width: 992px) {
  .hide {
    display: none;
  }
  .ehoh {
    flex-wrap: nowrap !important;
  }
  .down {
    margin-top: 0.5rem !important;
  }
  .adapt {
    max-width: 100% !important;
  }
}

@media (max-width: 575px) {
  .hidePhone {
    display: none;
  }
  .down {
    margin-top: 0.75rem !important;
  }
}

.centerFlex {
  display: flex !important;
  align-items: center !important;
}

.nav-link {
  color:white !important;
  display: flex !important;
  align-items: center !important;
}

.navbar-left,
.navbar-right {
  display: flex !important;
  align-items: center !important;
}

.centerhv {
  color: white !important; 
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

.down {
  margin-top: 0.75rem;
}

.navbar-right {
  margin-left: auto !important;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.adapt {
  max-width: 80% !important;
}

.table th, .table td {
  padding: 10px;
  text-align: center; /* Align text to the left */
  vertical-align: middle; /* Center-align content vertically */
}

.table th {
  background-color: #f2f2f2;
}

.table .actions-column {
  display: flex;
  gap: 10px; /* Adjust the space between icons */
  justify-content: center; /* Center-align icons horizontally */
  align-items: center; /* Center-align icons vertically */
}

.table .actions-column a {
  display: inline-block;
  padding: 5px;
  text-decoration: none;
  color: #3b5998;
}

.table .actions-column i {
  font-size: 16px;
}

</style>
