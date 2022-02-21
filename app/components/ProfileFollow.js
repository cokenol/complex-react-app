import React, { useContext, useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"

function ProfileFollow(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/${props.action}`, { cancelToken: ourRequest.token })
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
  }, [username, props.action])

  function renderWords(action, currentUser, pageUsername) {
    switch (action) {
      case "followers":
        if (currentUser == pageUsername) {
          return "You have no followers, maybe try posting something eh?"
        } else {
          return "This user has no followers, maybe follow them to give moral support?"
        }
      case "following":
        if (currentUser == pageUsername) {
          return "You are not following anyone?! Wow! Really?"
        } else {
          return "This user follows no one. Wow. This one influencer sia..."
        }
    }
  }

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.length == 0 && renderWords(props.action, appState.user.username, username)}
      {posts.map((follow, index) => {
        return (
          <Link key={index} to={`/profile/${follow.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follow.avatar} /> {follow.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollow
