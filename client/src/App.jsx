import React, { useState } from 'react';
import './styles/App.css'
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import MySelect from './components/UI/select/MySelect';

function App() {
  const [posts, setPosts] = useState([
    {id: 1, title: 'JS', body: 'Description'},
    {id: 2, title: 'JS 2', body: 'Description'},
    {id: 3, title: 'JS 3', body: 'Description'},
    {id: 4, title: 'JS 4', body: 'Description'}
  ])

  const [selectedSort, setSelectedSort] = useState('')

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const sortPosts = (sort) => {
    setSelectedSort(sort)
    console.log(sort)
  }

  return (
    <div className="App">
      <PostForm create={createPost}/>
      <hr />
      <div>
        <MySelect
          value={selectedSort}
          onChange={sortPosts}
          defaultValue="Sort by"
          options={[
            {value: 'title', name: 'by title'},
            {value: 'body', name: 'by description'}
        ]}
        />
      </div>
      {posts.length !== 0
      ?
      <PostList remove={removePost} title={'List 1'} posts={posts}/>
      :
      <div>Посты не найдены</div>
      }
    </div>
  );
}

export default App;
