import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ProjectGrid from 'src/components/grid/ProjectGrid.vue';
import { createAcl, defineAclRules } from 'vue-simple-acl';
import ProjectEvent from 'src/composables/events/ProjectEvent';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: jest.fn(() => ({
    t: (t) => t,
  })),
}));

jest.mock('src/composables/Project', () => ({
  getProjects: jest.fn(() => ({
    test1: {
      id: 'test1',
      creationDate: 2,
      git: {
        repository: null,
      },
      isFavorite: true,
    },
    test2: {
      id: 'test2',
      creationDate: 1,
      git: {
        repository: 'test',
      },
      isFavorite: false,
    },
  })),
}));

jest.mock('src/composables/events/ProjectEvent', () => ({
  UpdateProjectEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: ProjectGrid', () => {
  let wrapper;
  let updateProjectSubscribe;
  let updateProjectUnsubscribe;

  beforeEach(() => {
    updateProjectSubscribe = jest.fn();
    updateProjectUnsubscribe = jest.fn();

    ProjectEvent.UpdateProjectEvent.subscribe.mockImplementation(() => {
      updateProjectSubscribe();
      return { unsubscribe: updateProjectUnsubscribe };
    });

    wrapper = shallowMount(ProjectGrid, {
      global: {
        plugins: [
          createAcl({
            rules() {
              return defineAclRules(() => {});
            },
          }),
        ],
        stubs: {
          qInput: true,
        },
      },
    });
  });

  describe('Test function updateProjects', () => {
    it('it should filter by text', () => {
      wrapper.vm.selectedSort = { value: 'date-desc' };
      wrapper.vm.selectedFilter = { value: 'all' };
      wrapper.vm.searchProjectText = '1';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test1',
        creationDate: 2,
        git: {
          repository: null,
        },
        isFavorite: true,
      }]);
    });

    it('it should filter by favorite', () => {
      wrapper.vm.selectedSort = { value: 'date-desc' };
      wrapper.vm.selectedFilter = { value: 'favorite' };
      wrapper.vm.searchProjectText = '';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test1',
        creationDate: 2,
        git: {
          repository: null,
        },
        isFavorite: true,
      }]);
    });

    it('it should filter by local project', () => {
      wrapper.vm.selectedSort = { value: 'date-desc' };
      wrapper.vm.selectedFilter = { value: 'local' };
      wrapper.vm.searchProjectText = '';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test1',
        creationDate: 2,
        git: {
          repository: null,
        },
        isFavorite: true,
      }]);
    });

    it('it should filter by remote project', () => {
      wrapper.vm.selectedSort = { value: 'date-desc' };
      wrapper.vm.selectedFilter = { value: 'remote' };
      wrapper.vm.searchProjectText = '';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test2',
        creationDate: 1,
        git: {
          repository: 'test',
        },
        isFavorite: false,
      }]);
    });

    it('it should order by desc date', () => {
      wrapper.vm.selectedSort = { value: 'date-desc' };
      wrapper.vm.selectedFilter = { value: 'all' };
      wrapper.vm.searchProjectText = '';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test1',
        creationDate: 2,
        git: {
          repository: null,
        },
        isFavorite: true,
      }, {
        id: 'test2',
        creationDate: 1,
        git: {
          repository: 'test',
        },
        isFavorite: false,
      }]);
    });

    it('it should order by asc date', () => {
      wrapper.vm.selectedSort = { value: 'date-asc' };
      wrapper.vm.selectedFilter = { value: 'all' };
      wrapper.vm.searchProjectText = '';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test2',
        creationDate: 1,
        git: {
          repository: 'test',
        },
        isFavorite: false,
      }, {
        id: 'test1',
        creationDate: 2,
        git: {
          repository: null,
        },
        isFavorite: true,
      }]);
    });

    it('it should order by asc name', () => {
      wrapper.vm.selectedSort = { value: 'name-asc' };
      wrapper.vm.selectedFilter = { value: 'all' };
      wrapper.vm.searchProjectText = '';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test1',
        creationDate: 2,
        git: {
          repository: null,
        },
        isFavorite: true,
      }, {
        id: 'test2',
        creationDate: 1,
        git: {
          repository: 'test',
        },
        isFavorite: false,
      }]);
    });

    it('it should order by asc date', () => {
      wrapper.vm.selectedSort = { value: 'name-desc' };
      wrapper.vm.selectedFilter = { value: 'all' };
      wrapper.vm.searchProjectText = '';

      wrapper.vm.updateProjects();

      expect(wrapper.vm.filteredProjects).toEqual([{
        id: 'test2',
        creationDate: 1,
        git: {
          repository: 'test',
        },
        isFavorite: false,
      }, {
        id: 'test1',
        creationDate: 2,
        git: {
          repository: null,
        },
        isFavorite: true,
      }]);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe UpdateProjectEvent', () => {
      expect(updateProjectSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe UpdateProjectEvent', () => {
      expect(updateProjectUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateProjectUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
