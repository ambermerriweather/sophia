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
      if (!fluencyItems[item.grade as Grade]) {
        fluencyItems[item.grade as Grade] = [];
      }
      fluencyItems[item.grade as Grade]?.push(item);
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

/**
 * Groups virtual "Number Sense" items from the pack data into a single activity per grade.
 * @param subdomain The Number Sense subdomain from the pack.
 * @returns An array of activities, with virtual items grouped into a "Number Ninja" challenge.
 */
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
        name: 'Number Ninja Challenge',
        prompt: `Let's test your number skills, Sophia! Complete these challenges to become a Number Ninja.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'number-ninja',
        subItems: items.map(transformItemToActivity),
      });
    }
  }

  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Groups virtual "Measurement & Data" items into separate activities for measurement and data analysis.
 * @param subdomain The Measurement & Data subdomain.
 * @returns An array of activities, with measurement and data questions grouped separately.
 */
const groupMeasurementDataActivities = (subdomain: PackSubdomain): Activity[] => {
  const measurementItems: { [key in Grade]?: PackItem[] } = {};
  const dataItems: { [key in Grade]?: PackItem[] } = {};
  const otherItems: PackItem[] = [];

  for (const item of subdomain.items) {
    if (item.type === 'virtual') {
      // Check if the item is data-related (bar chart or line plot)
      if ((item as any).visual?.type === 'bar-chart' || (item as any).title?.includes('Line Plot')) {
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

  // Group pure measurement items
  for (const grade in measurementItems) {
    const items = measurementItems[grade as Grade]!;
    if (items.length > 0) {
      groupedActivities.push({
        id: `grouped-meas-${grade}`,
        name: 'Measurement Master Mission',
        prompt: `Time for a Measurement Master Mission, Sophia! We'll explore time, money, and more.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'measurement-master',
        subItems: items.map(transformItemToActivity),
      });
    }
  }
  
  // Group data analysis items
  for (const grade in dataItems) {
    const items = dataItems[grade as Grade]!;
    if (items.length > 0) {
      groupedActivities.push({
        id: `grouped-data-${grade}`,
        name: 'Data Detective',
        prompt: `Time to be a Data Detective, Sophia! Look at the graphs and charts to solve the puzzles.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'data-detective',
        subItems: items.map(transformItemToActivity),
      });
    }
  }

  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Groups virtual "Inquiry & Observation" items from Science into a single activity per grade.
 * @param subdomain The Inquiry & Observation subdomain.
 * @returns An array of activities, with virtual items grouped into a "Science Explorer" mission.
 */
const groupScienceActivities = (subdomain: PackSubdomain): Activity[] => {
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
        id: `grouped-science-${grade}`,
        name: 'Science Explorer Mission',
        prompt: `Let's be Science Explorers, Sophia! We will observe, ask questions, and make predictions.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'science-explorer',
        subItems: items.map(transformItemToActivity),
      });
    }
  }

  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};

/**
 * Groups virtual "Life Cycles" items from Science into a single activity per grade.
 * @param subdomain The Life Cycles subdomain.
 * @returns An array of activities, with virtual items grouped into a "Life Cycles Lab" mission.
 */
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

  const groupedActivities: Activity[] = [];

  for (const grade in virtualItems) {
    const items = virtualItems[grade as Grade]!;
    if (items.length > 0) {
      groupedActivities.push({
        id: `grouped-lifecyc-${grade}`,
        name: 'Life Cycles Lab',
        prompt: `Welcome to the Life Cycles Lab, Sophia! Let's learn about how plants and animals grow and change.`,
        grade: grade as Grade,
        type: 'virtual',
        isGrouped: true,
        displayType: 'life-cycles-lab',
        subItems: items.map(transformItemToActivity),
      });
    }
  }

  return [...groupedActivities, ...otherItems.map(transformItemToActivity)];
};


/**
 * Adapts the raw, deeply nested pack data into a flat array of Domains,
 * which is easier for the UI components to consume.
 * @param data - The raw packData object.
 * @returns An array of Domain objects.
 */
export const adaptPackToDomains = (data: Pack): Domain[] => {
  return data.domains.map((domain: PackDomain) => {
    const domainKey = domain.name
      .toLowerCase()
      .replace(/ & /g, '-&-')
      .replace(/ /g, '-');
    
    const allActivities: Activity[] = domain.subdomains.flatMap(subdomain => {
      if (domain.name === 'Reading & Language Arts') {
        if (subdomain.name === 'Reading Comprehension') {
          return groupComprehensionActivities(subdomain);
        }
        if (subdomain.name === 'Reading Fluency') {
          return groupFluencyActivities(subdomain);
        }
        if (subdomain.name === 'Writing & Grammar') {
          return groupGrammarActivities(subdomain);
        }
      }
      if (domain.name === 'Mathematics') {
        if (subdomain.name === 'Number Sense') {
          return groupNumberSenseActivities(subdomain);
        }
        if (subdomain.name === 'Measurement & Data') {
          return groupMeasurementDataActivities(subdomain);
        }
      }
      if (domain.name === 'Science') {
        if (subdomain.name === 'Inquiry & Observation') {
            return groupScienceActivities(subdomain);
        }
        if (subdomain.name === 'Life Cycles') {
            return groupLifeCyclesActivities(subdomain);
        }
      }
      return subdomain.items.map(transformItemToActivity);
    });

    return {
      key: domainKey,
      label: domain.name,
      activities: allActivities,
    };
  });
};