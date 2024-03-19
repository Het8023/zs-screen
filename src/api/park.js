import request from '@/utils/request'

// 园区大屏-查询楼宇概况 收入和产业信息
export const getParkInfoApi = () => {
  return request({
    url: '/park/statistics/info',
    method: 'get'
  })
}
