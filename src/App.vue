<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<script lang="ts">
import DefaultLayout from '../src/layouts/DefaultLayout.vue';

export default {
  components: { DefaultLayout },
};
</script>