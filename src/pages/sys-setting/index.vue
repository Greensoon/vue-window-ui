<template>
    <div class="mu-sys-setting">
        <div class="mu-sys-head">
			<h2 v-if="showMain">
				<img :src="iconSetting" class="icon-sys">SystemSetting
			</h2>
			<h2 v-if="!showMain" class="mu-font-size">
				<img @click="showPanel" class="icon-back" :src="iconBack" v-if="!showMain">
				<p>{{moduleName}}</p>
			</h2>
            <div class="mu-sys-info flex" v-if="showMain">
                <div class="msi-left"><img :src="iconSys" class="msi-img"><span class="msi-text">Beta</span></div>
                <div class="msi-right"><ul class="msi-info-list"><li>版本号: {{GLOBAL.VERSION}}</li><li>更新时间: {{GLOBAL.ONLINE_TIME}}</li></ul></div>
            </div>
        </div>
        <div class="mu-sys-setting-item" v-if="showMain">
            <div class="mu-sys-setting-left clearfix">
                <img :src="iconPms" class="mssi-img">
                <div class="mssi-info">
                    <div class="mssi-title">权限</div>
                    <div class="mssi-desc">
                        您可以创建用户及群组，管理本机和网域用户访问权限，或设置磁盘容量使用限制。
                    </div>
                </div>
            </div>

            <div class="mu-sys-setting-right">
                <div class="mu-sys-setting-content">
                    <div class="mu-sys-item" v-for="(ele, i) in submenus" :key="i">
                        <a class="mu-sys-item-text" @click="open(ele.menu_component, ele.menu_id, ele)"><img :src="getIcons(ele.menu_icon)"> {{ele.menu_name}}</a>
                    </div>
                </div>
            </div>
        </div>

        <component :is="component" v-if="!showMain" :element-ids="elementIds" :menu-id="menuId"></component>
    </div>
</template>
<script>
    import * as Components from '../../getComponent'
    import menuMixins from '../menu.mixins.js'
    import iconBack from '../../../assets/img/icon-back.png'
    import iconSetting from '../../../assets/img/icon-setting.png'
    import iconSys from '../../../assets/img/icon-sys.png'
    import iconPms from '../../../assets/img/icon-permission.png'
    import iconEle from '../../../assets/img/icon-elem-per.png'
    import iconMen from '../../../assets/img/icon-menu-per.png'
    import iconRes from '../../../assets/img/icon-resource.png'

    export default {
        mixins: [menuMixins],
        data() {
            return {
                showMain: true,
                component: '',
                elementIds: [],
                menuId: 0,
                iconBack,
                moduleName: '',
                iconSetting,
                iconSys,
                iconPms,
                element: iconEle,
                'menu-manage': iconMen,
                resource: iconRes
            }
        },
        created() {
            this.getSubmenus('系统设置')
        },
        // computed: {
        //     submenus: function() {
        //         return getSubmenu('系统设置')
        //     }
        // },
        methods: {
            open(name, menu_id, ele) {
                this.showMain = false
                this.component = Components[name]
                var filters = this.submenus.filter(e => {
                    return e.menu_component == name
                })
                this.elementIds = filters[0].element_ids
                this.menuId = menu_id
                this.moduleName = ele.menu_name
            },
            showPanel() {
                this.showMain = true
            },
            getIcons(menu) {
                return this[menu]
            }
        }
    }
</script>
<style lang="less">
.mu-sys-setting {

    .mu-sys-head {
        padding: 12px;
        background: #f3f7ff;
        margin-bottom: 0;

        h2 {
            color: #464968;
        }
    }

    .mu-sys-setting-item {
        display: flex;
        border-bottom: 1px dashed #ccc;
        padding-bottom: 20px;

        margin: 20px 30px;

        display: flex;
    }

    .mu-sys-setting-left {
        padding: 10px 0;
        width: 28%;
        font-size: 12px;
        border-right: 1px solid #ccc;
        padding-right: 10px;
    }

	.mu-sys-setting-right {
		display: flex;
		justify-content: center;
		align-items: center;
	}
    .mu-sys-setting-content {
        margin: 20px 30px;
        display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
    }

    .mu-sys-item {
        cursor: pointer;
        margin-right: 100px;

        img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-top: -2px;
            margin-right: 5px;
        }
    }

    .icon-back, .icon-sys {
        width: 20px;
        height: 20px;
        vertical-align: text-top;
        margin-right: 8px;
        margin-top: 2px;
	}
	.icon-sys {
		margin-left: 8px;
	}

	.mu-font-size {
		img {
			vertical-align: middle;
			margin-right: 0px;
			cursor: pointer;
			margin-left: 8px;
		}
		p {
			display: inline;
			font-size: 14px;
			font-weight: 600;
			vertical-align: middle;
		}
	}
    .mu-sys-item-text {
        font-size: 15px;
        color: #2f2f2f;
        line-height: 20px;
        display: block;
        &:hover {
            color: #06c;
            text-decoration: underline;
        }
    }

    h3 {
        margin-bottom: 20px;
    }

    .msi-img {
        margin: 0 15px 0 85px;
    }

    .mu-sys-info {
        padding: 17px 20px 5px;
    }

    .msi-text {
        display: inline-block;
        vertical-align: top;
        line-height: 65px;
		font-size: 20px;
		font-weight: 900;

    }

    .msi-right {
        margin-left: 148px;
    }

    .msi-info-list {
        li {
            margin-right: 50px;
            font-size: 12px;
            margin-top: 12px;
			color: #444;
			font-weight: 500;
        }
    }

    .mssi-img {
        height: 20px;
        width: 20px;
    }

    .mssi-info {
        float: right;
        margin-top: -23px;
        margin-left: 25px;
    }

    .mssi-title {
        font-size: 20px;
        color: #4a4a4a;
        margin-bottom: 10px;
        line-height: 1;
    }

    .mssi-desc {
        font-size: 12px;
        color: #8b8b8b;
    }

}
</style>
