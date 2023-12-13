import React, { useState } from 'react';
import MyButton from '../components/UI/button/MyButton';
import MyInput from '../components/UI/input/MyInput';

const PostForm = ({create}) => {
    const [post, setPost] = useState({title: '', body: ''})
    const addNewPost = (e) => {
        e.preventDefault()
        const newPost = {
            ...post, id: Date.now()
        }
        create(newPost)
        setPost({title: '', body: ''})
      }

    return (
        <form action="">
        <MyInput onChange={e => setPost({...post, title: e.target.value})} value={post.title} type="text" placeholder="1"/>
        <MyInput onChange={e => setPost({...post, body: e.target.value})} value={post.body} type="text" placeholder="2"/>
        <MyButton onClick={addNewPost}>Create</MyButton>
      </form>
    );
};

export default PostForm;