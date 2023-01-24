import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitAuthenticationForm from 'src/components/form/GitAuthenticationForm.vue';
import {
  getProjectById,
  saveProject,
} from 'src/composables/Project';
import { Notify } from 'quasar';
import GitEvent from 'src/composables/events/GitEvent';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('src/composables/events/GitEvent', () => ({
  AuthenticationEvent: {
    next: jest.fn(),
  },
}));

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
}));

describe('Test component: GitAuthenticationForm', () => {
  let wrapper;
  const emit = jest.fn();

  GitEvent.AuthenticationEvent.next.mockImplementation(() => emit());

  beforeEach(() => {
    wrapper = shallowMount(GitAuthenticationForm, {
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

    describe('Test variable: token', () => {
      it('should be undefined without any git configuration in project', () => {
        wrapper = shallowMount(GitAuthenticationForm, {
          props: {
            projectName: 'noGit',
          },
        });
        expect(wrapper.vm.token).toBeUndefined();
      });

      it('should not be null with git configuration in project', () => {
        expect(wrapper.vm.token).toEqual('testToken');
      });
    });

    describe('Test variable: username', () => {
      it('should be undefined without any git configuration in project', () => {
        wrapper = shallowMount(GitAuthenticationForm, {
          props: {
            projectName: 'noGit',
          },
        });
        expect(wrapper.vm.username).toBeUndefined();
      });

      it('should not be null with git configuration in project', () => {
        expect(wrapper.vm.username).toEqual('testUsername');
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event and send a positive notification', async () => {
      wrapper.vm.repository = 'https://test/test.git';
      wrapper.vm.token = 'testToken';
      wrapper.vm.username = 'TestUsername';

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(getProjectById).toBeCalled();
      expect(saveProject).toBeCalled();
      expect(wrapper.vm.submitting).toEqual(false);
      expect(wrapper.emitted()['project-git:save']).toBeTruthy();
      expect(emit).toBeCalled();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });
  });
});
