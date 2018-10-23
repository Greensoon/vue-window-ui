<template>
    <a :class="`mu-layout-tabs ${current? 'current-tab' : ''}`">
        <span  @click="chooseClick" :style="{'padding-right': '10px', display: 'inline-block'}">
            <img :src="imgs[img]" />
            {{title}}
        </span>
        <!-- <i class="el-icon-rank" @click="resizeWin" v-if="minisize"></i> -->
        <i class="el-icon-close" @click="close(component, $event)"></i>
    </a>
</template>
<style lang="less">
    .mu-layout-tabs {
        display: inline-block;
        margin-left: 10px;
        background: rgba(250, 252, 252, 0.4);
        border-radius: 5px;
        padding: 0 12px;
        height: 36px;
        line-height: 36px;
        vertical-align: middle;
        margin-top: -40px;

        color: #000;
        font-size: 12px;
        font-weight: 500;

        img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 5px;
        }

        .el-icon-close {
            cursor: pointer;
            &:hover {
                font-weight: 600;
            }
        }

        .el-icon-rank {
            margin-left: 20px;
            transform: rotate(45deg);
            cursor: pointer;

            &:hover {
                font-weight: 600;
            }
        }
        .el-icon-rank + .el-icon-close {
            margin-left: 0;
        }

        &.current-tab {
            background: rgba(253, 253, 253, 0.8);
        }
    }
</style>
<script>
    import user from '../../assets/img/user.png'
    import permission from '../../assets/img/permission.png'
    import company from '../../assets/img/company.png'
    import setting from '../../assets/img/icon-task.png'
    import server from '../../assets/img/server.png'
    import sysSetting from '../../assets/img/sysSetting.png'
    import zone from '../../assets/img/icon-zone.png'
    import dc from '../../assets/img/icon-dc.png'
    import dcManage from '../../assets/img/icon-dc-manage.png'
    import game from '../../assets/img/icon-game.png'

    import $ from 'jquery'

    export default {
        props: ['title', 'component', 'img', 'minisize', 'current'],
        data() {
            return {
                imgs: {
                    user,
                    permission,
                    company,
                    setting,
                    server,
                    sysSetting,
                    zone,
                    dc,
                    dcManage,
                    game,
                }
            }
        },
        methods: {
            close(com, e) {
                this.$emit('close', this.component, e)
            },
            chooseClick() {
                this.$emit('choose', this.component, this.minisize, this.current)
            }
        }
    }
</script>
