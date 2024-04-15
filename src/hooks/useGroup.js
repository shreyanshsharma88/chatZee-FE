import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSocketProvider } from "../providers/SocketProvider"

export const useGroup = () => {
    const{setMessages} = useSocketProvider()
    const [groupDetails, setGroupDetails] = useState()
    const {groupId} = useParams()
    const getGroupMembers = async() =>{
        const response = await  fetch(`http://localhost:8080/getGroupDetails/${groupId}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        setGroupDetails(data)
        setMessages(data.chat)

    } 
    useEffect(() => {
        getGroupMembers([])
    }, [groupId])
    return {groupDetails}
    
}