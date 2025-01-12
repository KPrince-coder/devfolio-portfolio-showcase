import { FC } from 'react';
import { BlogPostPage } from "@/components/BlogPostPage";
import { useParams, Navigate } from 'react-router-dom';

interface BlogPostProps {
  postId?: string;
}

const BlogPost: FC<BlogPostProps> = () => {
  const { postId } = useParams();

  if (!postId) {
    return <Navigate to="/" replace />;
  }

  return <BlogPostPage postId={postId} />;
};

export default BlogPost;


