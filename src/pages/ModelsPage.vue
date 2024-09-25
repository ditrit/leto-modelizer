<template>
  <q-page>
    <div class="column items-center">
      <diagrams-card
        class="grid-container q-mt-md"
        :project-name="projectName"
      />
      <div class="row q-mt-xl grid-container">
        <template-grid
          type="DIAGRAM"
          @add:template="openImportModelTemplateDialog"
        >
          <template #header>
            {{ $t('page.models.template.create') }}
          </template>
        </template-grid>
      </div>
    </div>

    <create-model-dialog :project-name="projectName" />
    <create-a-i-model-dialog :project-name="projectName" />
    <delete-model-dialog :project-name="projectName" />
    <rename-model-dialog :project-name="projectName" />
    <import-model-template-dialog :project-name="projectName" />
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CreateModelDialog from 'components/dialog/CreateModelDialog.vue';
import CreateAIModelDialog from 'components/dialog/CreateAIModelDialog.vue';
import DeleteModelDialog from 'components/dialog/DeleteModelDialog.vue';
import RenameModelDialog from 'components/dialog/RenameModelDialog.vue';
import ImportModelTemplateDialog from 'components/dialog/ImportModelTemplateDialog.vue';
import TemplateGrid from 'components/grid/TemplateGrid.vue';
import DiagramsCard from 'components/card/DiagramsCard.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

const route = useRoute();
const projectName = computed(() => route.params.projectName);

/**
 * Open dialog to import template.
 * @param {object} template - Template to import.
 */
function openImportModelTemplateDialog(template) {
  DialogEvent.next({
    type: 'open',
    key: 'ImportModelTemplate',
    template,
  });
}
</script>

<style lang="scss" scoped>
.grid-container {
  width: 100%;
  max-width: 1275px;

  .project-grid, .template-grid {
    width: 100%;
  }
}
</style>
