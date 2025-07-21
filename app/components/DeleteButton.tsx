'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/posts');
          router.refresh();
        } else {
          throw new Error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Delete Post
    </button>
  );
}