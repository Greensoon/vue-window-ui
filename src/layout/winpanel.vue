<template>
    <div :class="`mu-win-panel mu-win-${component} ${current ? 'mu-win-panel-curr' : ''} ${resizable == undefined ? resizeClazz : ''} ${isSys == undefined ? '' : 'mu-sys-win'} ${clazz || ''}`" @click="choose">
        <div :class="`mu-win-panel-title ${moveClazz}`" @dblclick="titleDblclick">
            <div class="mu-win-panel-title-text">{{title}}</div>
            <div class="mu-win-panel-btns-wrap" >
                <a class="mu-win-panel-btn mu-win-minisize" @click="minisizeHandle"></a> 
                <a class="mu-win-panel-btn mu-win-close" @click="close"></a>
            </div>
        </div>

        <div class="mu-win-panel-content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less">
.mu-win-panel {
    position: absolute;
    z-index: 5;

    overflow: hidden;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.5);

    .mu-win-panel-title {
        display: flex;
        width: 100%;
        background: rgba(230, 230, 230, 0.8);
        justify-content: space-between;
    }

    .mu-win-panel-title-text {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;

        font-size: 12px;
        font-weight: 600;
        color: #000;
    }

    .mu-win-panel-btn {
        margin-right: 10px;
        height: 20px;
        width: 20px;
        display: inline-block;
        margin-top: 5px;
        position: relative;

        &:after,
        &:before {
            position: absolute;
            content: '';
        }

        &.mu-win-minisize{
            margin-right: 5px;
        }
        &.mu-win-minisize:before {
            height: 2px;
            width: 12px;
            background: gray;
            top: 10px;
            left: 10px;
        }

        &.mu-win-maxisize:before {
            background: green;
            width: 2px;
            height: 18px;
            left: 8px;
            top: 1px;
        }

        &.mu-win-maxisize:after {
            background: green;
            width: 18px;
            height: 2px;
            top: 9px;
        }

        &.mu-win-close:after {
            content: '';
            height: 2px;
            width: 14px;
            background: red;
            top: 50%;
            transform: rotate(45deg);
            
            margin-top: -1px;
            margin-left: 4px;
        }

        &.mu-win-close:before {
            content: '';
            position: absolute;
            width: 2px;
            height: 14px;
            background: red;
            transform: rotate(45deg);
            left: 50%;
            margin-top: 3px;
        }
    }

    .mu-win-panel-tools {
        height: 70px;
        background: #b9b9b9;
        width: 100%;
    }

    .mu-win-panel-tool-title {
        font-size: 30px;
        line-height: 3;
        padding-left: 20px;
    }

    .mu-win-panel-content {
        background: #fff;
        overflow: hidden;

        & > div {
            height: inherit;
            overflow-y: auto;
        }
    }

    &.mu-win-panel-curr {
        box-shadow: 0 2px 4px 1px rgba(0,0,0,0.5);

        z-index: 6;
    }

    &.mu-sys-win {
        border-radius: 0;
    }
}

</style>

<script>
    import interact from 'interactjs'
    import $ from 'jquery'

    var defaultCss = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto'
    }
    export default {
        props: [
            'title', //标题
            'toolTitle', //工具栏的大标题
            'minisizeEvent', //最小化事件
            'value', //控制显示的值
            'component', //对应的组件名字
            'current', //是否是当前活动窗口
            'winWidth', //指定的宽度，否则默认宽度为800px
            'winHeight', //指定的高度，否则默认宽度为500px
            'resizable', //是否支持缩放，只要该值不为undefined就不支持
            'isSys', //是否是系统设置窗口，如果是，不显示工具栏
            'clazz',
            'rect' //拖动缩放情况
        ],
        data() {
            var $this = this
            return {
                defaultWidth: 1000,
                defaultHeight: 500,
                left: 0,
                top: 0,
                maxisize: false,
                width: 0,
                height: 0,
                id: `win_panel_${new Date().getTime()}`,
                show: $this.value,
                moveClazz: `drag_${new Date().getTime()}`,
                resizeClazz: `resize_${new Date().getTime()}`,
                transform: '',
                toolHeight: 30,
                pageX: 0,
                pageY: 0
                
            }
        },
        watch: {
            value(newv) {
                this.show = newv
            },
            show(newv) {
                newv == true ? $(this.$el).show() : $(this.$el).hide()
            },
            current(newv) {
                this.current = newv
            }
        },
        methods: {
            titleDblclick() {
                var $el = this.$el
                var winWidth = $('body').width()
                var winHeight = $('body').height()

                var $height = winHeight - 46 //divide head height
                if(!this.maxisize) {
                    $($el).css({width: winWidth, height: $height, left: 0, top: 46, transform: 'translate(0, 0)', margin: 0})
                    $($el).attr('data-x', 0).attr('data-y', 0)
                    this.maxisize = true
                } else {
                    $($el).css({width: this.width, height: this.height, left: this.left, top: this.top, transform: this.transform})
                    this.maxisize = false
                    $($el).attr('data-x', this.pageX).attr('data-y', this.pageY)
                }

                $($el).find('.mu-win-panel-content').css('height', $($el).height() - this.toolHeight - 0)
            },
            minisizeHandle(e) {
                this.show = false
                this.minisizeEvent(this.id, this.component, e)
            },
            close(e) {
                this.$emit('close-event', this.component, e)
            },
            choose() {
                this.$emit('choose', this.component)
                $(this.$el).addClass('mu-win-panel-curr').siblings().removeClass('mu-win-panel-curr')
            },
            initCss() {
                var $el = this.$el
                
                $($el).css(defaultCss).css({width: this.winWidth || this.defaultWidth, height: this.winHeight || this.defaultHeight})
                var $left = $el.offsetLeft
                var $top = $el.offsetTop
                var $width = $el.offsetWidth
                var $height = $el.offsetHeight

                this.left = $left
                this.top = $top
                this.width = $($el).width()
                this.height = $($el).height()

                $($el).find('.mu-win-panel-content').css('height', this.height - this.toolHeight - 0)
            },
            initHandle() {
                var $el = this.$el
                var $this = this

                
                this.initCss()

                var draggableConfig = {
                    onstart: function(event) {
                        var target = event.target
                        target = target.parentNodeq
                        $(target).addClass('mu-win-panel-curr').siblings().removeClass('mu-win-panel-curr')
                    },
                    onmove: function(event) {
                        var target = event.target.parentNode,

                        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        // translate the element
                        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

                        target.setAttribute('data-x', x)
                        target.setAttribute('data-y', y)

                        $this.pageX = x
                        $this.pageY = y

                        $this.left = target.offsetLeft
                        $this.top = target.offsetTop

                        $this.transform = 'translate(' + x + 'px, ' + y + 'px)'
                    },
                    onend() {
                        $this.maxisize = false

                        $this.transVars({drag_x: $this.pageX, drag_y: $this.pageY})
                    },
                    restrict: {
                        restriction: 'body',
                        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                    }
                }

                var resizeConfig = {
                    edges: { left: true, right: true, bottom: true, top: true },

                    restrictEdges: {
                        outer: 'parent',
                        endOnly: true,
                    },

                    restrictSize: {
                        min: { width: 1000, height: 450 },
                    },

                    inertia: true,
                }

                var resizeMove = function (event) {
                    if($this.maxisize) {
                        $($el).css('margin', '0')
                    } else {
                        $($el).css({left: $this.left, top: $this.top}).css('margin', '0')
                    }
                    var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0),
                        y = (parseFloat(target.getAttribute('data-y')) || 0)

                    target.style.width  = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'

                    x += event.deltaRect.left
                    y += event.deltaRect.top

                    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)

                    $($el).find('.mu-win-panel-content').height(target.offsetHeight - $this.toolHeight - 0) //divide title height and tool height

                    $this.width = target.offsetWidth
                    $this.height = target.offsetHeight

                    $this.transVars({resize_x: $this.width, resize_y: $this.height})
                }

                if($this.isSys != undefined) {
                    interact('.' + $this.moveClazz).draggable(draggableConfig)
                } else {
                    interact('.' + $this.moveClazz)
                        .draggable(draggableConfig)
                    
                    interact('.' + this.resizeClazz).resizable(resizeConfig)
                        .on('resizemove', resizeMove)
                }
            },
            transVars(params) {
                this.$emit('monitor-win', params, this.component)
            },
        },
        mounted() {
            this.initHandle()
        }
    }
</script>