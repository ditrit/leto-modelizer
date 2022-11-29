import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ImportProjectForm from 'src/components/form/ImportProjectForm.vue';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  importProject: jest.fn((project) => {
    if (project.id === 'error') {
      return Promise.reject({ name: 'error' });
    }
    return Promise.resolve();
  }),
}));

describe('Test component: ImportProjectForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ImportProjectForm, {
      props: {
        projectName: 'test',
        branchName: 'test',
      },
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event on success and a notification', async () => {
      Notify.create = jest.fn();
      wrapper.vm.repository = '/test';

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.submitting).toEqual(false);
      expect(wrapper.emitted()['project:import']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a notification on error', async () => {
      Notify.create = jest.fn();
      wrapper.vm.repository = '/error';

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
    });
  });
});
