import fetch from './fetch'
import store from '@/store'
import {baseUrl} from '../../vue.config'
const url = baseUrl == '/' ? '/api' : baseUrl
const mapUrl = baseUrl == '/' ? '/amap' : 'http://restapi.amap.com/v3/geocode/regeo'


//高德地图

//逆地理编码--done
export const getAmapAddress = (lat, lng) => fetch(mapUrl, {
    // output:'xml',
    location:`${lng},${lat}`,
    key:'a6d2df7f27a6e3a5cc28e376062e5bf6',
    radius:100,
    extensions:'all',
    batch:false,
    roadlevel:0
})

//用户接口

//登录--done
export const login = (username, password) => fetch(url + '/login', {
    username,
    password
}, 'POST')

//获取关注信息流--done
export const getAttentionMsgList = (userId = store.state.userInfo.userId) => fetch(url + `/user/${userId}/attentionMsgList`)

//管理员
//查看所有用户信息--done
export const getUserList = (userId = store.state.userInfo.userId) => fetch(url + `/admin/${userId}/userList`,{userId},'POST')

//获取个人信息--done
export const getUserMsg = (userId = store.state.userInfo.userId) => fetch(url + `/user/${userId}/userMsg`)

//关注用户--done
export const attention = (followId, userId = store.state.userInfo.userId) => fetch(url + '/user/attention', {
    followId,
    userId
}, 'POST')

//取消关注用户--done
export const cancelAttention = (cancelId, userId = store.state.userInfo.userId) => fetch(url + '/user/cancelAttention', {
    cancelId ,
    userId
}, 'POST')

//管理员
//获取统计数据--done
//统计数据，status 状态区分，推广信息传1，心得交流传0，标注传-1
export const getCountData = (startTime,endTime,status,userId = store.state.userInfo.userId) => fetch(url + '/admin/countData', {
    endTime,
    startTime,
    status,
    userId
}, 'POST')

//管理员
//删除操作-心得交流/标注地点--done
export const deleteByType = (id, type,userId = store.state.userInfo.userId) => fetch(url + '/admin/deleteByType', {
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

//获取推广审核状态--done
export const getCheckList = (userId = store.state.userInfo.userId) => fetch(url + '/mark/checkList',{userId})


//管理员
//获取推广审核状态--done
export const getAllUserCheckList = (userId = store.state.userInfo.userId) => fetch(url + '/admin/pcCheckList',{userId})


//管理员
//标注地点管理列表-done
export const findMarkList = (selectedUserId, userId = store.state.userInfo.userId) => fetch(url + '/admin/findMarkList', {
    selectedUserId,
    userId
}, 'POST')

//管理员
//推广审核功能(通过：1，拒绝：2)--done
export const markCheck = (markId, status,userId = store.state.userInfo.userId) => fetch(url + '/admin/markCheck', {
    markId,
    status,
    userId
}, 'POST')

//获取标注地点详情--done
export const getMarkDetail = (markId,userId = store.state.userInfo.userId) => fetch(url + '/mark/markDetail', {
    markId,
    userId
}, 'POST')


//获取首页--done
export const getMobileHome = (userId = store.state.userInfo.userId) => fetch(url + '/mark/mobileHome', {userId})

//管理员
//获取推广信息审核列表--done
export const getPcCheckList = (userId = store.state.userInfo.userId) => fetch(url + '/mark/pcCheckList', {userId})

//获取校园推广流--done
export const getPopularMsg = (userId = store.state.userInfo.userId) => fetch(url + '/mark/popularMsg', {userId})

//发布信息功能--done
export const publicMessage = (content,lat,lng,title,userId = store.state.userInfo.userId) => fetch(url + '/mark/publicMessage', {
    content,
    lat,
    lng,
    title,
    userId
}, 'POST')

//发布校园推广--done
export const publicPopularMsg = (markId,userId = store.state.userInfo.userId) => fetch(url + '/mark/publicPopularMsg', {
    markId,
    userId
}, 'POST')


//心得交流接口

//获取心得交流详情--done
export const getExperienceDetail = (commId,userId = store.state.userInfo.userId) => fetch(url + '/experience/experienceDetail', {
    commId,
    userId
}, 'POST')

//获取心得交流首页--done
export const getExperienceHome = (userId = store.state.userInfo.userId) => fetch(url + '/experience/experienceHome', {userId})

//管理员
//获取心得交流管理列表--done
export const findExperienceList = (selectedUserId,userId = store.state.userInfo.userId) => fetch(url + '/admin/findExperienceList', {
    selectedUserId,
    userId
}, 'POST')

//点赞心得--done
export const likeOrHate = (operateType, targetId, targetType, userId = store.state.userInfo.userId) => fetch(url + '/experience/likeOrHate', {
    operateType,
    targetId,
    targetType,
    userId
}, 'POST')

//发布心得--无图文--done
export const postExperience = (title,content,userId = store.state.userInfo.userId) => fetch(url + '/experience/postExperience', {
    content,
    title,
    userId
}, 'POST')

//发布心得--有图文--done
export const postExperienceWithPic = (title,content,file,userId = store.state.userInfo.userId) => fetch(url + '/experience/postExperience', {
    content,
    title,
    file,
    userId
}, 'POST',true)

//回复心得--done
export const replyExperience = (commId,content,userId = store.state.userInfo.userId) => fetch(url + '/experience/replyExperience', {
    commId,
    content,
    userId
}, 'POST')