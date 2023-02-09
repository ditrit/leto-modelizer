import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import NewProjectTemplateForm from 'src/components/form/NewProjectTemplateForm.vue';
import { Notify } from 'quasar';
import Project from 'src/composables/Project';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  importProject: jest.fn(() => Promise.resolve()),
  initProject: jest.fn(() => Promise.resolve()),
  appendProjectFile: jest.fn(() => Promise.resolve()),
}));

jest.mock('src/composables/Random', () => ({
  randomHexString: () => '00000000',
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplateFileByPath: jest.fn(() => Promise.resolve()),
}));

describe('Test component: NewProjectTemplateForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(NewProjectTemplateForm, {
      props: {
        template: {
          files: ['test.js'],
          key: 'key',
        },
        isImportAction: false,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: template', () => {
      it('should be an object with files and key', () => {
        expect(wrapper.vm.template).toEqual({
          files: ['test.js'],
          key: 'key',
        });
      });
    });

    describe('Test prop: isImportAction', () => {
      it('should be false', () => {
        expect(wrapper.vm.isImportAction).toEqual(false);
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should call initProject when isImportAction is false', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Project.initProject).toBeCalled();
    });

    it('should call importProject when isImportAction is true', async () => {
      await wrapper.setProps({
        template: {
          files: ['test.js'],
          key: 'key',
        },
        isImportAction: true,
      });

      wrapper.vm.repository = 'https://github.com/test';

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Project.importProject).toBeCalled();
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
});
