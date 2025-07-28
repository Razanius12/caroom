'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { setPosts, deletePost } from '@/app/lib/features/postSlice';
import { addComment } from '@/app/lib/features/commentSlice';
import Loading from '@/app/loading';

export default function ViewPostPage(context: { params: Promise<{ id: string }> }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);
  const router = useRouter();
  const { id } = React.use(context.params);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      dispatch(setPosts([data]));
    };
    fetchPost();
  }, [id, dispatch]);

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    dispatch(deletePost(id));
    redirect('/posts');
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete comment');
      }

      // Refresh the post data to get updated comments
      const postResponse = await fetch(`/api/posts/${id}`);
      const postData = await postResponse.json();
      dispatch(setPosts([postData]));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete comment');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const commentData = {
      content: formData.get('comment'),
      post_id: id
    };

    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      const newComment = await response.json();
      dispatch(addComment(newComment));

      // Clear the comment form
      (e.target as HTMLFormElement).reset();

      // Refresh the post data to get updated comments
      const postResponse = await fetch(`/api/posts/${id}`);
      const postData = await postResponse.json();
      dispatch(setPosts([postData]));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to add comment');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!posts || posts.length === 0) return <Loading />;

  const post = posts[0];

  return (
    <div className="container mx-auto p-4">
      <Link href="/posts" className="text-decoration-none">
        Back to Posts
      </Link>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>By: {post.user_name}</p>
      <p>Car: {post.car_make} {post.car_model}</p>
      <p>Type: {post.type}</p>
      {session?.user?.name === post.user_name && (
        <Link href={`/posts/${post.id}/edit`}>
          <button className="bg-warning p-2 rounded me-2">
            Edit
          </button>
        </Link>
      )}
      {session?.user?.name === post.user_name && (
        <button
          onClick={handleDelete}
          className="bg-danger text-white p-2 rounded"
        >
          Delete
        </button>
      )}
      <div className="mt-4">
        <h2>Comments</h2>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment.id} className="border p-2 mb-2 rounded-lg">
              <div className="flex items-center mb-1">
                {/* <img
                  src={comment.user_avatar}
                  alt={comment.user_name}
                  className="w-8 h-8 rounded-full"
                />
                &nbsp; */}
                <span className="font-semibold">{comment.user_name} </span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.content}</p>
              {session?.user?.id === comment.user_id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="bg-danger text-white p-2 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        {session && (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              name="comment"
              placeholder="Add a comment"
              className="p-2 border rounded w-full mb-2"
            ></textarea>
            <br />
            <button type="submit" className="bg-primary text-white p-2 rounded">
              Submit Comment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}