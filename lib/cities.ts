export const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Goa", "Varanasi", "Kochi", "Chandigarh", "Indore",
  "Bhopal", "Nagpur", "Coimbatore", "Visakhapatnam", "Patna",
  "Agra", "Udaipur", "Jodhpur", "Mysore", "Shimla",
  "Manali", "Darjeeling", "Rishikesh", "Amritsar", "Surat",
  "Thiruvananthapuram", "Madurai", "Dehradun", "Ranchi", "Bhubaneswar",
  "Guwahati", "Jammu", "Srinagar", "Leh", "Ooty",
  "Pondicherry", "Lonavala", "Mahabaleshwar", "Alibaug", "Nashik",
]

export function searchCities(query: string): string[] {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return indianCities
    .filter((city) => city.toLowerCase().includes(q))
    .slice(0, 8)
}
