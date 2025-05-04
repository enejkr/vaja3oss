import React, { useState } from 'react';

function Photo(props) {
    const { photo } = props;

    // Preverimo, da likes in dislikes ne povzročata napake, če sta undefined
    const initialLikes = photo.likes ? photo.likes.length : 0;
    const initialDislikes = photo.dislikes ? photo.dislikes.length : 0;

    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);

    const handleLike = () => {
        if (userLiked) return;

        if (userDisliked) {
            setDislikes(prev => prev - 1);
            setUserDisliked(false);
        }

        // Optimistična posodobitev
        setLikes(prev => prev + 1);
        setUserLiked(true);

        fetch(`http://localhost:3001/photos/${photo._id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(response => {
            if (!response.ok) {
                // Če API javi napako, razveljavimo spremembo
                setLikes(prev => prev - 1);
                setUserLiked(false);
                alert('Neuspešen like');
            }
        }).catch(error => {
            console.error('Napaka:', error);
            setLikes(prev => prev - 1);
            setUserLiked(false);
        });
    };

    const handleDislike = () => {
        if (userDisliked) return;

        if (userLiked) {
            setLikes(prev => prev - 1);
            setUserLiked(false);
        }

        // Optimistična posodobitev
        setDislikes(prev => prev + 1);
        setUserDisliked(true);

        fetch(`http://localhost:3001/photos/${photo._id}/dislike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(response => {
            if (!response.ok) {
                setDislikes(prev => prev - 1);
                setUserDisliked(false);
                alert('Neuspešen dislike');
            }
        }).catch(error => {
            console.error('Napaka:', error);
            setDislikes(prev => prev - 1);
            setUserDisliked(false);
        });
    };

    return (
        <div className="card bg-dark text-white mb-3 position-relative">
            <img className="card-img" src={`http://localhost:3001/${photo.path}`} alt={photo.name} />
            <div className="card-img-overlay d-flex flex-column justify-content-end p-3">
                <h5 className="card-title">{photo.name}</h5>
                <p className="card-text">{photo.description}</p>
                <div className="mt-2">
                    <button className="btn btn-success me-2" onClick={handleLike}>
                        👍 Like {likes}
                    </button>
                    <button className="btn btn-danger" onClick={handleDislike}>
                        👎 Dislike {dislikes}
                    </button>
                </div>
            </div>
        </div>


    );
}

export default Photo;
