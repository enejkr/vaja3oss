import React, { useState, useEffect } from 'react';

function Photo(props) {
    const { photo } = props;
    const [uploaded, setUploaded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [likes, setLikes] = useState(photo.likes ? photo.likes.length : 0);
    const [dislikes, setDislikes] = useState(photo.dislikes ? photo.dislikes.length : 0);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [comments, setComments] = useState(photo.comments || []);

    useEffect(() => {
        if (!photo.comments || photo.comments.length === 0) {
            fetch(`http://localhost:3001/photos/${photo._id}`)
                .then(response => response.json())
                .then(data => setComments(data.comments || []))
                .catch(error => console.error('Error fetching comments:', error));
        }
    }, [photo._id, photo.comments]);

    useEffect(() => {
        console.log("Komentarji:", comments);
        comments.forEach(c => console.log("Uporabnik komentarja:", c.user));
    }, [comments]);

    const handleLike = () => {
        if (userLiked) return;

        if (userDisliked) {
            setDislikes(prev => prev - 1);
            setUserDisliked(false);
        }

        setLikes(prev => prev + 1);
        setUserLiked(true);

        fetch(`http://localhost:3001/photos/${photo._id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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

        setDislikes(prev => prev + 1);
        setUserDisliked(true);

        fetch(`http://localhost:3001/photos/${photo._id}/dislike`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        }).catch(error => {
            console.error('Napaka:', error);
            setDislikes(prev => prev - 1);
            setUserDisliked(false);
        });
    };

    const toggleDetails = () => setShowDetails(prevState => !prevState);

    async function onSubmit(e) {
        e.preventDefault();

        if (!title || !content) {
            alert("Vnesite naslov in vsebino!");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/photos/${photo._id}/addComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title, content }),
            });
            const data = await res.json();
            if (res.ok) {
                setUploaded(true);
                setComments(prev => [...prev, data]);
            } else {
                alert('Napaka pri pošiljanju komentarja');
            }
        } catch (error) {
            console.error('Napaka pri pošiljanju komentarja:', error);
        }
    }

    if (!photo) return <div>Loading...</div>;

    return (
        <div className="mb-3 position-relative">
            <h5 className="card-title">{photo.name}</h5>
            <img className="card-img" src={`http://localhost:3001/${photo.path}`} alt={photo.name} />
            <div className="mt-2">
                <button className="btn btn-success me-2" onClick={handleLike}>
                    👍 Like {likes}
                </button>
                <button className="btn btn-danger" onClick={handleDislike}>
                    👎 Dislike {dislikes}
                </button>
                <div>
                    <button className="btn btn-info mt-2" onClick={toggleDetails}>
                        {showDetails ? 'Show Less' : 'Show More'}
                    </button>
                </div>

                {showDetails && (
                    <div className="mt-3">
                        <h5>Podrobnosti:</h5>
                        <p>{photo.description}</p>
                        <p>Likes: {photo.likes?.length || 0}</p>
                        <p>Dislikes: {photo.dislikes?.length || 0}</p>

                        <form className="form-group" onSubmit={onSubmit}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Naslov"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                className="form-control mt-2"
                                placeholder="Vsebina"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <input className="btn btn-primary mt-2" type="submit" value="Komentiraj" />
                        </form>

                        {uploaded && <p>Komentar je bil uspešno dodan!</p>}
                        <div className="mt-3">
                            <h3>Komentarji:</h3>
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment._id} className="comment">
                                        <h5>{comment?.user?.username}</h5>
                                        <p>{comment.title}</p>
                                        <p>{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Photo;
