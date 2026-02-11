import type { TranslationKey } from "./ko";

const en: Record<TranslationKey, string> = {
  // Common
  "common.appName": "MoodCompass",
  "common.signIn": "Sign in",
  "common.signUp": "Sign up",
  "common.signOut": "Sign out",
  "common.loading": "Loading...",
  "common.saving": "Saving...",
  "common.save": "Save",
  "common.or": "or",
  "common.account": "Account",
  "common.email": "Email",
  "common.password": "Password",
  "common.name": "Name",
  "common.somethingWentWrong": "Something went wrong",
  "common.getStarted": "Get started",

  // Navigation
  "nav.dashboard": "Dashboard",
  "nav.mood": "Mood",
  "nav.journal": "Journal",
  "nav.medications": "Medications",
  "nav.insights": "Insights",
  "nav.settings": "Settings",

  // Auth - Sign In
  "auth.signIn.title": "Welcome back",
  "auth.signIn.subtitle": "Sign in to MoodCompass",
  "auth.signIn.emailPlaceholder": "you@example.com",
  "auth.signIn.signingIn": "Signing in...",
  "auth.signIn.invalidCredentials": "Invalid email or password",
  "auth.signIn.continueWithGoogle": "Continue with Google",
  "auth.signIn.noAccount": "Don\u2019t have an account?",

  // Auth - Sign Up
  "auth.signUp.title": "Create an account",
  "auth.signUp.subtitle": "Get started with MoodCompass",
  "auth.signUp.namePlaceholder": "Your name",
  "auth.signUp.emailPlaceholder": "you@example.com",
  "auth.signUp.passwordPlaceholder": "At least 8 characters",
  "auth.signUp.creating": "Creating account...",
  "auth.signUp.create": "Create account",
  "auth.signUp.continueWithGoogle": "Continue with Google",
  "auth.signUp.hasAccount": "Already have an account?",
  "auth.signUp.autoSignInFailed":
    "Account created but could not sign in automatically",

  // Landing
  "landing.hero.title": "Navigate your emotions with confidence",
  "landing.hero.description":
    "MoodCompass is an AI-powered companion for bipolar disorder management. Track moods, discover patterns, and gain insights \u2014 all in one place.",
  "landing.hero.startTracking": "Start tracking free",
  "landing.features.moodTracking.title": "Mood Tracking",
  "landing.features.moodTracking.description":
    "Log your mood, energy, anxiety, and sleep daily. Visualize patterns over time with interactive charts.",
  "landing.features.aiInsights.title": "AI Insights",
  "landing.features.aiInsights.description":
    "Get personalized insights powered by AI that help you understand your mood patterns and triggers.",
  "landing.features.guidedJournal.title": "Guided Journal",
  "landing.features.guidedJournal.description":
    "Write journal entries with AI-generated prompts tailored to your current emotional state.",
  "landing.features.medicationTracker.title": "Medication Tracker",
  "landing.features.medicationTracker.description":
    "Track your medications, dosages, and adherence to stay on top of your treatment plan.",
  "landing.footer.openSource":
    "MoodCompass is open source and released under the AGPL-3.0 license.",
  "landing.footer.disclaimer":
    "This app is not a replacement for professional medical care. Always consult your healthcare provider about your treatment.",

  // Crisis Banner
  "crisis.badge": "Crisis?",
  "crisis.message": "If you\u2019re in crisis, call or text",
  "crisis.hotline": "988",
  "crisis.hotlineLabel": "(Suicide & Crisis Lifeline) \u2014 available 24/7",
  "crisis.telLink": "tel:988",

  // Dashboard
  "dashboard.welcome": "Welcome back, {name}",
  "dashboard.subtitle": "Here\u2019s an overview of your recent activity.",
  "dashboard.logMood": "Log Mood",
  "dashboard.logMoodDesc": "Record how you\u2019re feeling right now",
  "dashboard.writeJournal": "Write Journal",
  "dashboard.writeJournalDesc": "Start a new journal entry",
  "dashboard.viewInsights": "View Insights",
  "dashboard.viewInsightsDesc": "See AI-powered mood analysis",
  "dashboard.moodLast7Days": "Mood \u2014 Last 7 Days",
  "dashboard.recentMoodTrends": "Your recent mood trends",
  "dashboard.viewAll": "View all",

  // Mood Page
  "mood.title": "Mood Tracking",
  "mood.subtitle": "Track and visualize your mood over time.",
  "mood.logMood": "Log Mood",
  "mood.moodOverTime": "Mood Over Time",
  "mood.moodTrends": "Your mood, energy, and anxiety trends",
  "mood.recentEntries": "Recent Entries",
  "mood.noEntries":
    "No mood entries yet. Start by logging your first mood!",
  "mood.energy": "Energy: {value}/10",
  "mood.anxiety": "Anxiety: {value}/10",
  "mood.sleep": "Sleep: {value}h",
  "mood.labelVeryLow": "Very Low",
  "mood.labelLow": "Low",
  "mood.labelModerate": "Moderate",
  "mood.labelGood": "Good",
  "mood.labelExcellent": "Excellent",

  // Mood Form
  "moodForm.title": "How are you feeling?",
  "moodForm.pageTitle": "Log Mood",
  "moodForm.pageSubtitle":
    "How are you feeling right now? Rate each area on a scale.",
  "moodForm.mood": "Mood",
  "moodForm.moodVeryLow": "Very low",
  "moodForm.moodVeryHigh": "Very high",
  "moodForm.energy": "Energy",
  "moodForm.exhausted": "Exhausted",
  "moodForm.veryEnergetic": "Very energetic",
  "moodForm.anxiety": "Anxiety",
  "moodForm.calm": "Calm",
  "moodForm.veryAnxious": "Very anxious",
  "moodForm.irritability": "Irritability",
  "moodForm.relaxed": "Relaxed",
  "moodForm.veryIrritable": "Very irritable",
  "moodForm.sleep": "Sleep",
  "moodForm.hoursOfSleep": "Hours of sleep",
  "moodForm.sleepQuality": "Sleep quality",
  "moodForm.terrible": "Terrible",
  "moodForm.excellent": "Excellent",
  "moodForm.notes": "Notes",
  "moodForm.notesPlaceholder":
    "Anything else you\u2019d like to note about today? (optional)",
  "moodForm.saveMoodEntry": "Save mood entry",
  "moodForm.savedSuccess": "Mood entry saved!",
  "moodForm.savedError": "Failed to save mood entry",
  "moodForm.savedErrorGeneric": "Something went wrong. Please try again.",

  // Mood Chart
  "moodChart.loading": "Loading chart...",
  "moodChart.noData":
    "No mood entries yet. Start by logging your first mood!",
  "moodChart.mood": "Mood",
  "moodChart.energy": "Energy",

  // Journal Page
  "journal.title": "Journal",
  "journal.subtitle": "Write and reflect with AI-guided prompts.",
  "journal.newEntry": "New Entry",
  "journal.noEntries": "No journal entries yet. Start writing!",

  // Journal Editor
  "journalEditor.aiPromptTitle": "AI Writing Prompt",
  "journalEditor.generatePrompt": "Generate prompt",
  "journalEditor.title": "Title",
  "journalEditor.titlePlaceholder": "Give your entry a title...",
  "journalEditor.content": "Content",
  "journalEditor.contentPlaceholder": "Write your thoughts...",
  "journalEditor.saveEntry": "Save entry",
  "journalEditor.savedSuccess": "Journal entry saved!",
  "journalEditor.savedError": "Failed to save journal entry",
  "journalEditor.savedErrorGeneric": "Something went wrong. Please try again.",
  "journalEditor.promptError":
    "Could not generate prompt. Check AI configuration.",

  // Journal New Page
  "journalNew.title": "New Journal Entry",
  "journalNew.subtitle":
    "Write freely or use an AI-generated prompt to get started.",

  // Medications Page
  "medications.title": "Medications",
  "medications.subtitle":
    "Track your medications and log when you take them.",
  "medications.addMedication": "Add Medication",
  "medications.dialogTitle": "Add Medication",
  "medications.name": "Medication Name",
  "medications.namePlaceholder": "e.g., Lithium",
  "medications.dosage": "Dosage",
  "medications.dosagePlaceholder": "e.g., 300mg",
  "medications.frequency": "Frequency",
  "medications.frequencyPlaceholder": "e.g., Twice daily",
  "medications.adding": "Adding...",
  "medications.addButton": "Add medication",
  "medications.addedSuccess": "Medication added!",
  "medications.addedError": "Failed to add medication",
  "medications.noMedications":
    "No medications added yet. Add your first medication to start tracking.",
  "medications.active": "Active",
  "medications.inactive": "Inactive",
  "medications.taken": "Taken",
  "medications.skipped": "Skipped",
  "medications.markedTaken": "Marked as taken",
  "medications.markedSkipped": "Marked as skipped",
  "medications.logError": "Failed to log medication",

  // Insights Page
  "insights.title": "AI Insights",
  "insights.subtitle":
    "Get AI-powered analysis of your mood patterns and personalized suggestions.",
  "insights.analysisTitle": "Mood Pattern Analysis",
  "insights.analysisDescription":
    "Based on your recent mood entries, our AI will identify patterns, potential triggers, and offer suggestions.",
  "insights.generate": "Generate Insights",
  "insights.analyzing": "Analyzing your mood data...",
  "insights.regenerate": "Regenerate",
  "insights.disclaimer":
    "AI insights are informational only and not a substitute for professional medical advice. Always consult your healthcare provider.",
  "insights.errorNoData":
    "Unable to generate insights. Make sure you have mood entries and the AI service is configured.",
  "insights.errorConnection":
    "Unable to connect to the AI service. Please check your configuration.",

  // Settings Page
  "settings.title": "Settings",
  "settings.subtitle": "Manage your account and preferences.",
  "settings.profile": "Profile",
  "settings.profileDesc": "Update your display name",
  "settings.noName": "No name set",
  "settings.displayName": "Display Name",
  "settings.namePlaceholder": "Your name",
  "settings.profileUpdated": "Profile updated!",
  "settings.profileError": "Failed to update profile",
  "settings.password": "Password",
  "settings.passwordDesc":
    "Change your password (credentials accounts only)",
  "settings.currentPassword": "Current Password",
  "settings.newPassword": "New Password",
  "settings.newPasswordPlaceholder": "At least 8 characters",
  "settings.changing": "Changing...",
  "settings.changePassword": "Change password",
  "settings.passwordChanged": "Password changed!",
  "settings.passwordError": "Failed to change password",
  "settings.appearance": "Appearance",
  "settings.appearanceDesc": "Choose your preferred theme",
  "settings.light": "Light",
  "settings.dark": "Dark",
  "settings.system": "System",
  "settings.language": "Language",
  "settings.languageDesc": "Choose the app display language",
  "settings.dataPrivacy": "Data & Privacy",
  "settings.dataPrivacyDesc":
    "Your data is stored securely and is only accessible by you. MoodCompass is open source \u2014 you can audit the code at any time.",

  // AI Insights (fallback)
  "ai.insights.noData":
    "Not enough data yet. Log a few mood entries first, then come back for insights!",
  "ai.insights.avgMoodHigh":
    "Things seem to be going relatively well overall.",
  "ai.insights.avgMoodMid": "Your mood has been in a moderate range.",
  "ai.insights.avgMoodLow":
    "Your mood has been on the lower side \u2014 be gentle with yourself.",
  "ai.insights.sleepLow":
    "That\u2019s below the recommended range \u2014 improving sleep could have a positive effect on your mood and energy.",
  "ai.insights.sleepHigh":
    "That\u2019s on the higher side, which can sometimes be associated with low energy periods.",
  "ai.insights.sleepNormal":
    "That\u2019s within a healthy range, which is great for mood stability.",
  "ai.insights.anxietyHigh":
    "Anxiety has been quite high \u2014 consider discussing coping strategies with your care team.",
  "ai.insights.anxietyMid":
    "Some moderate anxiety is present \u2014 mindfulness or breathing exercises might help.",
  "ai.insights.anxietyLow":
    "Anxiety levels look manageable, which is a positive sign.",
  "ai.insights.disclaimer":
    "Remember: these are simple observations based on your self-reported data, not medical advice. Share these patterns with your healthcare provider for personalized guidance.",

  // AI Journal Prompts (fallback)
  "ai.journal.prompt1":
    "What are three things you\u2019re grateful for today, and why do they matter to you?",
  "ai.journal.prompt2":
    "Describe a moment today when you felt most like yourself.",
  "ai.journal.prompt3":
    "What is one small thing you did today that took courage?",
  "ai.journal.prompt4":
    "Write about a person who made you feel safe or understood recently.",
  "ai.journal.prompt5":
    "What would you tell a friend who was feeling the way you feel right now?",
  "ai.journal.prompt6":
    "Describe your energy today as a weather pattern. What does the forecast look like?",
  "ai.journal.prompt7":
    "What is one boundary you set or wish you had set today?",
  "ai.journal.prompt8":
    "Write about something you\u2019re looking forward to, no matter how small.",
  "ai.journal.prompt9":
    "What did your body need today that you did or didn\u2019t give it?",
  "ai.journal.prompt10":
    "If your mood today had a color and a texture, what would they be?",

  // Language toggle
  "lang.ko": "한국어",
  "lang.en": "English",
};

export default en;
