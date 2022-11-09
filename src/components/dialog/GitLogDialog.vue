<template>
  <default-dialog dialog-key="GitLog" data-cy="git-log-dialog">
    <template v-slot:title>
      <q-icon color="primary" name="fa-brands fa-git-alt" />
      {{ $t('page.modelizer.git.log.title') }}
    </template>
    <template v-slot:default>
      <div ref="scrollTargetRef" style="max-height: 250px; overflow: auto;">
        <q-infinite-scroll
          @load="onLoad"
          :offset="250"
          :scroll-target="scrollTargetRef"
        >
          <q-list>
            <template v-for="(item) in logItems" :key="item.oid">
              <q-expansion-item
                header-class="bg-primary text-white"
                expand-icon-class="text-white"
                expand-separator
              >
                <template v-slot:header>
                  <q-item-section class="text-bold" color="primary" avatar>
                    {{item.oid.slice(0, 8)}}
                  </q-item-section>
                  <q-item-section>
                    {{ truncateCommitMessage(item.commit.message) }}
                  </q-item-section>
                </template>
                <q-list dense class="bg-secondary text-white">
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar icon="fa-solid fa-hashtag"/>
                    </q-item-section>
                    <q-item-section>
                      {{item.oid}}
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar icon="fa-solid fa-user"/>
                    </q-item-section>
                    <q-item-section>
                      {{item.commit.author.name}} &#60;{{item.commit.author.email}}&#62;
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar icon="fa-solid fa-calendar"/>
                    </q-item-section>
                    <q-item-section>
                      {{new Date(item.commit.committer.timestamp * 1000).toLocaleString()}}
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar icon="fa-solid fa-message"/>
                    </q-item-section>
                    <q-item-section>
                      <p v-html="$sanitize(item.commit.message.replaceAll('\n', '<br>'))"></p>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </template>
          </q-list>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </template>
  </default-dialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import DefaultDialog from 'components/dialog/DefaultDialog';
import DialogEvent from 'src/composables/events/DialogEvent';
import { gitLog } from 'src/composables/Project';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
const scrollTargetRef = ref(null);
const logItems = ref([]);
const branchName = ref(null);
let dialogEventSubscription;

/**
 * Load logs.
 * First execution will load 25 logs from current log. The next executions will load 26 logs
 * because the last previous log will be the first one (and will be removed to avoid duplication).
 * @param {Number} index - The index parameter can be used to make some sort of pagination on the
 * content you load. It takes numeric values starting with 1 and incrementing with each call.
 * @param {Function} done - Function to call when you made all necessary updates.
 * @see https://quasar.dev/vue-components/infinite-scroll
 */
function onLoad(index, done) {
  let commitRef = branchName.value;
  let depth = 25;

  if (logItems.value.length !== 0) {
    depth = 26;
    commitRef = logItems.value[logItems.value.length - 1].oid;
  }

  return gitLog(props.projectName, commitRef, depth).then((logs) => {
    logs
      .filter((log) => log.oid !== commitRef)
      .forEach((log) => logItems.value.push(log));
    done(logs.length < depth);
  });
}

/**
 * Set branch name on valid event.
 * @param {String} key - Event type.
 * @param {String} branch - Branch name.
 */
function setBranchName({ key, branch }) {
  if (key === 'GitLog') {
    branchName.value = branch;
  }
}

/**
 * Truncate commit message at new line character.
 * @param {String} message - Message to truncate.
 * @returns {String} Truncated message.
 */
function truncateCommitMessage(message) {
  const index = message.indexOf('\n');
  if (index >= 0) {
    return message.slice(0, index);
  }
  return message;
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setBranchName);
});
onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
