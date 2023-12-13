import React, { useState, useMemo } from 'react';
import './styles/App.css'
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostFilter from './components/PostFilter';
import MyModal from './components/MyModal/MyModal';
import MyButton from './components/UI/button/MyButton';

function App() {
  const [posts, setPosts] = useState([
    {id: 1, title: 'bb', body: 'hh'},
    {id: 2, title: 'jj', body: 'rr'},
    {id: 3, title: 'dd', body: 'aa'},
    {id: 4, title: 'aa', body: 'nn'}
  ])

  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false);

  const sortedPosts = useMemo(() => {
    if (filter.sort){
      return [...posts.sort((a, b) => a[filter.sort].localeCompare(b[filter.sort]))]
    }
    return posts
  }, [filter.sort, posts])

  const sortedAndSearchedPosts = useMemo(() => {
    return sortedPosts.filter(post => post.title.toLowerCase().includes(filter.query))
  }, [filter.query, sortedPosts])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  return (
    <div className="App">
      <MyButton onClick={() => setModal(true)}>
        Add new
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      <PostFilter filter={filter} setFilter={setFilter}/>
      <PostList remove={removePost} title={'List 1'} posts={sortedAndSearchedPosts}/>
    </div>
  );
}

export default App;
