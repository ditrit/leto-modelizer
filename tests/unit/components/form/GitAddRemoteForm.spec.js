import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitAddRemoteForm from 'src/components/form/GitAddRemoteForm.vue';
import {
  getProjectById,
  saveProject,
  gitAddRemote,
} from 'src/composables/Project';
import { Notify } from 'quasar';
import GitEvent from 'src/composables/events/GitEvent';

jest.mock('src/composables/events/GitEvent', () => ({
  AddRemoteEvent: {
    next: jest.fn(),
  },
}));

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  getProjectById: jest.fn((id) => {
    if (id === 'noGit') {
      return { id };
    }

    return {
      id,
      git: {
        repository: 'testRepository',
        username: 'testUsername',
        token: 'testToken',
      },
    };
  }),
  saveProject: jest.fn(),
  gitAddRemote: jest.fn((project) => {
    if (project.id === 'error') {
      return Promise.reject({ name: 'HttpError' });
    }

    return Promise.resolve();
  }),
}));

describe('Test component: GitAddRemoteForm', () => {
  let wrapper;
  const emit = jest.fn();

  GitEvent.AddRemoteEvent.next.mockImplementation(() => emit());

  beforeEach(() => {
    wrapper = shallowMount(GitAddRemoteForm, {
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

    describe('Test variable: repository', () => {
      it('should be undefined without any git remote in project', () => {
        wrapper = shallowMount(GitAddRemoteForm, {
          props: {
            projectName: 'noGit',
          },
        });
        expect(wrapper.vm.repository).toBeUndefined();
      });

      it('should not be null with git remote in project', () => {
        expect(wrapper.vm.repository).toEqual('testRepository');
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event on success and emit a positive notification', async () => {
      wrapper.vm.repository = 'https://test/test.git';
      wrapper.vm.token = 'testToken';
      wrapper.vm.username = 'TestUsername';

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(getProjectById).toBeCalled();
      expect(saveProject).toBeCalled();
      expect(gitAddRemote).toBeCalled();
      expect(wrapper.vm.submitting).toEqual(false);
      expect(wrapper.emitted()['project-git:save']).toBeTruthy();
      expect(emit).toBeCalled();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a notification on error', async () => {
      wrapper = shallowMount(GitAddRemoteForm, {
        props: {
          projectName: 'error',
        },
      });

      Notify.create = jest.fn();

      wrapper.vm.repository = 'https://test/test.git';
      wrapper.vm.token = 'testToken';
      wrapper.vm.username = 'TestUsername';
      await wrapper.vm.onSubmit();

      expect(getProjectById).toBeCalled();
      expect(saveProject).toBeCalled();
      expect(gitAddRemote).toBeCalled();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
    });
  });
});
