import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const categories = ["Environment", "Education", "Food", "Healthcare", "Animals", "Elderly", "Development", "Community"];
const urgencies = ["low", "medium", "urgent"];
const cities = [
  "Dhaka, Bangladesh", "Chittagong, Bangladesh", "Sylhet, Bangladesh", "Rajshahi, Bangladesh", "Khulna, Bangladesh",
  "New York, NY", "San Francisco, CA", "London, UK", "Toronto, ON", "Sydney, Australia",
  "Dhanmondi, Dhaka", "Gulshan, Dhaka", "Uttara, Dhaka", "Mirpur, Dhaka", "Banani, Dhaka"
];

async function main() {
  console.log("🌱 Starting database wipe & 200+ record seed process...");

  // Clear existing records cleanly
  await prisma.notification.deleteMany();
  await prisma.pendingHour.deleteMany();
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.helpRequest.deleteMany();
  await prisma.event.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. Create 35 Realistic Users
  const userSeeds = [
    { name: "Niloy Kumar", email: "niloy15-13991@diu.edu.bd", verificationLevel: "Gold", points: 1250, volunteerHours: 84.5 },
    { name: "Sarah Rahman", email: "sarah.r@handson.org", verificationLevel: "Gold", points: 940, volunteerHours: 62.0 },
    { name: "Arif Chowdhury", email: "arif.c@handson.org", verificationLevel: "Silver", points: 610, volunteerHours: 41.5 },
    { name: "Maria Santos", email: "maria.s@handson.org", verificationLevel: "Silver", points: 520, volunteerHours: 35.0 },
    { name: "Tanvir Ahmed", email: "tanvir.a@handson.org", verificationLevel: "Bronze", points: 380, volunteerHours: 24.0 },
    { name: "Emma Watson", email: "emma.w@handson.org", verificationLevel: "Silver", points: 490, volunteerHours: 31.0 },
    { name: "Rahul Sharma", email: "rahul.s@handson.org", verificationLevel: "Bronze", points: 290, volunteerHours: 18.5 },
    { name: "Fatima Noor", email: "fatima.n@handson.org", verificationLevel: "Gold", points: 1100, volunteerHours: 75.0 },
    { name: "David Miller", email: "david.m@handson.org", verificationLevel: "Silver", points: 430, volunteerHours: 28.0 },
    { name: "Nusrat Jahan", email: "nusrat.j@handson.org", verificationLevel: "Bronze", points: 310, volunteerHours: 20.0 },
  ];

  for (let i = 11; i <= 35; i++) {
    userSeeds.push({
      name: `Volunteer User ${i}`,
      email: `volunteer${i}@handson.org`,
      verificationLevel: i % 3 === 0 ? "Gold" : i % 2 === 0 ? "Silver" : "Bronze",
      points: Math.floor(Math.random() * 800) + 100,
      volunteerHours: Math.floor(Math.random() * 50) + 5,
    });
  }

  const createdUsers = [];
  for (const u of userSeeds) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: defaultPassword,
        verificationLevel: u.verificationLevel,
        points: u.points,
        volunteerHours: u.volunteerHours,
        skills: JSON.stringify(["Teaching", "Event Organizing", "First Aid", "Logistics"]),
        causes: JSON.stringify(["Environment", "Education", "Community Relief"]),
      }
    });
    createdUsers.push(user);
  }
  console.log(`✅ Created ${createdUsers.length} Users`);

  // 2. Create 75 Community Volunteer Events
  const eventTemplates = [
    { title: "Dhanmondi Lake Clean-Up & Recycling Drive", category: "Environment", desc: "Join us this Saturday to clear plastic waste along Dhanmondi lakefront and sort items for recycling." },
    { title: "Youth STEM & Coding Workshop", category: "Education", desc: "Interactive computer science and robotics workshop for underrepresented middle school students." },
    { title: "Community Food Pantry Distribution", category: "Food", desc: "Packing and distributing fresh produce and essential groceries to 200 local families in need." },
    { title: "Free Neighborhood Health & Eye Checkup Camp", category: "Healthcare", desc: "Volunteer medical doctors and assistants providing free basic checkups, vision tests, and medicine." },
    { title: "Animal Shelter Care & Adoption Fair", category: "Animals", desc: "Help feed, groom, and walk rescue animals while facilitating weekend community pet adoptions." },
    { title: "Senior Citizen Digital Literacy Class", category: "Elderly", desc: "One-on-one patient mentoring to help seniors navigate smartphones, video calls, and online services." },
    { title: "Urban Tree Planting Initiative", category: "Environment", desc: "Planting 300 native saplings along school perimeters to combat urban heat islands." },
    { title: "Slum Children Literacy & Storytelling Circle", category: "Education", desc: "Reading sessions, book distribution, and art activities for underprivileged kids." },
    { title: "Emergency Flood Relief Packaging Drive", category: "Community", desc: "Assembling emergency dry food packs, clean water purification tablets, and hygiene kits." },
    { title: "Community Garden Restoration & Composting", category: "Environment", desc: "Building organic soil beds, planting vegetables, and setting up neighborhood composting bins." },
  ];

  const createdEvents = [];
  for (let i = 0; i < 75; i++) {
    const template = eventTemplates[i % eventTemplates.length];
    const creator = createdUsers[i % createdUsers.length];
    const city = cities[i % cities.length];
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + (i % 30) - 10);

    const ev = await prisma.event.create({
      data: {
        title: `${template.title} #${i + 1}`,
        description: template.desc,
        category: template.category,
        urgency: i % 4 === 0 ? "Emergency" : i % 2 === 0 ? "High" : "Medium",
        location: city,
        date: eventDate,
        startTime: `${8 + (i % 4)}:00 AM`,
        endTime: `${12 + (i % 4)}:00 PM`,
        maxParticipants: 15 + (i % 25),
        requirements: "Bring a water bottle and wear comfortable outdoor footwear.",
        creatorId: creator.id,
      }
    });
    createdEvents.push(ev);
  }
  console.log(`✅ Created ${createdEvents.length} Events`);

  // 3. Create 75 Direct Mutual Aid / Help Requests
  const helpTemplates = [
    { title: "Need assistance moving heavy furniture after clinic visit", category: "general", urgency: "medium", desc: "Elderly resident needing two volunteers to help relocate living room furniture and groceries." },
    { title: "Urgent O+ Blood Donor Needed at Square Hospital", category: "health", urgency: "urgent", desc: "Patient undergoing surgery urgently requires 2 bags of O+ blood. Transportation arranged." },
    { title: "Math & Physics tutoring for 9th grader before exam", category: "education", urgency: "low", desc: "Looking for a college volunteer to tutor algebra 2 hours a week for 3 weeks." },
    { title: "Emergency food package request for family of 5", category: "food", urgency: "urgent", desc: "Family recently affected by temporary lay-off seeking emergency dry food supplies." },
    { title: "Volunteer driver needed for wheelchair user's appointment", category: "health", urgency: "medium", desc: "Assistance needed to escort senior citizen to weekly physical therapy session." },
    { title: "Neighborhood park bench repair & painting", category: "environment", urgency: "low", desc: "Looking for handy volunteers with basic carpenter tools to fix weathered park benches." },
    { title: "Pet fostering/walking during emergency hospital stay", category: "general", urgency: "medium", desc: "Need temporary dog walking support for 4 days while owner undergoes medical care." },
    { title: "Digital device setup & safety tutorial for elderly couple", category: "general", urgency: "low", desc: "Patient instructor needed to set up WhatsApp and online banking app securely." },
  ];

  const createdRequests = [];
  for (let i = 0; i < 75; i++) {
    const template = helpTemplates[i % helpTemplates.length];
    const creator = createdUsers[(i + 3) % createdUsers.length];
    const city = cities[(i + 2) % cities.length];

    const req = await prisma.helpRequest.create({
      data: {
        title: `${template.title} (Req #${i + 1})`,
        description: template.desc,
        category: template.category,
        urgencyLevel: template.urgency,
        location: city,
        contactInfo: `contact-req${i + 1}@handson.org | +8801700${100000 + i}`,
        offers: Math.floor(Math.random() * 5),
        creatorId: creator.id,
      }
    });
    createdRequests.push(req);
  }
  console.log(`✅ Created ${createdRequests.length} Help Requests`);

  // 4. Create 30 Volunteer Teams & Team Memberships
  const teamNames = [
    "Green Earth Action Corps", "Dhaka Youth Climate Alliance", "Meals on Wheels Bangladesh",
    "Tech & Code for Good", "Neighborhood Senior Care Alliance", "Paws & Whiskers Animal Rescue",
    "Lifesaver Blood Donors Network", "Community Literacy Champions", "Emergency Relief Task Force",
    "Clean & Green City Volunteers", "Hope for Homeless Foundation", "Medical Outreach Corps"
  ];

  const createdTeams = [];
  for (let i = 0; i < 30; i++) {
    const name = `${teamNames[i % teamNames.length]} Group ${Math.floor(i / 12) + 1}`;
    const creator = createdUsers[i % createdUsers.length];
    const cause = categories[i % categories.length].toLowerCase();

    const team = await prisma.team.create({
      data: {
        name,
        description: `Dedicated volunteer group advocating for ${cause} and driving sustainable neighborhood projects.`,
        cause,
        isPublic: true,
        memberCount: Math.floor(Math.random() * 25) + 5,
        eventsCount: Math.floor(Math.random() * 12) + 2,
        hoursContributed: Math.floor(Math.random() * 300) + 40,
        creatorId: creator.id,
      }
    });

    // Add team members
    for (let j = 0; j < 4; j++) {
      const memberUser = createdUsers[(i + j) % createdUsers.length];
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: memberUser.id,
          role: j === 0 ? "admin" : "member"
        }
      }).catch(() => {}); // ignore duplicates if any
    }

    createdTeams.push(team);
  }
  console.log(`✅ Created ${createdTeams.length} Teams with Memberships`);

  // 5. Connect Participants to Events & Log Pending Hours
  for (let i = 0; i < 40; i++) {
    const ev = createdEvents[i];
    const participant = createdUsers[(i + 1) % createdUsers.length];
    
    await prisma.event.update({
      where: { id: ev.id },
      data: {
        participants: { connect: { id: participant.id } }
      }
    }).catch(() => {});

    await prisma.pendingHour.create({
      data: {
        hours: 3.5,
        date: new Date(),
        status: i % 2 === 0 ? "approved" : "pending",
        verifications: "[]",
        userId: participant.id,
        eventId: ev.id
      }
    });
  }
  console.log(`✅ Linked event participants & generated pending hours log`);

  const totalCount = createdUsers.length + createdEvents.length + createdRequests.length + createdTeams.length;
  console.log(`🎉 DATABASE SEEDED SUCCESSFULLY! Total entries created: ${totalCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
