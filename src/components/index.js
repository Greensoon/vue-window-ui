import Panel from './panel'
import PanelTitle from './panel/title'
import PanelContent from './panel/content'
import Block from './block'
import Menus from './menus'
import SideMenus from './side-menu'
import Wrap from './wrap'
import WrapBlock from './wrap/block'
import WrapBlockItem from './wrap/item'
import InstancePanel from './instance-panel'
import InstancePanelTitle from './instance-panel/title'
import InstancePanelContent from './instance-panel/content'
import MonitorPanel from './monitor-panel'
import Chart from './charts'
import ChartMonitor from './charts/monitor'
import ChartTree from './charts/tree'
import ChartSunburst from './charts/sunburst'
import ChartLine from './charts/line'
import Tag from './tag'
import MobileMenu from './mobile-menu'
import SearchBar from './search-bar'
import Select from './select'
import TreeTable from './tree-table/data'
import Dialog from './dialog'
import SearchSelect from './search-select'
import LRLayout from './lr-layout'
import Vue from 'vue'

var components = [
	Panel,
	PanelTitle,
	PanelContent,
	Block,
	Menus,
	SideMenus,
	Wrap,
	WrapBlock,
	WrapBlockItem,
	InstancePanel,
	InstancePanelTitle,
	InstancePanelContent,

	MonitorPanel,
	Chart,
	ChartMonitor,
	ChartTree,
	ChartSunburst,
	ChartLine,

	MobileMenu,
	SearchBar,
	Tag,
	Dialog,
	TreeTable,
	SearchSelect,
	Select,

	LRLayout
]

components.forEach(el => {
	Vue.component(el.name, el)
})