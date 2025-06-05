<template>
  <div class="container mt-4">
    <header class="mb-4 text-center">
      <h1 class="text-primary fw-normal">Управление учетными записями</h1>
      <nav class="d-flex justify-content-center gap-3 mt-3">
        <router-link to="/" class="btn btn-outline-primary rounded-pill px-4">Список учетных записей</router-link>
        <router-link to="/add" class="btn btn-success rounded-pill px-4">Добавить учетную запись</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DefaultLayout',
};
</script>