import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import ShortProjectsItem from 'src/components/item/ShortProjectsItem.vue';
import ProjectEvent from 'src/composables/events/ProjectEvent';

installQuasarPlugin();

jest.mock('src/composables/events/ProjectEvent', () => ({
  UpdateProjectEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  getProjects: jest.fn(() => ({
    check: { id: 'Check' },
    zoom: { id: 'Zoom' },
    update: { id: 'update' },
    delete: { id: 'delete' },
    move: { id: 'Move' },
    add: { id: 'add' },
  })),
}));

describe('Test component: ShortProjectsItem', () => {
  let wrapper;
  let updateProjectSubscribe;
  let updateProjectUnsubscribe;

  beforeEach(() => {
    updateProjectSubscribe = jest.fn();
    updateProjectUnsubscribe = jest.fn();

    ProjectEvent.UpdateProjectEvent.subscribe.mockImplementation(() => {
      updateProjectSubscribe();
      return { unsubscribe: updateProjectUnsubscribe };
    });

    wrapper = shallowMount(ShortProjectsItem, {
      global: {
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
    });
  });

  describe('Test function: updateProjects', () => {
    it('should update projects list', () => {
      wrapper.vm.projects = [];
      wrapper.vm.updateProjects();

      expect(wrapper.vm.projects).toStrictEqual([
        { id: 'add' },
        { id: 'Check' },
        { id: 'delete' },
        { id: 'Move' },
      ]);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe UpdateProjectEvent', () => {
      expect(updateProjectSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe UpdateProjectEvent', () => {
      expect(updateProjectUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateProjectUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
