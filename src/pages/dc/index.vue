<template>
    <div >
        <div class="ele-ba-user ">
            <ul class="nav flex-column ele-ba-menus"></ul>

            <div class="ele-ba-user-content">
                <div class="ele-ba-user-tip"></div>
                
                <table class="ele-ba-user-table"></table>

                <button type="button" class="btn btn-primary submit-btn">下单</button>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.ele-ba-user {
    .ele-ba-user-tip {
        font-size: 12px;
        color: red;
        margin: 10px 0 20px;
    }

    .ele-ba-user-content {
        margin-left: 280px;
        background: rgba(255,255,255,1);
        border-radius: 6px;
        padding: 20px;
        margin-right: 20px;
        color: #333;
        min-height: 60vh;
    }

    .ele-ba-user-table {
        width: 100%;
        tr td {
            padding: 15px 0 15px 5px;
            border-bottom: 1px solid #999;
            font-size: 12px;
            border: 1px solid #999;
            text-align: center;
        }
    }

    .ele-ba-user-item {
        margin-right: 30px;
        cursor: pointer;
    }

    .ele-ba-user-radio {
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 5px;
    }

    .submit-btn,
    .cancel-btn {
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 20px;
    }

    .ele-ba-table-header {
        background: #e4e4e4;
    }
    
}

.ele-ba-dialog-mask.user-order-wrap {
    .ele-ba-dialog {
        width: 888px;
    }

    .list-col {
        display: inline-block;
    }
}

.ele-ba-empty-tip {
    text-align: center;
    font-size: 36px;
    margin-top: 20%;
    color: red;
}

.row-active {
    background: #ddd;
}

@media screen and (max-width: 800px) {
    .ele-ba-user {
        .ele-ba-menus {
            display: none;
        }
    
        .ele-ba-user-content {
            margin-left: 0;
            margin-right: 0;
            border-radius: 0;
        }

        .submit-btn {
            width: 100%;
        }
        
    }
    
    .menu-btn {
        width: 100%;
        border-radius: 0;
    }

    #collapseExample {
        li {
            list-style: none;
        }
    }
}
</style>

<script>
    export default {

    }
</script>