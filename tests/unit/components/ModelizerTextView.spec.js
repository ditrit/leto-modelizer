import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerTextView from 'src/components/ModelizerTextView.vue';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: ModelizerTextView', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelizerTextView, {
      props: {
        projectName: 'project-00000000',
      },
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

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test variable: showParsableFiles', () => {
      it('should be false', () => {
        expect(wrapper.vm.showParsableFiles).toEqual(false);
      });
    });
  });
});
