import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ProjectCard from 'src/components/card/ProjectCard.vue';
import { saveProject } from 'src/composables/Project';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  saveProject: jest.fn(),
}));

describe('Test component: ProjectCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ProjectCard, {
      props: { project: { id: 'project-0000' } },
      global: {
        components: {
          'router-link': 'a',
        },
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: project', () => {
      it('should match "project-0000"', () => {
        expect(wrapper.vm.project).toStrictEqual({ id: 'project-0000' });
      });
    });
  });

  describe('Test function: getProjectImage', () => {
    it('should return valid image value', async () => {
      await wrapper.setProps({ project: { id: 'A' } });
      expect(wrapper.vm.getProjectImage().indexOf('data:image/svg+xml;base64,')).toEqual(0);
    });
  });

  describe('Test function: setFavorite', () => {
    it('should set favorite project and emit event', () => {
      saveProject.mockClear();
      wrapper.vm.setFavorite(true);
      expect(saveProject).toBeCalledWith({
        id: 'project-0000',
        isFavorite: true,
      });
      expect(wrapper.emitted()).toHaveProperty('reloadProjects');
    });
  });
});
