import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitUpdateForm from 'src/components/form/GitUpdateForm.vue';
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
  getProjectById: jest.fn((id) => ({
    id,
    git: {
      username: 'username',
      token: 'token',
    },
  })),
  gitUpdate: jest.fn((project) => {
    if (project.id === 'error') {
      return Promise.reject({ name: 'error' });
    }
    return Promise.resolve();
  }),
}));

describe('Test component: GitUpdateForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GitUpdateForm, {
      props: {
        projectName: 'test',
        branchName: 'test',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.projectName).toEqual('test');
      });
    });

    describe('Test props: branchName', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.branchName).toEqual('test');
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event on success and a notification', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.submitting).toEqual(false);
      expect(wrapper.emitted()['git-branch:update']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a notification on error', async () => {
      wrapper = shallowMount(GitUpdateForm, {
        props: {
          projectName: 'error',
          branchName: 'test',
        },
      });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
