<template>
  <div>
    <h2 class="mb-4 text-dark">
      {{ isEditing ? 'Редактировать учетную запись' : 'Добавить учетную запись' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="bg-white p-4 rounded shadow-sm">

      <div class="mb-3">
        <label class="form-label">Тип:</label>
        <select v-model="account.type" class="form-select form-select-sm rounded">
          <option value="Local">Локальный</option>
          <option value="LDAP">LDAP</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Логин:</label>
        <input
          v-model="account.login"
          required
          class="form-control"
          :class="{ 'is-invalid': showErrorLogin }"
          autocomplete="username"
          @blur="validateLogin"
          @input="limitLoginLength"
        />
        <div v-if="showErrorLogin" class="invalid-feedback">
          Логин должен содержать минимум 3 символа.
        </div>
      </div>

      <div class="mb-3" v-show="account.type === 'Local'">
        <label class="form-label">Пароль:</label>
        <div :class="['input-group', { 'is-invalid': showErrorPassword }]">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="account.password"
            :required="account.type === 'Local'"
            class="form-control"
            @blur="validatePassword"
            @input="limitPasswordLength"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="togglePasswordVisibility"
          >
            <i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>
        <div v-if="showErrorPassword" class="invalid-feedback">
          Пароль должен содержать минимум 6 символов.
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Метки:</label>
        <small class="text-muted d-block mb-2">Введите через точку с запятой. Пример: dev; prod; staging</small>
        <input
          v-model="rawTagsInput"
          @keydown.enter="addTag"
          placeholder="Введите через точку с запятой"
          class="form-control form-control-sm mb-2"
        />

        <div class="tag-container border rounded p-2 bg-light" style="min-height: 50px;">
          <span
            v-for="(tag, index) in displayedTags"
            :key="index"
            class="badge bg-light text-dark border me-1 mb-1"
            style="font-size: 0.8rem;"
          >
            {{ tag.text }}
          </span>
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <button
          type="submit"
          class="btn btn-primary btn-sm px-4"
          :disabled="!isValidForm"
        >
          {{ isEditing ? 'Сохранить' : 'Добавить' }}
        </button>
        <button
          type="button"
          @click="cancel"
          class="btn btn-outline-secondary btn-sm px-4"
        >
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountsStore } from '../stores/account';

export default defineComponent({
  setup() {
    const accountsStore = useAccountsStore();
    const router = useRouter();
    const route = useRoute();

    const rawTagsInput = ref('');

    const accountId = route.params.id as string | undefined;
    const isEditing = computed(() => !!accountId);

    const account = reactive({
      id: '',
      type: 'Local' as 'Local' | 'LDAP',
      login: '',
      password: null as string | null,
      tags: [] as { text: string }[],
    });

    if (isEditing.value && accountId) {
      const existingAccount = accountsStore.accounts.find(a => a.id === accountId);
      if (existingAccount) {
        Object.assign(account, existingAccount);
        rawTagsInput.value = account.tags.map(t => t.text).join('; ');
      }
    }

    const showPassword = ref(false);
    const showErrorLogin = ref(false);
    const showErrorPassword = ref(false);

    const validateLogin = () => {
      showErrorLogin.value = account.login.trim().length < 3;
    };

    const limitLoginLength = () => {
      account.login = account.login.slice(0, 100);
    };

    const validatePassword = () => {
      if (account.type === 'Local') {
        const trimmed = account.password?.trim() || '';
        showErrorPassword.value = trimmed.length < 6;
      } else {
        showErrorPassword.value = false;
      }
    };

    const limitPasswordLength = () => {
      if (account.type === 'Local' && account.password !== null) {
        account.password = account.password.slice(0, 100);
      }
    };

    const parseTagsFromString = (input: string): { text: string }[] => {
      return input
        .split(';')
        .map(tag => tag.trim())
        .filter(tag => tag !== '' && tag.length <= 50)
        .filter((tag, index, arr) => arr.indexOf(tag) === index)
        .map(tag => ({ text: tag }));
    };

    const addTag = (event: KeyboardEvent) => {
      const trimmed = rawTagsInput.value.trim();
      if (trimmed && !trimmed.endsWith(';')) {
        rawTagsInput.value = trimmed + '; ';
        event.preventDefault(); // Останавливаем отправку формы при Enter
      }
    };

    watch(
      () => rawTagsInput.value,
      (newVal) => {
        account.tags = parseTagsFromString(newVal);
      }
    );

    watch(
      () => account.type,
      (newType) => {
        if (newType !== 'Local') {
          account.password = null;
          showErrorPassword.value = false;
        }
      }
    );

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const isValidForm = computed(() => {
      const validLogin = account.login.trim().length >= 3;
      const validPassword =
        account.type !== 'Local' ||
        (account.password !== null && account.password.trim().length >= 6);
      return validLogin && validPassword;
    });

    const handleSubmit = () => {
      validateLogin();
      validatePassword();

      if (!isValidForm.value) return;

      if (isEditing.value) {
        accountsStore.updateAccount(account.id, {
          ...account,
          password: account.password ?? undefined
        });
      } else {
        accountsStore.addAccount({
          ...account,
          password: account.password ?? undefined
        });
      }

      router.push('/');
    };

    const cancel = () => {
      router.push('/');
    };

    return {
      account,
      rawTagsInput,
      showPassword,
      showErrorLogin,
      showErrorPassword,
      addTag,
      togglePasswordVisibility,
      validateLogin,
      validatePassword,
      isValidForm,
      handleSubmit,
      cancel,
      isEditing,
      displayedTags: computed(() => parseTagsFromString(rawTagsInput.value)),
      limitLoginLength,
      limitPasswordLength,
    };
  },
});
</script>