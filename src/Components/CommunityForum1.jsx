import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { imgDB } from "./Firebase_config/Firebase";
import { auth, firestore } from "./Firebase_config/Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import "./Community.css";
import { BiImageAdd } from "react-icons/bi";
import { GoHeartFill, GoCommentDiscussion } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
// import Avatar from "./Avatar"; // Import the Avatar component
// import md5 from "md5";

function CommunityForum() {
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [displayedPosts, setDisplayedPosts] = useState(3);
  const [showMore, setShowMore] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInputVisible, setCommentInputVisible] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

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
      querySnapshot.forEach((docRef) => {
        const postData = docRef.data();
        postsData.push({ id: docRef.id, ...postData, liked: false });
      });
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const imageUrl = URL.createObjectURL(selectedImage);
      setImageUrl(imageUrl);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if ((newPost.trim() !== "" || image) && user) {
      try {
        let imageUrl = "";
        if (image) {
          const storageRef = ref(imgDB, `images/${image.name}`);
          await uploadBytes(storageRef, image);
          imageUrl = await getDownloadURL(storageRef);
        }
        await addDoc(collection(firestore, "posts"), {
          content: newPost,
          createdAt: new Date(),
          userEmail: user.email,
          comments: [],
          likes: 0,
          imageUrl: imageUrl,
        });
        setNewPost("");
        setImage(null);
        setImageUrl("");
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
          { user: user.email, text: commentText },
        ];
        await updateDoc(doc(firestore, "posts", selectedPost.id), {
          comments: updatedComments,
        });
        fetchPosts();
        setCommentText("");
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
        updatedPosts[postIndex] = {
          ...post,
          liked: true,
          likes: post.likes + 1,
        };
        setPosts(updatedPosts);
      } else {
        await updateDoc(doc(firestore, "posts", postId), {
          likes: post.likes - 1,
        });
        updatedPosts[postIndex] = {
          ...post,
          liked: false,
          likes: post.likes - 1,
        };
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleToggleCommentInput = (postId) => {
    const updatedShowComments = {
      ...showComments,
      [postId]: !showComments[postId],
    };
    setShowComments(updatedShowComments);
    setSelectedPost(posts.find((post) => post.id === postId));
    setCommentInputVisible(true);
  };

  const handleSeeMore = () => {
    setDisplayedPosts(displayedPosts + 3);
    setShowMore(true);
  };

  const formatPostTime = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const handleContinueReading = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, showFullContent: true };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="community">
      <div className="community-body">
        <h3>Community</h3>
        {user && (
          <div>
            <form
              className="chat-inputarea message-form"
              onSubmit={handlePostSubmit}
            >
              <div className="post-content-box">
                <textarea
                  value={newPost}
                  onChange={handlePostChange}
                  placeholder="Share something with the community..."
                  rows={5}
                  style={{
                    resize: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Selected"
                    style={{ width: "100px", height: "100px" }}
                  />
                )}

                <div className="textarea-btns">
                  <button type="submit">Post</button>

                  <label htmlFor="file-upload">
                    <BiImageAdd style={{ cursor: "pointer" }} />
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                      id="file-upload"
                    />
                  </label>
                </div>
              </div>
            </form>

            <div className="search-icon">
              <CiSearch />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className={`post-list ${showMore ? "show-scrollbar" : ""}`}>
          {filteredPosts.slice(0, displayedPosts).map((post, index) => (
            <div
              key={index}
              className="post-box"
              style={{
                padding: "10px",
                background: "#fff",
                boxShadow: "rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">
                    <strong>{post.userEmail}</strong>{" "}
                  </div>
                  <div className="msg-info-time">
                    {formatPostTime(post.createdAt.toDate())}
                  </div>
                </div>

                <div className="msg-text">
                  {post.showFullContent ? post.content : post.content.slice(0, 90)}
                  {post.content.length > 50 && !post.showFullContent && (
                    <>
                      {" ... "}
                      <span
                        style={{ fontSize: "12px", cursor: "pointer",color: "blue" }}
                        onClick={() => handleContinueReading(post.id)}
                      >
                        Continue Reading
                      </span>
                    </>
                  )}
                </div>
                {post.imageUrl && <img className="post-image-content" src={post.imageUrl} alt="Uploaded" />}
                <div>
                  <button
                    className="like-button"
                    onClick={() => handleLikePost(post.id)}
                  >
                    <i
                      className="heart-icon"
                      style={{
                        color: post.liked ? "red" : "black",
                      }}
                    >
                      <GoHeartFill />{" "}
                    </i>
                    <span> Love ({post.likes})</span>
                  </button>
                  <i className="comment-icon">
                    <GoCommentDiscussion />
                    <button
                      className="comment-btn"
                      onClick={() => handleToggleCommentInput(post.id)}
                    >
                      Comment ({post.comments.length})
                    </button>
                  </i>
                  {showComments[post.id] &&
                    selectedPost &&
                    selectedPost.id === post.id && (
                      <div>
                        {selectedPost.comments && (
                          <ol>
                            {selectedPost.comments.map((comment, index) => (
                              <li key={index}>
                                <b>{comment.user}:</b> <br></br>
                                {comment.text}
                              </li>
                            ))}
                          </ol>
                        )}
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Type your comment"
                          style={{
                            fontSize: "13px",
                          }}
                        />
                        <button
                          className="Send-comment"
                          onClick={handleCommentSubmit}
                        >
                          Send Comment
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {posts.length > displayedPosts && (
          <button className="see-more-btn" onClick={handleSeeMore}>
            See More
          </button>
        )}
      </div>
    </div>
  );
}

export default CommunityForum;
