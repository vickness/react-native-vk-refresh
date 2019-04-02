
/** 刷新状态*/
const RefreshStatus = {

    /** 头部闲置*/
    HeaderIdle: 0,

    /** 头部即将刷新*/
    HeaderBegin: 1,

    /** 头部刷新中*/
    HeaderRefresh: 2,

    /** 头部刷新完成*/
    HeaderFinish: 3,

    /** 头部刷新失败*/
    HeaderFailure: 4,

    /** 尾部加载中*/
    FooterRefresh: 5,

    /** 尾部没有更多数据*/
    FooterFinish: 6,

    /** 尾部加载失败*/
    FooterFailure: 7,

    /** 尾部数据为空*/
    FooterEmpty: 8
};

export default RefreshStatus;
