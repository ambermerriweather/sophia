
// lib/packAdapter.ts
import { Domain, Activity, Grade } from '../types.ts';
import { packData } from '../data/pack.ts';

// Helper types for the raw pack data structure to improve type safety.
type Pack = typeof packData;
type PackDomain = Pack['domains'][number];
type PackSubdomain = PackDomain['subdomains'][number];
type PackItem = PackSubdomain['items'][number];


/**
 * Transforms a raw item from the pack data into a streamlined Activity object.
 * @param item - The raw activity data from pack.ts.
 * @returns An Activity object.
 */
const transformItemToActivity = (item: PackItem): Activity => {
  return {
    id: item.id,
    name: item.title,
    prompt: item.prompt,
    grade: item.grade as Grade,
    type: item.type as 'virtual' | 'recording' | 'offline',
    // FIX: Cast item to `any` to allow access to optional properties that may not exist on all item types.
    // This is safe because the target Activity type marks these as optional, so `undefined` is a valid value.
    responseOptions: (item as any).responseOptions,
    correctAnswerIndex: (item as any).correctAnswerIndex,
    visual: (item as any).visual,
    displayType: (item as any).displayType,
    introText: (item as any).introText
  };
};

/**
 * Identifies and groups Reading Comprehension items into a single activity.
 * @param subdomain - The subdomain to process.
 * @returns An array of activities, with comprehension items grouped.
 */
const groupComprehensionActivities = (subdomain: PackSubdomain): Activity[] => {
  const comprehensionItems: { [key in Grade]?: PackItem[] } = {};
  const otherItems: PackItem[] = [];

  // Separate comprehension items from others
  for (const item of subdomain.items) {
    if (subdomain.name === 'Reading Comprehension' && item.type === 'virtual') {
      if (!comprehensionItems[item.grade as Grade]) {
        comprehensionItems[item.grade as Grade] = [];
      }
      comprehensionItems[item.grade as Grade]?.push(item);
    } else {
      otherItems.push(item);
    }
  }

  const groupedActivities: Activity[] = [];

  // Create a single grouped activity for each grade's comprehension items
  for (const grade in comprehensionItems) {
    const items = comprehensionItems[grade as Grade]!;
    if (items.length > 0) {
      groupedActivities.push({
        id: `grouped-readcomp-${grade}`,
        name: 'Story Time Adventure',
        prompt: `Let's read a fun story together, ${"Sophia"}! After the story, you'll answer a few questions to show what you remember.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'story-time',
        subItems: items.map(transformItemToActivity),
      });
    }
  }

  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Identifies and groups Reading Fluency items into a single activity.
 * @param subdomain - The subdomain to process.
 * @returns An array of activities, with fluency items grouped.
 */
const groupFluencyActivities = (subdomain: PackSubdomain): Activity[] => {
  const fluencyItems: { [key in Grade]?: PackItem[] } = {};
  const otherItems: PackItem[] = [];

  // Separate fluency items from others
  for (const item of subdomain.items) {
    if (subdomain.name === 'Reading Fluency') {
       if (item.type === 'virtual') {
            if (!fluencyItems[item.grade as Grade]) {
                fluencyItems[item.grade as Grade] = [];
            }
            fluencyItems[item.grade as Grade]?.push(item);
       } else {
           otherItems.push(item);
       }
    } else {
      otherItems.push(item);
    }
  }

  const groupedActivities: Activity[] = [];

  // Create a single grouped activity for each grade's fluency items
  for (const grade in fluencyItems) {
    const items = fluencyItems[grade as Grade]!;
    if (items.length > 0) {
      groupedActivities.push({
        id: `grouped-readflu-${grade}`,
        name: 'Word Detective',
        prompt: `Let's play Word Detective, Sophia! We'll practice sight words, find rhymes, and count syllables. Follow the instructions on the screen for each mini-game.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'word-detective',
        subItems: items.map(transformItemToActivity),
      });
    }
  }

  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Identifies and groups Writing & Grammar items into a single activity.
 * @param subdomain - The subdomain to process.
 * @returns An array of activities, with grammar items grouped.
 */
const groupGrammarActivities = (subdomain: PackSubdomain): Activity[] => {
  const grammarItems: { [key in Grade]?: PackItem[] } = {};
  const otherItems: PackItem[] = [];

  // Separate virtual grammar items from offline/recording ones
  for (const item of subdomain.items) {
    if (subdomain.name === 'Writing & Grammar' && item.type === 'virtual') {
      if (!grammarItems[item.grade as Grade]) {
        grammarItems[item.grade as Grade] = [];
      }
      grammarItems[item.grade as Grade]?.push(item);
    } else {
      otherItems.push(item);
    }
  }

  const groupedActivities: Activity[] = [];

  // Create a single grouped activity for each grade's virtual grammar items
  for (const grade in grammarItems) {
    const items = grammarItems[grade as Grade]!;
    if (items.length > 0) {
      groupedActivities.push({
        id: `grouped-writegram-${grade}`,
        name: 'Sentence Builder',
        prompt: `Time to be a Sentence Builder, Sophia! We'll fix sentences, match contractions, and find different types of words. Follow the on-screen instructions for each challenge.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'sentence-builder',
        subItems: items.map(transformItemToActivity),
      });
    }
  }
  
  // Return the new grouped activities along with any non-virtual items
  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};


const groupNumberSenseActivities = (subdomain: PackSubdomain): Activity[] => {
  const virtualItems: { [key in Grade]?: PackItem[] } = {};
  const otherItems: PackItem[] = [];

  for (const item of subdomain.items) {
    if (item.type === 'virtual') {
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
      const items = virtualItems[grade as Grade]!;
      if (items.length > 0) {
          groupedActivities.push({
              id: `grouped-numsense-${grade}`,
              name: 'Number Ninja Challenge 🥷',
              prompt: "Welcome, Number Ninja! Let's test your math skills. Answer the questions on the screen to show what a math whiz you are!",
              grade: grade as Grade,
              type: 'virtual',
              isGrouped: true,
              displayType: 'number-ninja',
              subItems: items.map(transformItemToActivity)
          });
      }
  }
  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};


const groupMeasurementDataActivities = (subdomain: PackSubdomain): Activity[] => {
    const measurementItems: { [key in Grade]?: PackItem[] } = {};
    const dataItems: { [key in Grade]?: PackItem[] } = {};
    const otherItems: PackItem[] = [];
    const dataKeywords = ['graph', 'plot'];

    for (const item of subdomain.items) {
        if (item.type === 'virtual') {
            const isDataItem = dataKeywords.some(kw => item.title.toLowerCase().includes(kw));
            if (isDataItem) {
                if (!dataItems[item.grade as Grade]) dataItems[item.grade as Grade] = [];
                dataItems[item.grade as Grade]?.push(item);
            } else {
                if (!measurementItems[item.grade as Grade]) measurementItems[item.grade as Grade] = [];
                measurementItems[item.grade as Grade]?.push(item);
            }
        } else {
            otherItems.push(item);
        }
    }

    const groupedActivities: Activity[] = [];
    for (const grade in measurementItems) {
        const items = measurementItems[grade as Grade]!;
        if (items.length > 0) {
            groupedActivities.push({
                id: `grouped-measdata-${grade}`,
                name: 'Measurement Master Mission 📏',
                prompt: "Get your rulers ready, Measurement Master! It's time to explore size, time, and money. Answer the questions to complete your mission.",
                grade: grade as Grade,
                type: 'virtual',
                isGrouped: true,
                displayType: 'measurement-master',
                subItems: items.map(transformItemToActivity)
            });
        }
    }
     for (const grade in dataItems) {
        const items = dataItems[grade as Grade]!;
        if (items.length > 0) {
            groupedActivities.push({
                id: `grouped-datadetective-${grade}`,
                name: 'Data Detective 📊',
                prompt: "Put on your detective hat! It's time to look at charts and graphs to find the hidden clues in the data.",
                grade: grade as Grade,
                type: 'virtual',
                isGrouped: true,
                displayType: 'data-detective',
                subItems: items.map(transformItemToActivity)
            });
        }
    }

    return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};


const groupScienceActivities = (subdomain: PackSubdomain): Activity[] => {
    const virtualItems: { [key in Grade]?: PackItem[] } = {};
    const otherItems: PackItem[] = [];

    for (const item of subdomain.items) {
        if (item.type === 'virtual' && (item as any).displayType !== 'sink-or-swim') {
            if (!virtualItems[item.grade as Grade]) {
                virtualItems[item.grade as Grade] = [];
            }
            virtualItems[item.grade as Grade]?.push(item);
        } else {
            otherItems.push(item);
        }
    }

    const introTexts: Record<Grade, string> = {
        'K': "Science is all about exploring! We use our five senses—sight, hearing, smell, taste, and touch—to observe the world. Let's find out what it means for something to be living or non-living.",
        '1': "Let's be scientists! A scientist makes a special kind of guess called a 'hypothesis' (like 'If I do this, then that will happen'). We use tools like thermometers and scales to measure things and record what we find.",
        '2': "Time for an investigation! To do good science, we need to ask 'testable questions'—questions we can answer by doing an experiment. When we do an experiment, we only change one thing at a time to keep it fair. Let's explore!"
    };

    const groupedActivities: Activity[] = [];
    for (const grade in virtualItems) {
        const g = grade as Grade;
        const items = virtualItems[g]!;
        if (items.length > 0) {
            groupedActivities.push({
                id: `grouped-science-inquiry-${g}`,
                name: 'Science Explorer Mission',
                prompt: "Put on your lab coat, Science Explorer! It's time to observe, predict, and discover. Answer the questions to complete your scientific mission.",
                grade: g,
                type: 'virtual',
                isGrouped: true,
                displayType: 'science-explorer',
                subItems: items.map(transformItemToActivity),
                introText: introTexts[g] || ''
            });
        }
    }
    return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};


const groupLifeCyclesActivities = (subdomain: PackSubdomain): Activity[] => {
    const virtualItems: { [key in Grade]?: PackItem[] } = {};
    const otherItems: PackItem[] = [];

    for (const item of subdomain.items) {
        if (item.type === 'virtual') {
            if (!virtualItems[item.grade as Grade]) {
                virtualItems[item.grade as Grade] = [];
            }
            virtualItems[item.grade as Grade]?.push(item);
        } else {
            otherItems.push(item);
        }
    }
    // FIX: Complete the function implementation to group life cycle activities and return a value.
    const groupedActivities: Activity[] = [];
    for (const grade in virtualItems) {
        const g = grade as Grade;
        const items = virtualItems[g]!;
        if (items.length > 0) {
            groupedActivities.push({
                id: `grouped-lifecycles-${g}`,
                name: 'Life Cycles Lab 🌱',
                prompt: "Welcome to the Life Cycles Lab! Let's explore how living things grow and change, from tiny seeds to big plants and from eggs to butterflies. Answer the questions to show what you know!",
                grade: g,
                type: 'virtual',
                isGrouped: true,
                displayType: 'life-cycles-lab',
                subItems: items.map(transformItemToActivity)
            });
        }
    }
    return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

const groupGeographyActivities = (subdomain: PackSubdomain): Activity[] => {
    const virtualItems: { [key in Grade]?: PackItem[] } = {};
    const otherItems: PackItem[] = [];

    for (const item of subdomain.items) {
        if (item.type === 'virtual') {
            if (!virtualItems[item.grade as Grade]) virtualItems[item.grade as Grade] = [];
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
                id: `grouped-geography-${g}`,
                name: 'Geography Quest',
                prompt: "Let's explore our world! Answer questions about maps, places, and how we find our way around.",
                grade: g,
                type: 'virtual',
                isGrouped: true,
                displayType: 'community-quest',
                subItems: items.map(transformItemToActivity)
            });
        }
    }
    return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

const groupCivicsActivities = (subdomain: PackSubdomain): Activity[] => {
    const virtualItems: { [key in Grade]?: PackItem[] } = {};
    const otherItems: PackItem[] = [];

    for (const item of subdomain.items) {
        if (item.type === 'virtual') {
            if (!virtualItems[item.grade as Grade]) virtualItems[item.grade as Grade] = [];
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
                id: `grouped-civics-${g}`,
                name: 'Community Quest',
                prompt: "Our community is full of amazing people and important rules. Let's learn about them!",
                grade: g,
                type: 'virtual',
                isGrouped: true,
                displayType: 'community-quest',
                subItems: items.map(transformItemToActivity)
            });
        }
    }
    return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Processes a single subdomain, applying grouping logic where applicable.
 * @param subdomain - The subdomain to process.
 * @returns An array of activities.
 */
const processSubdomain = (subdomain: PackSubdomain): Activity[] => {
  switch (subdomain.name) {
    case 'Reading Comprehension':
      return groupComprehensionActivities(subdomain);
    case 'Reading Fluency':
      return groupFluencyActivities(subdomain);
    case 'Writing & Grammar':
      return groupGrammarActivities(subdomain);
    case 'Number Sense':
      return groupNumberSenseActivities(subdomain);
    case 'Measurement & Data':
      return groupMeasurementDataActivities(subdomain);
    case 'Inquiry & Observation':
      return groupScienceActivities(subdomain);
    case 'Life Cycles':
      return groupLifeCyclesActivities(subdomain);
    case 'Geography':
        return groupGeographyActivities(subdomain);
    case 'Civics & Community':
        return groupCivicsActivities(subdomain);
    default:
      // For subdomains without special grouping, just transform each item.
      return subdomain.items.map(transformItemToActivity);
  }
};


/**
 * Adapts the raw pack data into the Domain[] structure used by the UI.
 * This function iterates through domains and subdomains, applying specific grouping
 * logic to bundle related items into single, cohesive activities.
 * @param pack - The raw pack data.
 * @returns An array of Domain objects.
 */
// FIX: Export the adaptPackToDomains function to make it available for import in other modules, resolving the error in constants.ts.
export const adaptPackToDomains = (pack: Pack): Domain[] => {
  return pack.domains.map(domain => {
    const allActivities = domain.subdomains.flatMap(processSubdomain);

    const domainKey = domain.name
      .toLowerCase()
      .replace(/ & /g, '-')
      .replace(/ /g, '-');

    return {
      key: domainKey,
      label: domain.name,
      activities: allActivities,
    };
  });
};
