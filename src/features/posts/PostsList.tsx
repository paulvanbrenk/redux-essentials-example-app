import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from '../../components/TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { Spinner } from '../../components/Spinner';
import { type Post, useGetPostsQuery } from '../api/apiSlice';
import { useMemo } from 'react';

interface PostExcerptProps {
  post: Post;
}

function PostExcerpt({ post }: PostExcerptProps) {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  );
}

export const PostsList = () => {
  // Calling the `useGetPostsQuery()` hook automatically fetches data!
  const { data: posts = [], isLoading, isFetching, isSuccess, isError, error } = useGetPostsQuery();

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.toSorted((a, b) => b.date.localeCompare(a.date));
    return sortedPosts;
  }, [posts]);

  let content: React.ReactNode;

  // Show loading states based on the hook status flags
  if (isLoading) {
    content = <Spinner text="Loading..." />;
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => <PostExcerpt key={post.id} post={post} />);

    const containerClassname = classnames('posts-container', {
      disabled: isFetching,
    });

    content = <div className={containerClassname}>{renderedPosts}</div>;
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
};
