import request from '@/utils/request'

export const getPhotos = (categoryId) => {
  const params = categoryId ? { categoryId } : {}
  return request({
    method: 'GET',
    url: '/photos',
    params
  })
}

export const uploadPhoto = (formData) => {
  return request({
    method: 'POST',
    url: '/photos',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deletePhoto = (photoId) => {
  return request({
    method: 'DELETE',
    url: `/photos/${photoId}`
  })
}