// lib/packAdapter.ts
import { Domain, Activity, Grade } from '../types.ts';

// Helper types for the raw pack data structure to improve type safety.
type Pack = {
    domains: Array<{
        name: string;
        subdomains: Array<{
            name: string;
            items: Array<any>; // Using any for flexibility with pack item structure
        }>;
    }>;
};
type PackSubdomain = Pack['domains'][number]['subdomains'][number];
type PackItem = PackSubdomain['items'][number];

/**
 * Transforms a raw item from the pack data into a streamlined Activity object.
 */
const transformItemToActivity = (item: PackItem): Activity => {
  return {
    id: item.id,
    name: item.title,
    prompt: item.prompt,
    grade: item.grade as Grade,
    type: item.type as 'virtual' | 'recording' | 'offline',
    responseOptions: item.responseOptions,
    correctAnswerIndex: item.correctAnswerIndex,
    visual: item.visual,
    displayType: item.displayType,
    introText: item.introText,
    timedSeconds: item.timedSeconds,
    sentenceStems: item.sentenceStems,
  };
};

/**
 * Generic grouper for AI-generated content based on a displayType.
 */
const groupVirtualActivitiesByDisplayType = (
    subdomain: PackSubdomain, 
    subdomainName: string, 
    displayType: Activity['displayType'], 
    idPrefix: string, 
    title: string, 
    prompt: string
): Activity[] => {
    const virtualItemsByGrade: { [key in Grade]?: PackItem[] } = {};
    const otherItems: PackItem[] = [];

    for (const item of subdomain.items) {
        if (subdomain.name === subdomainName && item.type === 'virtual') {
            if (!virtualItemsByGrade[item.grade as Grade]) {
                virtualItemsByGrade[item.grade as Grade] = [];
            }
            virtualItemsByGrade[item.grade as Grade]?.push(item);
        } else {
            otherItems.push(item);
        }
    }

    const groupedActivities: Activity[] = [];
    for (const grade in virtualItemsByGrade) {
        const items = virtualItemsByGrade[grade as Grade]!;
        if (items.length > 0) {
            groupedActivities.push({
                id: `${idPrefix}-${grade}`,
                name: title,
                prompt: prompt,
                grade: grade as Grade,
                type: 'virtual',
                isGrouped: true,
                displayType: displayType,
                subItems: items.map(transformItemToActivity),
            });
        }
    }
    return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Generic grouper for static MCQ content.
 */
const groupStaticMCQActivities = (
    subdomain: PackSubdomain, 
    displayType: Activity['displayType'], 
    idPrefix: string, 
    title: string, 
    prompt: string,
    introText?: Record<Grade, string>
): Activity[] => {
    const virtualItems: { [key in Grade]?: PackItem[] } = {};
    const otherItems: PackItem[] = [];

    for (const item of subdomain.items) {
         if (item.type === 'virtual' && !item.displayType) { // Avoid grabbing things like sink-or-swim
            if (!virtualItems[item.grade as Grade]) {
                virtualItems[item.grade as Grade] = [];
            }
            virtualItems[item.grade as Grade]?.push(item);
        } else {
            otherItems.push(item);
        }
    }
    const groupedActivities: Activity[] = [];
    for (const grade in virtualItems) {
        const g = grade as Grade;
        const items = virtualItems[g]!;
        if (items.length > 0) {
            groupedActivities.push({
                id: `${idPrefix}-${g}`,
                name: title,
                prompt: prompt,
                grade: g,
                type: 'virtual',
                isGrouped: true,
                displayType: displayType,
                subItems: items.map(transformItemToActivity),
                introText: introText ? introText[g] : undefined,
            });
        }
    }
    return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Processes a single subdomain, applying grouping logic where applicable.
 */
const processSubdomain = (subdomain: PackSubdomain): Activity[] => {
    const scienceExplorerIntros: Record<Grade, string> = {
        'K': "Science is all about exploring! We use our five senses—sight, hearing, smell, taste, and touch—to observe the world. Let's find out what it means for something to be living or non-living.",
        '1': "Let's be scientists! A scientist makes a special kind of guess called a 'hypothesis' (like 'If I do this, then that will happen'). We use tools like thermometers and scales to measure things and record what we find.",
        '2': "Time for an investigation! To do good science, we need to ask 'testable questions'—questions we can answer by doing an experiment. When we do an experiment, we only change one thing at a time to keep it fair. Let's explore!"
    };
    const lifeCyclesIntros: Record<Grade, string> = {
         'K': "All living things grow and change. A tiny seed can become a big flower, and a small caterpillar can become a beautiful butterfly! This is called a life cycle. Let's explore these amazing changes.",
         '1': "Let's investigate life cycles! We'll see how a tadpole turns into a frog and discover the different parts of a plant. We'll also learn how baby animals look like their parents because of 'traits'.",
         '2': "Welcome to the advanced life cycles lab! We'll explore 'metamorphosis'—the incredible change some insects go through. We'll also see how plants spread their seeds and how animals have special features to survive."
    };
    const communityQuestIntros: Record<Grade, string> = {
        'K': "Maps are like pictures of places from above. They help us know where things are. A good map uses symbols, which are small pictures that stand for real things, like a tree symbol for a park. It also has a compass to show directions like North, East, South, and West. Let's practice being map experts!",
        '1': "Let's become expert navigators! In this quest, we'll learn how to use a map key, or legend, to understand what different symbols mean. We will also use a compass rose to find our way. We'll discover the difference between natural features, like rivers, and man-made features, like bridges.",
        '2': "Time to explore the whole world! We live on a huge piece of land called a continent. There are seven continents and five big oceans on our planet. We'll learn how to identify them and use map skills like scale and grids to understand our world better. Let's begin our global adventure!"
    };
    const leadersCitizensIntros: Record<Grade, string> = {
        'K': "Every community, like our school or neighborhood, has rules to keep us safe and helpers who do important jobs. A firefighter is a helper, and a good rule is to be kind to others. Let's learn about how we can all be good helpers and friends in our community!",
        '1': "What makes a community a great place to live? It's the people! We have leaders, like a mayor, who help make important decisions. We also have laws and rules that help everyone stay safe and be fair. Let's learn about our roles as good citizens who help our community thrive.",
        '2': "Being a citizen means being part of a community, a state, and a country. In this mission, we'll learn about different levels of government, from local to national. We will also explore our rights (like the right to learn) and our responsibilities (like being respectful). Let's see how we can make a positive difference!"
    };

  switch (subdomain.name) {
    case 'Reading Comprehension':
      return groupVirtualActivitiesByDisplayType(subdomain, 'Reading Comprehension', 'story-time', 'grouped-readcomp', 'Story Time Adventure', "Let's read a fun story together! After the story, you'll answer a few questions to show what you remember.");
    case 'Reading Fluency':
       return groupVirtualActivitiesByDisplayType(subdomain, 'Reading Fluency', 'word-detective', 'grouped-readflu', 'Word Detective', "Let's play Word Detective! We'll practice sight words, find rhymes, and count syllables.");
    case 'Writing & Grammar':
       return groupVirtualActivitiesByDisplayType(subdomain, 'Writing & Grammar', 'sentence-builder', 'grouped-writegram', 'Sentence Builder', "Time to be a Sentence Builder! We'll fix sentences and match contractions.");
    case 'Number Sense':
        return groupStaticMCQActivities(subdomain, 'number-ninja', 'grouped-numsense', 'Number Ninja Challenge 🥷', "Welcome, Number Ninja! Let's test your math skills.");
    case 'Measurement & Data':
        const measurementItems = subdomain.items.filter(item => !['bar-chart', 'line-plot'].includes((item as any).visual?.type));
        const dataItems = subdomain.items.filter(item => ['bar-chart', 'line-plot'].includes((item as any).visual?.type));
        
        const measurementActivities = groupStaticMCQActivities({ ...subdomain, items: measurementItems }, 'measurement-master', 'grouped-measdata', 'Measurement Master Mission 📏', "Get your rulers ready, Measurement Master! It's time to explore size, time, and money.");
        const dataActivities = groupStaticMCQActivities({ ...subdomain, items: dataItems }, 'data-detective', 'grouped-datadetective', 'Data Detective 📊', "Put on your detective hat! It's time to look at charts and graphs to find the hidden clues.");

        return [...measurementActivities, ...dataActivities];
    case 'Inquiry & Observation':
        return groupStaticMCQActivities(subdomain, 'science-explorer', 'grouped-science-inquiry', 'Science Explorer Mission', "Put on your lab coat, Science Explorer! It's time to observe, predict, and discover.", scienceExplorerIntros);
    case 'Life Cycles':
        return groupStaticMCQActivities(subdomain, 'life-cycles-lab', 'grouped-lifecycles', 'Life Cycles Lab 🌱', "Welcome to the Life Cycles Lab! Let's explore how living things grow and change.", lifeCyclesIntros);
    case 'Geography':
        return groupStaticMCQActivities(subdomain, 'community-quest', 'grouped-geography', 'Community Quest 🗺️', "Welcome, community explorer! Get ready to learn about maps and neighborhoods.", communityQuestIntros);
    case 'Civics & Community':
        return groupStaticMCQActivities(subdomain, 'leaders-and-citizens', 'grouped-civics', 'Leaders & Citizens 👑', "Let's learn about the amazing people who help our community and the rules that keep us safe!", leadersCitizensIntros);
    default:
      return subdomain.items.map(transformItemToActivity);
  }
};


/**
 * Adapts the raw pack data into the Domain[] structure used by the UI.
 */
export const adaptPackToDomains = (pack: Pack): Domain[] => {
  const finalDomains: Domain[] = [];

  for (const domain of pack.domains) {
    if (domain.name === "Social-Emotional & Executive Functioning") {
      // Split this special domain into two separate UI domains
      const selSubdomains = domain.subdomains.filter(sd => sd.name === 'Emotions & Collaboration');
      const efSubdomains = domain.subdomains.filter(sd => ['Planning & Organization', 'Working Memory'].includes(sd.name));

      if (selSubdomains.length > 0) {
        finalDomains.push({
          key: 'social-emotional-learning',
          label: 'Social-Emotional Learning',
          activities: selSubdomains.flatMap(processSubdomain)
        });
      }
      if (efSubdomains.length > 0) {
        finalDomains.push({
          key: 'executive-functioning',
          label: 'Executive Functioning',
          activities: efSubdomains.flatMap(processSubdomain)
        });
      }
    } else {
      // Process all other domains normally
      finalDomains.push({
        key: domain.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
        label: domain.name,
        activities: domain.subdomains.flatMap(processSubdomain),
      });
    }
  }

  return finalDomains;
};