import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import CreateProjectTemplateForm from 'src/components/form/CreateProjectTemplateForm.vue';
import { Notify } from 'quasar';
import * as Project from 'src/composables/Project';
import * as Git from 'src/composables/Git';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  initProject: jest.fn(() => Promise.resolve()),
  appendProjectFile: jest.fn(() => Promise.resolve()),
  getProjects: jest.fn(() => ['project']),
}));

jest.mock('src/composables/Git', () => ({
  importProject: jest.fn(() => Promise.resolve()),
}));

jest.mock('src/composables/Random', () => ({
  randomHexString: () => '00000000',
}));

jest.mock('src/services/TemplateService', () => ({
  getTemplateFiles: jest.fn(() => Promise.resolve([{ path: 'file.md' }])),
}));

describe('Test component: CreateProjectTemplateForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CreateProjectTemplateForm, {
      props: {
        template: {
          basePath: 'test/',
          files: ['test.js'],
          key: 'key',
        },
        isChecked: false,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: template', () => {
      it('should be an object with files and key', () => {
        expect(wrapper.vm.template).toEqual({
          basePath: 'test/',
          files: ['test.js'],
          key: 'key',
        });
      });
    });

    describe('Test prop: isChecked', () => {
      it('should be false', () => {
        expect(wrapper.vm.isChecked).toEqual(false);
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should call initProject when localIsChecked is false', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Project.initProject).toBeCalled();
    });

    it('should append files', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Project.appendProjectFile).toBeCalledWith({ path: '/file.md' });
    });

    it('should call importProject when localIsChecked is true', async () => {
      await wrapper.setProps({
        template: {
          files: ['test.js'],
          key: 'key',
        },
        isChecked: true,
      });

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Git.importProject).toBeCalled();
    });

    it('should emit an event and a positive notification on success', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.emitted()['project:add']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      Project.initProject.mockImplementation(() => Promise.reject({ name: 'error' }));

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
    });
  });

  describe('Test watcher: props.isChecked', () => {
    it('should be triggered when props.isChecked is updated', async () => {
      expect(wrapper.vm.localIsChecked).toEqual(false);

      await wrapper.setProps({
        isChecked: true,
      });

      expect(wrapper.vm.localIsChecked).toEqual(true);
    });
  });

  describe('Test watcher: localIsChecked', () => {
    it('should be triggered when localIsChecked is updated', async () => {
      expect(wrapper.vm.localIsChecked).toEqual(false);

      await wrapper.setProps({
        isChecked: true,
      });

      wrapper.vm.localIsChecked = false;

      expect(wrapper.vm.localIsChecked).toEqual(false);
    });
  });
});
