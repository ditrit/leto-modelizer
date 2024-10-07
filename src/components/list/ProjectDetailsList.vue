<template>
  <q-list style="max-width: 350px">
    <q-item>
      <q-item-section>
        <q-breadcrumbs active-color="accent">
          <q-breadcrumbs-el
            label="Projects"
            to="/"
          />
          <q-breadcrumbs-el
            v-if="level >= 1"
            label="Diagrams"
            :to="`/projects/${projectName}/models`"
          />
          <q-breadcrumbs-el
            v-if="level >= 2"
            :label="path"
            :title="$route.query.path"
          />
        </q-breadcrumbs>
      </q-item-section>
    </q-item>
    <q-item class="q-pl-none">
      <q-item-section avatar>
        <q-img
          :src="getProjectImage()"
          height="120px"
          width="120px"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label style="word-break: break-all;">
          {{ projectName }}
        </q-item-label>
        <q-item-label v-if="project.git.repository !== null">
          <a :href="project.git.repository" target="_blank">View on git provider</a>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import jdenticon from 'jdenticon/standalone';
import { getProjectById } from 'src/composables/Project';

defineProps({
  level: {
    type: Number,
    required: true,
  },
});

const route = useRoute();
const projectName = computed(() => route.params.projectName);
const project = computed(() => getProjectById(route.params.projectName));
const path = computed(() => {
  const text = route.query.path;
  const { length } = text;
  const maxLen = 15;

  if (length > maxLen) {
    return `...${text.slice(length - maxLen)}`;
  }
  return text;
});

/**
 * Get image of project.
 * Use JIdenticon to generate the project image.
 * @returns {string} Image value.
 */
function getProjectImage() {
  const image = jdenticon.toSvg(projectName.value, 200);
  const base64Data = btoa(image);

  return `data:image/svg+xml;base64,${base64Data}`;
}
</script>

<style scoped lang="scss">

</style>
