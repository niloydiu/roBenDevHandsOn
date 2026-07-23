export const seedUsers = [
  { id: "u-1", name: "Niloy Kumar", email: "niloy15-13991@diu.edu.bd", verificationLevel: "Gold", points: 1250, volunteerHours: 84.5 },
  { id: "u-2", name: "Sarah Rahman", email: "sarah.r@handson.org", verificationLevel: "Gold", points: 940, volunteerHours: 62.0 },
  { id: "u-3", name: "Arif Chowdhury", email: "arif.c@handson.org", verificationLevel: "Silver", points: 610, volunteerHours: 41.5 },
  { id: "u-4", name: "Maria Santos", email: "maria.s@handson.org", verificationLevel: "Silver", points: 520, volunteerHours: 35.0 },
  { id: "u-5", name: "Tanvir Ahmed", email: "tanvir.a@handson.org", verificationLevel: "Bronze", points: 380, volunteerHours: 24.0 },
  { id: "u-6", name: "Emma Watson", email: "emma.w@handson.org", verificationLevel: "Silver", points: 490, volunteerHours: 31.0 },
  { id: "u-7", name: "Rahul Sharma", email: "rahul.s@handson.org", verificationLevel: "Bronze", points: 290, volunteerHours: 18.5 },
  { id: "u-8", name: "Fatima Noor", email: "fatima.n@handson.org", verificationLevel: "Gold", points: 1100, volunteerHours: 75.0 }
];

export const seedEvents = [
  {
    id: "ev-1",
    title: "Dhanmondi Lake Clean-Up & Recycling Drive",
    description: "Join us this Saturday to clear plastic waste along Dhanmondi lakefront and sort items for recycling.",
    category: "Environment",
    urgency: "Medium",
    location: "Dhanmondi, Dhaka",
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    maxParticipants: 35,
    participants: [seedUsers[0], seedUsers[1]],
    requirements: "Bring a water bottle and wear comfortable outdoor footwear.",
    creator: seedUsers[0]
  },
  {
    id: "ev-2",
    title: "Youth STEM & Robotics Coding Workshop",
    description: "Interactive computer science and robotics workshop for underrepresented middle school students.",
    category: "Education",
    urgency: "Low",
    location: "Uttara, Dhaka",
    date: new Date(Date.now() + 86400000 * 4).toISOString(),
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    maxParticipants: 25,
    participants: [seedUsers[2]],
    requirements: "Laptops provided for all students.",
    creator: seedUsers[1]
  },
  {
    id: "ev-3",
    title: "Community Food Bank & Fresh Produce Distribution",
    description: "Packing and distributing fresh produce and essential groceries to 200 local families in need.",
    category: "Food",
    urgency: "High",
    location: "Mirpur, Dhaka",
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    maxParticipants: 40,
    participants: [seedUsers[3], seedUsers[4]],
    requirements: "Volunteers must wear masks and gloves.",
    creator: seedUsers[2]
  },
  {
    id: "ev-4",
    title: "Free Neighborhood Health & Eye Screening Camp",
    description: "Volunteer medical doctors and assistants providing free basic checkups, vision tests, and medicine.",
    category: "Healthcare",
    urgency: "Emergency",
    location: "Banani, Dhaka",
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    startTime: "08:30 AM",
    endTime: "04:00 PM",
    maxParticipants: 50,
    participants: [seedUsers[5]],
    requirements: "Medical credentials required for diagnostic volunteers.",
    creator: seedUsers[3]
  },
  {
    id: "ev-5",
    title: "Animal Shelter Care & Pet Adoption Fair",
    description: "Help feed, groom, and walk rescue animals while facilitating weekend community pet adoptions.",
    category: "Animals",
    urgency: "Medium",
    location: "Gulshan, Dhaka",
    date: new Date(Date.now() + 86400000 * 8).toISOString(),
    startTime: "11:00 AM",
    endTime: "04:00 PM",
    maxParticipants: 30,
    participants: [seedUsers[6]],
    requirements: "Love for animals and comfortable clothes.",
    creator: seedUsers[4]
  },
  {
    id: "ev-6",
    title: "Senior Citizen Digital Literacy & Smartphone Mentor Class",
    description: "One-on-one patient mentoring to help seniors navigate smartphones, video calls, and online services.",
    category: "Elderly",
    urgency: "Low",
    location: "Baridhara, Dhaka",
    date: new Date(Date.now() + 86400000 * 10).toISOString(),
    startTime: "02:00 PM",
    endTime: "05:00 PM",
    maxParticipants: 20,
    participants: [seedUsers[7]],
    requirements: "Patient attitude and basic tech familiarity.",
    creator: seedUsers[5]
  }
];

// Generate 45 additional rich events
for (let i = 7; i <= 50; i++) {
  const cats = ["Environment", "Education", "Food", "Healthcare", "Animals", "Elderly", "Community"];
  const locs = ["Dhanmondi, Dhaka", "Gulshan, Dhaka", "Uttara, Dhaka", "Mirpur, Dhaka", "Banani, Dhaka", "Chittagong, BD", "Sylhet, BD"];
  const cat = cats[i % cats.length];
  seedEvents.push({
    id: `ev-${i}`,
    title: `Community Action & ${cat} Initiative #${i}`,
    description: `Mobilizing neighborhood volunteers for high-impact ${cat.toLowerCase()} projects and sustainable community development.`,
    category: cat,
    urgency: i % 4 === 0 ? "Emergency" : i % 2 === 0 ? "High" : "Medium",
    location: locs[i % locs.length],
    date: new Date(Date.now() + 86400000 * (i % 20 + 1)).toISOString(),
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    maxParticipants: 20 + (i % 30),
    participants: [seedUsers[i % seedUsers.length]],
    requirements: "Open to all passionate volunteers.",
    creator: seedUsers[i % seedUsers.length]
  });
}

export const seedHelpRequests = [
  {
    id: "req-1",
    title: "Need assistance moving heavy furniture after clinic visit",
    description: "Elderly resident needing two volunteers to help relocate living room furniture and groceries.",
    category: "general",
    urgencyLevel: "medium",
    location: "Dhanmondi, Dhaka",
    contactInfo: "contact@handson.org | +8801700100001",
    offers: 3,
    createdAt: new Date().toISOString(),
    creator: seedUsers[0]
  },
  {
    id: "req-2",
    title: "Urgent O+ Blood Donor Needed at Square Hospital",
    description: "Patient undergoing surgery urgently requires 2 bags of O+ blood. Transportation arranged.",
    category: "health",
    urgencyLevel: "urgent",
    location: "Panthapath, Dhaka",
    contactInfo: "emergency@handson.org | +8801700100002",
    offers: 5,
    createdAt: new Date().toISOString(),
    creator: seedUsers[1]
  },
  {
    id: "req-3",
    title: "Math & Physics tutoring for 9th grader before exam",
    description: "Looking for a college volunteer to tutor algebra 2 hours a week for 3 weeks.",
    category: "education",
    urgencyLevel: "low",
    location: "Gulshan, Dhaka",
    contactInfo: "tutoring@handson.org | +8801700100003",
    offers: 2,
    createdAt: new Date().toISOString(),
    creator: seedUsers[2]
  }
];

for (let i = 4; i <= 50; i++) {
  const cats = ["general", "health", "education", "food", "environment"];
  const urgs = ["urgent", "medium", "low"];
  const locs = ["Dhanmondi, Dhaka", "Gulshan, Dhaka", "Uttara, Dhaka", "Mirpur, Dhaka"];
  seedHelpRequests.push({
    id: `req-${i}`,
    title: `Neighborhood Mutual Aid Support Request #${i}`,
    description: `Local community member seeking neighborly assistance for urgent task and logistics.`,
    category: cats[i % cats.length],
    urgencyLevel: urgs[i % urgs.length],
    location: locs[i % locs.length],
    contactInfo: `contact-req${i}@handson.org | +8801700${100000 + i}`,
    offers: Math.floor(Math.random() * 4),
    createdAt: new Date().toISOString(),
    creator: seedUsers[i % seedUsers.length]
  });
}

export const seedTeams = [
  {
    id: "t-1",
    name: "Green Earth Action Corps",
    description: "Dedicated volunteer group advocating for environmental conservation and sustainable city projects.",
    cause: "environment",
    memberCount: 28,
    eventsCount: 14,
    hoursContributed: 240,
    isPublic: true,
    creator: seedUsers[0]
  },
  {
    id: "t-2",
    name: "Meals on Wheels Bangladesh",
    description: "Community food drive and surplus meal redistribution alliance.",
    cause: "food",
    memberCount: 35,
    eventsCount: 22,
    hoursContributed: 410,
    isPublic: true,
    creator: seedUsers[1]
  },
  {
    id: "t-3",
    name: "Tech & Code for Good",
    description: "Volunteers mentoring youth in STEM, coding, and digital literacy.",
    cause: "education",
    memberCount: 19,
    eventsCount: 9,
    hoursContributed: 185,
    isPublic: true,
    creator: seedUsers[2]
  }
];

for (let i = 4; i <= 25; i++) {
  const causes = ["environment", "food", "education", "healthcare", "animals", "community"];
  seedTeams.push({
    id: `t-${i}`,
    name: `Volunteer Alliance Group #${i}`,
    description: `Active community team driving collective action and community impact.`,
    cause: causes[i % causes.length],
    memberCount: 10 + (i * 2),
    eventsCount: 5 + i,
    hoursContributed: 50 + (i * 15),
    isPublic: true,
    creator: seedUsers[i % seedUsers.length]
  });
}
