import { ref, set, get, push, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase';

export const databaseService = {
  // Convert file to base64
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },

  // Add a new post
  addPost: async (userId, postData) => {
    try {
      // Convert image to base64 if it exists
      let imageBase64 = null;
      if (postData.image) {
        imageBase64 = await databaseService.fileToBase64(postData.image);
      }

      const postRef = ref(database, 'posts');
      const newPostRef = push(postRef);
      
      const post = {
        id: newPostRef.key,
        user_id: userId,
        cafe_name: postData.cafe_name,
        location: postData.location,
        category: postData.category,
        rating: postData.rating,
        description: postData.description,
        image: imageBase64,
        created_at: new Date().toISOString(),
        like_count: 0,
        comment_count: 0
      };

      await set(newPostRef, post);
      return { success: true, post };
    } catch (error) {
      console.error('Error adding post:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all posts
  getPosts: async () => {
    try {
      const postsRef = ref(database, 'posts');
      const snapshot = await get(postsRef);
      
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach((childSnapshot) => {
          posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return { success: true, posts };
      }
      
      return { success: true, posts: [] };
    } catch (error) {
      console.error('Error getting posts:', error);
      return { success: false, error: error.message };
    }
  },

  // Get posts by user ID
  getUserPosts: async (userId) => {
    try {
      const postsRef = ref(database, 'posts');
      const userPostsQuery = query(postsRef, orderByChild('user_id'), equalTo(userId));
      const snapshot = await get(userPostsQuery);
      
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach((childSnapshot) => {
          posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return { success: true, posts };
      }
      
      return { success: true, posts: [] };
    } catch (error) {
      console.error('Error getting user posts:', error);
      return { success: false, error: error.message };
    }
  },

  // Like/unlike a post
  likePost: async (postId, userId) => {
    try {
      const postRef = ref(database, `posts/${postId}`);
      const likesRef = ref(database, `likes/${postId}/${userId}`);
      
      const [postSnapshot, likeSnapshot] = await Promise.all([
        get(postRef),
        get(likesRef)
      ]);
      
      if (!postSnapshot.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnapshot.val();
      const isLiked = likeSnapshot.exists();
      
      if (isLiked) {
        // Unlike
        await Promise.all([
          remove(likesRef),
          update(postRef, { like_count: (post.like_count || 0) - 1 })
        ]);
        return { success: true, liked: false };
      } else {
        // Like
        await Promise.all([
          set(likesRef, true),
          update(postRef, { like_count: (post.like_count || 0) + 1 })
        ]);
        return { success: true, liked: true };
      }
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false, error: error.message };
    }
  },

  // Add a comment
  addComment: async (postId, userId, content) => {
    try {
      const commentsRef = ref(database, `comments/${postId}`);
      const postRef = ref(database, `posts/${postId}`);
      
      const [postSnapshot] = await Promise.all([
        get(postRef)
      ]);
      
      if (!postSnapshot.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnapshot.val();
      const newCommentRef = push(commentsRef);
      
      const comment = {
        id: newCommentRef.key,
        user_id: userId,
        content,
        created_at: new Date().toISOString()
      };
      
      await Promise.all([
        set(newCommentRef, comment),
        update(postRef, { comment_count: (post.comment_count || 0) + 1 })
      ]);
      
      return { success: true, comment };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  },

  // Get comments for a post
  getComments: async (postId) => {
    try {
      const commentsRef = ref(database, `comments/${postId}`);
      const snapshot = await get(commentsRef);
      
      if (snapshot.exists()) {
        const comments = [];
        const commentPromises = [];
        
        snapshot.forEach((childSnapshot) => {
          const commentData = { id: childSnapshot.key, ...childSnapshot.val() };
          commentPromises.push(
            get(ref(database, `users/${commentData.user_id}`)).then(userSnapshot => {
              if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                return {
                  ...commentData,
                  name: userData.name,
                  profile_image: userData.profile_image
                };
              }
              return commentData;
            })
          );
        });
        
        const enrichedComments = await Promise.all(commentPromises);
        return { success: true, comments: enrichedComments };
      }
      
      return { success: true, comments: [] };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      // Convert profile image to base64 if it exists
      let imageBase64 = null;
      if (profileData.profile_image) {
        imageBase64 = await databaseService.fileToBase64(profileData.profile_image);
      }

      const userRef = ref(database, `users/${userId}`);
      const updates = {
        ...profileData,
        profile_image: imageBase64 || profileData.profile_image_url
      };
      
      await update(userRef, updates);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Follow/unfollow user
  followUser: async (followerId, followingId) => {
    try {
      const followRef = ref(database, `follows/${followerId}/${followingId}`);
      const followSnapshot = await get(followRef);
      
      if (followSnapshot.exists()) {
        // Unfollow
        await remove(followRef);
        return { success: true, following: false };
      } else {
        // Follow
        await set(followRef, true);
        return { success: true, following: true };
      }
    } catch (error) {
      console.error('Error following user:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if user is following another user
  checkFollow: async (followerId, followingId) => {
    try {
      const followRef = ref(database, `follows/${followerId}/${followingId}`);
      const snapshot = await get(followRef);
      return { success: true, following: snapshot.exists() };
    } catch (error) {
      console.error('Error checking follow:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user stats (post count, follower count, following count)
  getUserStats: async (userId) => {
    try {
      const [postsSnapshot, followersSnapshot, followingSnapshot] = await Promise.all([
        get(query(ref(database, 'posts'), orderByChild('user_id'), equalTo(userId))),
        get(ref(database, `follows/${userId}`)),
        get(ref(database, 'follows')),
      ]);

      let postCount = 0;
      let followerCount = 0;
      let followingCount = 0;

      if (postsSnapshot.exists()) {
        postCount = Object.keys(postsSnapshot.val()).length;
      }

      if (followersSnapshot.exists()) {
        followingCount = Object.keys(followersSnapshot.val()).length;
      }

      // Count followers
      if (followingSnapshot.exists()) {
        const allFollows = followingSnapshot.val();
        followerCount = Object.values(allFollows).reduce((count, userFollows) => {
          return count + (userFollows[userId] ? 1 : 0);
        }, 0);
      }

      return {
        success: true,
        stats: {
          posts: postCount,
          followers: followerCount,
          following: followingCount
        }
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const users = [];
        snapshot.forEach((childSnapshot) => {
          users.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return { success: true, users };
      }
      
      return { success: true, users: [] };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: error.message };
    }
  }
}; 