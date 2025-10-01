import axios from 'axios'
import { uploadApi as uploadApiFactory } from './http'

const client = axios.create({
  baseURL: import.meta.env.VITE_UPLOAD_BASE_URL,
  headers: {
    Authorization: `OAuth ${import.meta.env.VITE_UPLOAD_TOKEN}`,
  },
})

export const uploadApi = uploadApiFactory(client)
export { isApiError, isAlreadyExistsError } from './http'
