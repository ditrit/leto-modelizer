import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerTextView from 'src/components/ModelizerTextView.vue';

installQuasarPlugin();

jest.mock('components/card/GitBranchCard', () => {});

describe('Test component: ModelizerTextView', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelizerTextView, {
      props: {
        viewType: 'model',
      },
      stubs: {
        GitBranchCard: true,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: viewType', () => {
      it('should match "model"', () => {
        expect(wrapper.vm.viewType).toEqual('model');
      });
    });
  });
});
