import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DeleteProjectForm from 'src/components/form/DeleteProjectForm';
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
  deleteProjectById: jest.fn((projectId) => {
    if (projectId === 'error') {
      return Promise.reject({ name: 'error' });
    }

    return Promise.resolve();
  }),
}));

describe('Test component: DeleteProjectForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DeleteProjectForm, {
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
      wrapper.vm.confirmDelete = true;

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.confirmDelete).toEqual(true);
      expect(wrapper.emitted()['project:delete']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ projectId: 'error' });
      Notify.create = jest.fn();
      wrapper.vm.confirmDelete = true;

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should emit a negative notification on error without confirm deletion', async () => {
      await wrapper.setProps({ projectId: 'error' });
      wrapper.vm.confirmDelete = false;
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
