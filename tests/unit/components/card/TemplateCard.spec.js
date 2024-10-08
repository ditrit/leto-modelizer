import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import TemplateCard from 'src/components/card/TemplateCard.vue';
import { Notify } from 'quasar';
import { getTemplateIcon } from 'src/services/ImageDownloadService';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('src/services/ImageDownloadService', () => ({
  getTemplateIcon: jest.fn(() => Promise.resolve('icon')),
}));

describe('Test component: TemplateCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TemplateCard, {
      props: {
        template: {
          id: 'id_1',
        },
      },
    });
  });

  describe('Test function: loadTemplateIcon', () => {
    it('should load icon', async () => {
      wrapper.vm.templateIcon = null;
      await wrapper.vm.loadTemplateIcon();
      expect(wrapper.vm.templateIcon).toEqual('icon');
    });

    it('should set icon to null on error', async () => {
      wrapper.vm.templateIcon = 'test';
      getTemplateIcon.mockImplementationOnce(() => Promise.reject());
      await wrapper.vm.loadTemplateIcon();
      expect(wrapper.vm.templateIcon).toBeNull();
    });
  });
});
