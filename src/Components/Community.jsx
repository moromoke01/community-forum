import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../Firebase'; // Import Firebase setup
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function CommunityChannel({ mealPlanAppLink }) {
  const [newPost, setNewPost] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchUserPosts(user.uid);
      } else {
        setUserPosts([]);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      const q = query(collection(firestore, 'posts'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      setUserPosts(postsData);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() !== '' && user) {
      try {
        // Save the new post to Firestore
        await addDoc(collection(firestore, 'posts'), {
          content: newPost,
          createdAt: new Date(),
          userId: user.uid, // Add userId to associate post with user
        });
        setNewPost('');
        // After posting, fetch user posts again to include the latest one
        fetchUserPosts(user.uid);
      } catch (error) {
        console.error('Error posting:', error);
      }
    }
  };

  return (
    <div>
      <h2>Community Channel</h2>
      {user && (
        <div>
          <p>Welcome, {user.email}!</p>
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={handlePostChange}
              placeholder="Share something with the community..."
              rows={4}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
      <div>
        {userPosts.map((post, index) => (
          <div key={index}>
            <p><strong>{user.email}:</strong> {post.content} - Posted on: {post.createdAt.toDate().toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div>
        <p>For more meal plans, check out our <a href={mealPlanAppLink}>Meal Plan App</a>.</p>
      </div>
    </div>
  );
}

export default CommunityChannel;







// import React, { useState, useEffect } from "react";
// import { auth, firestore } from "../Firebase"; // Import Firebase setup
// import { doc, getDoc } from 'firebase/firestore'; 

// function CommunityChannel({ mealPlanAppLink }) {
//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState("");
//   const [posterName, setPosterName] = useState("");

//   useEffect(() => {
//     // Fetch the current user's name from Firestore
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         try {
//           // Construct the document reference for the user document
//           const userDocRef = doc(firestore, "users", user.uid);
//           // Get the user document
//           const userDocSnapshot = await getDoc(userDocRef);
//           if (userDocSnapshot.exists()) {
//             const userData = userDocSnapshot.data();
//             if (userData) {
//               setPosterName(userData.name);
//             }
//           } else {
//             console.error("User document does not exist");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handlePostChange = (e) => {
//     setNewPost(e.target.value);
//   };

//   const handlePostSubmit = async (e) => {
//     e.preventDefault();
//     if (newPost.trim() !== "" && typeof posterName === "string" && posterName.trim() !== "") {
//       try {
//         // Save the new post along with the poster's name to Firestore
//         await firestore.collection("posts").add({
//           content: newPost,
//           poster: posterName,
//           createdAt: new Date(),
//         });
//         setNewPost("");
//       } catch (error) {
//         console.error("Error posting:", error);
//       }
//     } else {
//       console.error("Poster name is empty or undefined");
//     }
//   };

//   return (
//     <div>
//       <h2>Community Channel</h2>
//       <div>
//         <form onSubmit={handlePostSubmit}>
//           <textarea
//             value={newPost}
//             onChange={handlePostChange}
//             placeholder="Share something with the community..."
//             rows={4}
//           />
//           <button type="submit">Post</button>
//         </form>
//       </div>
//       <div>
//         {posts.map((post, index) => (
//           <div key={index}>
//             <p>
//               <strong>{post.poster}:</strong> {post.content}
//             </p>
//           </div>
//         ))}
//       </div>
//       <div>
//         <p>
//           For more meal plans, check out our{" "}
//           <a href={mealPlanAppLink}>Meal Plan App</a>.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default CommunityChannel;
