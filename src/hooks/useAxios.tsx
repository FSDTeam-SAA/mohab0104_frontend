import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODM0MDRhYTM1NTFhMmFlMTA4YmE2MGEiLCJlbWFpbCI6InRhaHNpbi5iZGNhbGxpbmdAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ4NDkxNzI2LCJleHAiOjE3NDg1NzgxMjZ9.kX1TC3tWcanMz3iWLLsSXtXph2oOyCMdNrtUYMbexvA"

const axiosInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_API_URL}`,
    headers : {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})

const useAxios = () => {
  return axiosInstance;
}

export default useAxios