<template>
    <div class="add-element">
        <ul class="element-list">
            <li class="element-item"
                v-for="(item, i) in elementList"
                :class="chooseIds.indexOf(String(item.element_id)) > -1 ? 'element-select' : ''"
                :key="i"
                @click="chooseItem(String(item.element_id))"
            >{{item.element_name}}</li>
        </ul>

        <div class="ae-bottom">
            <el-button type="warning" @click="addElements">确定</el-button>
            <el-button @click="closeModal">取消</el-button>
        </div>
    </div>
</template>

<style lang="less">
.element-list {
    display: flex;
    flex-wrap: wrap;

    .element-item {
        padding: 5px 15px;
        margin-right:10px;
        background: #5297ff;
        color: #fff;
        margin-bottom: 10px;
        cursor: pointer;
        border: 3px solid #5297ff;
        font-size: 12px;
    }

    .element-select {
        border-color: #06f;
        position: relative;
        overflow: hidden;
        &:before {
            content: '';
            position: absolute;
            width: 50px;
            height: 30px;
            background: #06f;
            transform: rotate(50deg);
            right: -30px;
            top: -10px;
        }

        &:after {
            content: '';
            position: absolute;
            background: url(../../../assets/img/icon-right.png) no-repeat center;
            background-size: 15px 15px;
            width: 15px;
            height: 15px;
            right: -4px;
            top: -2px;
        }

    }

    .ae-bottom {
        margin-top: 20px;
    }
}
</style>

<script>
    import { getElements } from '../../apis/get'
    import { addElementsToMenu } from '../../apis/patch'

    export default {
        props: ['elementIds'],
        data() {
            var $this = this
            return {
                elementList: [],
                chooseIds: $this.elementIds || [],
                chooseMenus: []
            }
        },
        created() {
            this.getElementList()
        },
        watch: {
            elementIds: {
                handler(newv) {
                    this.chooseIds = newv
                },
                deep: true
            }
        },
        methods: {
            getElementList() {
                getElements()
                    .then(json => {
                        if(json.code == 200) {
                            this.elementList = json.result
                        }
                    })
            },
            chooseItem(eid) {
                var $index = this.chooseIds.indexOf(eid)

                if($index > -1) {
                    this.chooseIds = this.chooseIds.slice(0, $index).concat(this.chooseIds.slice($index + 1))
                } else {
                    this.chooseIds.push(eid)
                }
            },
            addElements() {
                this.chooseMenus = this.elementList.filter(e => this.chooseIds.indexOf(String(e.element_id)) > -1)
                this.$emit('handle-data', this.chooseMenus)
                this.$emit('close-modal')
            },
            closeModal() {
                this.$emit('close-modal')
            }
        }
    }
</script>
