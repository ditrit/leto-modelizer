<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md new-project-form"
    data-cy="new-project-form"
  >
    <q-input
      v-model="projectName"
      :label="$t('page.home.project.name')"
      :rules="[
        v => notEmpty($t, v),
        v => isUniqueProjectName($t, Object.keys(getProjects()), v)
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
        data-cy="submit-button"
        color="positive">
      </q-btn>
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

/**
 * Emit new project name.
 */
function onSubmit() {
  emit('project:create', projectName.value);
}
</script>

<style lang="scss" scoped>
.new-project-form {
  min-width: 400px;
}
</style>
