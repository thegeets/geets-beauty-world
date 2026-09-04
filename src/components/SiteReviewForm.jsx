import { useState } from "react";
import { Star } from "lucide-react";

function getSiteReviews() {
  try {
    const stored = localStorage.getItem("geets-site-reviews");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function StarInput({ value, onChange }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`review-star-btn ${star <= value ? "active" : ""}`}
          onClick={() => onChange(star)}
          aria-label={`${star} stars`}
        >
          <Star size={16} fill={star <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export default function SiteReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [recentReviews, setRecentReviews] = useState(getSiteReviews);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !comment.trim()) {
      setMessage("Please enter your name and review.");
      return;
    }

    const review = {
      id: Date.now(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("en-NP", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updated = [review, ...getSiteReviews()].slice(0, 6);
    localStorage.setItem("geets-site-reviews", JSON.stringify(updated));
    setRecentReviews(updated);
    setName("");
    setRating(5);
    setComment("");
    setMessage("Thank you! Your review has been submitted.");
  };

  return (
    <div className="site-review-block">
      <form className="site-review-form" onSubmit={handleSubmit}>
        <label htmlFor="siteReviewName">Your Name</label>
        <input
          id="siteReviewName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
        />

        <label>Rating</label>
        <StarInput value={rating} onChange={setRating} />

        <label htmlFor="siteReviewComment">Your Review</label>
        <textarea
          id="siteReviewComment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience with Geets Beauty..."
          rows="3"
        />

        {message && <p className="site-review-message">{message}</p>}

        <button type="submit" className="site-review-submit">
          Submit Review
        </button>
      </form>

      {recentReviews.length > 0 && (
        <div className="site-review-list">
          {recentReviews.slice(0, 3).map((review) => (
            <article className="site-review-item" key={review.id}>
              <div className="site-review-item-top">
                <strong>{review.name}</strong>
                <span>{"★".repeat(review.rating)}</span>
              </div>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
