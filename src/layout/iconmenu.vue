<template>
    <div class="mu-layout-icon-menu-wrap draggable" @click="click">
        <img class="mu-layout-icon-menu" :src="imgs[img]">
        <div class="mu-layout-icon-menu-title">{{title}}</div>
    </div>
</template>

<script>
    import permission from '../../assets/img/permission.png'
    import user from '../../assets/img/user.png'
    import company from '../../assets/img/company.png'
    import setting from '../../assets/img/setting.png'
    import server from '../../assets/img/server.png'
    import sysSetting from '../../assets/img/sysSetting.png'
    import zone from '../../assets/img/icon-zone.png'
    import dc from '../../assets/img/icon-dc.png'
    import dcManage from '../../assets/img/icon-dc-manage.png'
    import game from '../../assets/img/icon-game.png'

    export default {
        props: ['title', 'img', 'component', 'menuId'],
        data() {
            return {
                imgs: {
                    permission,
                    user,
                    company,
                    setting,
                    server,
                    sysSetting,
                    zone,
                    dc_user: dc,
                    dcManage,
                    game,
                }
            }
        },
        methods: {
            click() {
                this.$emit('click', this.component, this.title, this.img, this.menuId)
            }
        }
    }
</script>

<style lang="less">
.mu-layout-icon-menu-wrap {
    margin: 60px;
    padding: 20px;
    border-radius: 25px;
    cursor: pointer;

    &:hover {
        .mu-layout-icon-menu {
            transform: translateY(-10px);
        }
    }

    .mu-layout-icon-menu {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 25px;
        padding: 10px;
        transition: all 0.3s ease-in;
        box-shadow: 0 2px 4px 1px rgba(0,0,0,0.2);
    }

    .mu-layout-icon-menu-title {
        color: #000;
        text-align: center;
        font-size: 14px;
    }
}
</style>

