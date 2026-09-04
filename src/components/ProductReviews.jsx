import { useMemo, useState } from "react";
import { Star } from "lucide-react";

function getStoredReviews(productId) {
  try {
    const stored = localStorage.getItem(`geets-reviews-${productId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReview(productId, review) {
  const existing = getStoredReviews(productId);
  const updated = [review, ...existing];
  localStorage.setItem(
    `geets-reviews-${productId}`,
    JSON.stringify(updated)
  );
  return updated;
}

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="review-stars" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`review-star-btn ${star <= value ? "active" : ""}`}
          onClick={() => !readOnly && onChange?.(star)}
          disabled={readOnly}
          aria-label={`${star} star`}
        >
          <Star size={18} fill={star <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState(() => getStoredReviews(productId));
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !comment.trim()) {
      setMessage("Please enter your name and review.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("en-NP", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    const updated = saveReview(productId, newReview);
    setReviews(updated);
    setName("");
    setRating(5);
    setComment("");
    setMessage("Thank you! Your review has been submitted.");
  };

  return (
    <section className="product-reviews">
      <div className="reviews-header">
        <div>
          <p className="eyebrow">Customer Reviews</p>
          <h2>What people say about {productName}</h2>
        </div>

        {reviews.length > 0 && (
          <div className="reviews-average">
            <strong>{averageRating}</strong>
            <StarRating value={Math.round(Number(averageRating))} readOnly />
            <span>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Write a Review</h3>

        <div className="form-group">
          <label htmlFor="reviewName">Your Name</label>
          <input
            id="reviewName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>Your Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="form-group">
          <label htmlFor="reviewComment">Your Review</label>
          <textarea
            id="reviewComment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience with this product..."
            rows="4"
          />
        </div>

        {message && <p className="review-message">{message}</p>}

        <button type="submit" className="primary-button">
          Submit Review
        </button>
      </form>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="reviews-empty">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-card-top">
                <strong>{review.name}</strong>
                <StarRating value={review.rating} readOnly />
              </div>
              <p className="review-date">{review.date}</p>
              <p className="review-comment">{review.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
