<template>
  <div class="bg-white p-4 rounded shadow-sm">
    <h2 class="mb-4 text-dark">Список учетных записей</h2>

    <div v-if="accounts.length === 0" class="alert alert-info mt-3">
      Список учетных записей пуст.
    </div>

    <ul v-else class="list-group list-group-flush">
      <li
        v-for="account in accounts"
        :key="account.id"
        class="list-group-item d-flex justify-content-between align-items-start py-3"
      >
        <div class="d-flex flex-column">
          <strong>{{ account.login }}</strong>
          <small class="text-muted">Тип: {{ account.type }}</small>
          <small class="text-muted">
            Метки: {{ account.tags.map(t => t.text).join(', ') || '—' }}
          </small>
        </div>
        <div>
          <button
            @click="editAccount(account.id)"
            class="btn btn-sm btn-outline-warning me-2"
            title="Редактировать"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            @click="removeAccount(account.id)"
            class="btn btn-sm btn-outline-danger"
            title="Удалить"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </li>
    </ul>

    <button
      @click="goToAddAccount"
      class="btn btn-success btn-sm mt-3 px-3"
    >
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
    const accounts = computed(() => accountsStore.accounts);

    const editAccount = (id: string) => {
      router.push(`/edit/${id}`);
    };

    const goToAddAccount = () => {
      router.push('/add');
    };

    const removeAccount = (id: string) => {
      accountsStore.removeAccount(id);
    };

    return {
      accounts,
      editAccount,
      goToAddAccount,
      removeAccount,
    };
  },
});
</script>