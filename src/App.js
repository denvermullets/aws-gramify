import React, { useState, useEffect } from 'react'
import './App.css'

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { API, Auth } from 'aws-amplify'
import { listPosts } from './graphql/queries'

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
    checkUser()
    return () => {}
  }, [])

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    console.log('user: ', user)
    console.log('user attributes: ', user.attributes)
  }

  async function fetchPosts() {
    try {
      const postData = await API.graphql({ query: listPosts })
      setPosts(postData.data.listPosts.items)
    } catch (err) {
      console.log({ err })
    }
  }

  return (
    <div>
      <AmplifySignOut />
      <h1>Hello World</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.name}</h3>
          <p>{post.location}</p>
        </div>
      ))}
    </div>
  )
}

export default withAuthenticator(App)
