export type Review = {
  id: string
  productId: string
  storeId: string
  reviewerName: string
  reviewerAvatar: string
  rating: number
  comment: string
  createdAt: string
}

export const mockReviews: Review[] = [
  {
    id: "r_01",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W1A",
    storeId: "s_kwame",
    reviewerName: "Abena Asante",
    reviewerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Exactly as described! The shoes were in perfect condition and delivery was super fast. Kwame was very responsive too.",
    createdAt: "2026-05-01T10:20:00.000Z",
  },
  {
    id: "r_02",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W1A",
    storeId: "s_kwame",
    reviewerName: "Emmanuel Boateng",
    reviewerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Good condition, minor crease on the toe box that wasn't in the photos but overall still a great buy at this price.",
    createdAt: "2026-04-28T14:45:00.000Z",
  },
  {
    id: "r_03",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W2B",
    storeId: "s_kwame",
    reviewerName: "Yaa Frimpong",
    reviewerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Vendor was very professional. Packaged carefully and delivered same day. Will buy again!",
    createdAt: "2026-05-03T09:10:00.000Z",
  },
  {
    id: "r_04",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W1A",
    storeId: "s_ama",
    reviewerName: "Kofi Antwi",
    reviewerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 3,
    comment: "Item is decent but delivery took longer than expected. Communication could be better.",
    createdAt: "2026-04-20T16:30:00.000Z",
  },
  {
    id: "r_05",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W1A",
    storeId: "s_kwame",
    reviewerName: "Akosua Mensah",
    reviewerAvatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Amazing buy! Shoes are exactly as described and the seller even threw in the extra laces. 100% legit.",
    createdAt: "2026-05-05T11:00:00.000Z",
  },
  {
    id: "r_06",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W3C",
    storeId: "s_kwame",
    reviewerName: "Fiifi Dadson",
    reviewerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Solid seller, product was clean and well-packaged. Minor scratches on the body but listed in the description.",
    createdAt: "2026-04-15T08:22:00.000Z",
  },
  {
    id: "r_07",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W1A",
    storeId: "s_ama",
    reviewerName: "Efua Amoah",
    reviewerAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    rating: 5,
    comment: "One of the smoothest transactions I've had on VarsityMart. Showed up to campus gate right on time.",
    createdAt: "2026-05-06T19:15:00.000Z",
  },
  {
    id: "r_08",
    productId: "p_01HZ8K2N3P4Q5R6S7T8U9V0W2B",
    storeId: "s_kwame",
    reviewerName: "Nana Osei",
    reviewerAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop",
    rating: 2,
    comment: "Product was okay but the seller took 3 days to reply. Not ideal when you need something urgently.",
    createdAt: "2026-04-10T12:00:00.000Z",
  },
]
