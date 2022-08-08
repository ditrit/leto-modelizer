<template>
  <q-page
    class="modelizer-page column"
    data-cy="modelizer-page"
  >
    <q-layout>
      <modelizer-navigation-bar
        :projectName="projectName"
        :viewType="viewType"
        @changeView="changeView"
      />
      <modelizer-model-view v-show="viewType === 'model'" />
      <modelizer-text-view v-show="viewType === 'text'" :viewType="viewType" />
    </q-layout>
  </q-page>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar';
import ModelizerModelView from 'src/components/ModelizerModelView';
import ModelizerTextView from 'src/components/ModelizerTextView';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';

const route = useRoute();
const router = useRouter();
const viewType = computed(() => route.params.viewType);
const projectName = computed(() => route.params.projectName);
const viewSwitchSubscription = ref();

/**
 * Update the route with the new view type.
 *
 * @param {string} newViewType
 */
function changeView(newViewType) {
  if (newViewType !== viewType.value) {
    router.push({
      name: 'modelizer',
      params: {
        viewType: newViewType,
        projectName: projectName.value,
      },
    });
  }
}

onMounted(() => {
  viewSwitchSubscription.value = ViewSwitchEvent.on(changeView);
});
onUnmounted(() => {
  ViewSwitchEvent.off(viewSwitchSubscription.value);
});
</script>
