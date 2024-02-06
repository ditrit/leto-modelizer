import { boot } from 'quasar/wrappers';
import { createAcl, defineAclRules } from 'vue-simple-acl';
import { computed } from 'vue';
import { useUserStore } from 'stores/UserStore';

const userStore = useUserStore();
const userPermissions = computed(() => ({ permissions: userStore.permissions }));

const findPermission = (user, action, entity) => user.permissions.find(
  ({ action: userAction, entity: userEntity }) => userAction === action && userEntity === entity,
);

const rules = () => defineAclRules((setRule) => {
  setRule('admin', (user) => process.env.HAS_BACKEND && findPermission(user, 'ACCESS', 'ADMIN'));
  setRule('create-diagram', (user) => !process.env.HAS_BACKEND || findPermission(user, 'CREATE', 'DIAGRAM'));
  setRule('create-diagram-from-template', (user) => !process.env.HAS_BACKEND || findPermission(user, 'CREATE', 'DIAGRAM_TEMPLATE'));
  setRule('create-component', (user) => !process.env.HAS_BACKEND || findPermission(user, 'CREATE', 'COMPONENT'));
  setRule('create-component-from-template', (user) => !process.env.HAS_BACKEND || findPermission(user, 'CREATE', 'COMPONENT_TEMPLATE'));
  setRule('create-project', (user) => !process.env.HAS_BACKEND || findPermission(user, 'CREATE', 'COMPONENT'));
  setRule('create-project-from-template', (user) => !process.env.HAS_BACKEND || findPermission(user, 'CREATE', 'COMPONENT_TEMPLATE'));
  setRule('delete-diagram', (user) => !process.env.HAS_BACKEND || findPermission(user, 'DELETE', 'DIAGRAM'));
});

export default boot(({ app }) => {
  app.use(createAcl({
    user: userPermissions,
    rules,
    disabledAttrTitle: 'Custom Disabled Title',
  }));
});
