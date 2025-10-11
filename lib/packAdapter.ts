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
      return subdomain.items.map(transformItemToActivity);
    });

    return {
      key: domainKey,
      label: domain.name,
      activities: allActivities,
    };
  });
};