<template>
  <div
    :class="{
      hidden: hidden,
      error: error
    }"
    class="progress"
    :style="{
      width: `${percent}%`,
    }"
  />
</template>

<script>
export default {
  data () {
    return {
      hidden: true,
      percent: 0,
      timer: null,
      error: false
    }
  },

  methods: {
    start () {
      this.hidden = false
      this.percent = 0

      this.timer = setInterval(() => {
        this.percent++
      }, 100)
    },

    finish () {
      this.hidden = true
      this.percent = 100
      clearInterval(this.timer)
    },

    fail () {
      this.error = true
      this.percent = 100
    }
  }
}
</script>

<style scoped>
.hidden {
  opacity: 0;
}
</style>
