<template>
  <div class="row items-center">
    <template v-if="!attribute.definition && !!inputList[attributeType]">
      <q-input
        v-model="name"
        :label="$t('plugin.component.attribute.name')"
        class="col-4 q-px-md q-pb-sm"
        @update:model-value="(event) => emit('update:attribute-name', event)"
      />
      <span>:</span>
    </template>
    <component
      :is="inputList[attributeType]"
      :attribute="attribute"
      :plugin="plugin"
      :label="label"
      class="col q-px-md q-pb-sm"
      @update:model-value="(event) => emit('update:attribute-value', event)"
    />
  </div>
</template>

<script setup>
import {
  ref,
  defineAsyncComponent,
  computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  plugin: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const attributeType = ref(props.attribute.definition?.type || props.attribute.type);
const name = ref(!props.attribute.definition ? props.attribute.name : '');

const label = computed(() => {
  if (props.attribute.definition) {
    return props.attribute.name;
  }
  if (attributeType.value === 'Boolean') {
    return '';
  }
  return t('plugin.component.attribute.value');
});

const emit = defineEmits(['update:attribute-name', 'update:attribute-value']);

const inputList = {
  Boolean: defineAsyncComponent(() => import('./BooleanInput')),
  String: defineAsyncComponent(() => import('./StringInput')),
  Number: defineAsyncComponent(() => import('./NumberInput')),
  Reference: defineAsyncComponent(() => import('./ReferenceInput')),
};
</script>
