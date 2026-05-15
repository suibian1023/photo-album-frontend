import request from '@/utils/request'

export const getCategories = () => {
  return request({
    method: 'GET',
    url: '/categories'
  })
}

export const addCategory = (name) => {
  return request({
    method: 'POST',
    url: '/categories',
    data: { name }
  })
}

export const updateCategory = (id, name) => {
  return request({
    method: 'PUT',
    url: `/categories/${id}`,
    data: { name }
  })
}

export const deleteCategory = (id) => {
  return request({
    method: 'DELETE',
    url: `/categories/${id}`
  })
}