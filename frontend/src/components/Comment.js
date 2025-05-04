import React, { useState, useEffect } from 'react';

function Comment({ comment }) {
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        if (comment && comment.belongsTo) {
            fetch(`/api/users/${comment.belongsTo}`)
                .then(response => response.json())
                .then(data => setAuthor(data))
                .catch(error => console.error('Error fetching author:', error));
        }
    }, [comment]);

    return (
        <div className="comment">
            <h3>{comment.title}</h3>
            <p>{comment.content}</p>
            {author && <p><strong>Written by:</strong> {author.name}</p>}
        </div>
    );
}

export default Comment;
