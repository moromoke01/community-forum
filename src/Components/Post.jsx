import React, { useState } from 'react';

function Post({ postId, content }) {
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true);
        } else {
            setLikes(likes - 1);
            setLiked(false);
        }
    };

    return (
        <div className="post">
            <p>{content}</p>
            <button
                style={{ backgroundColor: liked ? 'blue' : 'white', color: liked ? 'white' : 'black' }}
                onClick={handleLike}
            >
                Like
            </button>
            <span>Likes: {likes}</span>
        </div>
    );
}

export default Post;
