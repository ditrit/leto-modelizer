<template>
  <q-form
    class="q-gutter-md create-project-form"
    data-cy="create-project-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="projectName"
      :label="$t('page.home.project.name')"
      :rules="[
        v => notEmpty($t, v),
        v => isUniqueProjectName($t, projectNames, v)
      ]"
      filled
      lazy-rules
      data-cy="name-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        :label="$t(`actions.home.createProject`)"
        icon="fa-solid fa-save"
        type="submit"
        color="positive"
        data-cy="submit-button"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import {
  notEmpty,
  isUniqueProjectName,
} from 'src/composables/QuasarFieldRule';
import {
  getProjects,
} from 'src/composables/Project';

const emit = defineEmits(['project:create']);

const projectName = ref('');
const projectNames = ref(Object.keys(getProjects()));

/**
 * Emit created project name.
 */
function onSubmit() {
  emit('project:create', projectName.value);
}
</script>

<style lang="scss" scoped>
.create-project-form {
  min-width: 400px;
}
</style>
