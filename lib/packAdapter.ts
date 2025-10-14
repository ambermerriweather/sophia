// lib/packAdapter.ts
import { Domain, Activity, Grade } from '../types.ts';

// Helper types for the raw pack data structure to improve type safety.
type Pack = {
    domains: Array<{
        name: string;
        color?: string; // Add color property to type
        subdomains: Array<{
            name: string;
            items: Array<any>; // Using any for flexibility with pack item structure
        }>;
    }>;
};
type PackDomain = Pack['domains'][number];
type PackSubdomain = Pack['domains'][number]['subdomains'][number];
type PackItem = PackSubdomain['items'][number];

// This set contains the IDs of the static "Read Aloud Passage" activities.
// By adding their IDs here, we prevent them from being displayed in the UI,
// which declutters the Fluency section as requested by the user.
const hiddenItemIds = new Set(['rl-readflu-K-5', 'rl-readflu-2-5', 'rl-writegram-1-5']);


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
    subItems: item.subItems // Pass subItems through for Sink or Swim
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
         if (item.type === 'virtual' && !item.displayType?.startsWith('sink-or-swim')) { // Avoid grabbing sink-or-swim
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
            const processedSubItems = items.map(transformItemToActivity).map(activity => {
                if (displayType === 'data-detective') {
                    const visualType = (activity.visual as any)?.type;
                    if (visualType === 'bar-chart') {
                        activity.introText = "A bar graph uses bars. Taller bars mean more. Read the title, labels, and the scale.";
                    } else if (visualType === 'line-plot') {
                        activity.introText = "A line plot shows measurements with X marks on a number line. Count the Xs at the number.";
                    } else if (activity.name.toLowerCase().includes('tally')) {
                        activity.introText = "Tally marks group by fives to make counting fast. A bundle with a slash equals five.";
                    }
                }
                return activity;
            });

            groupedActivities.push({
                id: `${idPrefix}-${g}`,
                name: title,
                prompt: prompt,
                grade: g,
                type: 'virtual',
                isGrouped: true,
                displayType: displayType,
                subItems: processedSubItems,
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
    const measurementMasterIntros: Record<Grade, string> = {
        'K': "Let's compare things! We can see which things are longer, taller, or heavier. This helps us understand the world around us.",
        '1': "Time to be a Measurement Master! We use tools like rulers to see how long things are and clocks to tell time. Let's practice!",
        '2': "Welcome, Measurement Master! We'll practice using different units, like inches and miles, and solve problems with time and money."
    };
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
        'K': "A community is a place where people live, work, and help each other. Let's learn to read simple maps that show us where places are, like our home, school, and the park!",
        '1': "Let's explore our community! We'll use maps with special symbols and a compass to find our way around and learn about the world.",
        '2': "Time to be a global explorer! We live on a continent, which is a giant piece of land with many countries. Let's learn about continents, oceans, and how to read more advanced maps."
    };
    const leadersCitizensIntros: Record<Grade, string> = {
        'K': "Every community has rules to keep us safe and helpers who do important jobs. Let's learn about being a kind and helpful member of our school and neighborhood!",
        '1': "What makes a good community? Let's learn about important community leaders, like the mayor, the laws that keep us safe, and what it means to be a good citizen.",
        '2': "Let's explore what it means to be a citizen. We'll learn about different levels of government, our rights and responsibilities, and how people work together to solve problems and make their communities better."
    };
    const emotionsCollabIntros: Record<Grade, string> = {
      'K': "Feelings are like visitors; they come and go! Let's practice naming our feelings and learn how to be a kind friend to others.",
      '1': "Let's explore our emotions! We'll practice using 'I-statements' to share how we feel and find fair ways to solve problems with friends.",
      '2': "Time to become an emotions expert! We'll learn about empathy, which is understanding how someone else feels, and practice positive self-talk for when things get tricky."
    };
    const planningOrgIntros: Record<Grade, string> = {
        'K': "Getting ready is a superpower! Let's practice the first steps for getting tasks done, like cleaning up our toys and following directions.",
        '1': "Let's become super organizers! We'll practice planning the steps to get a job done and learn how keeping our space tidy helps our brain.",
        '2': "Time for a planning challenge! Let's practice how to break big projects into small steps and choose what's most important to do first."
    };
    const workingMemoryIntros: Record<Grade, string> = {
        'K': "Your brain is like a treasure box for remembering things. Let's play a game to see what treasures we can keep inside!",
        '1': "Let's give our brain a workout! These memory games will help us practice holding information in our minds to solve problems.",
        '2': "Ready for a memory mission? We'll practice remembering lists and following multi-step directions to boost our brainpower!"
    };

  let activities: Activity[];

  switch (subdomain.name) {
    case 'Reading Comprehension':
      activities = groupVirtualActivitiesByDisplayType(subdomain, 'Reading Comprehension', 'story-time', 'grouped-readcomp', 'Story Time Adventure', "Let's read a fun story together! After the story, you'll answer a few questions to show what you remember.");
      break;
    case 'Reading Fluency':
       activities = groupVirtualActivitiesByDisplayType(subdomain, 'Reading Fluency', 'word-detective', 'grouped-readflu', 'Word Detective', "Let's play Word Detective! We'll practice sight words, find rhymes, and count syllables.");
       break;
    case 'Writing & Grammar':
       activities = groupVirtualActivitiesByDisplayType(subdomain, 'Writing & Grammar', 'sentence-builder', 'grouped-writegram', 'Sentence Builder', "Time to be a Sentence Builder! We'll fix sentences and match contractions.");
       break;
    case 'Number Sense':
        activities = groupStaticMCQActivities(subdomain, 'number-ninja', 'grouped-numsense', 'Number Ninja Challenge 🥷', "Welcome, Number Ninja! Let's test your math skills.");
        break;
    case 'Measurement & Data':
        const measurementItems = subdomain.items.filter(item => !['bar-chart', 'line-plot'].includes((item as any).visual?.type) && !item.title?.toLowerCase().includes('tally'));
        const dataItems = subdomain.items.filter(item => ['bar-chart', 'line-plot'].includes((item as any).visual?.type) || item.title?.toLowerCase().includes('tally'));
        
        const measurementActivities = groupStaticMCQActivities({ ...subdomain, items: measurementItems }, 'measurement-master', 'grouped-measdata', 'Measurement Master Mission 📏', "Get your rulers ready, Measurement Master! It's time to explore size, time, and money.", measurementMasterIntros);
        const dataActivities = groupStaticMCQActivities({ ...subdomain, items: dataItems }, 'data-detective', 'grouped-datadetective', 'Data Detective 📊', "Put on your detective hat! It's time to look at charts and graphs to find the hidden clues.");

        activities = [...measurementActivities, ...dataActivities];
        break;
    case 'Inquiry & Observation':
        // Handle Sink or Swim separately
        const sinkOrSwimItems = subdomain.items.filter(i => i.title === 'Sink or Swim?');
        const otherInquiryItems = subdomain.items.filter(i => i.title !== 'Sink or Swim?');
        const groupedSinkOrSwim: Activity[] = sinkOrSwimItems.map(item => ({
            ...transformItemToActivity(item),
            isGrouped: true,
            displayType: 'sink-or-swim-mission'
        }));
        
        const explorerActivities = groupStaticMCQActivities({ ...subdomain, items: otherInquiryItems }, 'science-explorer', 'grouped-science-inquiry', 'Science Explorer Mission', "Put on your lab coat, Science Explorer! It's time to observe, predict, and discover.", scienceExplorerIntros);
        activities = [...explorerActivities, ...groupedSinkOrSwim];
        break;
    case 'Life Cycles':
        activities = groupStaticMCQActivities(subdomain, 'life-cycles-lab', 'grouped-lifecycles', 'Life Cycles Lab 🌱', "Welcome to the Life Cycles Lab! Let's explore how living things grow and change.", lifeCyclesIntros);
        break;
    case 'Geography':
        activities = groupStaticMCQActivities(subdomain, 'community-quest', 'grouped-geography', 'Community Quest 🗺️', "Welcome, community explorer! Get ready to learn about maps and neighborhoods.", communityQuestIntros);
        break;
    case 'Civics & Community':
        activities = groupStaticMCQActivities(subdomain, 'leaders-and-citizens', 'grouped-civics', 'Leaders & Citizens 👑', "Let's learn about the amazing people who help our community and the rules that keep us safe!", leadersCitizensIntros);
        break;
    case 'Emotions & Collaboration':
        activities = groupStaticMCQActivities(subdomain, 'emotions-and-collaboration', 'grouped-sel-emocol', 'Friendship & Feelings Mission', "Let's explore our feelings and learn how to be a great friend!", emotionsCollabIntros);
        break;
    case 'Planning & Organization':
         activities = groupStaticMCQActivities(subdomain, 'planning-and-organization', 'grouped-ef-plan', 'Super Organizer Challenge', "Let's practice planning and organizing our tasks like a superhero!", planningOrgIntros);
        break;
    case 'Working Memory':
         activities = groupStaticMCQActivities(subdomain, 'working-memory-game', 'grouped-ef-workmem', 'Memory Master Game', "Let's play a game to see how much your amazing brain can remember!", workingMemoryIntros);
        break;
    default:
      activities = subdomain.items.map(transformItemToActivity);
  }

  return activities.filter(activity => !hiddenItemIds.has(activity.id));
};


/**
 * Merges multiple domains (e.g., "Reading", "Writing") into a single target domain.
 */
const mergeDomains = (domains: PackDomain[]): PackDomain[] => {
    const readingDomainNames = ["Reading & Language Arts", "Reading", "Writing"];
    const mathDomainNames = ["Mathematics", "Math"];

    const domainsToMerge: Record<string, PackDomain[]> = {
        "Reading & Language Arts": [],
        "Mathematics": [],
    };
    const otherDomains: PackDomain[] = [];
    
    for (const domain of domains) {
        if (readingDomainNames.includes(domain.name)) {
            domainsToMerge["Reading & Language Arts"].push(domain);
        } else if (mathDomainNames.includes(domain.name)) {
            domainsToMerge["Mathematics"].push(domain);
        } else {
            otherDomains.push(domain);
        }
    }

    const mergedResult: PackDomain[] = [];
    for (const mergedName in domainsToMerge) {
        const domainGroup = domainsToMerge[mergedName];
        if (domainGroup.length === 0) continue;

        const baseDomain = domainGroup.find(d => d.name === mergedName) || domainGroup[0];

        const newDomain: PackDomain = {
            name: mergedName,
            color: baseDomain.color,
            subdomains: [],
        };

        const subdomainMap: Record<string, { name: string; items: any[] }> = {};
        for (const domain of domainGroup) {
            for (const subdomain of domain.subdomains) {
                if (!subdomainMap[subdomain.name]) {
                    subdomainMap[subdomain.name] = { name: subdomain.name, items: [] };
                }
                subdomainMap[subdomain.name].items.push(...subdomain.items);
            }
        }
        newDomain.subdomains = Object.values(subdomainMap);
        mergedResult.push(newDomain);
    }

    return [...mergedResult, ...otherDomains];
};


/**
 * Adapts the raw pack data into the Domain[] structure used by the UI.
 */
export const adaptPackToDomains = (pack: Pack): Domain[] => {
  const finalDomains: Domain[] = [];
  const processedDomains = mergeDomains(pack.domains);

  for (const domain of processedDomains) {
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