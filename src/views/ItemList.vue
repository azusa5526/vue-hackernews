<template>
  <div class="item-list-view">
    <router-link v-if="$route.params.page > 1"
      :to="'/' + $route.params.type + '/' + $route.params.page - 1">&lt; prev</router-link>
    <a v-else>&lt; prev</a>
    <span>{{$route.params.page || 1}}/{{$route.params.page - 1}}</span>
    <router-link v-if="($route.params.page || 1) < $store.getters.maxPage"
      :to="'/' + $route.params.type + '/' + ((Number($route.params.page) || 1) + 1)">more &gt;</router-link>
    <a v-else>more &gt;</a>

    <div class="item-list">
      <item
        v-for="item in $store.getters.displayItems"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import Item from '../components/Item.vue'

export default {
  components: {
    Item
  },
  beforeMount () {
    this.loadItems()
  },
  methods: {
    loadItems () {
      this.$bar.start()
      this.$store.dispatch('fetchListData', {type: this.$route.params.type}).then(() => {
        if (this.$route.params.page > this.$store.getters.maxPage) {
          this.$router.replace(`/${this.$route.params.type}/1`)
          return
        }
        this.$bar.finish()
      })
        .catch(() => {
          this.$bar.fail()
        })
    }
  }
}
</script>

<style>
.item-list-view {
  padding-top: 45px;
}
.item-list {
  background-color: #fff;
  border-radius: 2px;
  position: absolute;
  margin: 30px 0;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
@media (max-width: 600px) {
  .item-list {
    margin: 10px 0;
  }
}
</style>
