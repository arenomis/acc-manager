import { defineStore } from 'pinia';

export interface Account {
  id: string;
  type: 'Local' | 'LDAP';
  login: string;
  password?: string;
  tags: { text: string }[];
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  getters: {
    getAccounts(state) {
      return state.accounts;
    },
  },
  actions: {
    removeAccount(id: string) {
      this.accounts = this.accounts.filter((account) => account.id !== id);
      this.saveToLocalStorage();
    },
    addAccount(account: Account) {
      this.accounts.push({ ...account, id: String(Date.now()) });
      this.saveToLocalStorage();
    },
    updateAccount(id: string, updatedAccount: Partial<Account>) {
      const account = this.accounts.find((a) => a.id === id);
      if (account) {
        Object.assign(account, updatedAccount);
        this.saveToLocalStorage();
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts));
    },
    loadFromLocalStorage() {
      const savedAccounts = localStorage.getItem('accounts');
      if (savedAccounts) {
        this.accounts = JSON.parse(savedAccounts);
      } else {
        console.log('No accounts found in localStorage');
      }
    },
    initialize() {
      this.loadFromLocalStorage();
    },
  },
});