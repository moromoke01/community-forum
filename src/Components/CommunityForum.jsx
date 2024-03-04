import React, { useState, useEffect } from "react";
import { auth, firestore } from "../Firebase"; // Import Firebase setup
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Community.css";

function CommunityForum() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [displayedPosts, setDisplayedPosts] = useState(3); // Number of posts to display initially
  const [showMore, setShowMore] = useState(false); // Track whether "See More" button is clicked
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null); // Track selected post for adding comments
  const [commentInputVisible, setCommentInputVisible] = useState(false); // Track visibility of comment input field
  const [showComments, setShowComments] = useState({}); // Track visibility of comments for each post

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        fetchPosts();
      } else {
        setPosts([]);
      }
    });

    return unsubscribe;
  }, []);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "posts"));
      const postsData = [];
      for (const docRef of querySnapshot.docs) {
        const postData = docRef.data();
        postsData.push({ id: docRef.id, ...postData, liked: false });
      }
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() !== "" && user) {
      try {
        // Save the new post to Firestore
        await addDoc(collection(firestore, "posts"), {
          content: newPost,
          createdAt: new Date(),
          userEmail: user.email,
          comments: [], // Initialize comments array
          likes: 0, // Initialize likes count
        });
        setNewPost("");
        // After posting, fetch posts again to include the latest one
        fetchPosts();
      } catch (error) {
        console.error("Error posting:", error);
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() !== "" && selectedPost && user) {
      try {
        const updatedComments = [
          ...selectedPost.comments,
          { text: commentText, user: user.email },
        ];
        await updateDoc(doc(firestore, "posts", selectedPost.id), {
          comments: updatedComments,
        });
        // After commenting, fetch posts again to include the updated one
        fetchPosts();
        setCommentText("");
        setCommentInputVisible(false);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const postIndex = posts.findIndex((post) => post.id === postId);
      const updatedPosts = [...posts];
      const post = updatedPosts[postIndex];
      if (!post.liked) {
        await updateDoc(doc(firestore, "posts", postId), {
          likes: post.likes + 1,
        });
        updatedPosts[postIndex] = { ...post, liked: true, likes: post.likes + 1 };
        setPosts(updatedPosts);
      } else {
        await updateDoc(doc(firestore, "posts", postId), {
          likes: post.likes - 1,
        });
        updatedPosts[postIndex] = { ...post, liked: false, likes: post.likes - 1 };
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSeeComments = (postId) => {
    const updatedShowComments = {
      ...showComments,
      [postId]: !showComments[postId],
    };
    setShowComments(updatedShowComments);
  };

  const handleToggleCommentInput = (postId) => {
    setSelectedPost(posts.find((post) => post.id === postId));
    setCommentInputVisible(true);
  };

  const handleSeeMore = () => {
    setDisplayedPosts(displayedPosts + 3);
    setShowMore(true);
  };

  return (
    <div className="community">
      <div className="header-arc"></div>
      <div className="community-body">
        {user && (
          <div>
            <form
              className="chat-inputarea message-form"
              onSubmit={handlePostSubmit}
            >
              <textarea
                value={newPost}
                onChange={handlePostChange}
                placeholder="Share something with the community..."
                rows={2}
              />
              <button type="submit">Post</button>
            </form>
          </div>
        )}
        <div className={`post-list ${showMore ? "show-scrollbar" : ""}`}>
          {posts.slice(0, displayedPosts).map((post, index) => (
            <div
              key={index}
              className="post-box"
              style={{
                padding: "10px",
                borderRadius: "15px",
                background: "#fff",
                boxShadow: "rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">
                    <strong>{post.userEmail}</strong>{" "}
                  </div>
                  <div className="msg-info-time">
                    {post.createdAt.toDate().toLocaleString()}
                  </div>
                </div>
                <div className="msg-text">{post.content}</div>
                <div>
                  <button
                    style={{
                      backgroundColor: post.liked ? "blue" : "white",
                      color: post.liked ? "white" : "black",
                    }}
                    onClick={() => handleLikePost(post.id)}
                  >
                    Like 
                    <span> {post.likes}</span>
                  </button>

                  <button onClick={() => handleToggleCommentInput(post.id)}>
                    Comment
                  </button>

                  <button onClick={() => handleSeeComments(post.id)}>
                    {showComments[post.id] ? "Hide Comments" : "See Comments"}
                  </button>
                  {commentInputVisible &&
                    selectedPost &&
                    selectedPost.id === post.id && (
                      <div>
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Type your comment"
                        />
                        <button onClick={handleCommentSubmit}>
                          Submit Comment
                        </button>
                      </div>
                    )}
                  {showComments[post.id] &&
                    selectedPost &&
                    selectedPost.id === post.id &&
                    selectedPost.comments && (
                      <ol>
                        {selectedPost.comments.map((comment, index) => (
                          <li key={index}>
                            {comment.user}: {comment.text}
                          </li>
                        ))}
                      </ol>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {posts.length > displayedPosts && (
          <button onClick={handleSeeMore}>See More</button>
        )}
      </div>
    </div>
  );
}

export default CommunityForum;
