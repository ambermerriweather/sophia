// lib/utils.ts
import { GoogleGenAI } from "@google/genai";
import { Model, Domain, ActivityState, Activity } from '../types.ts';

// Lazily initialize the AI client to avoid accessing process.env before it's available.
let ai: GoogleGenAI | null = null;
// FIX: Hardcoded the user's provided API key for reliability in their private deployment.
export const getAiClient = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: 'AIzaSyClQm_SfT2UFLTdhMs0FU8YeKKTO-qtrWk' });
    }
    return ai;
};

// Helper to get all activities from a given set of domains
const getActivitiesFromDomains = (domains: Domain[]): Activity[] => {
  return domains.flatMap(d => d.activities);
};

export const percentComplete = (model: Model, domains: Domain[]): number => {
  const allActivities = getActivitiesFromDomains(domains);
  if (allActivities.length === 0) return 0;
  
  const completedCount = allActivities.filter(a => model.activity[a.id]?.completed).length;
  return Math.round((completedCount / allActivities.length) * 100);
};

export const domainStatus = (model: Model, domain: Domain): string => {
    const domainActivities = domain.activities;
    if (domainActivities.length === 0) return "Not applicable";

    const completed = domainActivities.filter(a => model.activity[a.id]?.completed).length;
    const total = domainActivities.length;

    if (completed === total) return "Complete!";
    if (completed > 0) return "In Progress";
    return "Not Started";
}

export const overallStatus = (model: Model, domains: Domain[]): string => {
    const completion = percentComplete(model, domains);
    if (completion === 100) return `Congratulations, ${model.learner.name}! You've completed this grade level!`;
    if (completion > 60) return `Amazing progress, ${model.learner.name}! Keep up the great work!`;
    if (completion > 20) return `You're off to a great start, ${model.learner.name}!`;
    return `Let's get started, ${model.learner.name}! This is going to be fun!`;
}

export const averageDuration = (model: Model, domains: Domain[]): string => {
    const domainActivityIds = new Set(getActivitiesFromDomains(domains).map(a => a.id));
    // FIX: Explicitly cast Object.values to ActivityState[] to resolve type inference issues.
    const completedActivities = (Object.values(model.activity) as ActivityState[])
      .filter(a => a.completed && a.startedAt && a.endedAt && domainActivityIds.has(a.id));

    if (completedActivities.length === 0) return 'N/A';
    
    const totalSeconds = completedActivities.reduce((acc, a) => {
        // FIX: Ensure endedAt and startedAt are treated as numbers. The filter above ensures they are not null.
        const duration = (a.endedAt! - a.startedAt!) / 1000;
        return acc + duration;
    }, 0);
    
    const avgSeconds = Math.round(totalSeconds / completedActivities.length);
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = avgSeconds % 60;
    
    return `${minutes}m ${seconds}s`;
};

export const nextStepsForDomain = (domainKey: string): string[] => {
    const suggestions: Record<string, string[]> = {
        'reading-&-language-arts': [
            "Read together daily, even for just 10 minutes.",
            "Point to words as you read to build tracking skills.",
            "Ask questions about the story to check comprehension."
        ],
        'mathematics': [
            "Use flashcards for quick math fact practice.",
            "Find math in everyday life, like counting items at the store.",
            "Play board games that involve counting and moving spaces."
        ],
        'social-emotional-learning': [
            "Name feelings as they happen: 'You seem frustrated.'",
            "Read books about emotions and talk about the characters.",
            "Model healthy ways to express your own feelings."
        ],
        'executive-functioning': [
            "Use visual checklists for morning or evening routines.",
            "Play memory games or 'I Spy' to boost working memory.",
            "Break down big tasks into smaller, more manageable steps."
        ],
        'science': [
            "Go on a nature walk and identify living and non-living things.",
            "Ask 'what do you think will happen?' to encourage prediction skills.",
            "Watch a science show for kids like 'Octonauts' or 'Wild Kratts'."
        ],
        'social-studies': [
            "Talk about community helpers you see during errands.",
            "Draw a map of your neighborhood or room.",
            "Read books about different cultures and places."
        ]
    };
    return suggestions[domainKey] || ["Continue to practice and have fun!"];
}


export const buildTextSummary = (model: Model, domains: Domain[]): string => {
  let summary = `
SOPHIA'S PLAYCHECK SUMMARY
===========================

Learner: ${model.learner.name}
Observer: ${model.learner.adult}
Date: ${model.learner.date}

---------------------------
OVERALL STATUS: ${overallStatus(model, domains)} (${percentComplete(model, domains)}% complete)
AVERAGE ACTIVITY TIME: ${averageDuration(model, domains)}
---------------------------
`;

  domains.forEach(domain => {
    if (domain.activities.length === 0) return; // Skip empty domains for the selected grade
    summary += `
DOMAIN: ${domain.label.toUpperCase()}
Status: ${domainStatus(model, domain)}
---------------------------\n`;

    const domainActivities = domain.activities;
    domainActivities.forEach(activity => {
      const state = model.activity[activity.id];
      if (state && state.completed) {
        summary += `
Activity: ${activity.name}
- Completed: Yes
- Rating: ${state.rating || 'N/A'}
- Difficulty: ${state.difficulty || 'N/A'}
- Time: ${state.time ? `${Math.floor(state.time / 60)}m ${state.time % 60}s` : 'N/A'}
- Notes: ${state.notes || 'None'}
`;
      }
    });

    if (model.domainNotes[domain.key]) {
      summary += `
Domain Notes for ${domain.label}:\n${model.domainNotes[domain.key]}\n`;
    }
     summary += '---------------------------\n';
  });

  if (model.overallNotes) {
    summary += `
OVERALL NOTES & REFLECTIONS
---------------------------
${model.overallNotes}
`;
  }

  return summary.trim();
};

export const calculateDomainPerformance = (model: Model, domain: Domain): { correct: number, total: number, percentage: number, status: string } => {
    let totalCorrect = 0;
    let totalAnswered = 0;

    for (const activity of domain.activities) {
        const state = model.activity[activity.id];
        // We only care about completed virtual activities that have answers
        if (state?.completed && state.answers && activity.type === 'virtual') {
            const answerKeys = Object.keys(state.answers);
            if (answerKeys.length > 0) {
                 const activityCorrect = Object.values(state.answers).filter(a => a.correct).length;
                 const activityTotal = answerKeys.length;
                 totalCorrect += activityCorrect;
                 totalAnswered += activityTotal;
            }
        }
    }
    
    const percentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    let status = 'Not enough data';
    if (totalAnswered > 2) { // Only give a status if there's enough data
        if (percentage >= 80) status = 'On Track';
        else if (percentage >= 60) status = 'Developing Skills';
        else status = 'Needs More Practice';
    }


    return { correct: totalCorrect, total: totalAnswered, percentage, status };
}


export const emailResults = async (model: Model, domains: Domain[]): Promise<{ ok: boolean }> => {
    const summary = buildTextSummary(model, domains);
    const prompt = `
        Format the following playcheck summary into a friendly, well-structured HTML email.
        The email should be addressed to the parent/observer.
        Use simple headings, bold text, and lists to make it easy to read.
        Start with a warm and encouraging opening.
        End with a positive closing statement.
        Here is the summary:
        ---
        ${summary}
        ---
    `;

    try {
        // FIX: Removed API key check as per guidelines, assuming key is always present.
        const response = await getAiClient().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const htmlBody = response.text;

        // This would be a call to a backend service to send the email.
        // We're simulating it here with a fetch to a placeholder.
        const emailApiEndpoint = 'https://api.example.com/send-email'; // Placeholder
        const res = await fetch(emailApiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: 'merriweatherlac@gmail.com',
                subject: `Playcheck Summary for ${model.learner.name}`,
                html: htmlBody,
            }),
        });

        // Since the endpoint is fake, we can't rely on res.ok.
        // For the purpose of this demo, we'll assume if the Gemini call succeeds, it's "ok".
        console.log("Simulated email sent with body:", htmlBody);
        return { ok: true };

    } catch (error) {
        console.error("Error generating or sending email:", error);
        return { ok: false };
    }
};