/* ============================================
   REVA REPUTATION MANAGER — CLIENT DATA
   data.js — Single source of truth for clients
   Edit client info here only
   ============================================ */

const RevaData = (() => {

  const clients = [
    {
      id: 1,
      name: "Al Badr Restaurant",
      category: "Restaurant",
      icon: "ti-tools-kitchen-2",
      color: "#ff634e",
      initials: "AB",
      location: "Doha, Qatar",
      google_rating: 3.4,
      facebook_rating: 3.6,
      total_reviews: 128,
      pending_replies: 4,
      response_rate: 55,
      status: "needs-attention",
      contact: "albadrdoha@gmail.com",
      platforms: ["google", "facebook"],
      monthly_report: "pending",
      reviews: [
        { id: 101, platform: "google", author: "Ahmed Al-Rashid", rating: 1, date: "2024-06-10", text: "Waited 40 minutes and no one helped us. Very disappointing experience.", replied: false, urgent: true },
        { id: 102, platform: "facebook", author: "Sara Mohammed", rating: 4, date: "2024-06-09", text: "Food was really good but the place was a bit crowded.", replied: true, urgent: false },
        { id: 103, platform: "google", author: "Khalid Ibrahim", rating: 2, date: "2024-06-08", text: "Service was very slow and staff was not helpful at all.", replied: false, urgent: true },
        { id: 104, platform: "google", author: "Fatima Hassan", rating: 5, date: "2024-06-07", text: "Absolutely love this place! The biryani is the best in Doha.", replied: true, urgent: false },
        { id: 105, platform: "facebook", author: "Omar Al-Farsi", rating: 3, date: "2024-06-06", text: "Average experience. Food was okay but nothing special.", replied: false, urgent: false },
      ]
    },
    {
      id: 2,
      name: "Glow Salon & Spa",
      category: "Salon & Spa",
      icon: "ti-sparkles",
      color: "#8b5cf6",
      initials: "GS",
      location: "Doha, Qatar",
      google_rating: 4.5,
      facebook_rating: 4.7,
      total_reviews: 214,
      pending_replies: 2,
      response_rate: 82,
      status: "good",
      contact: "glowsalon@gmail.com",
      platforms: ["google", "facebook"],
      monthly_report: "sent",
      reviews: [
        { id: 201, platform: "google", author: "Noor Al-Mansoori", rating: 5, date: "2024-06-10", text: "Amazing service! The team was so professional and results were great.", replied: false, urgent: false },
        { id: 202, platform: "facebook", author: "Layla Ahmed", rating: 5, date: "2024-06-09", text: "Best salon in Doha. I always leave feeling amazing.", replied: true, urgent: false },
        { id: 203, platform: "google", author: "Mariam Jassim", rating: 4, date: "2024-06-08", text: "Great experience overall. Staff is very friendly and skilled.", replied: false, urgent: false },
        { id: 204, platform: "google", author: "Hessa Al-Kuwari", rating: 3, date: "2024-06-07", text: "Good service but waiting time was a bit long.", replied: true, urgent: false },
      ]
    },
    {
      id: 3,
      name: "SmileCare Dental",
      category: "Dental Clinic",
      icon: "ti-tooth",
      color: "#0f6e56",
      initials: "SC",
      location: "Doha, Qatar",
      google_rating: 4.8,
      facebook_rating: 4.6,
      total_reviews: 189,
      pending_replies: 1,
      response_rate: 91,
      status: "excellent",
      contact: "smilecare@gmail.com",
      platforms: ["google", "facebook"],
      monthly_report: "sent",
      reviews: [
        { id: 301, platform: "google", author: "Fatima Al-Jaber", rating: 5, date: "2024-06-10", text: "Best clinic experience I've had in Doha. Very clean and punctual.", replied: false, urgent: false },
        { id: 302, platform: "facebook", author: "Abdullah Hassan", rating: 5, date: "2024-06-09", text: "Dr. was so professional and gentle. No pain at all!", replied: true, urgent: false },
        { id: 303, platform: "google", author: "Moza Al-Thani", rating: 4, date: "2024-06-08", text: "Very satisfied with the service. Prices are a bit high though.", replied: true, urgent: false },
      ]
    },
    {
      id: 4,
      name: "Burger Nest",
      category: "Restaurant",
      icon: "ti-tools-kitchen-2",
      color: "#d97706",
      initials: "BN",
      location: "Doha, Qatar",
      google_rating: 3.9,
      facebook_rating: 4.1,
      total_reviews: 97,
      pending_replies: 3,
      response_rate: 60,
      status: "average",
      contact: "burgernest@gmail.com",
      platforms: ["google", "facebook"],
      monthly_report: "generating",
      reviews: [
        { id: 401, platform: "facebook", author: "Khalid Ibrahim", rating: 3, date: "2024-06-10", text: "Good food but parking is always an issue near the place.", replied: false, urgent: false },
        { id: 402, platform: "google", author: "Reem Al-Subaie", rating: 4, date: "2024-06-09", text: "Burgers are really tasty! Will come back again.", replied: true, urgent: false },
        { id: 403, platform: "google", author: "Tariq Mohammed", rating: 2, date: "2024-06-08", text: "Order was wrong and took forever. Not happy.", replied: false, urgent: true },
        { id: 404, platform: "facebook", author: "Dana Al-Qassim", rating: 5, date: "2024-06-07", text: "Absolutely love their smash burger. Best in Qatar!", replied: false, urgent: false },
      ]
    },
    {
      id: 5,
      name: "Peak Fitness",
      category: "Gym & Fitness",
      icon: "ti-barbell",
      color: "#185fa5",
      initials: "PF",
      location: "Doha, Qatar",
      google_rating: 4.2,
      facebook_rating: 4.0,
      total_reviews: 76,
      pending_replies: 2,
      response_rate: 70,
      status: "good",
      contact: "peakfitness@gmail.com",
      platforms: ["google", "facebook"],
      monthly_report: "sent",
      reviews: [
        { id: 501, platform: "google", author: "Hassan Al-Dosari", rating: 4, date: "2024-06-10", text: "Great gym with good equipment. Staff is helpful.", replied: false, urgent: false },
        { id: 502, platform: "facebook", author: "Noura Jassim", rating: 5, date: "2024-06-09", text: "Love this gym! Clean, modern, and great trainers.", replied: true, urgent: false },
        { id: 503, platform: "google", author: "Saad Al-Marri", rating: 3, date: "2024-06-08", text: "Good gym but gets very crowded in the evenings.", replied: false, urgent: false },
      ]
    },
    {
      id: 6,
      name: "Luxe Real Estate",
      category: "Real Estate",
      icon: "ti-building",
      color: "#334155",
      initials: "LR",
      location: "Doha, Qatar",
      google_rating: 4.3,
      facebook_rating: 4.4,
      total_reviews: 52,
      pending_replies: 0,
      response_rate: 95,
      status: "excellent",
      contact: "luxe.realestate@gmail.com",
      platforms: ["google", "facebook"],
      monthly_report: "sent",
      reviews: [
        { id: 601, platform: "google", author: "Jassim Al-Kuwari", rating: 5, date: "2024-06-09", text: "Very professional team. Helped us find our dream home in Doha.", replied: true, urgent: false },
        { id: 602, platform: "facebook", author: "Aisha Khalid", rating: 4, date: "2024-06-08", text: "Good service, responsive agents. Recommended.", replied: true, urgent: false },
      ]
    },
  ];

  /* --- GET ALL CLIENTS --- */
  function getAll() {
    return clients;
  }

  /* --- GET SINGLE CLIENT BY ID --- */
  function getById(id) {
    return clients.find(c => c.id === parseInt(id)) || null;
  }

  /* --- GET STATS SUMMARY --- */
  function getSummary() {
    const total       = clients.length;
    const avgRating   = (clients.reduce((s, c) => s + c.google_rating, 0) / total).toFixed(1);
    const pending     = clients.reduce((s, c) => s + c.pending_replies, 0);
    const avgResponse = Math.round(clients.reduce((s, c) => s + c.response_rate, 0) / total);
    const urgent      = clients.reduce((c, cl) => c + cl.reviews.filter(r => r.urgent && !r.replied).length, 0);

    return { total, avgRating, pending, avgResponse, urgent };
  }

  /* --- GET ALL REVIEWS ACROSS CLIENTS --- */
  function getAllReviews() {
    return clients.flatMap(c =>
      c.reviews.map(r => ({ ...r, clientName: c.name, clientId: c.id, clientColor: c.color }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /* --- GET STAR HTML --- */
  function starsHTML(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}">★</span>`;
    }
    return html;
  }

  /* --- STATUS CONFIG --- */
  const statusConfig = {
    'excellent':      { label: 'Excellent',      badge: 'badge-success' },
    'good':           { label: 'Good',            badge: 'badge-info'    },
    'average':        { label: 'Average',         badge: 'badge-warning' },
    'needs-attention':{ label: 'Needs Attention', badge: 'badge-urgent'  },
  };

  function getStatus(key) {
    return statusConfig[key] || statusConfig['good'];
  }

  return { getAll, getById, getSummary, getAllReviews, starsHTML, getStatus };

})();
