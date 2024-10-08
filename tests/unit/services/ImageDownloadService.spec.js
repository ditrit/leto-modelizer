import * as ImageDownloadService from 'src/services/ImageDownloadService';
import { prepareApiRequest } from 'src/boot/axios';

jest.mock('src/boot/axios', () => ({
  prepareApiRequest: jest.fn(() => Promise.resolve()),
}));

describe('Test: ImageDownloadService', () => {
  describe('Test function: downloadImage', () => {
    it('should return the image', async () => {
      const mockImage = 'data:image/png;base64,';

      prepareApiRequest.mockImplementation(() => ({
        get: jest.fn(() => Promise
          .resolve({ data: 'picture', headers: { 'content-type': 'image/png' } })),
      }));

      const image = await ImageDownloadService.downloadImage('url');
      expect(image).toEqual(mockImage);
    });
  });

  describe('Test function: getTemplateIcon', () => {
    it('should return the template icon from API', async () => {
      const mockTemplateIcon = 'data:image/png;base64,';

      prepareApiRequest.mockImplementation(() => ({
        get: jest.fn(() => Promise
          .resolve({ data: 'picture', headers: { 'content-type': 'image/png' } })),
      }));

      const templateIcon = await ImageDownloadService.getTemplateIcon({
        HAS_BACKEND: 'true',
      }, {
        id: 'id_1',
      });
      expect(templateIcon).toEqual(mockTemplateIcon);
    });

    it('should return the template icon without API', async () => {
      const templateIcon = await ImageDownloadService.getTemplateIcon({
        HAS_BACKEND: null,
      }, {
        id: 'id_1',
        icon: 'test',
      });

      expect(templateIcon).toEqual('test');
    });
  });

  describe('Test function: getTemplateSchema', () => {
    it('should return the template schema from API', async () => {
      const mockTemplateSchema = 'data:image/png;base64,';

      prepareApiRequest.mockImplementation(() => ({
        get: jest.fn(() => Promise
          .resolve({ data: 'picture', headers: { 'content-type': 'image/png' } })),
      }));

      const templateSchema = await ImageDownloadService.getTemplateSchema({
        HAS_BACKEND: 'true',
      }, {
        id: 'id_1',
      }, 0);
      expect(templateSchema).toEqual(mockTemplateSchema);
    });

    it('should return the template schema without API', async () => {
      const templateSchema = await ImageDownloadService.getTemplateSchema({
        HAS_BACKEND: null,
      }, {
        id: 'id_1',
        basePath: 'basePath/',
        schemas: ['test'],
      }, 0);

      expect(templateSchema).toEqual('/template-library/basePath/test');
    });
  });
});
