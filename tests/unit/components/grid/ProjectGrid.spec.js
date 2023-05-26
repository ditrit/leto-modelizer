import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ProjectGrid from 'src/components/grid/ProjectGrid.vue';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: ProjectGrid', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ProjectGrid, {
      props: {
        projects: [{ id: 'test' }],
      },
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: definitions', () => {
      it('should match array of projects', () => {
        expect(wrapper.vm.projects).toStrictEqual([{ id: 'test' }]);
      });
    });
  });

  describe('Test function: onToggleTag', () => {
    it('should toggle wanted tag', () => {
      expect(wrapper.vm.tags.length).toEqual(2);
      expect(wrapper.vm.tags[0].active).toEqual(false);
      expect(wrapper.vm.tags[1].active).toEqual(false);

      wrapper.vm.onToggleTag(wrapper.vm.tags[0].key);
      expect(wrapper.vm.tags[0].active).toEqual(true);
      expect(wrapper.vm.tags[1].active).toEqual(false);

      wrapper.vm.onToggleTag(wrapper.vm.tags[1].key);
      expect(wrapper.vm.tags[0].active).toEqual(true);
      expect(wrapper.vm.tags[1].active).toEqual(true);

      wrapper.vm.onToggleTag(wrapper.vm.tags[0].key);
      expect(wrapper.vm.tags[0].active).toEqual(false);
      expect(wrapper.vm.tags[1].active).toEqual(true);

      wrapper.vm.onToggleTag(wrapper.vm.tags[1].key);
      expect(wrapper.vm.tags[0].active).toEqual(false);
      expect(wrapper.vm.tags[1].active).toEqual(false);
    });
  });
});
