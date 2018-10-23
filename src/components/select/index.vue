<template>
    <div class="mu-select">
        <multiselect v-model="val"
            :selectLabel="''"
            :deselectLabel="''"
            :selectedLabel="''"
            :options="options"
            :placeholder="placeholder || '请选择'"
            @select="change"
            label="name">
        </multiselect>
    </div>
</template>
<style lang="less">
.mu-select {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    vertical-align: middle;

    .multiselect {
        display: inline-block;
        width: 220px;
        height: 30px;
        line-height: 1;
        font-size: 12px;
        min-height: 30px;
        // overflow: hidden;

        .multiselect__select {
            height: 28px;
        }

        .multiselect__tags {
            min-height: 28px;
            padding-top: 0;
            border-radius: 0;
            font-size: 12px;
            height: 28px;
            line-height: 28px;
        }

        .multiselect__placeholder {
            line-height: 26px;
            vertical-align: top;
            margin-bottom: 0;
            padding-top: 0;
        }

        .multiselect__input, .multiselect__single {
            font-size: 12px;
            line-height: 26px;
        }

        .multiselect__input {
            margin-bottom: 0;
            padding: 0;
            height: 26px;
        }

        .multiselect__single {
            padding-left: 0;
        }
    }
}
</style>

<script>
    import Multiselect from 'vue-multiselect'
    export default {
        name: 'muSelect',
        components: {
            Multiselect
        },
        props: ['options', 'placeholder', 'defaultValue', 'value'],
        data() {
            return {
                val: this.value || null
            }
        },
        watch: {
            value(val) {
                if(typeof val == 'object') {
                    this.val = val
                } else if(!val) {
                    this.val = null
                }
            },
            options(val) {
                if(val.length) {
                    if(this.defaultValue != undefined) {
                        this.val = val[0] || null
                        this.$emit('input', val[0].id || val[0].value)
                    } else {
                        this.val = this.value || null
                    }
                }
            },
        },
        methods: {
            change(option) {
                this.$emit('input', option.id || option.value)
                this.$emit('change', option.id || option.value)
            }
        }
    }
</script>
