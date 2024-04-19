/* eslint-disable no-unused-vars */
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export const useLogin =  () => {
    const [value, setValue] = useState<string>('')
    const [_, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const addUser =  async() =>{
        const response = await fetch ('http://localhost:8080/login',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userName: value})
                
            
        })
        const result = await response.json();
        navigate(`/${result.id}?userName=${value}`)
    }
  

    return {value, setValue , addUser}
}