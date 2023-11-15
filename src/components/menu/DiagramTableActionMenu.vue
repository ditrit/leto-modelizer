<template>
  <q-menu
    ref="menu"
    class="diagrams-table-action-menu"
    data-cy="diagrams-table-action-menu"
  >
    <q-list style="min-width: 150px">
      <q-item
        clickable
        data-cy="rename-diagram-action-item"
        @click="renameDiagram"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            size="xs"
            name="fa-solid fa-pen"
          />
        </q-item-section>
        <q-item-section>
          {{ $t('actions.default.modify') }}
        </q-item-section>
      </q-item>
      <q-item
        clickable
        :title="$acl.role('delete-diagram')
          ? $t('actions.models.delete.button.title')
          : $t('errors.permissionsDenied')"
        :disable="!$acl.role('delete-diagram')"
        data-cy="delete-diagram-action-item"
        @click="deleteDiagram"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            size="xs"
            name="fa-solid fa-trash"
          />
        </q-item-section>
        <q-item-section>
          {{ $t('actions.default.delete') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import { ref } from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';

const props = defineProps({
  diagram: {
    type: Object,
    required: true,
  },
});

const menu = ref(null);

/**
 * Open RenameModel dialog and close menu.
 */
function renameDiagram() {
  DialogEvent.next({
    type: 'open',
    key: 'RenameModel',
    model: props.diagram,
  });
  menu.value.hide();
}

/**
 * Open DeleteModel dialog and close menu.
 */
function deleteDiagram() {
  DialogEvent.next({
    type: 'open',
    key: 'DeleteModel',
    model: props.diagram,
  });
  menu.value.hide();
}
</script>
