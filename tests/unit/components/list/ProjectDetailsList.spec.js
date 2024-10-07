import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ProjectDetailsList from 'src/components/list/ProjectDetailsList.vue';
import { getProjectById } from 'src/composables/Project';
import { useRoute } from 'vue-router';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    params: {
      projectName: 'test',
    },
    query: {
      path: 'path',
    },
  })),
}));

jest.mock('src/composables/Project', () => ({
  getProjectById: jest.fn(() => ({
    id: 'test',
  })),
}));

describe('Test component: ProjectDetailsList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ProjectDetailsList, {
      props: { level: 1 },
    });
  });

  describe('Test computed: project', () => {
    it('should retrieve project', () => {
      expect(wrapper.vm.project).toEqual({
        id: 'test',
      });
    });
  });

  describe('Test computed: projectName', () => {
    it('should retrieve projectName', () => {
      expect(wrapper.vm.projectName).toEqual('test');
    });
  });

  describe('Test computed: path', () => {
    it('should not modify short path', () => {
      expect(wrapper.vm.path).toEqual('path');
    });

    it('should not modify long path', () => {
      useRoute.mockImplementation(() => ({
        params: {
          projectName: 'test',
        },
        query: {
          path: 'LOOOOOOOOOOONNNNNGGGG_PATH',
        },
      }));
      wrapper = shallowMount(ProjectDetailsList, {
        props: { level: 1 },
      });
      expect(wrapper.vm.path).toEqual('...ONNNNNGGGG_PATH');
    });
  });

  describe('Test function: getProjectImage', () => {
    it('should return valid image value', async () => {
      await wrapper.setProps({ project: { id: 'A' } });
      expect(wrapper.vm.getProjectImage().indexOf('data:image/svg+xml;base64,')).toEqual(0);
    });
  });
});
