import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelsPage from 'src/pages/ModelsPage';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    params: {
      projectName: 'project-00000000',
    },
  })),
}));

describe('Test page component: ModelsPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelsPage);
  });

  describe('Test variables initialization', () => {
    describe('Test computed: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });
  });
});
