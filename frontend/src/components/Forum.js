import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/forum/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forum/posts', { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments({ ...comments, [postId]: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/forum/posts/${postId}/comments`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments(postId);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Community Forum</h2>
      <form onSubmit={handlePostSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Post</button>
      </form>
      <div>
        {posts.map(post => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>By: {post.author.username}</p>
            <button onClick={() => { setSelectedPost(post._id); fetchComments(post._id); }}>View Comments</button>
            {selectedPost === post._id && (
              <div>
                <h4>Comments</h4>
                {comments[post._id]?.map(comment => (
                  <div key={comment._id}>
                    <p>{comment.content} - {comment.author.username}</p>
                  </div>
                ))}
                <form onSubmit={(e) => handleCommentSubmit(e, post._id)}>
                  <input type="text" placeholder="Comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
                  <button type="submit">Comment</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
