import fetch from './fetch'
import store from '@/store'
const url = '/api'


//用户接口 


//登录--done
export const login = (username, password) => fetch(url + '/login', {
    username,
    password
}, 'POST')


//获取关注信息流
export const getAttentionMsgList = (userId = store.state.userInfo.userId) => fetch(url + `/user/${userId}/attentionMsgList`)

//查看所有用户信息
export const getUserList = (userId = store.state.userInfo.userId) => fetch(url + `/user/${userId}/userList`)

//获取个人信息--done
export const getUserMsg = (userId = store.state.userInfo.userId) => fetch(url + `/user/${userId}/userMsg`)

//关注用户
export const attention = (followId, userId = store.state.userInfo.userId) => fetch(url + '/user/attention', {
    followId,
    userId
}, 'POST')

//取消关注用户
export const cancelAttention = (followId, userId = store.state.userInfo.userId) => fetch(url + '/user/cancelAttention', {
    followId,
    userId
}, 'POST')

//获取统计数据
export const getCountData = (endTime, startTime,status,userId = store.state.userInfo.userId) => fetch(url + '/user/countData', {
    endTime,
    startTime,
    status,
    userId
}, 'POST')

//删除操作-心得交流/标注地点
export const deleteByType = (id, type,userId = store.state.userInfo.userId) => fetch(url + '/user/deleteByType', {
    id,
    type,
    userId
}, 'POST')

//注册--done
export const register = (name, password, username) => fetch(url + '/user/register', {
    name,
    password,
    username
}, 'POST')


//更新头像--done
export const updateUserPic = (file, userId = store.state.userInfo.userId) => fetch(url + '/user/updateIcon', {
    file,
    userId
}
, 'POST', true)


//首页和推广流接口

//获取推广审核状态
export const getCheckList = (userId = store.state.userInfo.userId) => fetch(url + '/mark/checkList',{userId})

//标注地点管理列表
export const findMarkList = (selectedUserId, userId = store.state.userInfo.userId) => fetch(url + '/mark/findMarkList', {
    selectedUserId,
    userId
}, 'POST')

//审核功能
export const markCheck = (markId, status,userId = store.state.userInfo.userId) => fetch(url + '/mark/markCheck', {
    markId,
    status,
    userId
}, 'POST')

//获取标注地点详情
export const getMarkDetail = (markId,userId = store.state.userInfo.userId) => fetch(url + '/mark/markDetail', {
    markId,
    userId
}, 'POST')

//获取首页
export const getMobileHome = (userId = store.state.userInfo.userId) => fetch(url + '/mark/mobileHome', {userId})


//获取推广信息审核列表
export const getPcCheckList = (userId = store.state.userInfo.userId) => fetch(url + '/mark/pcCheckList', {userId})

//获取校园推广流
export const getPopularMsg = (userId = store.state.userInfo.userId) => fetch(url + '/mark/popularMsg', {userId})

//发布信息功能
export const publicMessage = (content,lat,lng,title,userId = store.state.userInfo.userId) => fetch(url + '/mark/publicMessage', {
    content,
    lat,
    lng,
    title,
    userId
}, 'POST')

//发布校园推广
export const publicPopularMsg = (markId,userId = store.state.userInfo.userId) => fetch(url + '/mark/publicPopularMsg', {
    markId,
    userId
}, 'POST')

//心得交流接口

//获取心得交流详情
export const getExperienceDetail = (commId,userId = store.state.userInfo.userId) => fetch(url + '/experience/experienceDetail', {
    commId,
    userId
}, 'POST')

//获取心得交流首页
export const getExperienceHome = (userId = store.state.userInfo.userId) => fetch(url + '/experience/experienceHome', {userId})

//获取心得交流管理列表
export const findExperienceList = (selectedUserId,userId = store.state.userInfo.userId) => fetch(url + '/experience/findExperienceList', {
    selectedUserId,
    userId
}, 'POST')

//点赞心得
export const likeExperience = (commId,likeFlag,unlikeFlag,userId = store.state.userInfo.userId) => fetch(url + '/experience/likeExperience', {
    commId,
    likeFlag,
    unlikeFlag,
    userId
}, 'POST')

//发布心得
export const postExperience = (content,title,userId = store.state.userInfo.userId) => fetch(url + '/experience/postExperience', {
    content,
    title,
    userId
}, 'POST')

//发布心得
export const replyExperience = (commId,content,userId = store.state.userInfo.userId) => fetch(url + '/experience/replyExperience', {
    commId,
    content,
    userId
}, 'POST')