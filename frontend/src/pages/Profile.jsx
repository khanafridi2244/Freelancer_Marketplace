import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api/users.js';
import { getUserReviews } from '../api/reviews.js';

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          getUserProfile(id),
          getUserReviews(id),
        ]);
        setProfile(profileRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-fog font-mono text-sm">Loading profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-fog">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate border border-border rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-2xl font-semibold text-paper">
              {profile.name}
            </h1>
            <span className="font-mono text-signal text-sm">
              ★ {profile.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-fog text-sm mb-3 capitalize">{profile.role}</p>
          {profile.bio && <p className="text-paper/80 mb-3">{profile.bio}</p>}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-slate-2 border border-border text-fog text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="font-display text-lg font-semibold text-paper mb-3">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-fog text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-slate border border-border rounded-md p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-paper font-medium">
                    {review.reviewer?.name || 'Anonymous'}
                  </p>
                  <span className="text-signal font-mono text-sm">
                    {'★'.repeat(review.rating)}
                  </span>
                </div>
                <p className="text-paper/70 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;