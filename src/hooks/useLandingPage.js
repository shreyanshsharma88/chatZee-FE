import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useLandingPage = () => {
    const [currentUsers, setCurrentUsers] = useState()
    const [currentGroups, setCurrentGroups] = useState()
    const navigate = useNavigate()
    const {userId} = useParams()
    const getUsers = async () => {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCurrentUsers(data);
    };

    const getGroups = async () => {
      const response = await fetch("http://localhost:8080/getGroups", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCurrentGroups(data);
    }

  useEffect(() => {
    getGroups()
    getUsers()
  }, [])

  const addGroup = async (groupName , isDm , uniqueId2)  => {
    const response = await fetch ('http://localhost:8080/addGroup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({groupName, uniqueId:userId, isDm , uniqueId2})
    })
    const res = await response.json()
    getGroups()

    console.log(res)
  }

  const addUserToGroup =async (groupId) => {
     fetch('http://localhost:8080/addUserToGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
      body:JSON.stringify({groupId, userId})

     
    }).then(() => navigate(`/${userId}/${groupId}`))
  
    
  }


  return { currentUsers , addGroup, currentGroups, addUserToGroup}
};
