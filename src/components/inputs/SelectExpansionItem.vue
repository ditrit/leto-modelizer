<template>
  <div v-if="children.length > 0">
    <q-expansion-item
      expand-separator
      :label="category"
      header-class="text-weight-medium"
      default-closed
    >
      <select-expansion-item
        v-for="child in children"
        :key="child.value"
        :value="child.value"
      />
    </q-expansion-item>
  </div>
  <div v-else>
    <q-item
      v-model="variableValue"
      v-ripple
      clickable
      @click="variableValue = value"
    >
      <q-item-section>
        {{ value }}
      </q-item-section>
    </q-item>
      <!-- <q-expansion-item
        expand-separator
        header-class="text-weight-bold"
        :label="category"
        :default-opened="hasValue(scope)"
      >
        <q-item
          v-ripple
          v-close-popup
          clickable
          :class="{ 'bg-light-blue-1' : localValue === value.name
            || (value.value != null && localValue === value.value) }"
          @click="localValue = [value.name]"
        >
          <q-item-section v-if="!scope.opt.values.category">
            <q-item-label
              class="q-ml-md"
            />
            <div v-html="value.name" />
          </q-item-section>
          <template
            #default
          >
            <q-expansion-item
              expand-separator
              header-class="text-weight-bold"
              :label="category"
              :default-opened="hasValue(scope)"
            >
              <template
                v-for="childrenCategory in category.children"
                :key="childrenCategory"
              >
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  :class="{ 'bg-light-blue-1' : localValue === value.name
                    || (value.value != null && localValue === value.value) }"
                  @click="localValue = [value.name]"
                >
                  <q-item-section>
                    <q-item-label
                      class="q-ml-md"
                    />
                    <div v-html="category.name" />
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
          </template>
        </q-item>
      </q-expansion-item> -->
  </div>
</template>

<script setup>
import {
  ref,
  watch,
} from 'vue';
import SelectExpansionItem from 'src/components/inputs/SelectExpansionItem';

const props = defineProps({
  category: {
    type: String,
    default: '',
  },

  children: {
    type: Array,
    default() {
      return [];
    },
  },

  value: {
    type: null,
    default: '',
  },
});

const emit = defineEmits(['update:model-value']);

const category = ref(props.category);
const children = ref(props.children);
const value = ref(props.value);
const variableValue = ref('');

console.log('variableValue', variableValue.value);

watch(() => variableValue.value, () => {
  console.log('variableValue', variableValue.value);
  emit('update:model-value', variableValue.value);
});
/**
 * Check if the given scope options contains the local value.
 * @param {Object} scope - The given scope.
 * @return {Boolean} true if one of the options equals the local value, otherwise false.
 */
// function hasValue(scope) {
//   if (!localValue.value) {
//     return false;
//   }
//   return scope.opt.values
//     .some((value) => value.name === localValue.value || value.value === localValue.value);
// }
</script>
