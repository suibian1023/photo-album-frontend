import request from '@/utils/request'

export const login = (username, password) => {
  return request({
    method: 'POST',
    url: '/auth/login',
    data: { username, password }
  })
}

export const register = (username, password) => {
  return request({
    method: 'POST',
    url: '/auth/register',
    data: { username, password }
  })
}