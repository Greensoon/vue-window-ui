<template>
    <div class="mu-layout-post">
        <!-- <div class="mu-layout-post-head">
            任务
        </div> -->
        <div class="mu-layout-post-content">
            <ul class="mu-layout-post-list">
                <li class="mu-layout-post-item" v-if="posts.length" v-for="(post, i) in posts" :key="i">
                    <a :href="post.id" class="mu-layout-post-link">
                        <div class="mu-layout-post-link-title">{{post.title}}</div>
                        <div class="">
                            <el-progress :percentage="post.value" v-if="post.value != 100"></el-progress>
                            <el-progress :percentage="post.value" status="success" v-if="post.value == 100"></el-progress>
                        </div>
                        <div class="mu-layout-post-link-content">
                            <span>{{post.author || '系统'}}</span>
                            <span>{{post.create_time}}</span>
                        </div>
                    </a>
                </li>

                <li class="mu-layout-post-item mu-layout-post-empty" v-if="!posts.length">
                    <div class="mu-layout-post-empty-wrap text-center">
                        <div class="mu-layout-post-empty-inner"><i class="el-icon-warning"></i></div>
                        <div class="mu-layout-post-empty-text">
                            暂无消息
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                posts: [{
                    title: '北京北京北京北京',
                    content: '',
                    create_time: '2018-05-02 10:20:00',
                    value: 70,
                    id: '1',
                }, {
                    title: '北京五环，北京6环，北京10环',
                    content: '',
                    create_time: '2018-06-15 10:08:21',
                    value: 100,
                    id: 2
                }],
            }
        }
    }
</script>

<style lang="less">
.post-popper {
    border-radius: 0;
}
.mu-layout-post {
    .mu-layout-post-head {
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }

    .mu-layout-post-item {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #ccc;
    }

    .mu-layout-post-link-content {
        color: #ccc;
        font-size: 12px;
    }

    .mu-layout-post-empty-inner {
        width: 80px;
        margin: 10px auto;
        border: 1px dashed #ccc;
        padding: 12px;
    }
}

</style>
