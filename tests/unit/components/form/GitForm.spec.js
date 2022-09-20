import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitForm from 'src/components/form/GitForm.vue';
import { getProjectById, saveProject } from 'src/composables/Project';

installQuasarPlugin();

describe('Test component: GitForm', () => {
  let wrapper;

  beforeEach(() => {
    saveProject({
      id: 'test',
    });
    wrapper = shallowMount(GitForm, {
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
      it('should be undefined on no git configuration in project', () => {
        expect(wrapper.vm.repository).toBeUndefined();
      });

      it('should be not null on git configuration in project', () => {
        saveProject({ id: 'test', git: { repository: 'testRepository' } });
        wrapper = shallowMount(GitForm, {
          props: {
            projectName: 'test',
          },
        });
        expect(wrapper.vm.repository).toEqual('testRepository');
      });
    });

    describe('Test variable: token', () => {
      it('should be undefined on no git configuration in project', () => {
        expect(wrapper.vm.token).toBeUndefined();
      });

      it('should be not null on git configuration in project', () => {
        saveProject({ id: 'test', git: { token: 'testToken' } });
        wrapper = shallowMount(GitForm, {
          props: {
            projectName: 'test',
          },
        });
        expect(wrapper.vm.token).toEqual('testToken');
      });
    });

    describe('Test variable: username', () => {
      it('should be undefined on no git configuration in project', () => {
        expect(wrapper.vm.username).toBeUndefined();
      });

      it('should be not null on git configuration in project', () => {
        saveProject({ id: 'test', git: { username: 'TestUsername' } });
        wrapper = shallowMount(GitForm, {
          props: {
            projectName: 'test',
          },
        });
        expect(wrapper.vm.username).toEqual('TestUsername');
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event', () => {
      wrapper.vm.repository = 'https://test/test.git';
      wrapper.vm.token = 'testToken';
      wrapper.vm.username = 'TestUsername';
      wrapper.vm.onSubmit();

      expect(getProjectById('test').git).toEqual({
        repository: 'https://test/test.git',
        token: 'testToken',
        username: 'TestUsername',
      });
      expect(wrapper.emitted()['project-git:save']).toBeTruthy();
    });
  });
});
