import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitCommitForm from 'src/components/form/GitCommitForm.vue';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Git', () => ({
  gitCommit: jest.fn((projectId) => {
    if (projectId === 'error') {
      return Promise.reject({ name: 'error' });
    }
    return Promise.resolve();
  }),
}));

describe('Test component: GitCommitForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GitCommitForm, {
      props: {
        projectName: 'test',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.projectName).toEqual('test');
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event on success and a notification', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.submitting).toEqual(false);
      expect(wrapper.emitted()['git-commit:save']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a notification on error', async () => {
      wrapper = shallowMount(GitCommitForm, {
        props: {
          projectName: 'error',
        },
      });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
