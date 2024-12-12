import { createEntityAdapter, type EntityState } from '@reduxjs/toolkit';
import { type AppStartListening } from '../../app/listenerMiddleware';
import { apiSlice } from '../api/apiSlice';

// Define a TS type for the data we'll be using

export interface Reactions {
  thumbsUp: number;
  tada: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export type ReactionName = keyof Reactions;

export type Post = {
  id: string;
  title: string;
  content: string;
  user: string;
  date: string;
  reactions: Reactions;
};

export type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>;
export type NewPost = Pick<Post, 'title' | 'content' | 'user'>;

interface PostsState extends EntityState<Post, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'rejected';
  error: string | null;
}

const postsAdapter = createEntityAdapter<Post>({
  // Sort in descending date order
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState: PostsState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const addPostsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    matcher: apiSlice.endpoints.addNewPost.matchFulfilled,
    effect: async (_, listenerApi) => {
      const { toast } = await import('react-tiny-toast');

      const toastId = toast.show('New post added!', {
        variant: 'success',
        position: 'bottom-right',
        pause: true,
      });

      await listenerApi.delay(5000);
      toast.remove(toastId);
    },
  });
};
