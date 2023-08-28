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

defineProps({
  errors: {
    type: Array,
    required: true,
  },
});

const columns = computed(() => [
  {
    name: 'severity',
    align: 'left',
    label: t('footer.consoleFooter.errorsTable.severity'),
    field: 'severity',
    style: 'width: 2rem',
  },
  {
    name: 'line',
    align: 'center',
    label: t('footer.consoleFooter.errorsTable.line'),
    field: (row) => `${row.startLine}-${row.endLine}`,
    style: 'width: 2rem',
  },
  {
    name: 'column',
    align: 'center',
    label: t('footer.consoleFooter.errorsTable.column'),
    field: (row) => `${row.startColumn}-${row.endColumn}`,
    style: 'width: 2rem',
  },
  {
    name: 'message',
    align: 'left',
    label: t('footer.consoleFooter.errorsTable.message'),
    field: 'message',
  },
]);
</script>
