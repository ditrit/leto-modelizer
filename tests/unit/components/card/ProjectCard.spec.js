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
      it('Should match "project-0000"', () => {
        expect(wrapper.vm.project).toStrictEqual({ id: 'project-0000' });
      });
    });
  });
});
