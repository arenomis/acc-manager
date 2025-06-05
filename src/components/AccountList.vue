<template>
  <div class="bg-white p-4 rounded shadow-sm">
    <h2 class="mb-4 text-dark">Список учетных записей</h2>
    <ul class="list-group list-group-flush">
      <li
        v-for="account in accounts"
        :key="account.id"
        class="list-group-item d-flex justify-content-between align-items-center py-3"
      >
        <span>{{ account.login }} <small class="text-muted">({{ account.type }})</small></span>
        <div>
          <button
            @click="editAccount(account.id)"
            class="btn btn-sm btn-outline-warning me-2"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            @click="removeAccount(account.id)"
            class="btn btn-sm btn-outline-danger"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </li>
    </ul>
    <button @click="goToAddAccount" class="btn btn-success btn-sm mt-3 px-3">
      <i class="bi bi-plus-circle me-1"></i> Добавить учетную запись
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountsStore } from '../stores/account';

export default defineComponent({
  setup() {
    const accountsStore = useAccountsStore();
    const router = useRouter();

    const editAccount = (id: string) => {
      router.push(`/edit/${id}`);
    };

    const goToAddAccount = () => {
      router.push('/add');
    };

    return {
      accounts: computed(() => accountsStore.getAccounts),

      removeAccount: (id: string) => accountsStore.removeAccount(id),

      editAccount,
      goToAddAccount,
    };
  },
});
</script>