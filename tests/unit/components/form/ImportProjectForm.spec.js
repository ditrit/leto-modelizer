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
  getProjects: jest.fn(() => ({
    foo: {
      id: 'foo',
      git: { repository: '/foo' },
    },
    bar: {
      id: 'bar',
      git: { repository: '/bar' },
    },
  })),
  deleteProjectById: jest.fn((projectId) => {
    if (projectId === 'error') {
      return Promise.reject({ name: 'error' });
    }

    return Promise.resolve();
  }),
  extractProjectName: jest.fn((name) => name),
}));

jest.mock('src/composables/Git', () => ({
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
      wrapper.vm.repository = 'error';

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
    });

    it('should delete existing project if overwrite is set to true', async () => {
      wrapper.vm.repository = '/foo';
      wrapper.vm.project.id = 'foo';
      wrapper.vm.overwrite = true;

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.deleteProjectById).toHaveBeenCalled();
    });
  });

  describe('Test watcher: repository', () => {
    it('should be triggered when repository value is updated', async () => {
      expect(wrapper.vm.isDuplicate).toBeFalsy();

      wrapper.vm.repository = 'foo';

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isDuplicate).toBeTruthy();
    });
  });

  describe('Test watcher: overwrite', () => {
    it('should be triggered when overwrite value is updated', async () => {
      expect(wrapper.vm.overwrite).toBeFalsy();
      expect(wrapper.vm.isUniqueRuleEnabled).toBeTruthy();

      wrapper.vm.overwrite = true;

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isUniqueRuleEnabled).toBeFalsy();

      wrapper.vm.overwrite = false;

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isUniqueRuleEnabled).toBeTruthy();
    });
  });
});
