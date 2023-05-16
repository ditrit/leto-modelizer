import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import HomePage from 'src/pages/HomePage.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import ProjectEvent from 'src/composables/events/ProjectEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

jest.mock('src/composables/events/ProjectEvent', () => ({
  UpdateProjectEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve([{ template: 'template' }])),
}));

jest.mock('src/composables/Project', () => ({
  getProjects: jest.fn(() => ({
    foobar: { id: 'foobar', creationDate: 1684168529274 },
    foo: { id: 'foo', creationDate: 1684168572473 },
    bar: { id: 'bar', creationDate: 1684168591636 },
  })),
}));

describe('Test page component: HomePage', () => {
  let wrapper;
  let updateProjectSubscribe;
  let updateProjectUnsubscribe;

  beforeEach(() => {
    updateProjectSubscribe = jest.fn();
    updateProjectUnsubscribe = jest.fn();

    ProjectEvent.UpdateProjectEvent.subscribe.mockImplementation(() => {
      updateProjectSubscribe();
      return { unsubscribe: updateProjectUnsubscribe };
    });

    wrapper = shallowMount(HomePage);
  });

  describe('Test function: setProjects', () => {
    it('should update projects list', () => {
      wrapper.vm.projects = {};
      wrapper.vm.setProjects();

      expect(wrapper.vm.projects).toStrictEqual({
        bar: { id: 'bar', creationDate: 1684168591636 },
        foo: { id: 'foo', creationDate: 1684168572473 },
        foobar: { id: 'foobar', creationDate: 1684168529274 },
      });
      expect(Object.keys(wrapper.vm.projects)).toStrictEqual(['bar', 'foo', 'foobar']);
    });
  });

  describe('Test function: openCreateProjectTemplateDialog', () => {
    it('should emit DialogEvent', () => {
      DialogEvent.next = jest.fn();

      expect(DialogEvent.next).not.toHaveBeenCalled();

      wrapper.vm.openCreateProjectTemplateDialog({});

      expect(DialogEvent.next).toHaveBeenCalledWith({
        type: 'open',
        key: 'CreateProjectTemplate',
        template: {},
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should assign templates with return value of getTemplatesByType', () => {
      expect(wrapper.vm.templates).toEqual([{ template: 'template' }]);
    });

    it('should subscribe UpdateProjectEvent', () => {
      expect(updateProjectSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe UpdateProjectEvent', () => {
      expect(updateProjectUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateProjectUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
