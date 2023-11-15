import { boot } from 'quasar/wrappers';
import { createAcl, defineAclRules } from 'vue-simple-acl';
import { computed } from 'vue';
import { useUserStore } from 'stores/UserStore';

const userStore = useUserStore();
const userRoles = computed(() => ({ roles: userStore.roles }));
const rules = () => defineAclRules((setRule) => {
  setRule('create-diagram', (user) => !process.env.HAS_BACKEND || user.roles.includes('CF_createDiagram'));
  setRule('create-diagram-from-template', (user) => !process.env.HAS_BACKEND || user.roles.includes('CF_createDiagramFromTemplate'));
});

export default boot(({ app }) => {
  app.use(createAcl({
    user: userRoles,
    rules,
    disabledAttrTitle: 'Custom Disabled Title',
  }));
});
