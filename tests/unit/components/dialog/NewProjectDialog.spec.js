import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { Notify } from 'quasar';
import NewProjectDialog from 'src/components/dialog/NewProjectDialog.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import { directive as viewer } from 'v-viewer';
import Project from 'src/composables/Project';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

jest.mock('src/composables/Project', () => ({
  initProject: jest.fn(),
}));

describe('Test component: NewProjectDialog', () => {
  let wrapper;

  const push = jest.fn();

  useRouter.mockImplementation(() => ({
    push,
  }));

  beforeEach(() => {
    wrapper = shallowMount(NewProjectDialog, {
      global: {
        directives: {
          viewer,
        },
      },
    });
  });

  describe('Test functions', () => {
    describe('Test function: createProject', () => {
      it('should emit an event and redirect to project model page on success', async () => {
        Notify.create = jest.fn();
        DialogEvent.next = jest.fn();
        Project.initProject.mockImplementation(() => Promise.resolve());

        expect(DialogEvent.next).not.toHaveBeenCalled();

        await wrapper.vm.createProject('test');

        expect(DialogEvent.next).toBeCalledWith({ type: 'close', key: 'NewProject' });
        expect(push).toBeCalledWith('/modelizer/test/models');
        expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      });

      it('should emit a notification on error', async () => {
        Notify.create = jest.fn();
        Project.initProject.mockImplementation(() => Promise.reject({ name: 'error' }));

        await wrapper.vm.createProject('test');

        expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
      });
    });
  });
});
