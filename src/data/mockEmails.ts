import { EmailItem, ReminderItem } from '../types';

export const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'email-1',
    sender: 'Prof. David Vance',
    senderEmail: 'david.vance@cs.stanford.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    subject: 'CS Capstone Committee: Final Code Freeze & Live Demo Guidelines',
    receivedAt: '18 min ago',
    snippet: 'All GitHub repositories must undergo code freeze by Wednesday, October 14 at 11:59 PM...',
    priority: 'Urgent',
    read: false,
    starred: true,
    folder: 'inbox',
    category: 'university',
    summaryGenerated: false,
    body: `Hello Capstone Teams,

Please read this announcement thoroughly regarding next week's Capstone Evaluation Showcase.

All GitHub repositories must undergo code freeze by Wednesday, October 14 at 11:59 PM EST. Any commits pushed after midnight will not be evaluated by the grading committee.

Key logistical requirements:
1. Submit your 2-page system architecture PDF to Canvas by Tuesday, October 13 at 5:00 PM EST.
2. Verify your cloud hosting credits and ensure your production database is seeded with reproducible demonstration datasets.
3. Each team has a strict 8-minute presentation slot followed by 4 minutes of Q&A with industry evaluators.
4. Room 304 in the CS Hall has HDMI and USB-C display connections; please bring your own adapter if using an older hardware laptop.

Let me know if your team needs extra staging environment tokens before Monday. Please confirm receipt of this email.

Sincerely,
Prof. David Vance
Department of Computer Science`,
    summary: {
      headline: 'Capstone code freeze scheduled for Wednesday midnight; 2-page architecture doc due Tuesday.',
      mainIdea: 'Mandatory deadlines and presentation rules for the CS Capstone Evaluation Showcase, including hard code freeze cutoff and Canvas documentation submission.',
      importantPoints: [
        'Strict code freeze on Wednesday, Oct 14 at 11:59 PM EST — no commits accepted afterward.',
        'Architecture specification (2-page PDF) must be uploaded to Canvas by Tuesday 5:00 PM EST.',
        'Presentations are strictly 8 minutes with 4 minutes of Q&A in CS Hall Room 304.',
        'Staging tokens available upon request before Monday.'
      ],
      tasks: [
        'Submit 2-page system architecture PDF to Canvas',
        'Seed production database with sample test dataset',
        'Verify laptop display adapters for CS Hall Room 304',
        'Confirm receipt of email to Prof. Vance'
      ],
      deadlines: [
        'Tuesday, Oct 13 at 5:00 PM EST (Canvas 2-page PDF)',
        'Wednesday, Oct 14 at 11:59 PM EST (GitHub Code Freeze)'
      ],
      condensedPercentage: 81,
      readingTimeSavedMinutes: 2.8
    },
    suggestedReplies: {
      professional: `Dear Professor Vance,

Thank you for the detailed guidelines. Our team has reviewed the requirements and confirmed the Wednesday 11:59 PM code freeze as well as the Tuesday 5:00 PM Canvas PDF deadline.

We have already seeded our staging environment with reproducible datasets and tested our demonstration flow. We will bring our own USB-C video adapter for CS Room 304.

Looking forward to the showcase.

Warm regards,
Alex Chen & Team MailMind`,
      friendly: `Hi Professor Vance!

Thanks for the heads-up and the clear logistics! We've locked in the Wednesday midnight code freeze on our calendars and will have the 2-page architecture summary submitted to Canvas well ahead of Tuesday 5 PM.

Our demo environment is all prepped and ready to go. See you at the showcase!

Best,
Alex`,
      formal: `Dear Professor Vance,

I acknowledge receipt of the Capstone Evaluation Showcase guidelines and hereby confirm that our team will comply with the prescribed timeline.

The system architecture documentation shall be submitted via Canvas prior to Tuesday, October 13 at 5:00 PM EST. Furthermore, our GitHub repository will undergo complete code freeze before Wednesday, October 14 at 11:59 PM EST.

Respectfully submitted,
Alex Chen
Senior Undergraduate, Department of Computer Science`
    },
    detectedDeadlines: [
      {
        id: 'det-1',
        title: 'Submit 2-page Architecture PDF to Canvas',
        deadline: 'Tuesday, Oct 13 · 5:00 PM EST',
        context: 'Required submission before Capstone live showcase.',
        confirmed: true
      },
      {
        id: 'det-2',
        title: 'GitHub Code Freeze Cutoff',
        deadline: 'Wednesday, Oct 14 · 11:59 PM EST',
        context: 'No commits accepted after midnight by grading committee.',
        confirmed: false
      }
    ]
  },
  {
    id: 'email-2',
    sender: 'Jessica Martinez',
    senderEmail: 'jmartinez@google.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    subject: 'Google University Programs: Software Engineering Intern Interview Invitation',
    receivedAt: '1 hour ago',
    snippet: 'Congratulations! Your profile has been selected for technical rounds for the Summer 2027 SWE Internship...',
    priority: 'Urgent',
    read: false,
    starred: true,
    folder: 'inbox',
    category: 'career',
    summaryGenerated: false,
    body: `Hi Alex,

Thank you for your application to Google!

Our university talent committee was thoroughly impressed by your background and project portfolio (particularly your distributed systems and email productivity tools). We would love to move you forward to two 45-minute technical interview rounds for our Summer 2027 Software Engineering Internship.

Next Steps:
1. Please complete your availability form by Monday, October 19 at 12:00 PM PST.
2. The technical rounds will focus on data structures, algorithmic problem solving, and system design fundamentals via Google Meet and Google Docs.
3. Review our Technical Interview Preparation Guide linked in the candidate portal.

Please let me know if you need accommodations or have competing offers with upcoming decision deadlines.

Best of luck,
Jessica Martinez
University Talent Acquisition | Google`,
    summary: {
      headline: 'Selected for 2 technical interviews for Google SWE Summer 2027 Internship.',
      mainIdea: 'Invitation to schedule two 45-minute technical interview rounds for the Summer 2027 Software Engineering Internship at Google.',
      importantPoints: [
        'Selected based on strong portfolio in distributed systems and productivity tooling.',
        'Two 45-minute algorithmic & system design rounds via Google Meet.',
        'Availability schedule must be finalized by Monday, October 19 at 12:00 PM PST.',
        'Review Candidate Prep Guide in portal.'
      ],
      tasks: [
        'Complete Google interview availability form',
        'Review Technical Interview Preparation Guide',
        'Prepare algorithmic practice problems'
      ],
      deadlines: [
        'Monday, October 19 at 12:00 PM PST (Availability Form submission)'
      ],
      condensedPercentage: 84,
      readingTimeSavedMinutes: 3.1
    },
    suggestedReplies: {
      professional: `Dear Jessica,

Thank you so much for this exciting update! I am thrilled to move forward with Google for the Summer 2027 Software Engineering Internship.

I have filled out my interview availability in the candidate portal for next week and will review the Technical Interview Preparation Guide in detail. I do not require any accommodations.

Thank you again for this opportunity, and I look forward to speaking with the engineering team.

Best regards,
Alex Chen`,
      friendly: `Hi Jessica!

Thank you so much for the wonderful news! I'm really excited about the opportunity to interview with the Google engineering team.

I just submitted my available time slots in the portal through next week. Looking forward to the technical rounds!

Thanks again,
Alex`,
      formal: `Dear Ms. Martinez,

Thank you for your correspondence and for selecting my candidacy for the Summer 2027 Software Engineering Internship at Google.

I have formally submitted my scheduling availability via the candidate portal within the specified timeframe. I look forward to participating in the technical interviews.

Sincerely,
Alex Chen`
    },
    detectedDeadlines: [
      {
        id: 'det-3',
        title: 'Submit Google Interview Availability Form',
        deadline: 'Monday, Oct 19 · 12:00 PM PST',
        context: 'Required to schedule two 45-min technical interviews.',
        confirmed: true
      }
    ]
  },
  {
    id: 'email-3',
    sender: 'Office of the Registrar',
    senderEmail: 'registrar@university.edu',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=120&auto=format&fit=crop&q=80',
    subject: 'Action Required: Spring 2027 Course Registration Clearance & Major Audit',
    receivedAt: '3 hours ago',
    snippet: 'Priority registration begins next week. Please verify that your advisor hold is cleared...',
    priority: 'Important',
    read: true,
    starred: false,
    folder: 'inbox',
    category: 'university',
    summaryGenerated: true,
    body: `Dear Alex Chen,

Priority Course Registration for the upcoming Spring 2027 academic term will open on Monday, October 26 at 7:00 AM.

Prior to your scheduled registration appointment, please complete the following mandatory checks:
1. Academic Advisor Hold: You currently have an active academic advisement hold. You must schedule an appointment with Dr. Harold Sterling before Friday, October 16 to get your degree progress approved.
2. Degree Audit: Review your degree progress worksheet in DegreeWorks to ensure all Capstone prerequisites and Elective Group B requirements are fulfilled.
3. Financial Clearance: Check Student Billing to verify that your account balance is below $200 to prevent registration restrictions.

Failure to resolve these holds prior to October 16 will prevent your access when your registration window opens.

Office of the Registrar
Division of Academic Affairs`,
    summary: {
      headline: 'Clear academic advisor hold by Friday Oct 16 to unlock Spring registration.',
      mainIdea: 'Mandatory prerequisites for Spring 2027 registration: schedule meeting with advisor Dr. Sterling to lift academic hold before Friday, Oct 16.',
      importantPoints: [
        'Spring 2027 Priority Registration starts Monday, Oct 26 at 7:00 AM.',
        'Active academic advisor hold requires approval from Dr. Harold Sterling.',
        'Deadline to clear holds is Friday, October 16.',
        'Ensure account balance under $200 and audit DegreeWorks.'
      ],
      tasks: [
        'Schedule advising appointment with Dr. Harold Sterling',
        'Review DegreeWorks progress audit for Group B electives',
        'Verify zero balance in Student Billing'
      ],
      deadlines: [
        'Friday, October 16 (Academic Advisor Hold clearance)'
      ],
      condensedPercentage: 76,
      readingTimeSavedMinutes: 2.1
    },
    suggestedReplies: {
      professional: `Dear Registrar Office,

Thank you for the registration alert. I have scheduled an advising appointment with Dr. Harold Sterling for this Thursday to resolve my academic hold and review my DegreeWorks audit.

Best regards,
Alex Chen`,
      friendly: `Hi Registrar Team,

Thanks for the reminder! I've booked my session with Dr. Sterling for Thursday to get the advising hold cleared before Friday.

Best,
Alex`,
      formal: `To the Office of the Registrar,

I have received the notification regarding Spring 2027 course registration clearance. I will complete the required advising meeting with Dr. Harold Sterling prior to October 16 to ensure timely release of the registration hold.

Sincerely,
Alex Chen`
    },
    detectedDeadlines: [
      {
        id: 'det-4',
        title: 'Clear Academic Advisor Hold with Dr. Sterling',
        deadline: 'Friday, Oct 16 · 5:00 PM',
        context: 'Required to unlock Spring 2027 course enrollment.',
        confirmed: false
      }
    ]
  },
  {
    id: 'email-4',
    sender: 'Maya Lin',
    senderEmail: 'maya.lin@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    subject: 'Hackathon Project "MailMind" Sync & Weekend Hackroom Booking',
    receivedAt: 'Yesterday',
    snippet: 'Hey Alex! Super hyped about our hackathon demo. I booked Study Room 204 for Saturday 11 AM...',
    priority: 'Important',
    read: true,
    starred: true,
    folder: 'inbox',
    category: 'personal',
    summaryGenerated: true,
    body: `Hey Alex!

Super excited about our hackathon project this weekend! I managed to reserve Study Room 204 in the Student Union from 11:00 AM to 5:00 PM this Saturday.

Here is what we should divide and conquer before Saturday:
- I will finish up the Figma interactive slides and user flow diagrams by Friday night.
- Could you test the local mock datasets and make sure our AI summary cards look super crisp on mobile and desktop?
- We also need to record a clean 2-minute product video walkthrough before the submission portal closes on Sunday at 3:00 PM.

Let me know if you want to grab boba beforehand around 10:30 AM!

Cheers,
Maya`,
    summary: {
      headline: 'Study Room 204 booked for Saturday hackathon sync; video due Sunday 3 PM.',
      mainIdea: 'Coordination for hackathon project sprint: Saturday study room booked 11 AM - 5 PM; pitch deck in progress, need app testing and 2-minute demo video.',
      importantPoints: [
        'Study Room 204 reserved Saturday 11:00 AM - 5:00 PM.',
        'Maya completing Figma slides & user flow by Friday night.',
        'Alex tasked with UI testing on mobile/desktop.',
        '2-minute video walkthrough due Sunday at 3:00 PM.'
      ],
      tasks: [
        'Test UI cards and responsiveness on desktop & mobile',
        'Record 2-minute product demo video with Maya',
        'Meet at Student Union Room 204 on Saturday 11 AM'
      ],
      deadlines: [
        'Saturday at 11:00 AM (Hackroom sync session)',
        'Sunday at 3:00 PM (Final hackathon portal submission & video)'
      ],
      condensedPercentage: 79,
      readingTimeSavedMinutes: 2.0
    },
    suggestedReplies: {
      professional: `Hi Maya,

Great job securing Study Room 204! That will give us plenty of focused time before the deadline.

I have verified the responsive layout and sample email data, and the UI is rendering smoothly across viewports. I will bring my microphone and screen recorder so we can produce the 2-minute demo video on Saturday afternoon.

Boba at 10:30 AM sounds perfect. See you then!

Best,
Alex`,
      friendly: `Hey Maya!

You're a lifesaver for booking Room 204! Boba at 10:30 AM is 100% on.

The UI is looking really polished with the light blue accents and smooth tabs. I'll have the screen recording software all setup so we can knock out the 2-minute video right after lunch.

See you Saturday morning!
Alex`,
      formal: `Dear Maya,

I acknowledge receipt of the itinerary for our upcoming project sprint. I confirm my attendance at Study Room 204 this Saturday from 11:00 AM onwards.

All interface component tests have been conducted successfully. We will proceed with recording the evaluation demonstration video as scheduled prior to Sunday's deadline.

Regards,
Alex Chen`
    },
    detectedDeadlines: [
      {
        id: 'det-5',
        title: 'Hackathon Final Submission & Video Due',
        deadline: 'Sunday · 3:00 PM',
        context: '2-minute demo video and project upload.',
        confirmed: true
      }
    ]
  },
  {
    id: 'email-5',
    sender: 'Career & Placement Cell',
    senderEmail: 'placements@university.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    subject: 'Campus Tech Drive: Stripe, Microsoft & Datadog Pre-Screening Shortlist',
    receivedAt: '2 days ago',
    snippet: 'Companies have opened their resume drop portals for engineering students. Deadline to submit is Sunday...',
    priority: 'Important',
    read: true,
    starred: false,
    folder: 'inbox',
    category: 'career',
    summaryGenerated: false,
    body: `Attention Computer Science and Engineering Seniors,

The Fall Campus Tech Recruitment Drive begins next month. Participating top-tier employers including Stripe, Microsoft, Datadog, and Bloomberg have published their candidate screening guidelines.

Requirements for Campus Pre-Screening:
1. Submit your vetted 1-page PDF resume to Handshake by Sunday, October 18 at 6:00 PM.
2. Ensure your GitHub portfolio and LinkedIn links are updated and public.
3. Complete the department mock behavioral assessment if you haven't already.

Students whose submissions are received by Sunday 6 PM will be fast-tracked for on-campus interview slots scheduled for early November.

Campus Placement & Career Development Cell`,
    summary: {
      headline: 'Resume drop deadline Sunday Oct 18 for Stripe, Microsoft & Datadog campus drive.',
      mainIdea: 'Pre-screening announcement for campus recruitment drive with fast-track interview consideration for students submitting by Sunday 6 PM.',
      importantPoints: [
        'Top employers: Stripe, Microsoft, Datadog, Bloomberg.',
        'Upload 1-page PDF resume to Handshake by Sunday, Oct 18 at 6:00 PM.',
        'Fast-track status granted for early verified submissions.',
        'Interviews scheduled for early November.'
      ],
      tasks: [
        'Update and proofread 1-page resume PDF',
        'Verify public GitHub repositories and READMEs',
        'Submit resume packet to Handshake portal'
      ],
      deadlines: [
        'Sunday, October 18 at 6:00 PM (Handshake resume upload)'
      ],
      condensedPercentage: 75,
      readingTimeSavedMinutes: 1.9
    },
    suggestedReplies: {
      professional: `Dear Placement Cell,

Thank you for this update. I have reviewed the requirements and will ensure my updated 1-page resume and GitHub portfolio links are uploaded to Handshake prior to Sunday's 6:00 PM cutoff.

Best regards,
Alex Chen`,
      friendly: `Hi Placement Team,

Thanks for the notice! I've polished my resume and will have it submitted to Handshake ahead of Sunday evening.

Best,
Alex`,
      formal: `To the Campus Placement and Career Development Cell,

I acknowledge receipt of the guidelines for the Fall Campus Tech Recruitment Drive. I shall complete the submission of my curriculum vitae and associated professional links to Handshake prior to Sunday, October 18 at 6:00 PM.

Respectfully,
Alex Chen`
    },
    detectedDeadlines: [
      {
        id: 'det-6',
        title: 'Handshake Campus Recruitment Resume Drop',
        deadline: 'Sunday, Oct 18 · 6:00 PM',
        context: 'Required for fast-track on-campus interviews.',
        confirmed: false
      }
    ]
  },
  {
    id: 'email-6',
    sender: 'Dr. Elena Rostova',
    senderEmail: 'elena.rostova@university.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    subject: 'Research Assistant Position: Graph Neural Networks & Oral Viva Schedule',
    receivedAt: '3 days ago',
    snippet: 'I was very impressed with your performance in Advanced Algorithms. We have an opening for an undergraduate RA...',
    priority: 'Important',
    read: true,
    starred: true,
    folder: 'inbox',
    category: 'university',
    summaryGenerated: false,
    body: `Dear Alex,

Following your outstanding marks in the midterm exam for CS 412 (Advanced Algorithms), I would like to invite you to interview for an Undergraduate Research Assistant position in our Graph Neural Networks laboratory.

The project involves optimizing sparse attention kernels for biological interaction networks and is funded by the National Science Foundation for the upcoming academic year.

Additionally, our mandatory midterm oral viva sessions will be held on Thursday afternoon. Please reply by Thursday at 4:00 PM indicating:
1. Whether you are interested in the RA position and your weekly hourly availability (approx. 10-12 hrs/week).
2. Your preferred 15-minute time slot for the oral viva between 2:00 PM and 5:00 PM on Friday.

I look forward to discussing this further.

Warm regards,
Dr. Elena Rostova
Associate Professor, AI & Algorithmic Research Lab`,
    summary: {
      headline: 'Invitation for NSF Graph Neural Networks RA position & oral viva scheduling.',
      mainIdea: 'Offer to interview for funded Research Assistant role in Graph Neural Networks lab and requirement to schedule Friday oral viva by Thursday 4 PM.',
      importantPoints: [
        'Recognized for top marks in CS 412 Advanced Algorithms midterm.',
        'NSF-funded RA opportunity: sparse attention kernels (10-12 hrs/week).',
        'Mandatory oral viva on Friday afternoon (15-min slot).',
        'Reply deadline: Thursday at 4:00 PM.'
      ],
      tasks: [
        'Reply with weekly availability for RA position',
        'Select 15-minute slot for Friday oral viva',
        'Review recent papers from Dr. Rostova’s research lab'
      ],
      deadlines: [
        'Thursday at 4:00 PM (Reply with viva slot and RA interest)'
      ],
      condensedPercentage: 80,
      readingTimeSavedMinutes: 2.4
    },
    suggestedReplies: {
      professional: `Dear Dr. Rostova,

Thank you very much for this wonderful opportunity. I am deeply interested in the Undergraduate Research Assistant role in Graph Neural Networks and would be thrilled to contribute. I can readily commit 12 hours per week next term.

For the CS 412 oral viva on Friday, I would like to request the 3:15 PM – 3:30 PM time slot if still available.

Thank you again for your consideration, and I look forward to our discussion.

Warm regards,
Alex Chen`,
      friendly: `Dear Dr. Rostova,

Thank you so much! I'm really excited about the Graph Neural Networks project and would love to be part of the lab. I can commit 10-12 hours a week without issue.

For Friday's viva, 3:15 PM works great for me if that slot is open.

Thanks again!
Alex`,
      formal: `Dear Professor Rostova,

Thank you for your generous letter regarding the Undergraduate Research Assistant appointment. I respectfully confirm my enthusiastic interest in joining your research team and can allocate 12 hours weekly toward the NSF initiative.

Regarding the CS 412 oral viva examination, I formally request a slot at 3:15 PM on Friday afternoon.

With high regards,
Alex Chen`
    },
    detectedDeadlines: [
      {
        id: 'det-7',
        title: 'Reply to Dr. Rostova (Viva Slot & RA Interest)',
        deadline: 'Thursday · 4:00 PM',
        context: 'Required to lock in CS 412 viva appointment.',
        confirmed: false
      }
    ]
  },
  {
    id: 'email-7',
    sender: 'Arjun Patel',
    senderEmail: 'arjun.patel@alumni.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    subject: 'Study Group Notes for Chapter 6 & Friday Dinner Catchup',
    receivedAt: '4 days ago',
    snippet: 'Hey man! I just uploaded the shared notes from yesterday’s lecture on dynamic programming...',
    priority: 'Informational',
    read: true,
    starred: false,
    folder: 'inbox',
    category: 'personal',
    summaryGenerated: false,
    body: `Hey Alex,

Just wrapped up typing the notes from yesterday's session on dynamic programming and network flow algorithms. I placed the PDF in our shared Notion workspace.

A couple of quick things:
- Check page 4 where we derived the max-flow min-cut theorem; let me know if my reduction graph matches your scratchpad.
- A few of us are grabbing ramen downtown this Friday around 7:30 PM after the libraries close. Let me know if you can join!

Catch you later,
Arjun`,
    summary: {
      headline: 'Shared Notion notes on network flow uploaded; Friday ramen dinner at 7:30 PM.',
      mainIdea: 'Arjun uploaded lecture notes on dynamic programming to Notion and invited Alex to Friday dinner catch-up with the study group.',
      importantPoints: [
        'Shared study notes uploaded to Notion workspace.',
        'Request to cross-check page 4 max-flow min-cut reduction.',
        'Casual dinner invitation for Friday 7:30 PM downtown.'
      ],
      tasks: [
        'Cross-check page 4 max-flow derivation in Notion',
        'Reply regarding Friday dinner plans'
      ],
      deadlines: [
        'Friday at 7:30 PM (Dinner catchup)'
      ],
      condensedPercentage: 70,
      readingTimeSavedMinutes: 1.5
    },
    suggestedReplies: {
      professional: `Hey Arjun,

Thanks for putting the notes together so quickly! I checked page 4 and your reduction graph for max-flow min-cut matches my derivations perfectly.

Count me in for dinner on Friday at 7:30 PM. See you then!

Best,
Alex`,
      friendly: `Hey Arjun!

Thanks a ton for typing up those notes, they look great! Page 4 looks spot on to me.

I'm totally in for ramen on Friday at 7:30. Looking forward to unwinding after a heavy week!

Cheers,
Alex`,
      formal: `Dear Arjun,

Thank you for distributing the summary notes. I have reviewed the mathematical reductions on page 4 and verified their accuracy.

I confirm my attendance for dinner on Friday evening at 7:30 PM.

Best regards,
Alex Chen`
    },
    detectedDeadlines: []
  },
  {
    id: 'email-8',
    sender: 'Financial Aid & Student Accounts',
    senderEmail: 'billing-aid@university.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    subject: 'Student Employment & Work-Study Timesheet Cutoff for Pay Period 21',
    receivedAt: '5 days ago',
    snippet: 'Reminder: All student employees must submit electronic timesheets before Thursday at 5:00 PM...',
    priority: 'Informational',
    read: true,
    starred: false,
    folder: 'inbox',
    category: 'university',
    summaryGenerated: false,
    body: `Dear Student Employee,

This is an automated reminder regarding the upcoming payroll cutoff for Pay Period 21.

All undergraduate teaching assistants, lab proctors, and student desk staff must log into the Student Portal and submit their recorded hours for manager verification before Thursday, October 15 at 5:00 PM EST.

Timesheets submitted after the deadline will result in delayed direct deposit disbursement to the subsequent cycle.

Payroll & Student Accounts Office`,
    summary: {
      headline: 'Timesheet submission cutoff Thursday Oct 15 at 5:00 PM for on-time payroll.',
      mainIdea: 'Mandatory student employment timesheet submission deadline to guarantee timely direct deposit payment for Pay Period 21.',
      importantPoints: [
        'Pay Period 21 closing soon.',
        'Submit logged hours via Student Portal before Thursday, Oct 15 at 5:00 PM EST.',
        'Late entries deferred to subsequent payroll cycle.'
      ],
      tasks: [
        'Log into Student Portal and review recorded hours',
        'Submit electronic timesheet for supervisor sign-off'
      ],
      deadlines: [
        'Thursday, October 15 at 5:00 PM EST (Timesheet cutoff)'
      ],
      condensedPercentage: 74,
      readingTimeSavedMinutes: 1.6
    },
    suggestedReplies: {
      professional: `To Student Payroll,

Thank you for the notification. I have submitted my hours for Pay Period 21 and notified my lab supervisor for authorization.

Best regards,
Alex Chen`,
      friendly: `Hi Payroll Team,

Timesheet has been submitted in the portal. Thanks for the heads-up!

Best,
Alex`,
      formal: `To the Payroll and Student Accounts Office,

I confirm that my hours for Pay Period 21 have been submitted through the portal ahead of the specified deadline.

Respectfully,
Alex Chen`
    },
    detectedDeadlines: [
      {
        id: 'det-8',
        title: 'Submit Student Work-Study Timesheet',
        deadline: 'Thursday, Oct 15 · 5:00 PM EST',
        context: 'Required for on-time payroll disbursement.',
        confirmed: false
      }
    ]
  },
  {
    id: 'sent-1',
    sender: 'Alex Chen (You)',
    senderEmail: 'alex.chen@stanford.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    subject: 'Re: CS Capstone Committee: Final Code Freeze & Live Demo Guidelines',
    receivedAt: 'Yesterday at 3:45 PM',
    snippet: 'Dear Professor Vance, Thank you for the detailed guidelines. Our team has reviewed the requirements and confirmed the Wednesday 11:59 PM code freeze...',
    priority: 'Urgent',
    read: true,
    starred: true,
    folder: 'sent',
    category: 'university',
    summaryGenerated: false,
    body: `Dear Professor Vance,

Thank you for the detailed guidelines. Our team has reviewed the requirements and confirmed the Wednesday 11:59 PM code freeze as well as the Tuesday 5:00 PM Canvas PDF deadline.

We have already seeded our staging environment with reproducible datasets and tested our demonstration flow. We will bring our own USB-C video adapter for CS Room 304.

Looking forward to the showcase.

Warm regards,
Alex Chen & Team MailMind`
  },
  {
    id: 'sent-2',
    sender: 'Alex Chen (You)',
    senderEmail: 'alex.chen@stanford.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    subject: 'Re: Google University Programs: Software Engineering Intern Interview Invitation',
    receivedAt: '2 days ago',
    snippet: 'Dear Jessica, Thank you for this exciting opportunity. I have submitted the interview availability form through the portal...',
    priority: 'Urgent',
    read: true,
    starred: false,
    folder: 'sent',
    category: 'career',
    summaryGenerated: false,
    body: `Dear Jessica,

Thank you for this exciting opportunity. I have submitted the interview availability form through the portal and selected preferred time slots for Monday and Tuesday afternoon.

Looking forward to meeting the engineering team and discussing the systems infrastructure role.

Best regards,
Alex Chen
Computer Science Senior, Stanford University`
  },
  {
    id: 'sent-3',
    sender: 'Alex Chen (You)',
    senderEmail: 'alex.chen@stanford.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    subject: 'Re: Hackathon Project "MailMind" Sync & Weekend Hackroom Booking',
    receivedAt: '3 days ago',
    snippet: 'Hey Maya, Room 214 in Huang Engineering is locked in for Saturday from 9 AM to 6 PM. I will bring the dual monitors and test devices...',
    priority: 'Important',
    read: true,
    starred: true,
    folder: 'sent',
    category: 'personal',
    summaryGenerated: false,
    body: `Hey Maya,

Room 214 in Huang Engineering is locked in for Saturday from 9 AM to 6 PM. I'll bring the dual monitors and test devices.

I've also prepared the slide deck outline and tested the Gemini 3.8 Flash API key with the Express proxy routes. See you Saturday morning!

Cheers,
Alex`
  }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Submit 2-page Architecture PDF to Canvas',
    relatedEmailId: 'email-1',
    relatedEmailSubject: 'CS Capstone Committee: Final Code Freeze & Live Demo Guidelines',
    sender: 'Prof. David Vance',
    deadline: 'Tuesday, Oct 13 · 5:00 PM EST',
    status: 'upcoming',
    urgency: 'Urgent',
    dateCreated: '2026-10-09'
  },
  {
    id: 'rem-2',
    title: 'GitHub Code Freeze Cutoff for Capstone',
    relatedEmailId: 'email-1',
    relatedEmailSubject: 'CS Capstone Committee: Final Code Freeze & Live Demo Guidelines',
    sender: 'Prof. David Vance',
    deadline: 'Wednesday, Oct 14 · 11:59 PM EST',
    status: 'upcoming',
    urgency: 'Urgent',
    dateCreated: '2026-10-09'
  },
  {
    id: 'rem-3',
    title: 'Submit Google Interview Availability Form',
    relatedEmailId: 'email-2',
    relatedEmailSubject: 'Google University Programs: Software Engineering Intern Interview Invitation',
    sender: 'Jessica Martinez',
    deadline: 'Monday, Oct 19 · 12:00 PM PST',
    status: 'upcoming',
    urgency: 'Urgent',
    dateCreated: '2026-10-09'
  },
  {
    id: 'rem-4',
    title: 'Hackathon Final Submission & Video Due',
    relatedEmailId: 'email-4',
    relatedEmailSubject: 'Hackathon Project "MailMind" Sync & Weekend Hackroom Booking',
    sender: 'Maya Lin',
    deadline: 'Sunday · 3:00 PM',
    status: 'upcoming',
    urgency: 'Important',
    dateCreated: '2026-10-09'
  },
  {
    id: 'rem-5',
    title: 'Review Midterm Chapter 5 Practice Quiz',
    relatedEmailSubject: 'CS 412 Study Material',
    sender: 'Prof. David Vance',
    deadline: 'Last week',
    status: 'completed',
    urgency: 'Important',
    dateCreated: '2026-10-01'
  }
];
