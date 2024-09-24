import { api, templateLibraryApiClient } from 'src/boot/axios';
import {
  getTemplateFileContent,
  getTemplateFiles,
  getTemplatesByType,
} from 'src/services/TemplateService';

jest.mock('src/boot/axios', () => ({
  prepareQueryParameters: jest.fn((filters) => Object
    .keys(filters)
    .map((key) => `${key}=${filters[key]}`)
    .join(',')),
  prepareApiRequest: jest.fn(),
  makeFilterRequest: jest.fn(),
  api: {
    get: jest.fn(),
  },
  templateLibraryApiClient: {
    get: jest.fn(),
  },
}));

describe('Test service: TemplateService', () => {
  describe('Test function: getTemplatesByType', () => {
    it('should return templates from API', async () => {
      api.get.mockClear();
      templateLibraryApiClient.get.mockClear();
      api.get.mockImplementation(() => Promise.resolve({
        data: {
          content: [],
        },
      }));

      let data = await getTemplatesByType({
        HAS_BACKEND: 'true',
      }, 'COMPONENT', {
        name: '',
        plugin: 'plugin1',
      });

      expect(api.get).toBeCalledWith('/libraries/templatesname=,plugin=,plugins=lk_*plugin1*,order=name,sort=asc,type=COMPONENT');
      expect(data).toEqual({
        content: [],
      });

      data = await getTemplatesByType({
        HAS_BACKEND: 'true',
      }, 'COMPONENT', {
        name: 'test',
        plugin: 'plugin1',
      });

      expect(api.get).toBeCalledWith('/libraries/templatesname=lk_*test*,plugin=,plugins=lk_*plugin1*,order=name,sort=asc,type=COMPONENT');
      expect(templateLibraryApiClient.get).not.toBeCalled();
      expect(data).toEqual({
        content: [],
      });
    });

    it('should return empty templates without backend and library url', async () => {
      api.get.mockClear();
      templateLibraryApiClient.get.mockClear();

      const data = await getTemplatesByType({
        HAS_BACKEND: null,
        TEMPLATE_LIBRARY_BASE_URL: null,
      }, 'COMPONENT', {
        name: '',
        plugin: 'plugin1',
        count: 5,
      });

      expect(api.get).not.toBeCalled();
      expect(templateLibraryApiClient.get).not.toBeCalled();
      expect(data).toEqual({
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 5,
        },
        totalElements: 0,
      });
    });

    it('should filter without API', async () => {
      templateLibraryApiClient.get.mockClear();
      templateLibraryApiClient.get.mockImplementation(() => Promise.resolve({
        data: {
          templates: [{
            type: 'COMPONENT',
            name: 'test1',
            plugin: 'plugin1',
            basePath: 'basePath/',
            icon: 'image.png',
          }, {
            type: 'COMPONENT',
            name: 'test2',
            plugin: 'plugin1',
            basePath: 'basePath/',
            icon: 'image.png',
          }],
        },
      }));

      let data = await getTemplatesByType({
        HAS_BACKEND: null,
        TEMPLATE_LIBRARY_BASE_URL: 'test',
      }, 'COMPONENT', {
        name: '',
        plugin: 'plugin1',
        count: 5,
        page: 0,
      });
      expect(data).toEqual({
        content: [{
          type: 'COMPONENT',
          name: 'test1',
          plugin: 'plugin1',
          plugins: ['plugin1'],
          basePath: 'basePath/',
          icon: '/template-library/basePath/image.png',
          isTemplate: true,
          schemas: [],
        }, {
          type: 'COMPONENT',
          name: 'test2',
          plugin: 'plugin1',
          plugins: ['plugin1'],
          basePath: 'basePath/',
          icon: '/template-library/basePath/image.png',
          isTemplate: true,
          schemas: [],
        }],
        pageable: {
          pageNumber: 0,
          pageSize: 5,
        },
        totalElements: 2,
      });

      data = await getTemplatesByType({
        HAS_BACKEND: null,
        TEMPLATE_LIBRARY_BASE_URL: 'test',
      }, 'COMPONENT', {
        name: '',
        plugin: 'plugin1',
        count: 1,
        page: 1,
      });
      expect(data).toEqual({
        content: [{
          type: 'COMPONENT',
          name: 'test2',
          plugin: 'plugin1',
          plugins: ['plugin1'],
          basePath: 'basePath/',
          icon: '/template-library/basePath/image.png',
          isTemplate: true,
          schemas: [],
        }],
        pageable: {
          pageNumber: 1,
          pageSize: 1,
        },
        totalElements: 2,
      });

      data = await getTemplatesByType({
        HAS_BACKEND: null,
        TEMPLATE_LIBRARY_BASE_URL: 'test',
      }, 'COMPONENT', {
        name: '',
        plugin: 'plugin',
        count: 5,
        page: 0,
      });
      expect(data).toEqual({
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 5,
        },
        totalElements: 0,
      });
    });
  });

  describe('Test function: getTemplateFileContent', () => {
    it('should return content from API', async () => {
      templateLibraryApiClient.get.mockClear();
      api.get.mockClear();
      api.get.mockImplementation(() => Promise.resolve({
        data: 'test',
      }));

      const content = await getTemplateFileContent({
        HAS_BACKEND: 'true',
      }, {
        id: 'id_1',
      }, 0);

      expect(templateLibraryApiClient.get).not.toBeCalled();
      expect(api.get).toBeCalledWith('/libraries/templates/id_1/files/0');
      expect(content).toEqual('test');
    });

    it('should return content without API', async () => {
      api.get.mockClear();
      templateLibraryApiClient.get.mockClear();
      templateLibraryApiClient.get.mockImplementation(() => Promise.resolve({
        data: 'test',
      }));

      const content = await getTemplateFileContent({
        HAS_BACKEND: null,
      }, {
        id: 'id_1',
        basePath: 'basePath/',
        files: ['file'],
      }, 0);

      expect(api.get).not.toBeCalled();
      expect(templateLibraryApiClient.get).toBeCalledWith('basePath/file', {
        headers: {
          Accept: '*',
        },
        responseType: 'json',
      });
      expect(content).toEqual('test');
    });
  });

  describe('Test function: getTemplateFiles', () => {
    it('should return files', async () => {
      templateLibraryApiClient.get.mockClear();
      api.get.mockClear();
      api.get.mockImplementation(() => Promise.resolve({
        data: 'test',
      }));

      const content = await getTemplateFiles({
        HAS_BACKEND: 'true',
      }, {
        id: 'id_1',
        files: ['file'],
      }, 0);

      expect(templateLibraryApiClient.get).not.toBeCalled();
      expect(api.get).toBeCalledWith('/libraries/templates/id_1/files/0');
      expect(content).toEqual([{ path: 'file', content: 'test' }]);
    });
  });
});
