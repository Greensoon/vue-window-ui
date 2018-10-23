<template>
  <div class="mu-wrap-block">
      <div :class="`mu-wrap-block__title ${align === 'left' ?'text-left':(align==='right'?'text-right': 'text-center')}`">
          {{title}}
      </div>
      <div class="mu-wrap-block__content">
          <slot></slot>
      </div>
  </div>
</template>
<script>
    import $ from 'jquery'
    export default {
        name: 'wrapBlock',
        props: ['title', 'align', 'none'],
        mounted() {
            var items = $(this.$el).find('.mu-wrap-block-item')
            var len = items.length
            items.css('width', `${1/len*100}%`)

            if(this.none != undefined) {
              $(this.$el).find('.mu-wrap-block__title').hide()
            }
        }
    }
</script>
