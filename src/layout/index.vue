<template>
    <div class="mu-layout">
        <LayoutHead>
            <div class="mu-layout-head-left">
                <a class="mu-layout-showdesk" @click="toggleShowDesk"></a>
                <!-- <a class="mu-layout-toggle-sidebar" @click="toggleSidebar">
                    <i class="el-icon-menu"></i>
                </a> -->
                <layout-tab v-for="(tab, i) in iconTabs"
                    :key="'tab_' + i"
                    :title="tab.title"
                    :component="tab.componentName"
                    :img="tab.img"
                    :minisize="tab.showMinisize"
                    :current="tab.current"
                    @close="closeTab"
                    @choose="chooseTab"
                    :tabIdx="i"
                ></layout-tab>
            </div>
            <div class="mu-layout-head-right">
                <!-- <a class="mu-layout-head-link">
                    <i class="el-icon-search"></i>
                </a> -->
                <!-- <a class="mu-layout-head-link">
                    <el-popover trigger="click"
                        width="406"
                        placement="bottom-start"
                        popper-class="post-popper"
                    >
                        <layout-post></layout-post>
                        <div slot="reference" class="relative-wrap">
                            <i class="el-icon-news" title="任务通知" ></i>
                            <span class="mu-inner-badge">5</span>
                        </div>
                    </el-popover>
                </a> -->
                <!-- <a class="mu-layout-head-link">
                    <i class="el-icon-warning" title="通知"></i>
                </a> -->
                <a class="mu-layout-head-link">
                    <i class="iconfont icon-act7"></i>
                    <span class="head-user-wrap">
                        {{loginUser && loginUser.username}}
                    </span>
                </a>

                <el-popover placement="bottom"
                    width="160"
                    trigger="hover"
                    popper-class="rect-popper"
                >
                    <ul class="mu-layout-list mu-setting-list">
                        <li class="mu-layout-item">
                            <a class="mu-layout-item-inner" @click="openSetting"><i class="el-icon-edit-outline"></i>修改密码</a>
                            <a class="mu-layout-item-inner" @click="logout"><i class="el-icon-logout"></i>注销</a>
                        </li>
                    </ul>
                    <a class="mu-layout-head-link" slot="reference"><i class="icon-more"></i></a>
                </el-popover>
            </div>
        </LayoutHead>
        <div class="mu-layout-content">
            <div class="swiper-container swiper-no-swiping">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <layout-iconmenu-panel>
                            <layout-icon-menu :img="imenu.img"
                                :component="imenu.component"
                                :title="imenu.title"
                                :menu-id="imenu.menu_id"
                                v-for="(imenu, i) in iconMenus"
                                :key="'icon' + i"
                                @click="clickIconMenu"
                            ></layout-icon-menu>
                        </layout-iconmenu-panel>
                    </div>
                    <div class="swiper-slide">Slide 2</div>
                    <div class="swiper-slide">Slide 3</div>
                </div>

                <div class="swiper-pagination"></div>

                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>

        <win-panel :title="comp.title"
            :tool-title="`${comp.title}(${comp.componentName})`"
            :minisize-event="minisize"
            @close-event="close"
            :component="comp.componentName"
            :ref="comp.componentName"
            @choose="chooseWin"
            :current="comp.current"
            v-if="comp"
            v-for="(comp, i) in wpanels"
            :key="'ooo_' + i"
            v-model="comp.show"
            :resizable="comp.resizable"
            :win-width="comp.width"
            :win-height="comp.height"
            :is-sys="comp.isSys"
            :clazz="comp.classname"
            @monitor-win="monitorWin"
            :rect="{drag_x: comp.drag_x, drag_y: comp.drag_y , resize_x: comp.resize_x, resize_y: comp.resize_y}"
        >
            <keep-alive>
                <component :is="comp.comp" ></component>
            </keep-alive>
        </win-panel>

        <layout-sidebar v-model="sidebarModel"></layout-sidebar>
    </div>
</template>

<script>
    import $ from 'jquery'

    import LayoutHead from './head'
    import LayoutFoot from './foot'
    import LayoutLaunch from './button'
    import LayoutIconMenu from './iconmenu'
    import LayoutIconmenuPanel from './iconmenu-panel'
    import LayoutTab from './tabs'
    import LayoutPost from './post'
    import LayoutSidebar from './sidebar'

    import WinPanel from './winpanel'

	import * as Components from '../getComponent'

    import {
        setActivePanel,
        getActivePanel,
        removeActivePanel,
        logout,
        getLoginUser,
		getLoguserMenus,
		setMenuId,
		getMenuId
    } from '../utils/auth'
    import { stopPropagation } from '../utils'

    import Swiper from 'swiper/dist/js/swiper.min.js'

    export default {
        components: {
            LayoutTab,
            LayoutHead,
            LayoutPost,
            LayoutFoot,
            LayoutLaunch,
            LayoutSidebar,
            LayoutIconMenu,
            LayoutIconmenuPanel,

            WinPanel,
        },
        data() {
            var _userMenus = getLoguserMenus()
            
            var $menus = _userMenus ? JSON.parse(_userMenus).map(e => {
                return {
                    img: e.menu_icon,
                    component: e.menu_component,
                    title: e.menu_name,
                    menu_id: e.menu_id
                }
            }).filter(e => e.component!= 'login') : [] //排除登录组件

            return {
                Components,
                sidebarModel: false,
                loginUser: getLoginUser(),
                iconMenus: $menus,
                iconTabs: [],
                wpanels: [],
                showDeskModel: false,
                activeIdx: 0, //当前激活的索引
            }
        },
        methods: {
            /*
             * 根据传入的arrs进行map 操作，在回调中传入遍历的参数
             */
            filterArrs(comName, cb, arrs) {
                arrs = arrs ? arrs : this.iconTabs
                arrs = arrs.map(e => {
                    cb(e)
                    return e
                })
            },
            /*
             * 切换sidebar事件
             */
            toggleSidebar(e) {
                stopPropagation(e)
                this.sidebarModel = !this.sidebarModel
            },
            /*
             * 选择窗口
             */
            chooseWin(comName) {
                this.toggleTab( comName )
            },
            /*
             * 点击tab的操作事件
             */
            chooseTab(comName, minisize, current) {
				this.setMenuids(comName)
                if(current) {
                    this.filterArrs(comName, e => {
                        if(e.componentName == comName) {
                            e.current = false
                        }
                    })
                    this.filterArrs(comName, e => {
                        if(e.componentName == comName ) {
                            e.show = false
                        }
                    }, this.wpanels)

                } else {
                    this.filterArrs(comName, e => {
                        if(e.componentName == comName ) {
                            e.current = true
                        } else {
                            e.current = false
                        }
                    })

                    this.filterArrs(comName, e => {
                        if(e.componentName == comName ) {
                            e.show = true
                            e.current = true
                        }
                    }, this.wpanels)
                }
            },
            /*
             * 切换不同的tab
             */
            toggleTab(comName) {
                this.filterArrs(comName, e => {
                    if(e.componentName == comName) {
                        e.current = true
                    } else {
                        e.current = false
                    }
                })

                this.showDeskModel = !this.showDeskModel
				setActivePanel(comName)
				this.setMenuids(comName)
            },
            /*
             * 点击icon 菜单
             */
            clickIconMenu(componentName, title, img, menuId, config) {
                var filters = this.iconTabs.filter(e => e.componentName == componentName)
                if(filters.length == 0) {
                    var _config = {
                        title,
                        componentName,
                        img,
                        showMinisize: false,
                        current: true,
                        comp: Components[componentName],
                        show: true,
                        menuId
                    }
                    if(componentName == 'sysSetting') {
                        _config.isSys = true
                    }

                    if(config) {
                        _config = Object.assign(_config, config)
                    }
                    this.iconTabs.push(_config)
                    this.wpanels = this.iconTabs.slice(0)
                } else {
                    this.wpanels = this.wpanels.map(function(e) {
                        if(e) {
                            if(e.componentName == componentName) {
                                e.current = true
                                e.show = true
                            } else {
                                e.current = false
                            }
                        }
                        return e
                    })

                    this.iconTabs = this.iconTabs.map(function(e) {
                        if(e) {
                            if(e.componentName == componentName) {
                                e.current =true
                            } else {
                                e.current = false
                            }
                        }
                        return e
                    })
                }

                this.toggleTab( componentName )
                this.filterArrs(componentName, e => {
                    if(e) {
                        if(e.componentName == componentName) {
                            e.current = true
                        } else {
                            e.current = false
                        }
                    }
                }, this.wpanels)

            },
            /*
             * 自动选择最后一个tab 和 窗口
             */
            autoChooseLast() {
                if(this.iconTabs.length > 0) {
                    var $fs = this.iconTabs.filter(e => e.current)

                    if($fs.length == 0) {
                        setTimeout(_ => {
                            this.iconTabs.forEach((e, i) => {
                                if(i == this.iconTabs.length - 1) {
                                    e.current = true
                                    this.wpanels[i] && (this.wpanels[i].current = true)
                                    this.wpanels[i] && (this.wpanels[i].show = true)

                                    setActivePanel(e.componentName)
                                }
                            })
                        })
                    }
                } else {
                    removeActivePanel()
                }
            },

            /*
             * 窗口最小化
             */
            minisize(id, component, e) {
                // stopPropagation(e)
                this.filterArrs(component, el => {
                    if(el) {
                        if(el.componentName == component) {
                            el.current = false
                        }
                    }
                })

                this.filterArrs(component, el => {
                    if(el) {
                        if(el.componentName == component) {
                            el.show = false
                            el.current = false
                        }
                    }
                }, this.wpanels)

                // this.autoChooseLast()
            },
            /*
             * 关闭窗口事件
             * 和关闭tab 相同，需要阻止冒泡，否则最外层的事件会冲突
             */
            close(component, e) {
                stopPropagation(e)
                this.closeTab(component, e)
            },
            /*
             * 关闭tab，同时关闭相关联的窗口
             */
            closeTab(comName, e) {
                stopPropagation(e)
                this.iconTabs = this.iconTabs.filter(el => el && el.componentName != comName)
                this.wpanels = this.wpanels.map(ele => ele && ele.componentName == comName ? null : ele)
                this.autoChooseLast()
            },
            /*
             * 切换显示菜单
             */
            toggleShowDesk() {
                if(this.iconTabs.length == 0 || this.wpanels.length == 0) {
                    return
                }

                if(!this.showDeskModel) {
                    this.iconTabs = this.iconTabs.map(function(e) {
                        e && (e.current = false)
                        return e
                    })

                    this.wpanels = this.wpanels.map(function(e) {
                        e && (e.show = false)
                        return e
                    })
                } else {
                    this.wpanels = this.wpanels.map(function(e) {
                        e && (e.show = true)
                        return e
                    })

                    this.autoChooseLast()
                }

                this.showDeskModel = !this.showDeskModel
            },

            openSetting() {
                var componentName = 'setting'
                var settingConfig = {
                    title: '修改密码',
                    isSys: true,
                    resizable: false,
                    componentName: componentName,
                    width: 500,
                    height: 260,
                    img: componentName,
                    current: true,
                    comp: Components[componentName],
                    show: true,
                    classname: 'modify-pwd-panel'
                }

                this.clickIconMenu(componentName, settingConfig.title, settingConfig.img, 0, settingConfig)
            },

            logout() {
                logout()
            },
            monitorWin(params, com) {
                this.iconTabs.forEach(e => {
                    if(com == e.componentName) {
                        params.drag_x && (e.drag_x = params.drag_x)
                        params.drag_y && (e.drag_y = params.drag_y)
                        params.resize_x && (e.resize_x = params.resize_x)
                        params.resize_y && (e.resize_y = params.resize_y)
                    }
                })
            },
			//根据tab名字找menuid
			setMenuids(val) {
				var menuidJson = this.iconMenus.filter(e=> e.component == val )
				if(menuidJson.length > 0){
					setMenuId(menuidJson[0].menu_id)
				}
			}
        },
        mounted() {
			var $this = this
            $(this.$el).click(function(e) {
                $this.sidebarModel = false
            })

            //处理刷新打开上次激活窗口的问题
            if(getActivePanel()) {
                var iconMenu = this.iconMenus && this.iconMenus.filter(e => e.component == getActivePanel())[0]
                if(iconMenu && iconMenu.isSys == undefined) {
                    this.clickIconMenu(iconMenu.component, iconMenu.title, iconMenu.img)
                }
            }

            new Swiper('.swiper-container', {
              slidesPerView: 1,
              spaceBetween: 30,
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            })
        }
    }
</script>

<style lang="less">
.mu-layout {
    width: 100%;
    height: 100%;

    background: url(../../assets/img/bg2.jpg) no-repeat center;
    background-size: cover;

    .mu-layout-content {
        height: 90%;
    }

    .mu-layout-showdesk {
        width: 20px;
        height: 46px;
        display: inline-block;

        background: #000;
    }

    .icon-more {
        background: url(../../assets/img/icon-more.png) no-repeat center;

        background-size: 20px 20px;
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -2px;
    }

    .mu-layout-head-link {
        display: inline-block;
        color: #fff;
        height: 30px;
        line-height: 30px;
        margin: 8px 10px;
        font-size: 14px;

        padding-right: 20px;

        &:last-child {
            border-right: 0;
            margin-left: 0;
            margin-right: 0;
        }
    }

    .mu-layout-toggle-sidebar {
        display: inline-block;
        height: 46px;
        line-height: 46px;
        width: 30px;
        vertical-align: middle;
        margin-top: -38px;
        text-align: center;
        color: #fff;
    }

    .head-user-wrap {
        font-size: 14px;
    }
}

.mu-setting-list .mu-layout-item-inner {
    display: block;
    padding: 7px 5px;
    &:hover {
        background: #06c;
        color: #ccc;
    }

    i {
        margin-right: 10px;
    }
}

body {
    overflow: hidden;
}

.text-center {
    text-align: center;
}

body .rect-popper {
    border-radius: 0;
}
.relative-wrap {
    position: relative;
}
.mu-inner-badge {
    position: absolute;
    top: -3px;
    background: red;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 100px;
    right: -15px;
    font-size: 12px;
}

.swiper-container {
    height: 100%;
}


@keyframes fadeInLeft{
    0%{opacity:0;transform:translate3d(-100%,0,0);}
    to{opacity:1;transform:none;}
}
.fadeInLeft{animation-name: fadeInLeft;}

@keyframes fadeOutLeft {
    0%{ opacity: 1; }
    to{ opacity: 0; transform: translate3d(-100%, 0, 0); }
}
.fadeOutLeft { animation-name: fadeOutLeft; }

</style>
