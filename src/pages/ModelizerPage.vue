<template>
  <q-layout
    class="modelizer-page column"
    data-cy="modelizer-page"
  >
    <modelizer-navigation-bar
      :projectName="projectName"
      :viewType="viewType"
      @changeView="changeView"
    />
    <q-page-container>
      <q-page
        class="modelizer-page column"
        data-cy="modelizer-page"
      >
        <modelizer-model-view v-show="viewType === 'model'" />
        <modelizer-text-view
          v-show="viewType === 'text'"
          :viewType="viewType"
          :project-name="projectName"
        />
        <git-configuration-dialog :project-name="projectName"/>
        <git-new-branch-dialog :project-name="projectName"/>
        <git-update-dialog :project-name="projectName"/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  computed,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar';
import ModelizerModelView from 'src/components/ModelizerModelView';
import ModelizerTextView from 'src/components/ModelizerTextView';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import GitConfigurationDialog from 'components/dialog/GitConfigurationDialog';
import GitNewBranchDialog from 'components/dialog/GitNewBranchDialog';
import GitUpdateDialog from 'components/dialog/GitUpdateDialog';

const route = useRoute();
const router = useRouter();
const viewType = computed(() => route.params.viewType);
const projectName = computed(() => route.params.projectName);
let viewSwitchSubscription;

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
  viewSwitchSubscription = ViewSwitchEvent.subscribe(changeView);
});
onUnmounted(() => {
  viewSwitchSubscription.unsubscribe();
});
</script>

<style scoped>
.q-layout.modelizer-page>.q-page-container {
  padding-top: 0 !important;
}
</style>
