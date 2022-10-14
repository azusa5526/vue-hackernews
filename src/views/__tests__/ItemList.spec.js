import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import merge from 'lodash.merge'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ItemList.vue', () => {
  function createStore (overrides) {
    const defaultStoreConfig = {
      getters: {
        displayItems: jest.fn()
      },
      actions: {
        fetchListData: jest.fn(() => Promise.resolve())
      }
    }
    return new Vuex.Store(
      merge(defaultStoreConfig, overrides)
    )
  }

  function createWrapper (overrides) {
    const defaultMountingOptions = {
      mocks: {
        $bar: {
          start: jest.fn(),
          finish: jest.fn(),
          fail: jest.fn()
        },
        $route: {
          params: {
            type: 'top'
          }
        }
      },
      localVue,
      store: createStore()
    }
    return shallowMount(ItemList, merge(defaultMountingOptions, overrides))
  }

  test('renders an Item with data for each item in displayItems', () => {
    const items = [{}, {}, {}]
    const store = createStore({
      getters: {
        displayItems: () => items
      }
    })

    const wrapper = createWrapper({ store })
    const Items = wrapper.findAll(Item)
    expect(Items).toHaveLength(items.length)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.vm.item).toBe(items[i])
    })
  })

  test('calls $bar start on load', () => {
    const mocks = {
      $bar: {
        start: jest.fn()
      }
    }
    createWrapper({ mocks })
    expect(mocks.$bar.start).toHaveBeenCalled()
  })

  test('calls $bar finish when load successful', async () => {
    expect.assertions(1)
    const mocks = {
      $bar: {
        finish: jest.fn()
      }
    }
    createWrapper({ mocks })
    await flushPromises()
    expect(mocks.$bar.finish).toHaveBeenCalled()
  })

  test('dispatches fetchListData with top', async () => {
    expect.assertions(1)
    const store = createStore()
    store.dispatch = jest.fn(() => Promise.resolve())

    const type = 'a type'
    const mocks = {
      $route: {
        params: {
          type
        }
      }
    }
    createWrapper({ mocks, store })
    await flushPromises()
    expect(store.dispatch).toHaveBeenCalledWith('fetchListData', { type })
  })

  test('calls $bar fail when fetchListData throws', async () => {
    expect.assertions(1)
    const store = createStore({
      actions: { fetchListData: jest.fn(() => Promise.reject()) }
    })
    const mocks = {
      $bar: {
        fail: jest.fn()
      }
    }
    createWrapper({ mocks, store })
    await flushPromises()
    expect(mocks.$bar.fail).toHaveBeenCalled()
  })

  test(('renders 1/5 when on page 1 of 5'), () => {
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const wrapper = createWrapper({store})
    expect(wrapper.text()).toContain('1/5')
  })

  test(('renders 2/5 when on page 2 of 5'), () => {
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const mocks = {
      $route: {
        params: {
          page: 2
        }
      }
    }
    const wrapper = createWrapper({store, mocks})
    expect(wrapper.text()).toContain('2/5')
  })

  test(('calls $router.replace when the page parameter is greater than the max page count'), async () => {
    expect.assertions(1)
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const mocks = {
      $route: {
        params: {
          page: '1000'
        }
      },
      $router: {
        replace: jest.fn()
      }
    }
    createWrapper({ mocks, store })
    await flushPromises()
    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1')
  })
})
