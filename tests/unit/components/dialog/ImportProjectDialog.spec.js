import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import ImportProjectDialog from 'src/components/dialog/ImportProjectDialog.vue';
import { useRouter } from 'vue-router';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

describe('Test component: ImportProjectDialog', () => {
  let wrapper;
  const push = jest.fn();

  useRouter.mockImplementation(() => ({
    push,
  }));

  beforeEach(() => {
    wrapper = shallowMount(ImportProjectDialog, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test functions', () => {
    describe('Test function: importProject', () => {
      it('should redirect to project model page', async () => {
        await wrapper.vm.importProject('test');
        expect(push).toBeCalledWith('/projects/test/models');
      });
    });
  });
});
