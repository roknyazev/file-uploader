import axios from 'axios'
import { downloadApi as downloadApiFactory, uploadApi as uploadApiFactory } from './http'

const client = axios.create({
  baseURL: import.meta.env.VITE_UPLOAD_BASE_URL,
  headers: {
    Authorization: `OAuth ${import.meta.env.VITE_UPLOAD_TOKEN}`,
  },
})

export const uploadApi = uploadApiFactory(client)
export const downloadApi = downloadApiFactory(client)
export { isApiError, isAlreadyExistsError } from './http'
