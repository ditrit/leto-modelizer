import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import RenameProjectForm from 'src/components/form/RenameProjectForm';
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
  renameProject: jest.fn((projectId) => {
    if (projectId === 'error') {
      return Promise.reject({ name: 'error' });
    }

    return Promise.resolve();
  }),
}));

describe('Test component: RenameProjectForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RenameProjectForm, {
      props: {
        projectId: 'projectId',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectId', () => {
      it('should match "projectId"', () => {
        expect(wrapper.vm.props.projectId).toEqual('projectId');
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event and a positive notification on success', async () => {
      Notify.create = jest.fn();
      await wrapper.setProps({
        projectId: 'test',
      });

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.submitting).toEqual(false);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ projectId: 'error' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
