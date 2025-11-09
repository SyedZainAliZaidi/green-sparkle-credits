import { supabase } from "@/integrations/supabase/client";

const PAKISTAN_DEMO_DATA = [
  {
    location: "Lahore",
    cookstove_type: "improved biomass",
    image_url: "/images/default-cookstove-1.jpg",
    co2_prevented: 1.8,
    credits_earned: 10,
    likes: 12,
    verified: true,
  },
  {
    location: "Karachi",
    cookstove_type: "LPG",
    image_url: "/images/default-cookstove-2.jpg",
    co2_prevented: 2.3,
    credits_earned: 12,
    likes: 8,
    verified: true,
  },
  {
    location: "Islamabad",
    cookstove_type: "improved biomass",
    image_url: "/images/default-cookstove-3.jpg",
    co2_prevented: 1.5,
    credits_earned: 9,
    likes: 15,
    verified: true,
  },
  {
    location: "Peshawar",
    cookstove_type: "improved biomass",
    image_url: "/images/default-cookstove-1.jpg",
    co2_prevented: 1.2,
    credits_earned: 8,
    likes: 5,
    verified: true,
  },
  {
    location: "Quetta",
    cookstove_type: "LPG",
    image_url: "/images/default-cookstove-2.jpg",
    co2_prevented: 2.1,
    credits_earned: 11,
    likes: 3,
    verified: true,
  },
  {
    location: "Multan",
    cookstove_type: "improved biomass",
    image_url: "/images/default-cookstove-3.jpg",
    co2_prevented: 0.8,
    credits_earned: 8,
    likes: 7,
    verified: true,
  },
  {
    location: "Faisalabad",
    cookstove_type: "improved biomass",
    image_url: "/images/default-cookstove-1.jpg",
    co2_prevented: 1.9,
    credits_earned: 10,
    likes: 11,
    verified: true,
  },
  {
    location: "Rawalpindi",
    cookstove_type: "LPG",
    image_url: "/images/default-cookstove-2.jpg",
    co2_prevented: 2.2,
    credits_earned: 11,
    likes: 0,
    verified: true,
  },
];

export async function seedPakistanDemoData(): Promise<number> {
  // Add timestamps spread over last 10 days
  const now = new Date();
  const submissions = PAKISTAN_DEMO_DATA.map((data, index) => {
    const daysAgo = Math.floor((index * 10) / PAKISTAN_DEMO_DATA.length);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return {
      ...data,
      created_at: createdAt.toISOString(),
    };
  });

  const { data, error } = await supabase
    .from('submissions')
    .insert(submissions)
    .select();

  if (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  }

  return data?.length || 0;
}

export async function clearAllSubmissions(): Promise<void> {
  const { error } = await supabase
    .from('submissions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('Error clearing submissions:', error);
    throw error;
  }
}
