import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ProjectCard from 'src/components/card/ProjectCard.vue';

installQuasarPlugin();

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

  describe('Test functions', () => {
    describe('Test function: getProjectImage', () => {
      it('should return corresponding image name', async () => {
        await wrapper.setProps({ project: { id: 'A' } });
        expect(wrapper.vm.getProjectImage()).toEqual('images/project0.png');

        await wrapper.setProps({ project: { id: 'B' } });
        expect(wrapper.vm.getProjectImage()).toEqual('images/project1.png');

        await wrapper.setProps({ project: { id: 'C' } });
        expect(wrapper.vm.getProjectImage()).toEqual('images/project2.png');

        await wrapper.setProps({ project: { id: 'D' } });
        expect(wrapper.vm.getProjectImage()).toEqual('images/project3.png');

        await wrapper.setProps({ project: { id: 'E' } });
        expect(wrapper.vm.getProjectImage()).toEqual('images/project4.png');

        await wrapper.setProps({ project: { id: 'F' } });
        expect(wrapper.vm.getProjectImage()).toEqual('images/project0.png');
      });
    });
  });
});
