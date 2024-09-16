<template>
  <q-table
    bordered
    table-header-class="bg-grey-2 text-grey-7"
    :rows="errors"
    :columns="columns"
    row-key="message"
    data-cy="errors-table"
  >
    <template #body-cell-component="data">
      <q-td :props="data">
        <span
          class="body-link"
          @click="selectComponent(data.row.componentId)"
        >
          {{ data.value }}
        </span>
      </q-td>
    </template>
    <template #body-cell-file="data">
      <q-td :props="data">
        <span
          class="body-link"
          @click="selectFile(data.row.path)"
        >
          {{ data.value }}
        </span>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PluginEvent from 'src/composables/events/PluginEvent';

const { t } = useI18n();

const props = defineProps({
  errors: {
    type: Array,
    required: true,
  },
  editorType: {
    type: String,
    default: 'text',
  },
});

const columns = computed(() => {
  const array = [{
    name: 'severity',
    align: 'left',
    label: t('footer.consoleFooter.errorsTable.severity'),
    field: (row) => t(`parser.severity.${row.severity}`),
    style: 'width: 2rem',
  }];

  if (props.editorType === 'diagram') {
    array.push({
      name: 'component',
      align: 'center',
      label: t('footer.consoleFooter.errorsTable.component'),
      field: (row) => row.componentName,
      style: 'width: 2rem',
    });
    array.push({
      name: 'attribute',
      align: 'center',
      label: t('footer.consoleFooter.errorsTable.attribute'),
      field: (row) => row.attribute,
      style: 'width: 2rem',
    });
    array.push({
      name: 'file',
      align: 'center',
      label: t('footer.consoleFooter.errorsTable.file'),
      field: (row) => row.path,
      style: 'width: 2rem',
    });
  }

  array.push({
    name: 'line',
    align: 'center',
    label: t('footer.consoleFooter.errorsTable.line'),
    field: (row) => `${row.startLineNumber}-${row.endLineNumber}`,
    style: 'width: 2rem',
  });

  array.push({
    name: 'column',
    align: 'center',
    label: t('footer.consoleFooter.errorsTable.column'),
    field: (row) => `${row.startColumn}-${row.endColumn}`,
    style: 'width: 2rem',
  });

  array.push({
    name: 'message',
    align: 'left',
    label: t('footer.consoleFooter.errorsTable.message'),
    field: (row) => t(row.message, {
      initialErrorMessage: row.initialErrorMessage,
      extraData: row.extraData,
      attribute: row.attribute,
    }),
  });

  return array;
});

/**
 * Send event to select component and open its detail panel.
 * @param {string} id - Component id.
 */
function selectComponent(id) {
  PluginEvent.RequestEvent.next({
    type: 'select',
    ids: [id],
  });
  PluginEvent.RequestEvent.next({
    type: 'edit',
    id,
  });
}

/**
 * Send event to select file and open it in text editor.
 * @param {string} path - File path.
 */
function selectFile(path) {
  PluginEvent.RequestEvent.next({
    type: 'openFile',
    path,
  });
}
</script>

<style lang="scss">
.body-link {
  color: $info;
  text-decoration: underline;
  cursor: pointer;
}
</style>
