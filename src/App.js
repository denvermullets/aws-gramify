import React, { useState, useEffect } from 'react'
import './App.css'

import { Storage } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { API, Auth } from 'aws-amplify'
import { listPosts } from './graphql/queries'
import { v4 as uuid } from 'uuid'

function App() {
  // const [posts, setPosts] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    // fetchPosts()
    // checkUser()
    fetchImages()
    return () => {}
  }, [])

  async function fetchImages() {
    let s3images = await Storage.list('')
    s3images = await Promise.all(
      s3images.map(async (image) => {
        const signedImage = await Storage.get(image.key)
        return signedImage
      })
    )
  }

  function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0]
    Storage.put(uuid(), file).then(() => fetchImages())
  }
  // async function checkUser() {
  //   const user = await Auth.currentAuthenticatedUser()
  //   console.log('user: ', user)
  //   console.log('user attributes: ', user.attributes)
  // }

  // async function fetchPosts() {
  //   try {
  //     const postData = await API.graphql({ query: listPosts })
  //     setPosts(postData.data.listPosts.items)
  //   } catch (err) {
  //     console.log({ err })
  //   }
  // }

  return (
    <div>
      <h1>Photo Album</h1>
      <span>Add new image</span>
      <input type='file' accept='image/png' onChange={onChange} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {images.map((image) => (
          <img src={image} style={{ width: 400, marginBottom: 10 }} />
        ))}
      </div>
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(App)
