import React, { useState } from 'react';

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

    // Funkcija za like
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

    // Funkcija za dislike
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

    // Funkcija za preklop prikaza podrobnosti
    const toggleDetails = () => setShowDetails(prevState => !prevState);

    // Funkcija za pošiljanje komentarja
    async function onSubmit(e) {
        e.preventDefault();

        if (!title) {
            alert("Vnesite naslov!");
            return;
        }
        if (!content) {
            alert("Vnesite vsebino!");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        try {
            const res = await fetch(`http://localhost:3001/photos/${photo._id}/addComment`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setUploaded(true);
            } else {
                alert('Napaka pri pošiljanju komentarja');
            }
        } catch (error) {
            console.error('Napaka pri pošiljanju komentarja:', error);
        }
    }

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
                        <p>Likes: {photo.likes.length}</p>
                        <p>Dislikes: {photo.dislikes.length}</p>

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
                    </div>
                )}
            </div>
        </div>
    );
}

export default Photo;
