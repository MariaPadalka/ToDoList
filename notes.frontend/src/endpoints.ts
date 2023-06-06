const baseURL = process.env.REACT_APP_API_URL

export const urlGetAll = `${baseURL}/api/note/getAll`;
export const urlCreate = `${baseURL}/api/note`;
export const urlGet = `${baseURL}/api/note/get`;
export const urlDelete = `${baseURL}/api/note/delete`;
export const urlUpdate = `${baseURL}/api/note`;