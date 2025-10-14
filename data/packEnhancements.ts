// data/packEnhancements.ts
// This script programmatically enhances the base content pack to ensure
// depth in key areas and add new activities as requested.

type Grade = "K" | "1" | "2";
type Pack = {
  domains: Array<{
    name: string;
    subdomains: Array<{
      name: string;
      items: any[];
    }>;
  }>;
};

const GRADES: Grade[] = ["K", "1", "2"];
const gid = (...parts: string[]) => parts.join('_').replace(/\s+/g, '_').toLowerCase();

// --- Tiny Helper Functions ---

function clonePack(base: Pack): Pack {
  return JSON.parse(JSON.stringify(base));
}

function getOrCreateSubdomain(pack: Pack, domainName: string, subdomainName: string) {
  const domain = pack.domains.find(d => d.name === domainName);
  if (!domain) {
    throw new Error(`Domain "${domainName}" not found in pack.`);
  }
  let subdomain = domain.subdomains.find(sd => sd.name === subdomainName);
  if (!subdomain) {
    subdomain = { name: subdomainName, items: [] };
    domain.subdomains.push(subdomain);
  }
  return subdomain;
}

// --- Seed Item Factories ---

// These create new, unique items to be added to the pack.

const lifeCycleSeeds = (grade: Grade) => ([
  {
    id: gid('sci', grade, 'lifecyc', 'stem_parts_v3'),
    title: "Plant Parts: Stem",
    prompt: "Which part of a plant holds it up and carries water to the leaves?",
    grade,
    type: "virtual",
    introText: "A stem holds the plant up and carries water from roots to leaves. Leaves make food using sunlight.",
    responseOptions: ["The Stem", "The Flower", "The Roots", "The Seeds"],
    correctAnswerIndex: 0,
  },
  {
    id: gid('sci', grade, 'lifecyc', 'butterfly_seq_v3'),
    title: "Butterfly Sequence",
    prompt: "What is the correct order for a butterfly's life cycle?",
    grade,
    type: "virtual",
    introText: "A butterfly’s life cycle goes egg → caterpillar → chrysalis → butterfly. This big change is called metamorphosis.",
    responseOptions: [
      "Egg → Caterpillar → Chrysalis → Butterfly",
      "Egg → Butterfly → Caterpillar → Chrysalis",
      "Caterpillar → Egg → Butterfly → Chrysalis",
      "Chrysalis → Butterfly → Egg → Caterpillar"
    ],
    correctAnswerIndex: 0,
  }
]);

const dataDetectiveSeeds = (grade: Grade) => {
    // FIX: Explicitly type `seeds` as `any[]` to prevent incorrect type inference.
    // The TypeScript compiler was inferring the `visual.data` type based on the initial
    // `bar-chart` items, causing a conflict when a `line-plot` item was added.
    const seeds: any[] = [
        {
            id: gid('math', grade, 'data', 'bar_chart_v3'),
            title: "Bar Chart: Favorite Colors",
            prompt: "According to the bar chart, which color is the most popular?",
            grade,
            type: "virtual",
            responseOptions: ["Red", "Blue", "Green", "Yellow"],
            correctAnswerIndex: 1,
            visual: { type: "bar-chart", data: [{label: "Red", value: 4}, {label: "Blue", value: 7}, {label: "Green", value: 5}] }
        },
        {
            id: gid('math', grade, 'data', 'tally_marks_v3'),
            title: "Tally Marks: Counting Votes",
            prompt: "How many votes did 'Pizza' get based on the tally marks?",
            grade,
            type: "virtual",
            responseOptions: ["5", "7", "8", "10"],
            correctAnswerIndex: 2,
            visual: { type: "bar-chart", data: [{ label: "Votes for Pizza (Tally)", value: 8 }] } // visual is just for show
        }
    ];
    if (grade === '2') {
        seeds.push({
             id: gid('math', grade, 'data', 'line_plot_v3'),
            title: "Line Plot: Pencil Lengths",
            prompt: "What is the most common pencil length shown on the line plot?",
            grade: '2',
            type: "virtual",
            responseOptions: ["4 inches", "5 inches", "6 inches", "7 inches"],
            correctAnswerIndex: 1,
            visual: { type: "line-plot", unit: 'inches', data: [ {value: 4, count: 2}, {value: 5, count: 4}, {value: 6, count: 3} ] }
        });
    }
    return seeds;
};

const socialStudiesSeeds = (subdomain: 'Geography' | 'Civics & Community', grade: Grade) => {
    if (subdomain === 'Geography') {
        return [{
            id: gid('ss', grade, 'geo', 'map_key_v3'),
            title: "Map Key Use",
            prompt: "If a star symbol on a map key means 'Capital City', what does the star on the map show?",
            grade, type: 'virtual', responseOptions: ["A park", "A river", "The Capital City", "A house"], correctAnswerIndex: 2
        }];
    }
    // Civics
    return [{
        id: gid('ss', grade, 'civics', 'good_citizen_v3'),
        title: "Good Citizen Action",
        prompt: "Which of these is an example of being a good citizen in your community?",
        grade, type: 'virtual', responseOptions: ["Helping clean up a park", "Ignoring rules", "Making a lot of noise", "Wasting water"], correctAnswerIndex: 0
    }];
};

const selSeeds = (subdomain: 'Emotions & Collaboration' | 'Planning & Organization' | 'Working Memory', grade: Grade) => {
    if (subdomain === 'Emotions & Collaboration') {
        return [{
            id: gid('sel', grade, 'emo', 'empathy_v3'),
            title: "Showing Empathy",
            prompt: "Your friend seems sad. What is a kind thing to do?",
            grade, type: 'virtual', responseOptions: ["Laugh", "Ask 'Are you okay?'", "Walk away", "Take their toy"], correctAnswerIndex: 1
        }];
    }
    if (subdomain === 'Planning & Organization') {
        return [{
            id: gid('sel', grade, 'plan', 'first_step_v3'),
            title: "First Step",
            prompt: "What is the first step you should take before starting your homework?",
            grade, type: 'virtual', responseOptions: ["Play a game", "Watch TV", "Read the directions", "Take a nap"], correctAnswerIndex: 2
        }];
    }
    // Working Memory
    return [{
        id: gid('sel', grade, 'workmem', 'recall_v3'),
        title: "Recall Directions",
        prompt: "Listen: First, get a red crayon, then get a blue crayon. What should you get first?",
        grade, type: 'virtual', responseOptions: ["A blue crayon", "A red crayon", "A pencil", "A book"], correctAnswerIndex: 1
    }]
};


// --- The Main Enhancement Function ---

export function applyPackEnhancements(base: Pack): Pack {
  const pack = clonePack(base);

  // --- 1. Add new seed items ---
  for (const grade of GRADES) {
    // Add new Science items
    const lifeCyclesSubdomain = getOrCreateSubdomain(pack, 'Science', 'Life Cycles');
    lifeCycleSeeds(grade).forEach(seed => {
      if (!lifeCyclesSubdomain.items.some(item => item.id === seed.id)) {
        lifeCyclesSubdomain.items.push(seed);
      }
    });
  }

  // --- 2. Pad sections to 10 items per grade ---
  for (const grade of GRADES) {
    // Math -> Data Detective
    const mathSubdomain = getOrCreateSubdomain(pack, 'Mathematics', 'Measurement & Data');
    const dataDetectiveItems = mathSubdomain.items.filter(item => 
        item.grade === grade &&
        item.type === 'virtual' &&
        (['bar-chart', 'line-plot'].includes(item.visual?.type) || item.title?.toLowerCase().includes('tally'))
    );
    let itemsToAdd = 10 - dataDetectiveItems.length;
    let seedIndex = 0;
    while (itemsToAdd > 0) {
        const seeds = dataDetectiveSeeds(grade);
        const seed = seeds[seedIndex % seeds.length];
        // FIX: Convert `itemsToAdd` to a string as `gid` expects string arguments.
        const newItem = { ...seed, id: gid(seed.id, 'pad', itemsToAdd.toString()) };
        mathSubdomain.items.push(newItem);
        itemsToAdd--;
        seedIndex++;
    }

    // Science -> Life Cycles
    const lifeCyclesSubdomain = getOrCreateSubdomain(pack, 'Science', 'Life Cycles');
    const lifeCyclesVirtualItems = lifeCyclesSubdomain.items.filter(i => i.grade === grade && i.type === 'virtual');
    itemsToAdd = 10 - lifeCyclesVirtualItems.length;
    seedIndex = 0;
    while (itemsToAdd > 0) {
        const seeds = lifeCycleSeeds(grade);
        const seed = seeds[seedIndex % seeds.length];
        // FIX: Convert `itemsToAdd` to a string as `gid` expects string arguments.
        const newItem = { ...seed, id: gid(seed.id, 'pad', itemsToAdd.toString()) };
        lifeCyclesSubdomain.items.push(newItem);
        itemsToAdd--;
        seedIndex++;
    }

    // Social Studies -> Geography
    const geoSubdomain = getOrCreateSubdomain(pack, 'Social Studies', 'Geography');
    const geoVirtualItems = geoSubdomain.items.filter(i => i.grade === grade && i.type === 'virtual');
    itemsToAdd = 10 - geoVirtualItems.length;
    seedIndex = 0;
    while (itemsToAdd > 0) {
        const seeds = socialStudiesSeeds('Geography', grade);
        const seed = seeds[seedIndex % seeds.length];
        // FIX: Convert `itemsToAdd` to a string as `gid` expects string arguments.
        const newItem = { ...seed, id: gid(seed.id, 'pad', itemsToAdd.toString()) };
        geoSubdomain.items.push(newItem);
        itemsToAdd--;
        seedIndex++;
    }

     // Social Studies -> Civics
    const civicsSubdomain = getOrCreateSubdomain(pack, 'Social Studies', 'Civics & Community');
    const civicsVirtualItems = civicsSubdomain.items.filter(i => i.grade === grade && i.type === 'virtual');
    itemsToAdd = 10 - civicsVirtualItems.length;
    seedIndex = 0;
    while (itemsToAdd > 0) {
        const seeds = socialStudiesSeeds('Civics & Community', grade);
        const seed = seeds[seedIndex % seeds.length];
        // FIX: Convert `itemsToAdd` to a string as `gid` expects string arguments.
        const newItem = { ...seed, id: gid(seed.id, 'pad', itemsToAdd.toString()) };
        civicsSubdomain.items.push(newItem);
        itemsToAdd--;
        seedIndex++;
    }

    // SEL/EF sections
    const selSubdomains = ['Emotions & Collaboration', 'Planning & Organization', 'Working Memory'];
    for (const subName of selSubdomains) {
        const selSubdomain = getOrCreateSubdomain(pack, 'Social-Emotional & Executive Functioning', subName);
        const selItems = selSubdomain.items.filter(i => i.grade === grade);
        itemsToAdd = 10 - selItems.length;
        seedIndex = 0;
        while (itemsToAdd > 0) {
            const seeds = selSeeds(subName as any, grade);
            const seed = seeds[seedIndex % seeds.length];
            // FIX: Convert `itemsToAdd` to a string as `gid` expects string arguments.
            const newItem = { ...seed, id: gid(seed.id, 'pad', itemsToAdd.toString()) };
            selSubdomain.items.push(newItem);
            itemsToAdd--;
            seedIndex++;
        }
    }
  }

  return pack;
}
