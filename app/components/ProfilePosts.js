import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Post from "./Post"
import StateContext from "../StateContext"

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem.")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) {
    return <LoadingDotsIcon />
  }

  function renderWords(currentUser, pageUser) {
    if (currentUser != pageUser) {
      return "This user have no posts. What a lazy ass..."
    } else {
      return "Why are you not posting eh?!"
    }
  }

  return (
    <div className="list-group">
      {posts.length > 0 &&
        posts.map(post => {
          return <Post noAuthor={true} post={post} /*passing a props here*/ key={post._id} /* defining key for performance reasons */ />
        })}
      {posts.length == 0 && renderWords(appState.user.username, username)}
    </div>
  )
}

export default ProfilePosts
