export interface Playbook {
  id: string;
  title: string;
  description: string;
  author: string;
  major: string;
  graduationYear: string;
  tag: string;
  content: string;
  intro: string;
}

export const playbooks: Playbook[] = [
  {
    id: "clep-strategy",
    title: "How to Finish Undergraduate in 2 Years (CLEP Strategy)",
    description:
      "A practical NAU-focused guide on how to use ModernStates + CLEP exams to save time and money on your degree.",
    author: "Azamat Salamatov",
    major: "Computer Science",
    graduationYear: "2025",
    tag: "Academics",
    intro:
      "CLEP is a way to earn college credits by taking exams instead of sitting through a full semester. With a smart plan, you can finish undergrad much faster and much cheaper.",
    content: `
## What is CLEP?

CLEP (College-Level Examination Program) is a system of exams that lets you earn **college credit** by passing a test in a specific subject.

You save:

- **Money** — you don't pay full tuition for that course  
- **Time** — you don't spend an entire semester on a class you can test out of  

CLEP is powered by **CollegeBoard** (the same organization that runs the SAT).

> At NAU, students can take **up to 10 CLEP exams**. Always confirm the latest policy with the registrar or your advisor.

---

## Overview of the Process

1. **Watch a ModernStates course to get a voucher for a free CLEP**
2. **Register for CLEP using that voucher**
3. **Take the exam and get your credits**

> 💡 If you want to take CLEP immediately, you can skip the free course and pay the CLEP registration fee (around **$93**) out of pocket.

---

## Step 1: Watch a Course to Get a Free CLEP Voucher

1. Go to \`modernstates.org\`.
2. Choose a **free CLEP course** you want to take.

At NAU, you can take a maximum of **10 CLEPs**.  
To know which CLEPs count for which classes:

- Check the **NAU catalog**
- If you’re from another school, check **your university’s catalog**  
  - Example: “NLU Chicago CLEP equivalencies”

A typical table in the catalog might look like this:

\`\`\`
CLEP                  SCORE   Course Equivalency
American Literature   50      ENGL 2316
\`\`\`

This means:

> If you take **CLEP American Literature**, and score **50** or more, you will get credit for **ENGL 2316** at NAU.

### What ModernStates Gives You

ModernStates provides:

- Video lessons  
- Practice tests  
- Reading materials  

Time to complete the course depends on you:  
it can be **from 1 hour to a few months**.

To qualify for the **free CLEP voucher**:

- Complete all required modules  
- Score at least **75%** on the quizzes / tests  

After you finish:

- In about **10 days**, ModernStates will email you a **voucher code**.

> 🔑 The voucher pays for the **official CLEP registration fee**.  
> It does **not** automatically give you credits. Credits come after you pass the official exam and your score is sent to your school.

---

## Step 2: Register for CLEP

1. Go to the official **CLEP website**.
2. Register for the exam using the **voucher** you received from ModernStates.
3. Choose the exam format:
   - **Online proctoring** (take it at home)
   - **Testing center** (in-person)

4. Add your university as the **score recipient**.
   - NAU students: search for NAU.  
     If it doesn’t show up, enter it **manually** as instructed by the site or by the NAU registrar.

5. Schedule your exam:
   - CLEP exams are usually available on many days  
   - Choose a time that works with your schedule

6. For **online proctoring**, you typically need:
   - A **Windows computer**
   - A **working webcam**
   - A **mirror** to show the proctor your screen

7. On exam day:
   - Use what you learned from ModernStates and your own preparation  
   - Most CLEP exams require a score of around **50** to pass  
     (some schools may set higher or lower cutoffs)

---

## Step 3: Get Your Credits ✨

After you finish the exam:

- In about **10–20 days**, CLEP sends your official score to your school
- Once your university processes it, the course appears as **credits** on your transcript

At NAU, that might look like:

- “ENGL 2316 — 3 credits (by exam)”  

Always double-check with the registrar that the credit was applied correctly and counts toward your degree.

---

## Why This Can Help You Finish in 2 Years

By stacking:

- CLEP credits  
- Possibly AP credits (if you have any)  
- Full course loads during regular semesters  
- Maybe some summer/winter classes  

You can **replace several core or elective classes with exams**, which can significantly reduce how many semesters you need.

For example:

- Instead of taking 4–5 lower-level general-ed courses in class, you might test out of them with CLEP
- That frees your schedule to take more major classes earlier

> This strategy is intense and not for everyone. You need discipline, honest studying, and a clear plan.

---

## Important Notes & Academic Honesty

- Always check **NAU’s CLEP policy** and talk to your **advisor**  
- Not every course has a CLEP equivalent  
- Some majors are more CLEP-friendly than others  
- Don’t overload yourself just to graduate faster—your **GPA and real knowledge matter**

### About Cheating & AI

Some students are tempted to misuse AI tools or phones during online exams.  
This is considered **cheating** and can:

- Get your score canceled  
- Put a note on your record  
- Create serious problems for your **student status** and even immigration/visa

**My recommendation: don’t do it.**  
Use CLEP as a chance to **prove what you really know**, not as a shortcut that risks everything.

If you study consistently, use ModernStates, and plan your exams wisely, CLEP can be an honest and powerful way to save time and money on your degree.
    `,
  },
  {
    id: "international-student-arrival",
    title: "New to NAU: What’s Next? (Texas Driver’s License Guide)",
    description:
      "Step-by-step checklist for NAU students on how to get a Texas driver's license: courses, documents, appointments, and road test.",
    author: "Azamat Salamatov",
    major: "Computer Science",
    graduationYear: "2024",
    tag: "US Life",
    intro:
      "One of the most useful things you can do as a new student in Texas is to get a driver’s license. Here’s a practical, no-fluff guide based on what actually works.",
    content: `
## Why Get a Driver’s License Early?

In Houston, having a car and a driver’s license makes life **much easier**:

- You can drive to campus, work, stores, and events  
- It works as a strong **ID document**  
- It often helps with banking, renting, and job applications  

Here’s a clear, step-by-step path to getting your **Texas driver’s license** as a student.

---

## 1. Theoretical Part (Online Courses)

You’ll need to complete **two online courses**:

### 1) Adult Driver’s Course — 6 hours (~$31)

- Course link:  
  \`https://www.idrivesafely.com/drivers-ed/texas/adult-driver-education/?utm_source=google&utm_medium=cpc&utm_campaign=9304522507&utm_term=i%20drive%20safely\`

This course covers:

- Texas traffic laws  
- Basic driving rules  
- Safety information  

You’ll receive a **certificate** when you finish.

---

### 2) Texas DPS Impact Certificate — 1 hour

Take this **after** completing the first course.

- Course link:  
  \`https://impacttexasdrivers.dps.texas.gov/ITAD/Profile/Signup.aspx\`

This is a short course required by **Texas DPS**.  
You’ll receive another **certificate** at the end.

> 📌 Keep both certificates printed or saved as PDFs. You’ll need them for your DPS appointment.

---

## 2. Documents You Need

Before you go to the DPS, collect these documents:

- **I-20**
- **Passport with visa**
- **I-94** (download from:  
  \`https://i94.cbp.dhs.gov/I94/#/recent-search\`)
- **Address Proof 1**  
  - Bank statement, rent agreement, etc.
- **Address Proof 2**  
  - From a different source (for example, a second bank)

> ⚠️ Very important:  
> The address on **both proofs** must match **exactly**, including apartment or room number.

If applicable:

- **SSN — Social Security Number**

If you don’t have SSN yet, follow the instructions on the DPS site. Some students enter a placeholder when making the appointment (like “1234”), but always follow **current official rules** and, if unsure, ask NAU’s international office.

---

## 3. Make an Appointment at DPS

Book your spot at the Texas DPS:

- Appointment link:  
  \`https://public.txdpsscheduler.com/\`

Steps:

1. Choose the service for **Driver’s License**.
2. Fill out the form with your details.
3. For SSN, follow the current DPS instructions (or temporarily use a placeholder if allowed).
4. Plan to bring money for fees:
   - Around **$33** for the license  
   - Around **$11** in additional fees (can vary)

> 💡 Check the DPS website for the latest official fees, as they can change.

---

## 4. Road Test

After your theory and initial DPS steps, you must pass a **road test**.

A popular option many students use:

- **111 Driving School**  
  - Road test price (approximate):
    - Saturday: **$60**
    - Monday–Friday: **$75**
  - Website:  
    \`https://111drivingschool.com/contact-us/\`
  - Address on Google Maps:  
    \`https://www.google.com/maps/dir//4231+Cook+Rd+Houston,+TX+77072/\`

They have experience working with international students, which makes the process less stressful.

What to practice:

- Basic turns and lane changes  
- Stop signs and traffic lights  
- Parking  
- Speed limits and safety habits  

---

## 5. After You Pass the Test

Once you pass the road test:

1. Go again to the DPS appointment website (if needed):  
   \`https://public.txdpsscheduler.com/\`
2. Follow the instructions to finalize your **Texas driver’s license**.

Typically:

- You may receive a **temporary paper license** first  
- Your physical plastic card arrives by mail later

---

## Why This Matters for New NAU Students

Having a Texas driver’s license helps with:

- **Everyday life** — groceries, mosque, friends, events, internships  
- **Identity verification** — banks, some employers, and agencies prefer it  
- **Long-term living** — it’s one of the key documents you’ll keep using

Take it step by step:

1. Do the 2 online courses  
2. Prepare all documents  
3. Make the DPS appointment  
4. Do the road test  
5. Finalize everything and start driving 🚗

You don’t have to do it all in the first week, but starting early will make your life in Houston much easier.
    `,
  },
  {
    id: "choosing-professors",
    title: "How To Choose Professors + NAU Course Planning Tips",
    description:
      "Practical advice on selecting professors, building schedules, and planning your degree smartly.",
    author: "Anonymous Contributor",
    major: "Business Administration",
    graduationYear: "2024",
    tag: "Academics",
    intro:
      "Choosing the right professors can make or break your semester. Here's what I've learned after four years at NAU.",
    content: `
## Research Before You Register

### Use Multiple Sources
Don't rely on just one platform for professor reviews. Check:
- RateMyProfessors (take extreme reviews with a grain of salt)
- NAU Threads Reviews page (real student experiences)
- Talk to students who've taken the class
- Check department websites for professor research interests

### What to Look For
- Teaching style (lecture-heavy vs. discussion-based)
- Grading fairness
- Availability outside of class
- Response time to emails
- Exam format (multiple choice, essays, projects)

## Building Your Schedule Strategically

### Balance Your Course Load
- Mix difficult courses with easier electives
- Avoid scheduling all your hardest classes in one semester
- Leave buffer time between classes when possible
- Consider your personal peak productivity times

### First Semester Strategy
Take a slightly lighter load to adjust to college-level work. It's better to do well in 4 classes than struggle in 6.

### Plan Ahead for Prerequisites
Create a 4-year course plan early. Some courses are only offered in fall or spring, and missing them can delay graduation.

## Registration Tips

### Priority Registration
- Register as early as your time ticket allows
- Have backup options ready
- Popular professors fill up fast

### Use the Waitlist Strategically
If a class is full, add yourself to the waitlist. Many students drop in the first week.

### Check for Course Conflicts
- Verify no time overlaps
- Consider commute time between classes
- Leave time for lunch
- Don't overbook yourself

## Red Flags to Avoid

- Professors with consistently poor communication
- Classes with unclear syllabi
- Courses where students mention unfair grading
- Professors who don't show up or frequently cancel class

## Green Flags to Seek

- Professors who are passionate about their subject
- Clear expectations and fair grading criteria
- Available during office hours
- Engaging teaching methods
- Good rapport with students

## Major-Specific Advice

### STEM Majors
- Start math and science sequences early
- Take labs when you have lighter course loads
- Form study groups early
- Attend professor office hours regularly

### Liberal Arts
- Build relationships with professors in your major
- Take courses that fulfill multiple requirements
- Develop strong writing skills early
- Participate in class discussions

### Business
- Look for professors with industry experience
- Take advantage of networking opportunities
- Balance theory with practical application courses
- Consider internship credit options

## Final Thoughts

Your course schedule is more than just a list of classes—it's a strategic plan for your academic success. Take the time to research and plan carefully. Don't be afraid to adjust your schedule during add/drop week if something isn't working.

Remember: A good professor can make a difficult subject enjoyable, and a poor one can make an easy subject miserable. Choose wisely!
    `,
  },
  {
    id: "campus-jobs",
    title: "On-Campus Job Guide (Step-by-Step)",
    description:
      "A simple guide to finding and applying for on-campus jobs at NAU.",
    author: "Student Contributor",
    major: "Marketing",
    graduationYear: "2025",
    tag: "Career",
    intro:
      "On-campus jobs are perfect for students—flexible hours, convenient location, and they understand your academic priorities.",
    content: `
## Why Work On-Campus?

- Flexible schedules built around classes
- No commute—everything's on campus
- Employers understand academic commitments
- Looks great on your resume
- International students: eligible for on-campus work

## Types of On-Campus Jobs

### Student Assistant Positions
- Library assistants
- Lab monitors
- Administrative office help
- Tech support
- Event setup and support

### Dining Services
- Food service workers
- Cashiers
- Kitchen staff
- Baristas

### Recreation & Athletics
- Gym attendants
- Intramural sports referees
- Pool lifeguards
- Equipment room staff

### Resident Assistants (RA)
- Free or reduced housing
- Leadership experience
- Must live on campus
- Competitive positions

### Academic Positions
- Tutoring center
- Peer mentors
- Grading assistants (for higher-level students)
- Research assistants

## Step-by-Step Application Process

### Step 1: Check Eligibility
**For U.S. Citizens/Permanent Residents:**
- Simply need proof of eligibility to work

**For International Students:**
- Must be on valid F-1 visa
- Can work up to 20 hours/week during school term
- Can work full-time during breaks
- Must get authorization from international office

### Step 2: Find Job Listings
- Check NAU Career Services website
- Visit student employment portal
- Browse department bulletin boards
- Ask professors in your major
- Network with other students

### Step 3: Prepare Your Application
Create a simple resume including:
- Education (your current major)
- Relevant skills
- Previous work experience (if any)
- Volunteer experience
- Computer/software skills

### Step 4: Apply Online
- Follow application instructions carefully
- Tailor your resume for each position
- Write a brief cover letter if required
- Submit before deadline

### Step 5: Follow Up
- Give it about a week
- Send a polite follow-up email
- Express continued interest
- Ask about timeline for decisions

### Step 6: Interview Preparation
Common questions:
- Why do you want this position?
- What's your class schedule?
- How do you handle stress?
- Can you work [specific hours]?
- What are your strengths?

Be ready to discuss:
- Your availability
- How you'll balance work and school
- Examples of reliability and responsibility
- Any relevant experience

### Step 7: Accept and Complete Paperwork
Once offered a position:
- Complete I-9 (proof of work eligibility)
- Provide Social Security Number
- Fill out tax forms (W-4)
- Set up direct deposit
- Complete any required training

## Tips for Success

### Getting Hired
- Apply early in the semester
- Be flexible with your hours
- Emphasize reliability and punctuality
- Show enthusiasm
- Network with professors and staff

### Keeping Your Job
- Never miss shifts without notice
- Communicate schedule conflicts early
- Show up on time
- Be professional
- Ask questions when unsure
- Take initiative

## Best Times to Apply

- **August/September**: Highest number of openings
- **January**: Second wave of hiring
- **Throughout the year**: Positions open as students graduate or quit

## Red Flags to Avoid

- Jobs requiring too many hours (remember: school first!)
- Positions with inflexible schedules
- Jobs that interfere with classes
- Employers who don't respect academic priorities

## Average Pay Ranges

- Entry-level positions: $10-12/hour
- Specialized skills (tutoring, tech): $12-15/hour
- RA positions: Free/reduced housing + stipend
- Research assistants: $12-15/hour

## Final Advice

Start looking early, be persistent, and don't get discouraged if you don't get the first job you apply for. Many students don't get hired immediately, but most find something by the second or third application.

Working on campus is about more than just earning money—it's about building professional skills, making connections, and becoming part of the campus community.

Good luck!
    `,
  },
  {
    id: "campus-survival",
    title: "NAU Survival Guide — Housing, Transportation, Meal Plan",
    description:
      "A friendly, practical survival guide for students living and studying at NAU.",
    author: "Student Contributor",
    major: "Biology",
    graduationYear: "2024",
    tag: "Campus Life",
    intro:
      "Everything you need to know about navigating daily life at NAU, from housing options to getting around campus.",
    content: `
## Housing Options

### On-Campus Housing
**Pros:**
- Walking distance to classes
- Included utilities
- Built-in community
- No commute
- Easy access to campus resources

**Cons:**
- Can be expensive
- Less privacy
- Roommate situations
- Limited cooking options

**Residence Hall Types:**
- Traditional dorms (shared bathroom)
- Suite-style (bathroom shared with suite)
- Apartment-style (more independent living)

### Off-Campus Housing
**Pros:**
- Often cheaper
- More independence
- Can choose roommates
- Full kitchen

**Cons:**
- Transportation needed
- Utilities not included
- Lease commitments
- Potential isolation from campus

**Popular Off-Campus Areas:**
- Near campus apartments (walk/bike)
- Student apartment complexes (shuttles provided)
- Shared houses (split rent with roommates)

### Housing Tips
- Apply early for on-campus (it fills up!)
- Visit off-campus apartments before signing
- Check lease terms carefully
- Budget for utilities when off-campus
- Consider roommate compatibility seriously

## Transportation

### On Campus
- **Walking**: Most efficient for nearby classes
- **Campus Shuttle**: Free, regular routes
- **Bike**: Great for getting around quickly
  - Invest in a good lock
  - Register your bike with campus security
  - Use bike lanes and paths

### Off Campus
- **University Shuttle**: Check routes to off-campus housing
- **Public Transportation**: City bus routes (free with student ID)
- **Rideshare**: Uber/Lyft for occasional trips
- **Car**: 
  - Parking permits required
  - Can be expensive
  - Consider if necessary
  - Share rides to save money

### Transportation Budget Tips
- Get a student transit pass
- Carpool with classmates
- Bike when weather permits
- Plan trips efficiently
- Walk short distances

## Meal Plan Options

### Dining Hall Meal Plans
**All-Access Plans:**
- Unlimited swipes
- Best for students on campus all the time
- Most expensive

**Limited Plans:**
- Set number of meals per week/semester
- Better for lighter eaters
- More flexible

**Flex Plans:**
- Combination of meals + flex dollars
- Use at various campus locations
- Good middle ground

### Dining Dollars vs. Flex Dollars
- **Dining Dollars**: Only for dining facilities
- **Flex Dollars**: Can be used at campus store too
- Both roll over within semester
- Plan according to your eating habits

### Eating on a Budget
- Cook in your dorm/apartment when possible
- Buy groceries strategically
- Pack snacks for long class days
- Share bulk purchases with roommates
- Take advantage of campus food events
- Avoid daily coffee shop purchases

### Meal Plan Tips
- Don't over-purchase meals
- Guest swipes for visiting friends/family
- Use flex dollars before they expire
- Check meal plan balance regularly
- Adjust plan after first semester

## Campus Resources

### Academic Support
- Writing center (free tutoring)
- Math lab
- Subject-specific tutoring
- Library resources
- Study rooms

### Health & Wellness
- Student health center
- Counseling services
- Fitness center (included in fees)
- Recreational sports

### Other Essentials
- Campus bookstore
- Computer labs
- Printing stations
- Mail services
- Career services

## Money-Saving Tips

### General Budget Advice
- Track your spending
- Use student discounts everywhere
- Buy used textbooks
- Share streaming services
- Cook instead of eating out
- Use campus facilities instead of paying for gym

### Free Campus Perks
- Gym/fitness center
- Computer labs
- Printing (limited)
- Health services
- Counseling
- Academic tutoring
- Campus events
- Software licenses

## Laundry Hacks

- Do laundry during off-peak times (not Sunday night!)
- Set timer on your phone
- Don't leave clothes unattended too long
- Use laundry apps to check machine availability
- Keep quarters/laundry card loaded

## Safety Tips

- Walk with friends at night
- Use campus escort services
- Keep dorm room locked
- Register valuables
- Know emergency numbers
- Download campus safety app

## Social Life Balance

- Join clubs and organizations
- Attend campus events (often free food!)
- Make study groups
- Balance academics with social time
- Don't overcommit

## Semester Preparation Checklist

**Before Each Semester:**
- [ ] Secure housing
- [ ] Purchase meal plan
- [ ] Get parking permit (if needed)
- [ ] Buy textbooks
- [ ] Set up transportation
- [ ] Stock up on essentials
- [ ] Organize your schedule

## Final Thoughts

Campus life is about finding what works best for you. Don't be afraid to adjust your housing, meal plan, or transportation methods after your first semester. Most students figure out their ideal setup by sophomore year.

Take advantage of campus resources—you're already paying for them in your fees! And remember, everyone is figuring it out together. Don't hesitate to ask for help or advice from older students, RAs, or campus staff.

Welcome to NAU, and good luck!
    `,
  },
];

export const getPlaybookById = (id: string): Playbook | undefined => {
  return playbooks.find((p) => p.id === id);
};

export const getRelatedPlaybooks = (
  currentId: string,
  count: number = 3
): Playbook[] => {
  return playbooks.filter((p) => p.id !== currentId).slice(0, count);
};
