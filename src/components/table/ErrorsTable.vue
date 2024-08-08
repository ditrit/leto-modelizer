<template>
  <q-table
    bordered
    table-header-class="bg-grey-2 text-grey-7"
    :rows="errors"
    :columns="columns"
    row-key="message"
    data-cy="errors-table"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

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
  const severityColumn = {
    name: 'severity',
    align: 'left',
    label: t('footer.consoleFooter.errorsTable.severity'),
    field: (row) => t(`parser.severity.${row.severity}`),
    style: 'width: 2rem',
  };
  const messageColumn = {
    name: 'message',
    align: 'left',
    label: t('footer.consoleFooter.errorsTable.message'),
    field: (row) => t(row.message, {
      initialErrorMessage: row.initialErrorMessage,
      extraData: row.extraData,
      attribute: row.attribute,
    }),
  };

  if (props.editorType === 'text') {
    return [
      severityColumn,
      {
        name: 'line',
        align: 'center',
        label: t('footer.consoleFooter.errorsTable.line'),
        field: (row) => `${row.startLineNumber}-${row.endLineNumber}`,
        style: 'width: 2rem',
      },
      {
        name: 'column',
        align: 'center',
        label: t('footer.consoleFooter.errorsTable.column'),
        field: (row) => `${row.startColumn}-${row.endColumn}`,
        style: 'width: 2rem',
      },
      messageColumn,
    ];
  }

  return [
    severityColumn,
    {
      name: 'component',
      align: 'center',
      label: t('footer.consoleFooter.errorsTable.component'),
      field: (row) => row.componentId,
      style: 'width: 2rem',
    },
    {
      name: 'attribute',
      align: 'center',
      label: t('footer.consoleFooter.errorsTable.attribute'),
      field: (row) => row.attribute,
      style: 'width: 2rem',
    },
    messageColumn,
  ];
});
</script>
