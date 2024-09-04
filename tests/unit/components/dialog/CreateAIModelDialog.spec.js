import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import CreateAIModelDialog from 'src/components/dialog/CreateAIModelDialog';

installQuasarPlugin();

describe('Test component: CreateAIModelDialog', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CreateAIModelDialog, {
      props: {
        projectName: 'projectName',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.projectName).toEqual('projectName');
      });
    });
  });
});
