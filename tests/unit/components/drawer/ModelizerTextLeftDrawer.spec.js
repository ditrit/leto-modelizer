import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerTextLeftDrawer from 'src/components/drawer/ModelizerTextLeftDrawer.vue';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: () => ({ params: { projectName: 'project-00000000' } }),
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Test component: ModelizerTextLeftDrawer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelizerTextLeftDrawer, {});
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test variable: showParsableFiles', () => {
      it('should be false', () => {
        expect(wrapper.vm.showParsableFiles).toEqual(false);
      });
    });
  });
});
