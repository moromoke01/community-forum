import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./Firebase_config/Firebase";

function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(firestore, "posts", postId));
        if (postDoc.exists()) {
          setPost(postDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async () => {
    // Implement comment submission logic
  };

  const toggleShowComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="post-details">
      {post && (
        <>
          <div className="post-content">
            <h2>{post.userEmail}</h2>
            <p>{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
          </div>
          <div className="comment-section">
            <button onClick={toggleShowComments}>
              {showComments ? "Hide Comments" : "Show Comments"}
            </button>
            {showComments && (
              <div className="comments">
                <h3>Comments</h3>
                <ul>
                  {post.comments.map((comment, index) => (
                    <li key={index}>
                      <strong>{comment.user}:</strong> {comment.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="comment-input">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
              />
              <button onClick={handleCommentSubmit}>Submit</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PostDetails;
