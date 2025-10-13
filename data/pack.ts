// data/pack.ts
// This file contains the full educational content pack for the application.

export const packData = {
  "meta": {
    "name": "K2 Master Pack — Sophia (Expanded)",
    "version": "2.1"
  },
  "progressTracking": {
    "scoreScale": "0-100%",
    "saveLocally": true,
    "secureThreshold": 80
  },
  "domains": [
    {
      "name": "Reading & Language Arts",
      "color": "#A7C7A3",
      "subdomains": [
        {
          "name": "Reading Comprehension",
          "items": [
            {
              "id": "rl-readcomp-K-1",
              "title": "Picture Match",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, look at the picture and choose the matching sentence.",
              "responseOptions": ["The cat is on the mat.", "The dog is on the mat.", "The cat is under the mat.", "The cat is flying"], "correctAnswerIndex": 0
            },
            {
              "id": "rl-readcomp-K-2",
              "title": "Who?",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, listen and choose who the story was about.",
              "responseOptions": ["A bus", "A hat", "A cat", "A tree"], "correctAnswerIndex": 2
            },
            {
              "id": "rl-readcomp-K-3",
              "title": "Where?",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, listen and choose where it happened.",
              "responseOptions": ["At the beach", "In space", "At home", "In a cave"], "correctAnswerIndex": 2
            },
            {
              "id": "rl-readcomp-K-4",
              "title": "First-Then",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, choose what happened first.",
              "responseOptions": ["The boy woke up.", "He drove a car.", "He ate dinner.", "He went to sleep."], "correctAnswerIndex": 0
            },
            {
              "id": "rl-readcomp-K-5",
              "title": "Feeling Check",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, choose how the girl felt at the end.",
              "responseOptions": ["Confused", "Angry", "Scared", "Happy"], "correctAnswerIndex": 3
            },
            {
              "id": "rl-readcomp-1-1",
              "title": "Main Character",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, read and choose the main character.",
              "responseOptions": ["The park", "Maya", "A bike", "A squirrel"], "correctAnswerIndex": 1
            },
            {
              "id": "rl-readcomp-1-2",
              "title": "Setting",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, read and choose the setting.",
              "responseOptions": ["A castle", "The playground", "The desert", "The moon"], "correctAnswerIndex": 1
            },
            {
              "id": "rl-readcomp-1-3",
              "title": "Main Idea",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, read and choose the main idea.",
              "responseOptions": ["Planting seeds helps them grow.", "Dogs need bones.", "Kites are fish.", "Winter is hot."], "correctAnswerIndex": 0
            },
            {
              "id": "rl-readcomp-1-4",
              "title": "Sequence",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, choose what comes next.",
              "responseOptions": ["They fly a kite.", "They sleep.", "They eat the plant.", "They water the plant."], "correctAnswerIndex": 3
            },
            {
              "id": "rl-readcomp-1-5",
              "title": "Why",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, choose why the boy said thank you.",
              "responseOptions": ["He lost a shoe.", "Someone helped him.", "He was sleeping.", "It rained."], "correctAnswerIndex": 1
            },
            {
              "id": "rl-readcomp-2-1",
              "title": "Main Idea 2",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, read and choose the best main idea.",
              "responseOptions": ["A dog learns to swim at the lake.", "A dog gets lost.", "A cat climbs a tree.", "A bird builds a nest."], "correctAnswerIndex": 0
            },
            {
              "id": "rl-readcomp-2-2",
              "title": "Detail",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose a key detail.",
              "responseOptions": ["The lake water was cold.", "It was Tuesday.", "The tree wore shoes.", "The car was purple."], "correctAnswerIndex": 0
            },
            {
              "id": "rl-readcomp-2-3",
              "title": "Problem",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose the problem.",
              "responseOptions": ["The dog was afraid of water.", "There was no air.", "The dog could fly.", "The lake vanished."], "correctAnswerIndex": 0
            },
            {
              "id": "rl-readcomp-2-4",
              "title": "Solution",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose how the problem was solved.",
              "responseOptions": ["They ate cookies.", "They practiced in shallow water.", "They stopped reading.", "They used a spaceship."], "correctAnswerIndex": 1
            },
            {
              "id": "rl-readcomp-2-5",
              "title": "Prediction",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose what might happen next.",
              "responseOptions": ["The lake turns to sand.", "The dog will try deeper water.", "The cat drives home.", "The dog becomes a bird."], "correctAnswerIndex": 1
            }
          ]
        },
        {
          "name": "Reading Fluency",
          "items": [
            {"id": "rl-fluency-K-1", "title": "Read Aloud (K)", "type": "recording", "grade": "K", "prompt": "Read aloud: Mia has a red bag. She hops to the bus. The bus is big. Mia sees her pal. They grin and sit."},
            {"id": "rl-fluency-1-1", "title": "Read Aloud (1)", "type": "recording", "grade": "1", "prompt": "Read aloud: Jamal wakes up early. He packs his blue backpack and walks to school. On the way he counts three dogs and two bikes."},
            {"id": "rl-fluency-2-1", "title": "Read Aloud (2)", "type": "recording", "grade": "2", "prompt": "Read aloud: Sara plants seeds in a pot. She adds water and puts the pot by a sunny window. Each day she checks for a sprout."}
          ]
        },
        {
          "name": "Writing & Grammar",
          "items": [
            {
              "id": "rl-writegram-K-1",
              "title": "Sentence Build",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, choose the correct sentence.",
              "responseOptions": ["i see a dog", "I see a Dog", "i See a dog", "I see a dog."], "correctAnswerIndex": 3
            },
            {
              "id": "rl-writegram-K-2",
              "title": "Capital/Period",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, choose the sentence with a capital and period.",
              "responseOptions": ["tom runs.", "Tom runs", "Tom runs.", "tom runs"], "correctAnswerIndex": 2
            },
            {
              "id": "rl-writegram-K-3",
              "title": "Noun/Verb",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, choose the noun.",
              "responseOptions": ["blue", "run", "quickly", "cat"], "correctAnswerIndex": 3
            },
            {
              "id": "rl-writegram-K-4",
              "title": "Spacing",
              "type": "virtual", "grade": "K",
              "prompt": "Sophia, choose the sentence with spaces.",
              "responseOptions": ["I like cake.", "Il ikec ake.", "Ili kec ake.", "Ilikecake."], "correctAnswerIndex": 0
            },
            { "id": "rl-writegram-K-5", "title": "Draw & Tell", "type": "recording", "grade": "K", "prompt": "Sophia, draw and tell about your picture; mark complete." },
            {
              "id": "rl-writegram-1-1",
              "title": "Complete Sentence",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, choose the complete sentence.",
              "responseOptions": ["Went to park.", "To the.", "Park we.", "We went to the park."], "correctAnswerIndex": 3
            },
            {
              "id": "rl-writegram-1-2",
              "title": "Contractions",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, choose 'do not' as a contraction.",
              "responseOptions": ["don't", "dont", "do'nt", "do.nt"], "correctAnswerIndex": 0
            },
            {
              "id": "rl-writegram-1-3",
              "title": "Commas List",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, choose the correct list.",
              "responseOptions": ["I need, paper glue and scissors.", "I need paper, glue, and scissors.", "I need paper glue and, scissors.", "I need paper glue, and, scissors."], "correctAnswerIndex": 1
            },
            {
              "id": "rl-writegram-1-4",
              "title": "Pronouns",
              "type": "virtual", "grade": "1",
              "prompt": "Sophia, choose the correct pronoun for Maya.",
              "responseOptions": ["they (plural)", "it", "he", "she"], "correctAnswerIndex": 3
            },
            {
              "id": "rl-writegram-1-5",
              "title": "Story Write",
              "type": "offline", "grade": "1",
              "prompt": "Sophia, write 3–4 connected sentences about a fun day. Use the sentence stems to help you start!",
              "sentenceStems": ["One time I...", "First, we...", "Then, I saw...", "It was fun because..."]
            },
            { "id": "rl-quickwrite-K-1", "title": "Quick Write (K)", "type": "offline", "grade": "K", "prompt": "Quick Write about recess. Use at least one stem.", "timedSeconds": 60, "sentenceStems": ["At recess I like to", "My friend and I", "I feel happy when", "Next time I will"] },
            { "id": "rl-quickwrite-1-1", "title": "Quick Write (1)", "type": "offline", "grade": "1", "prompt": "Quick write for one minute using at least one stem.", "timedSeconds": 60, "sentenceStems": ["One time I learned", "First I", "Then I", "Finally I", "I think"] },
            { "id": "rl-quickwrite-2-1", "title": "Quick Write (2)", "type": "offline", "grade": "2", "prompt": "Quick write about your goal. Use at least one stem.", "timedSeconds": 60, "sentenceStems": ["My goal is", "First I will", "This matters because", "One challenge is", "I can improve by"] },
            {
              "id": "rl-writegram-2-1",
              "title": "Past Tense",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose the past tense of run.",
              "responseOptions": ["running", "ran", "runned", "runs"], "correctAnswerIndex": 1
            },
            {
              "id": "rl-writegram-2-2",
              "title": "Quotation Marks",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose the sentence with quotes used correctly.",
              "responseOptions": ["“Maya said, I won.”", "Maya said I won.”", "Maya said “I won”.", "Maya said, “I won.”"], "correctAnswerIndex": 3
            },
            {
              "id": "rl-writegram-2-3",
              "title": "Point of View",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose first person.",
              "responseOptions": ["You walk home.", "They will walk.", "I walked home.", "She walks home."], "correctAnswerIndex": 2
            },
            {
              "id": "rl-writegram-2-4",
              "title": "Informational",
              "type": "virtual", "grade": "2",
              "prompt": "Sophia, choose the best fact for a report on frogs.",
              "responseOptions": ["Frogs taste like pizza.", "Frogs are robots.", "Frogs are planets.", "Frogs are amphibians."], "correctAnswerIndex": 3
            },
            { "id": "rl-writegram-2-5", "title": "Revise/Edit", "type": "offline", "grade": "2", "prompt": "Ask Sophia to revise a paragraph she wrote. Use a simple checklist together: 1. Does every sentence start with a capital letter? 2. Does every sentence end with a punctuation mark (. ! ?)? 3. Does it make sense when you read it aloud? Mark complete when you've reviewed it together."}
          ]
        }
      ]
    },
    {
      "name": "Mathematics",
      "color": "#F6E89A",
      "subdomains": [
        {
          "name": "Number Sense",
          "items": [
            { "id": "ma-numsense-K-1", "title": "Count Objects", "type": "virtual", "grade": "K", "prompt": "Sophia, choose how many apples you see.", "visual": { "type": "count", "item": "apple", "count": 7 }, "responseOptions": ["6", "10", "7", "8"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-K-2", "title": "Number Match", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the number that matches 'five'.", "responseOptions": ["6", "7", "4", "5"], "correctAnswerIndex": 3 },
            { "id": "ma-numsense-K-3", "title": "Order", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the smallest number.", "responseOptions": ["2", "8", "9", "6"], "correctAnswerIndex": 0 },
            { "id": "ma-numsense-K-4", "title": "Before/After", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the number after 9.", "responseOptions": ["10", "11", "8", "7"], "correctAnswerIndex": 0 },
            { "id": "ma-numsense-K-6", "title": "Count Objects 2", "type": "virtual", "grade": "K", "prompt": "Sophia, how many dots do you see?", "visual": { "type": "count", "item": "dot", "count": 9 }, "responseOptions": ["8", "10", "9", "7"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-K-7", "title": "Which is Greater?", "type": "virtual", "grade": "K", "prompt": "Sophia, which number is bigger?", "responseOptions": ["8", "3", "Both are same", "Neither"], "correctAnswerIndex": 0 },
            { "id": "ma-numsense-K-8", "title": "Count Objects 3", "type": "virtual", "grade": "K", "prompt": "Sophia, how many apples do you see?", "visual": { "type": "count", "item": "apple", "count": 12 }, "responseOptions": ["10", "11", "12", "13"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-K-9", "title": "What Comes Before?", "type": "virtual", "grade": "K", "prompt": "Sophia, what number comes right before 7?", "responseOptions": ["5", "6", "8", "7"], "correctAnswerIndex": 1 },
            { "id": "ma-numsense-K-10", "title": "Number Word Match 2", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the number that matches 'three'.", "responseOptions": ["2", "4", "3", "5"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-K-11", "title": "Counting Forward", "type": "virtual", "grade": "K", "prompt": "Sophia, what number comes next: 4, 5, 6, __.", "responseOptions": ["8", "7", "5", "6"], "correctAnswerIndex": 1 },
            { "id": "ma-numsense-K-5", "title": "Count to 20", "type": "recording", "grade": "K", "prompt": "Sophia, count aloud to 20; mark complete." },
            { "id": "ma-numsense-1-1", "title": "Place Value 10s", "type": "virtual", "grade": "1", "prompt": "Sophia, choose how many tens in 40.", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "40", "tens": 4 }] }, "responseOptions": ["40", "4", "3", "5"], "correctAnswerIndex": 1 },
            { "id": "ma-numsense-1-2", "title": "Compare", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the true statement.", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "9", "ones": 9 }, { "label": "12", "tens": 1, "ones": 2 }] }, "responseOptions": ["9 > 12", "9 = 12", "12 > 9", "12 = 9"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-1-3", "title": "Skip Count 2s", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the next number: 2, 4, 6, __.", "responseOptions": ["9", "7", "8", "10"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-1-4", "title": "Expanded Form", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the expanded form of 36.", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "36", "tens": 3, "ones": 6 }] }, "responseOptions": ["3 + 6", "300 + 6", "30 + 6", "30 + 60"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-1-6", "title": "Skip Count 5s", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the next number: 5, 10, 15, __.", "responseOptions": ["16", "25", "20", "30"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-1-7", "title": "10 More", "type": "virtual", "grade": "1", "prompt": "Sophia, what is 10 more than 45?", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "45", "tens": 4, "ones": 5 }] }, "responseOptions": ["46", "35", "55", "450"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-1-8", "title": "10 Less", "type": "virtual", "grade": "1", "prompt": "Sophia, what is 10 less than 62?", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "62", "tens": 6, "ones": 2 }] }, "responseOptions": ["61", "72", "52", "6.2"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-1-9", "title": "Compare 2-digit", "type": "virtual", "grade": "1", "prompt": "Sophia, which number is smaller: 81 or 18?", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "81", "tens": 8, "ones": 1 }, { "label": "18", "tens": 1, "ones": 8 }] }, "responseOptions": ["81", "18", "They are the same", "Neither"], "correctAnswerIndex": 1 },
            { "id": "ma-numsense-1-10", "title": "Skip Count 10s", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the next number: 30, 40, 50, __.", "responseOptions": ["51", "70", "100", "60"], "correctAnswerIndex": 3 },
            { "id": "ma-numsense-1-11", "title": "Place Value - Tens and Ones", "type": "virtual", "grade": "1", "prompt": "Sophia, how many ones are in the number 57?", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "57", "tens": 5, "ones": 7 }] }, "responseOptions": ["5", "7", "50", "12"], "correctAnswerIndex": 1 },
            { "id": "ma-numsense-1-5", "title": "Hundreds Chart", "type": "offline", "grade": "1", "prompt": "Sophia, on a hundreds chart, point to 10 different numbers an adult calls out (e.g., 15, 42, 99); mark complete." },
            { "id": "ma-numsense-2-1", "title": "Read/Write 1000", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the number 'four hundred three'.", "responseOptions": ["403", "430", "340", "304"], "correctAnswerIndex": 0 },
            { "id": "ma-numsense-2-2", "title": "Place Value H/T/O", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the value of the 7 in 572.", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "572", "hundreds": 5, "tens": 7, "ones": 2 }] }, "responseOptions": ["700", "7", "0.7", "70"], "correctAnswerIndex": 3 },
            { "id": "ma-numsense-2-3", "title": "Compare 3-digit", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the greater number.", "responseOptions": ["568", "586", "658", "856"], "correctAnswerIndex": 3 },
            { "id": "ma-numsense-2-4", "title": "Rounding (intro)", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the nearest ten for 48.", "visual": { "type": "number-line", "min": 40, "max": 50, "highlight": 48 }, "responseOptions": ["50", "45", "60", "40"], "correctAnswerIndex": 0 },
            { "id": "ma-numsense-2-6", "title": "Expanded Form 2", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the expanded form of 281.", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "281", "hundreds": 2, "tens": 8, "ones": 1 }] }, "responseOptions": ["200 + 8 + 1", "20 + 80 + 1", "200 + 80 + 1", "2 + 8 + 1"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-2-7", "title": "Odd/Even", "type": "virtual", "grade": "2", "prompt": "Sophia, which of these numbers is even?", "responseOptions": ["13", "21", "7", "30"], "correctAnswerIndex": 3 },
            { "id": "ma-numsense-2-8", "title": "Compare 3-digit 2", "type": "virtual", "grade": "2", "prompt": "Sophia, which statement is true?", "visual": { "type": "base-ten-blocks", "numbers": [{ "label": "345", "hundreds": 3, "tens": 4, "ones": 5 }, { "label": "354", "hundreds": 3, "tens": 5, "ones": 4 }] }, "responseOptions": ["345 > 354", "345 < 354", "345 = 354", "453 < 354"], "correctAnswerIndex": 1 },
            { "id": "ma-numsense-2-9", "title": "Skip count by 100s", "type": "virtual", "grade": "2", "prompt": "Sophia, what number comes next: 250, 350, 450, __.", "responseOptions": ["460", "500", "550", "650"], "correctAnswerIndex": 2 },
            { "id": "ma-numsense-2-10", "title": "Place Value Puzzle", "type": "virtual", "grade": "2", "prompt": "Sophia, what number has 4 hundreds, 0 tens, and 8 ones?", "responseOptions": ["480", "408", "804", "48"], "correctAnswerIndex": 1 },
            { "id": "ma-numsense-2-11", "title": "Rounding 2", "type": "virtual", "grade": "2", "prompt": "Sophia, what is 88 rounded to the nearest ten?", "visual": { "type": "number-line", "min": 80, "max": 90, "highlight": 88 }, "responseOptions": ["80", "85", "100", "90"], "correctAnswerIndex": 3 },
            { "id": "ma-numsense-2-5", "title": "Number Line", "type": "offline", "grade": "2", "prompt": "Sophia, place 375 on the line; mark complete." }
          ]
        },
        {
          "name": "Measurement & Data",
          "items": [
            { "id": "ma-measdata-K-1", "title": "Length Compare", "type": "virtual", "grade": "K", "prompt": "Sophia, choose which is longer.", "visual": { "type": "compare-images", "items": ["seed", "button", "pencil", "paper_clip"], "options": ["Seed", "Button", "Pencil", "Paper clip"] }, "responseOptions": ["Seed", "Button", "Pencil", "Paper clip"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-K-2", "title": "Weight Compare", "type": "virtual", "grade": "K", "prompt": "Sophia, choose which is heavier.", "visual": { "type": "compare-images", "items": ["note", "feather", "book", "leaf"], "options": ["Note", "Feather", "Book", "Leaf"] }, "responseOptions": ["Note", "Feather", "Book", "Leaf"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-K-3", "title": "Coins ID", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the penny.", "responseOptions": ["Quarter", "Penny", "Dime", "Nickel"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-K-4", "title": "Time Sense", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the morning activity.", "responseOptions": ["Go to bed", "Turn on porch light", "Eat breakfast", "See stars"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-K-6", "title": "Capacity Compare", "type": "virtual", "grade": "K", "prompt": "Sophia, which container holds the most water?", "visual": { "type": "compare-images", "items": ["cup", "spoon", "bucket", "thimble"], "options": ["Cup", "Spoon", "Bucket", "Thimble"] }, "responseOptions": ["Cup", "Spoon", "Bucket", "Thimble"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-K-7", "title": "Coins ID 2", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the dime.", "responseOptions": ["Quarter", "Penny", "Dime", "Nickel"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-K-8", "title": "Coins ID 3", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the nickel.", "responseOptions": ["Quarter", "Penny", "Dime", "Nickel"], "correctAnswerIndex": 3 },
            { "id": "ma-measdata-K-9", "title": "Coins ID 4", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the quarter.", "responseOptions": ["Quarter", "Penny", "Dime", "Nickel"], "correctAnswerIndex": 0 },
            { "id": "ma-measdata-K-10", "title": "Time Sense 2", "type": "virtual", "grade": "K", "prompt": "Sophia, which activity takes longer?", "responseOptions": ["Brushing your teeth", "Sleeping at night", "Clapping your hands", "Tying a shoe"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-K-5", "title": "Sort Data", "type": "offline", "grade": "K", "prompt": "Sophia, sort objects by color and mark complete." },
            { "id": "ma-measdata-1-1", "title": "Ruler Use", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the best tool to measure length.", "responseOptions": ["Clock", "Ruler", "Scale", "Thermometer"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-1-2", "title": "Time Half-Hour", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the clock that shows 3:30.", "visual": { "type": "clocks", "options": ["12:15", "6:00", "3:30", "9:00"], "labels": ["Clock A", "Clock B", "Clock C", "Clock D"] }, "responseOptions": ["Clock D", "Clock C", "Clock B", "Clock A"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-1-3", "title": "Coin Value", "type": "virtual", "grade": "1", "prompt": "Sophia, what is the total of one quarter and one dime?", "visual": { "type": "coins", "coins": ["quarter", "dime"] }, "responseOptions": ["30¢", "35¢", "45¢", "40¢"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-1-4", "title": "Bar Graph", "type": "virtual", "grade": "1", "prompt": "Sophia, look at the graph. Which animal is there more of?", "visual": { "type": "bar-chart", "data": [{ "label": "Cats", "value": 3 }, { "label": "Dogs", "value": 5 }] }, "responseOptions": ["Cats", "They are equal", "Dogs", "Neither"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-1-6", "title": "Time to the Hour", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the clock that shows 8:00.", "visual": { "type": "clocks", "options": ["8:00", "8:30", "7:00", "12:08"], "labels": ["Clock A", "Clock B", "Clock C", "Clock D"] }, "responseOptions": ["Clock A", "Clock B", "Clock C", "Clock D"], "correctAnswerIndex": 0 },
            { "id": "ma-measdata-1-7", "title": "Coin Value 2", "type": "virtual", "grade": "1", "prompt": "Sophia, what is the total of 1 dime, 1 nickel, and 1 penny?", "visual": { "type": "coins", "coins": ["dime", "nickel", "penny"] }, "responseOptions": ["15¢", "16¢", "21¢", "11¢"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-1-8", "title": "Bar Graph 2", "type": "virtual", "grade": "1", "prompt": "Sophia, how many more dogs than cats are there?", "visual": { "type": "bar-chart", "data": [{ "label": "Cats", "value": 3 }, { "label": "Dogs", "value": 5 }] }, "responseOptions": ["1", "2", "3", "8"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-1-9", "title": "Coin Value 3", "type": "virtual", "grade": "1", "prompt": "Sophia, what is the total of 3 dimes?", "visual": { "type": "coins", "coins": ["dime", "dime", "dime"] }, "responseOptions": ["15¢", "30¢", "3¢", "25¢"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-1-10", "title": "Time Half-Hour 2", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the clock that shows 11:30.", "visual": { "type": "clocks", "options": ["11:00", "1:30", "10:30", "11:30"], "labels": ["Clock A", "Clock B", "Clock C", "Clock D"] }, "responseOptions": ["Clock A", "Clock B", "Clock C", "Clock D"], "correctAnswerIndex": 3 },
            { "id": "ma-measdata-1-11", "title": "Bar Graph 3", "type": "virtual", "grade": "1", "prompt": "Sophia, how many pets are there in total?", "visual": { "type": "bar-chart", "data": [{ "label": "Cats", "value": 3 }, { "label": "Dogs", "value": 5 }] }, "responseOptions": ["2", "5", "8", "3"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-1-12", "title": "Bar Graph 4", "type": "virtual", "grade": "1", "prompt": "Sophia, which flavor was chosen by the fewest people?", "visual": { "type": "bar-chart", "data": [{ "label": "Vanilla", "value": 6 }, { "label": "Chocolate", "value": 9 }, { "label": "Strawberry", "value": 4 }] }, "responseOptions": ["Vanilla", "Chocolate", "Strawberry", "All are equal"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-1-5", "title": "Measure Task", "type": "offline", "grade": "1", "prompt": "Sophia, measure 3 items at home; mark complete." },
            { "id": "ma-measdata-2-1", "title": "Time to 5", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the time shown on the clock.", "visual": { "type": "clock-face", "time": "4:25" }, "responseOptions": ["4:30", "5:25", "4:20", "4:25"], "correctAnswerIndex": 3 },
            { "id": "ma-measdata-2-2", "title": "Money Sum", "type": "virtual", "grade": "2", "prompt": "Sophia, which set of coins makes 75¢?", "responseOptions": ["2 quarters + dime", "1 quarter + 5 nickels", "7 dimes", "3 quarters"], "correctAnswerIndex": 3 },
            { "id": "ma-measdata-2-3", "title": "Line Plot", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the most common length.", "visual": { "type": "line-plot", "unit": "cm", "data": [{ "value": 3, "count": 2 }, { "value": 4, "count": 4 }, { "value": 5, "count": 3 }] }, "responseOptions": ["All equal", "3 cm", "5 cm", "4 cm"], "correctAnswerIndex": 3 },
            { "id": "ma-measdata-2-4", "title": "Units", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the better unit for a road trip.", "responseOptions": ["Millimeters", "Miles", "Inches", "Centimeters"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-2-6", "title": "Elapsed Time", "type": "virtual", "grade": "2", "prompt": "It is 2:10. What time will it be in 15 minutes?", "visual": { "type": "clock-face", "time": "2:10" }, "responseOptions": ["2:20", "2:30", "2:25", "3:10"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-2-7", "title": "Money Sum 2", "type": "virtual", "grade": "2", "prompt": "Sophia, how much is 3 dimes and 2 nickels?", "visual": { "type": "coins", "coins": ["dime", "dime", "dime", "nickel", "nickel"] }, "responseOptions": ["32¢", "40¢", "25¢", "50¢"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-2-8", "title": "Line Plot 2", "type": "virtual", "grade": "2", "prompt": "Sophia, how many items were measured in total?", "visual": { "type": "line-plot", "unit": "cm", "data": [{ "value": 3, "count": 2 }, { "value": 4, "count": 4 }, { "value": 5, "count": 3 }] }, "responseOptions": ["7", "8", "9", "10"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-2-9", "title": "Money Sum 3", "type": "virtual", "grade": "2", "prompt": "Sophia, how much is 2 quarters, 2 dimes, and 3 pennies?", "visual": { "type": "coins", "coins": ["quarter", "quarter", "dime", "dime", "penny", "penny", "penny"] }, "responseOptions": ["73¢", "53¢", "68¢", "78¢"], "correctAnswerIndex": 0 },
            { "id": "ma-measdata-2-10", "title": "Time to 5 mins 2", "type": "virtual", "grade": "2", "prompt": "Sophia, what time does this clock show?", "visual": { "type": "clock-face", "time": "5:50" }, "responseOptions": ["5:50", "10:30", "11:25", "5:10"], "correctAnswerIndex": 0 },
            { "id": "ma-measdata-2-11", "title": "Bar Chart - 2nd Grade", "type": "virtual", "grade": "2", "prompt": "Sophia, according to the chart, which sport is the most popular?", "visual": { "type": "bar-chart", "data": [{ "label": "Soccer", "value": 8 }, { "label": "Baseball", "value": 5 }, { "label": "Dance", "value": 6 }] }, "responseOptions": ["Baseball", "Dance", "Soccer", "They are equal"], "correctAnswerIndex": 2 },
            { "id": "ma-measdata-2-12", "title": "Bar Chart Comparison", "type": "virtual", "grade": "2", "prompt": "Sophia, how many more people chose Soccer than Dance?", "visual": { "type": "bar-chart", "data": [{ "label": "Soccer", "value": 8 }, { "label": "Baseball", "value": 5 }, { "label": "Dance", "value": 6 }] }, "responseOptions": ["1", "2", "3", "14"], "correctAnswerIndex": 1 },
            { "id": "ma-measdata-2-5", "title": "Graph Read 2", "type": "offline", "grade": "2", "prompt": "Sophia, read a graph and answer; mark complete." }
          ]
        }
      ]
    },
    {
      "name": "Science",
      "color": "#B3E5FC",
      "subdomains": [
        {
          "name": "Inquiry & Observation",
          "items": [
            { "id": "sc-inquiry-K-1", "title": "Senses", "type": "virtual", "grade": "K", "prompt": "Sophia, choose which sense you use to taste.", "introText": "We learn about the world using our five senses: sight, smell, hearing, touch, and taste. Our tongue is what we use for tasting delicious foods!", "responseOptions": ["Tongue", "Eyes", "Ears", "Nose"], "correctAnswerIndex": 0 },
            { "id": "sc-inquiry-K-2", "title": "Living/Nonliving", "type": "virtual", "grade": "K", "prompt": "Sophia, choose which is living.", "introText": "Living things can grow, move, and need food and water. Non-living things, like rocks and toys, do not.", "responseOptions": ["Car", "Toy", "Plant", "Rock"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-K-3", "title": "Tool Match", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the tool for a close look at a leaf.", "introText": "Scientists use special tools to help them observe. A magnifying glass is a tool that makes small things look bigger!", "responseOptions": ["Magnifying glass", "Ruler", "Thermometer", "Spoon"], "correctAnswerIndex": 0 },
            { "id": "sc-inquiry-K-4", "title": "Predict", "type": "virtual", "grade": "K", "prompt": "Sophia, which melts faster in sun?", "introText": "Making a prediction is like making a smart guess about what will happen next. Think about what the sun does to things that are cold.", "responseOptions": ["Leaf", "Rock", "Ice", "Paper"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-K-6", "title": "Sink or Swim?", "type": "virtual", "displayType": "sink-or-swim", "grade": "K", "prompt": "Let's be scientists and predict! For each item, guess if it will sink to the bottom or float on the water. Then, test your predictions with a bowl of water!" },
            { "id": "sc-inquiry-K-7", "title": "Sense of Hearing", "type": "virtual", "grade": "K", "prompt": "Which sense helps you hear a bird singing?", "introText": "Our ears are for our sense of hearing. They help us listen to all the sounds around us, like music, voices, and birds chirping.", "responseOptions": ["Smell", "Hearing", "Touch", "Sight"], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-K-8", "title": "Weather Observation", "type": "virtual", "grade": "K", "prompt": "What kind of weather is good for flying a kite?", "introText": "Observing the weather helps us decide what to do and what to wear. Kites need something to push them up into the sky.", "responseOptions": ["Rainy", "Snowy", "Windy", "No wind"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-K-9", "title": "Sorting", "type": "virtual", "grade": "K", "prompt": "Which of these does NOT belong with the others?", "introText": "Sorting is when we put things into groups based on how they are the same. Look for the one item that is different from the others in the group.", "responseOptions": ["Apple", "Banana", "Carrot", "Bicycle"], "correctAnswerIndex": 3 },
            { "id": "sc-inquiry-K-10", "title": "Living/Nonliving 2", "type": "virtual", "grade": "K", "prompt": "Which of these is non-living?", "introText": "Remember, living things grow and need food. Non-living things do not. Let's look at another group of items.", "responseOptions": ["A dog", "A flower", "A chair", "A fish"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-K-11", "title": "Predict 2", "type": "virtual", "grade": "K", "prompt": "What will happen if you leave a crayon in the hot sun?", "introText": "Let's make another scientific prediction! Think about what crayons are made of (wax) and what happens to wax when it gets very warm.", "responseOptions": ["It will melt", "It will freeze", "It will grow", "It will fly away"], "correctAnswerIndex": 0 },
            { "id": "sc-inquiry-K-12", "title": "Sense of Touch", "type": "virtual", "grade": "K", "prompt": "Which sense tells you that a teddy bear is soft?", "introText": "Our sense of touch is in our skin, especially our hands! It helps us feel if things are hot, cold, bumpy, smooth, or soft.", "responseOptions": ["Sight", "Hearing", "Taste", "Touch"], "correctAnswerIndex": 3 },
            { "id": "sc-inquiry-K-5", "title": "Observe Drawing", "type": "offline", "grade": "K", "prompt": "Sophia, draw a leaf you find; mark complete." },
            { "id": "sc-inquiry-1-1", "title": "Hypothesis", "type": "virtual", "grade": "1", "prompt": "A good scientific guess often starts with 'If..., then...'. Which is the best hypothesis?", "introText": "A hypothesis is a smart guess that you can test in an experiment. Scientists often write it as an 'If..., then...' sentence to show what they think will happen.", "responseOptions": ["Plants are green.", "I like sunny days.", "If I give a plant more sun, then it will grow taller.", "Water is wet."], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-1-2", "title": "Measure Tool", "type": "virtual", "grade": "1", "prompt": "Sophia, choose tool to measure temperature.", "introText": "To measure things accurately, scientists use specific tools. A thermometer is the tool we use to see how hot or cold something is.", "responseOptions": ["Clock", "Cup", "Ruler", "Thermometer"], "correctAnswerIndex": 3 },
            { "id": "sc-inquiry-1-3", "title": "Record Method", "type": "virtual", "grade": "1", "prompt": "Sophia, choose a way to record weather.", "introText": "After scientists observe something, they need to record what they saw so they don't forget. A chart is a great way to keep observations organized.", "responseOptions": ["Dance", "Song", "Chart", "Nap"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-1-4", "title": "Prediction", "type": "virtual", "grade": "1", "prompt": "Sophia, if we water a plant daily, choose what may happen.", "introText": "Based on what we know about living things, we can make a prediction. We know that plants are living and need water to survive.", "responseOptions": ["Vanishes", "It grows", "Turns to stone", "Flies"], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-1-6", "title": "Sink or Swim?", "type": "virtual", "displayType": "sink-or-swim", "grade": "1", "prompt": "Let's be scientists and predict! For each item, guess if it will sink to the bottom or float on the water. Then, test your predictions with a bowl of water!" },
            { "id": "sc-inquiry-1-7", "title": "Materials", "type": "virtual", "grade": "1", "prompt": "Which object is made of wood?", "introText": "Everything around us is made of different materials. Wood comes from trees. Other materials are plastic, metal, and glass.", "responseOptions": ["A glass cup", "A metal spoon", "A plastic toy", "A pencil"], "correctAnswerIndex": 3 },
            { "id": "sc-inquiry-1-8", "title": "States of Matter", "type": "virtual", "grade": "1", "prompt": "What happens when water gets very cold?", "introText": "Matter can be a liquid (like water), a solid (like a rock), or a gas (like the air). Water is special because we can easily see it change from one state to another.", "responseOptions": ["It turns into ice (a solid).", "It boils (turns into gas).", "It disappears.", "It turns into juice."], "correctAnswerIndex": 0 },
            { "id": "sc-inquiry-1-9", "title": "Observation vs. Opinion", "type": "virtual", "grade": "1", "prompt": "Which of these is an observation (something you can see)?", "introText": "An observation is something you notice with your senses—you can see, hear, or touch it. An opinion is what you think or feel about something.", "responseOptions": ["The flower is pretty.", "The flower has five petals.", "I like flowers.", "Flowers are boring."], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-1-10", "title": "Measure Tool 2", "type": "virtual", "grade": "1", "prompt": "Which tool would you use to see how heavy a rock is?", "introText": "Different tools measure different things. To measure weight, or how heavy something is, scientists use a tool called a scale.", "responseOptions": ["A ruler", "A scale", "A measuring cup", "A clock"], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-1-11", "title": "States of Matter 2", "type": "virtual", "grade": "1", "prompt": "What is the steam coming from a hot kettle?", "introText": "When liquid water gets very hot, it changes. It turns into an invisible gas called water vapor, which we can sometimes see as steam.", "responseOptions": ["A solid", "A liquid", "A gas", "A surprise"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-1-12", "title": "Comparing Objects", "type": "virtual", "grade": "1", "prompt": "How are a ball and an orange similar?", "introText": "When we compare things, we look for properties that are the same. Properties can be things like shape, color, size, or texture.", "responseOptions": ["They are both sweet.", "They are both round.", "They are both toys.", "They both grow on trees."], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-1-5", "title": "Mini Investigation", "type": "offline", "grade": "1", "prompt": "For this offline experiment, find two identical seeds (like bean seeds). Place them in separate small cups with a bit of soil. Water one seed just a little, but keep the other one completely dry. Place both in a sunny spot. Over the next few days, observe what happens! The goal is to see if water is important for a seed to sprout. Mark complete when you have set up the experiment." },
            { "id": "sc-inquiry-2-1", "title": "Testable Question", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the testable question.", "introText": "A good science question is one you can answer by doing an experiment. It's not about opinions (like 'is blue pretty?'), but about things you can measure or observe.", "responseOptions": ["Are rocks fun?", "Does a toy car go faster on wood or carpet?", "Why are flowers pretty?", "Is blue better?"], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-2-2", "title": "Variable", "type": "virtual", "grade": "2", "prompt": "In an experiment to see what helps seeds grow, what is the ONE thing you should change to keep it a fair test?", "introText": "In a 'fair test', you only change one thing at a time (this is called the variable). Everything else must stay the same so you know what caused the result.", "responseOptions": ["The type of seed", "The amount of water", "The size of the pot", "You change only ONE of these things"], "correctAnswerIndex": 3 },
            { "id": "sc-inquiry-2-3", "title": "Conclusion", "type": "virtual", "grade": "2", "prompt": "Data show plant A in the sun grew more than plant B in the dark. Choose the conclusion.", "introText": "A conclusion is what you learn from your experiment's results. It's the answer to your testable question, based on the data you collected.", "responseOptions": ["Sunlight helped the plant grow.", "Water is not important.", "Plants like the dark.", "The experiment failed."], "correctAnswerIndex": 0 },
            { "id": "sc-inquiry-2-4", "title": "Erosion", "type": "virtual", "grade": "2", "prompt": "What is it called when wind or water slowly wears away rock and soil?", "introText": "The Earth's surface is always changing. Erosion is a slow process where natural forces like wind and water carry away bits of the land.", "responseOptions": ["Evaporation", "Erosion", "Condensation", "Gravity"], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-2-6", "title": "Sink or Swim?", "type": "virtual", "displayType": "sink-or-swim", "grade": "2", "prompt": "Let's be scientists and predict! For each item, guess if it will sink to the bottom or float on the water. Then, test your predictions with a bowl of water!" },
            { "id": "sc-inquiry-2-7", "title": "Water Cycle", "type": "virtual", "grade": "2", "prompt": "What is it called when water on the ground turns into vapor and goes up into the air?", "introText": "The Earth reuses the same water over and over in a process called the water cycle. The first step is evaporation, when the sun heats up water and it turns into a gas.", "responseOptions": ["Precipitation", "Condensation", "Evaporation", "Collection"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-2-8", "title": "Water Cycle 2", "type": "virtual", "grade": "2", "prompt": "What are clouds made of?", "introText": "When water vapor rises into the sky, it gets cold and turns back into liquid. This is called condensation. These tiny water droplets gather together to form clouds.", "responseOptions": ["Smoke", "Cotton Candy", "Tiny water droplets", "Big rocks"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-2-9", "title": "Physical Changes", "type": "virtual", "grade": "2", "prompt": "If you cut a piece of paper into smaller pieces, what happens?", "introText": "A physical change is when you change how something looks, but you don't change the material it's made of. A chemical change makes a brand new material (like burning wood to make ash).", "responseOptions": ["It's still paper, just smaller.", "It becomes a new material.", "It disappears.", "It turns into wood."], "correctAnswerIndex": 0 },
            { "id": "sc-inquiry-2-10", "title": "Food Chains", "type": "virtual", "grade": "2", "prompt": "In a simple food chain, a rabbit eats grass and a fox eats the rabbit. What does the food chain show?", "introText": "A food chain shows how energy moves in an ecosystem. It always starts with a producer (a plant that makes its own food from the sun), and then shows what eats that plant, and what eats that animal.", "responseOptions": ["How animals play", "Where animals sleep", "How energy moves from plants to animals", "What color animals are"], "correctAnswerIndex": 2 },
            { "id": "sc-inquiry-2-11", "title": "Inherited Traits", "type": "virtual", "grade": "2", "prompt": "Which of these is a trait you can inherit from your parents?", "introText": "You inherit traits like your eye color and hair color from your parents through your genes. Other things, like your favorite food or a skill like riding a bike, are things you learn.", "responseOptions": ["Your eye color", "Your favorite food", "Knowing how to ride a bike", "The language you speak"], "correctAnswerIndex": 0 },
            { "id": "sc-inquiry-2-12", "title": "Hypothesis 2", "type": "virtual", "grade": "2", "prompt": "Which is a good hypothesis for an experiment about which ball bounces highest?", "introText": "Remember, a good hypothesis is a testable 'If..., then...' statement. It predicts the outcome of a specific action.", "responseOptions": ["Bouncing balls is fun.", "If I drop a basketball and a tennis ball, then the basketball will bounce higher.", "This ball is orange.", "My favorite ball is the tennis ball."], "correctAnswerIndex": 1 },
            { "id": "sc-inquiry-2-5", "title": "Report", "type": "recording", "grade": "2", "prompt": "After doing a simple science experiment (like the seed investigation), ask Sophia to be a scientist and report her findings. Ask her: 'What happened from beginning to end? What did you learn?' Mark complete after she shares her verbal report." }
          ]
        },
        {
          "name": "Life Cycles",
          "items": [
            { "id": "sc-lifecyc-K-1", "title": "Butterfly Life Cycle", "type": "virtual", "grade": "K", "prompt": "Sophia, which picture shows the first stage of a butterfly's life?", "introText": "Butterflies are beautiful insects, but they don't start out that way! They go through four big changes called a life cycle. It all begins with something very, very small.", "responseOptions": ["Egg", "Caterpillar", "Chrysalis", "Butterfly"], "correctAnswerIndex": 0 },
            { "id": "sc-lifecyc-K-2", "title": "What Does a Plant Need?", "type": "virtual", "grade": "K", "prompt": "Sophia, what does a seed need to grow into a big plant?", "introText": "Plants are living things, and just like you, they need special things to grow big and strong. Let's think about what a tiny seed needs to become a tall flower!", "responseOptions": ["Sun and Water", "Milk and Cookies", "Toys and a Bed", "Snow and Ice"], "correctAnswerIndex": 0 },
            { "id": "sc-lifecyc-K-3", "title": "Matching Baby Animals", "type": "virtual", "grade": "K", "prompt": "Sophia, which animal is a baby chicken?", "introText": "All grown-up animals were babies once! A baby dog is a puppy, and a baby cat is a kitten. Different animals have different names for their babies.", "responseOptions": ["Puppy", "Kitten", "Chick", "Calf"], "correctAnswerIndex": 2 },
            { "id": "sc-lifecyc-K-4", "title": "Butterfly Stage 2", "type": "virtual", "grade": "K", "prompt": "What comes out of a butterfly's egg?", "introText": "After the egg, the next stage of the butterfly life cycle begins. Something hatches out, and it is very, very hungry!", "responseOptions": ["A tiny butterfly", "A hungry caterpillar", "A ladybug", "A flower"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-K-5", "title": "Plant Growth", "type": "virtual", "grade": "K", "prompt": "What is the first thing that grows from a seed?", "introText": "When a seed starts to grow, it sends something down into the soil to drink water and hold it in place. This part is usually hidden underground.", "responseOptions": ["A flower", "A big leaf", "A tiny root", "An apple"], "correctAnswerIndex": 2 },
            { "id": "sc-lifecyc-K-6", "title": "Baby Animal Names", "type": "virtual", "grade": "K", "prompt": "A baby dog is called a...", "introText": "Let's test our baby animal names again! This animal is a popular pet and loves to play fetch.", "responseOptions": ["Kitten", "Foal", "Puppy", "Cub"], "correctAnswerIndex": 2 },
            { "id": "sc-lifecyc-K-7", "title": "Living Things Grow", "type": "virtual", "grade": "K", "prompt": "Which of these things can grow bigger all by itself?", "introText": "One special thing about living things is that they can grow and change on their own. Non-living things stay the same size unless someone changes them.", "responseOptions": ["A rock", "A kitten", "A toy car", "A shoe"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-K-8", "title": "Butterfly Stage 3", "type": "virtual", "grade": "K", "prompt": "What does a caterpillar make to rest and change inside?", "introText": "After the caterpillar eats and eats, it gets ready for its biggest change. It forms a special case around itself to stay safe while it transforms.", "responseOptions": ["A nest", "A web", "A house", "A chrysalis"], "correctAnswerIndex": 3 },
            { "id": "sc-lifecyc-K-9", "title": "Plant Needs 2", "type": "virtual", "grade": "K", "prompt": "Besides sun and water, what does a plant need to grow in?", "introText": "A plant can't just grow in the air! Its roots need something to hold onto and get nutrients from.", "responseOptions": ["Juice", "Soil (dirt)", "Sand", "Snow"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-K-10", "title": "Baby Animal Names 2", "type": "virtual", "grade": "K", "prompt": "A baby cat is called a...", "introText": "This baby animal is soft and purrs when it's happy. What is it called?", "responseOptions": ["Pup", "Kitten", "Chick", "Joey"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-1-1", "title": "Frog Life Cycle Order", "type": "virtual", "grade": "1", "prompt": "Sophia, what comes after the eggs in a frog's life cycle?", "introText": "Frogs are amphibians that go through amazing changes. Their life starts as jelly-like eggs in the water. When an egg hatches, a tiny creature with a tail swims out. This is called a tadpole!", "responseOptions": ["Froglet", "Tadpole", "Adult Frog", "A bigger egg"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-1-2", "title": "Plant Parts", "type": "virtual", "grade": "1", "prompt": "Sophia, which part of the plant soaks up water from the soil?", "introText": "A plant's roots act like a straw, drinking up water and nutrients from the dirt. The stem holds the plant up, and the leaves soak up sunlight to make food. A flower is often the most colorful part and helps the plant make seeds.", "responseOptions": ["Leaves", "Flower", "Stem", "Roots"], "correctAnswerIndex": 3 },
            { "id": "sc-lifecyc-1-3", "title": "Parent and Baby Traits", "type": "virtual", "grade": "1", "prompt": "A mother dog has floppy ears. What will her puppy likely have?", "introText": "Baby animals often look like their parents. They can inherit traits, which are features like eye color, fur color, or the shape of their ears.", "responseOptions": ["Floppy ears", "Wings", "Scales", "A trunk"], "correctAnswerIndex": 0 },
            { "id": "sc-lifecyc-1-4", "title": "Frog Life Cycle Stage 3", "type": "virtual", "grade": "1", "prompt": "After a tadpole grows legs, what is it called?", "introText": "The tadpole swims in the water, but soon it starts to change. As the tadpole grows legs and its tail gets shorter, it is called a froglet. It's starting to look more like a real frog!", "responseOptions": ["Tadpole", "Adult Frog", "Froglet", "Egg"], "correctAnswerIndex": 2 },
            { "id": "sc-lifecyc-1-5", "title": "Plant Parts 2", "type": "virtual", "grade": "1", "prompt": "Which part makes seeds for a new plant?", "introText": "A plant's roots act like a straw, drinking up water and nutrients from the dirt. The stem holds the plant up, and the leaves soak up sunlight to make food. A flower is often the most colorful part and helps the plant make seeds.", "responseOptions": ["The roots", "The stem", "The leaves", "The flower"], "correctAnswerIndex": 3 },
            { "id": "sc-lifecyc-1-6", "title": "Inherited Traits 2", "type": "virtual", "grade": "1", "prompt": "A tall dad and a tall mom have a baby. The baby will likely be:", "introText": "Just like animals, humans also inherit traits from their parents. This includes things like height, hair color, and eye color.", "responseOptions": ["Short", "Tall", "Green", "Furry"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-1-7", "title": "Animal Offspring", "type": "virtual", "grade": "1", "prompt": "How are baby animals different from their parents?", "introText": "Offspring (or babies) look a lot like their parents, but there are some clear differences, especially when they are very young.", "responseOptions": ["They are bigger.", "They are smaller.", "They are the exact same.", "They are a different animal."], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-1-8", "title": "Plant Parts 3", "type": "virtual", "grade": "1", "prompt": "Which part of the plant holds it up straight and tall?", "introText": "A plant's roots act like a straw, drinking up water and nutrients from the dirt. The stem holds the plant up, and the leaves soak up sunlight to make food. A flower is often the most colorful part and helps the plant make seeds.", "responseOptions": ["The stem", "The flower", "The roots", "The seeds"], "correctAnswerIndex": 0 },
            { "id": "sc-lifecyc-1-9", "title": "Learned vs. Inherited", "type": "virtual", "grade": "1", "prompt": "Which of these is something a dog LEARNS to do?", "introText": "Animals are born with some traits (inherited), like the color of their fur. But other things, called behaviors, they have to learn how to do.", "responseOptions": ["Having four legs", "Wagging its tail", "Fetching a ball", "Having fur"], "correctAnswerIndex": 2 },
            { "id": "sc-lifecyc-1-10", "title": "Animal Offspring 2", "type": "virtual", "grade": "1", "prompt": "Do all baby animals look exactly like their parents when they are born?", "introText": "Some animals are born looking like tiny versions of their parents. But some animals, like butterflies and frogs, look very different when they are young!", "responseOptions": ["Yes, always", "No, some change a lot (like frogs)", "They look like different animals", "They are born as adults"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-2-1", "title": "Metamorphosis", "type": "virtual", "grade": "2", "prompt": "A caterpillar makes a chrysalis and changes inside. What is this amazing change called?", "introText": "Some animals go through a complete change in their body form as they grow up. This incredible process has a special scientific name.", "responseOptions": ["Hibernation", "Metamorphosis", "Migration", "Camouflage"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-2-2", "title": "How Seeds Travel", "type": "virtual", "grade": "2", "prompt": "How do seeds from a dandelion travel to new places to grow?", "introText": "Plants can't walk around to find new homes for their seeds. So, they have clever ways to send their seeds to new places. This is called seed dispersal.", "responseOptions": ["By floating on the wind", "By swimming in the ocean", "By underground tunnels", "By car"], "correctAnswerIndex": 0 },
            { "id": "sc-lifecyc-2-3", "title": "Traits and Behaviors", "type": "virtual", "grade": "2", "prompt": "Which of these is something a bear learns, not something it is born with?", "introText": "An inherited trait is something an animal is born with, like its claws. A learned behavior is a skill it picks up by watching others or practicing.", "responseOptions": ["Having fur", "Catching fish in a river", "Having sharp claws", "Hibernating in winter"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-2-4", "title": "Pollination", "type": "virtual", "grade": "2", "prompt": "What do bees help plants do when they fly from flower to flower?", "introText": "Flowers need help to make seeds. They need to share tiny grains called pollen with other flowers. Flying insects like bees are a huge help with this job!", "responseOptions": ["Make honey", "Pollinate them to make seeds", "Give them water", "Keep them warm"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-2-5", "title": "Seed Dispersal 2", "type": "virtual", "grade": "2", "prompt": "A squirrel buries an acorn and forgets it. How does this help the oak tree?", "introText": "Animals can also help plants spread their seeds. Sometimes they eat a fruit and drop the seed far away. Other times, they help without even meaning to!", "responseOptions": ["It feeds the squirrel.", "It helps a new oak tree grow in a new spot.", "It cleans the forest floor.", "It stops other trees from growing."], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-2-6", "title": "Complete vs. Incomplete Metamorphosis", "type": "virtual", "grade": "2", "prompt": "Which animal goes through a complete metamorphosis (egg, larva, pupa, adult)?", "introText": "There are two types of metamorphosis. In 'complete' metamorphosis, the baby (larva) looks totally different from the adult. In 'incomplete' metamorphosis, the baby (nymph) looks like a small version of the adult.", "responseOptions": ["A dog", "A grasshopper", "A butterfly", "A human"], "correctAnswerIndex": 2 },
            { "id": "sc-lifecyc-2-7", "title": "Germination", "type": "virtual", "grade": "2", "prompt": "What is the name for when a seed starts to sprout and grow?", "introText": "A seed can wait for a long time until the conditions are just right. When it has enough water and warmth, it 'wakes up' and begins to grow. This process has a scientific name.", "responseOptions": ["Photosynthesis", "Germination", "Pollination", "Decomposition"], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-2-8", "title": "Ecosystem Roles", "type": "virtual", "grade": "2", "prompt": "In a forest, what is the role of a plant?", "introText": "In an ecosystem, every living thing has a job. Plants are called 'producers' because they do something that no animal can do.", "responseOptions": ["It produces its own food.", "It consumes other animals.", "It breaks down dead material.", "It provides shelter only."], "correctAnswerIndex": 0 },
            { "id": "sc-lifecyc-2-9", "title": "Adaptations", "type": "virtual", "grade": "2", "prompt": "Why does a polar bear have thick white fur?", "introText": "Animals have special features, or 'adaptations,' that help them survive in their environment. These features can help them find food, stay warm, or hide from predators.", "responseOptions": ["To look stylish.", "To help it stay warm and blend in with the snow.", "To help it swim faster.", "To make it easy to see."], "correctAnswerIndex": 1 },
            { "id": "sc-lifecyc-2-10", "title": "Inherited vs. Learned 2", "type": "virtual", "grade": "2", "prompt": "Which of these is an inherited trait in humans?", "introText": "Remember, inherited traits are passed down from your parents through genes. Learned behaviors are skills you get through practice and experience.", "responseOptions": ["Speaking Spanish", "Being good at soccer", "Having naturally curly hair", "Knowing how to cook"], "correctAnswerIndex": 2 }
          ]
        }
      ]
    },
    {
      "name": "Social Studies",
      "color": "#FFD6A5",
      "subdomains": [
        {
          "name": "Geography",
          "items": [
            { "id": "ss-geog-K-1", "title": "Land/Water", "type": "virtual", "grade": "K", "prompt": "Sophia, choose which shows land.", "responseOptions": ["Lake", "Ocean", "River", "Hill"], "correctAnswerIndex": 3 },
            { "id": "ss-geog-K-2", "title": "Home/School", "type": "virtual", "grade": "K", "prompt": "Sophia, choose which picture shows a school.", "responseOptions": ["Garage", "School building", "Kitchen", "Garden"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-K-3", "title": "Direction", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the arrow that points up.", "responseOptions": ["Right Arrow", "Left Arrow", "Up Arrow", "Down Arrow"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-K-4", "title": "Symbol Key", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the map symbol for a park.", "responseOptions": ["A flag", "A house", "A tree", "A car"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-K-5", "title": "What is a Map?", "type": "virtual", "grade": "K", "prompt": "What does a map show you?", "responseOptions": ["A story about animals", "Where places are located", "A list of numbers", "A weather forecast"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-K-6", "title": "Map Location", "type": "virtual", "grade": "K", "prompt": "On the map, what is near the river?", "visual": { "type": "neighborhood-map" }, "responseOptions": ["The school", "The house", "The park", "The grocery store"], "correctAnswerIndex": 0 },
            { "id": "ss-geog-K-7", "title": "Map Location 2", "type": "virtual", "grade": "K", "prompt": "Where is the park located on the map?", "visual": { "type": "neighborhood-map" }, "responseOptions": ["Top right", "Bottom left", "Middle", "Top left"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-K-8", "title": "Landforms", "type": "virtual", "grade": "K", "prompt": "Which of these is a body of water?", "responseOptions": ["Mountain", "Hill", "Valley", "Pond"], "correctAnswerIndex": 3 },
            { "id": "ss-geog-K-9", "title": "Globe", "type": "virtual", "grade": "K", "prompt": "What is a model of the Earth called?", "responseOptions": ["A ball", "A circle", "A globe", "A plate"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-K-10", "title": "Simple Directions", "type": "virtual", "grade": "K", "prompt": "To get from your Home to the Park on the map, you need to go:", "visual": { "type": "neighborhood-map" }, "responseOptions": ["Up", "Down", "Left", "Right"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-K-11", "title": "Neighborhood Walk", "type": "offline", "grade": "K", "prompt": "Sophia, take a short walk and tell two landmarks; mark complete." },
            { "id": "ss-geog-1-1", "title": "Map Key", "type": "virtual", "grade": "1", "prompt": "Sophia, look at the map shown. On a map key, what does the blue line usually mean?", "visual": { "type": "neighborhood-map" }, "responseOptions": ["Train track", "Road", "Building outline", "River"], "correctAnswerIndex": 3 },
            { "id": "ss-geog-1-2", "title": "Route", "type": "virtual", "grade": "1", "prompt": "Sophia, look at the map. Choose the shortest route from Home to the School.", "visual": { "type": "neighborhood-map" }, "responseOptions": ["Route B", "Route C", "Route D", "Route A"], "correctAnswerIndex": 3 },
            { "id": "ss-geog-1-3", "title": "Compass", "type": "virtual", "grade": "1", "prompt": "A compass shows directions. What does the 'N' on the compass stand for?", "visual": { "type": "compass-rose" }, "responseOptions": ["North", "New", "Next", "Noodle"], "correctAnswerIndex": 0 },
            { "id": "ss-geog-1-4", "title": "Labels", "type": "virtual", "grade": "1", "prompt": "Sophia, choose what belongs on a map key.", "responseOptions": ["Feelings", "Songs", "Hours", "Symbols"], "correctAnswerIndex": 3 },
            { "id": "ss-geog-1-6", "title": "Cardinal Directions", "type": "virtual", "grade": "1", "prompt": "If you are at Home and walk towards the School, which direction are you going?", "visual": { "type": "neighborhood-map" }, "responseOptions": ["East", "West", "North", "South"], "correctAnswerIndex": 0 },
            { "id": "ss-geog-1-7", "title": "Rural vs. Urban", "type": "virtual", "grade": "1", "prompt": "Which word describes a place with lots of tall buildings and people (a city)?", "introText": "Geographers use special words to describe places. 'Urban' means a city area with many buildings and people. 'Rural' means the countryside with farms and open land. 'Suburban' means the neighborhoods just outside a big city.", "responseOptions": ["Rural", "Urban", "Suburban", "Ocean"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-1-8", "title": "Natural Features", "type": "virtual", "grade": "1", "prompt": "Which of these is a natural feature, not man-made?", "introText": "Natural features are parts of the Earth that were not made by people, like mountains, rivers, and oceans. Man-made features are things people build, like bridges, roads, and houses.", "responseOptions": ["A bridge", "A house", "A mountain", "A road"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-1-9", "title": "What is a City?", "type": "virtual", "grade": "1", "prompt": "A city is a place where...", "responseOptions": ["Only animals live", "Many people live and work close together", "There are no buildings", "Only farms exist"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-1-10", "title": "State", "type": "virtual", "grade": "1", "prompt": "You live in a city, which is inside a...", "responseOptions": ["Country", "State", "Continent", "Planet"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-1-11", "title": "Relative Location", "type": "virtual", "grade": "1", "prompt": "On the map, the school is _____ of the river.", "visual": { "type": "neighborhood-map" }, "responseOptions": ["North", "South", "East", "West"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-1-5", "title": "Draw Simple Map", "type": "offline", "grade": "1", "prompt": "Let's draw a map of your street! Include your house and at least two other places, like a friend's house or a park. Don't forget to label everything (e.g., 'My House', 'Main Street'). Mark complete when done." },
            { "id": "ss-geog-2-1", "title": "Continents", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the number of continents.", "responseOptions": ["8", "6", "5", "7"], "correctAnswerIndex": 3 },
            { "id": "ss-geog-2-2", "title": "Oceans", "type": "virtual", "grade": "2", "prompt": "Sophia, which ocean is between North America and Europe?", "responseOptions": ["Atlantic", "Pacific", "Indian", "Arctic"], "correctAnswerIndex": 0 },
            { "id": "ss-geog-2-3", "title": "Landmarks", "type": "virtual", "grade": "2", "prompt": "Sophia, choose a community landmark.", "responseOptions": ["Apple", "Couch", "Backpack", "Library"], "correctAnswerIndex": 3 },
            { "id": "ss-geog-2-4", "title": "Scale", "type": "virtual", "grade": "2", "prompt": "On a world map, what does the scale help you measure?", "responseOptions": ["The weather", "The real distance between places", "The number of people", "The time of day"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-2-6", "title": "Country", "type": "virtual", "grade": "2", "prompt": "Which country do you live in?", "responseOptions": ["Canada", "Mexico", "United States", "France"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-2-7", "title": "Continent Identification", "type": "virtual", "grade": "2", "prompt": "The United States is on which continent?", "responseOptions": ["Asia", "Africa", "North America", "Australia"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-2-8", "title": "Hemispheres", "type": "virtual", "grade": "2", "prompt": "The Equator is an imaginary line that divides the Earth into which two hemispheres?", "responseOptions": ["Eastern and Western", "Top and Bottom", "Northern and Southern", "Inside and Outside"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-2-9", "title": "Human-Environment Interaction", "type": "virtual", "grade": "2", "prompt": "Which is an example of people changing the environment to meet their needs?", "responseOptions": ["Watching a river flow", "Building a bridge over a river", "Listening to birds in a forest", "Feeling the wind blow"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-2-10", "title": "Map Grids", "type": "virtual", "grade": "2", "prompt": "What are the lines that run up-and-down and across on a map called?", "responseOptions": ["Scribbles", "A grid system", "Roads", "Rivers"], "correctAnswerIndex": 1 },
            { "id": "ss-geog-2-11", "title": "Physical vs. Political Maps", "type": "virtual", "grade": "2", "prompt": "Which type of map would you use to find mountains and rivers?", "responseOptions": ["A political map", "A road map", "A physical map", "A weather map"], "correctAnswerIndex": 2 },
            { "id": "ss-geog-2-5", "title": "Neighborhood Walk & Map", "type": "offline", "grade": "2", "prompt": "Sophia, walk, then draw a map with 3 labels; mark complete." }
          ]
        },
        {
          "name": "Civics & Community",
          "items": [
            { "id": "ss-civics-K-1", "title": "Helpers", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the community helper.", "responseOptions": ["Robot", "Dragon", "Firefighter", "Monster"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-K-2", "title": "Rules", "type": "virtual", "grade": "K", "prompt": "Sophia, choose a good school rule.", "responseOptions": ["Run in the halls", "Walk indoors", "Push in line", "Yell loudly"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-K-3", "title": "Respect", "type": "virtual", "grade": "K", "prompt": "Sophia, choose a respectful action.", "responseOptions": ["Take turns", "Yell to get what you want", "Walk away when someone is talking", "Grab a toy from a friend"], "correctAnswerIndex": 0 },
            { "id": "ss-civics-K-4", "title": "Vote Intro", "type": "virtual", "grade": "K", "prompt": "Sophia, choose how a class can decide on a game fairly.", "responseOptions": ["The teacher always decides", "Only the boys decide", "Everyone gets to vote", "The fastest runner decides"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-K-6", "title": "Helper's Job", "type": "virtual", "grade": "K", "prompt": "What does a teacher do?", "responseOptions": ["Flies airplanes", "Helps people learn", "Builds houses", "Sells ice cream"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-K-7", "title": "Why Rules?", "type": "virtual", "grade": "K", "prompt": "Why is it important to have a rule like 'wait your turn'?", "responseOptions": ["So no one gets a turn", "To be mean", "So it is fair for everyone", "So the game ends quickly"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-K-8", "title": "Helper's Job 2", "type": "virtual", "grade": "K", "prompt": "Who helps you when you are sick?", "responseOptions": ["A chef", "A pilot", "A doctor or nurse", "A construction worker"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-K-9", "title": "Being a Good Friend", "type": "virtual", "grade": "K", "prompt": "What is a good way to be a friend?", "responseOptions": ["Sharing your toys", "Taking all the toys", "Not talking", "Pushing"], "correctAnswerIndex": 0 },
            { "id": "ss-civics-K-10", "title": "Community Places", "type": "virtual", "grade": "K", "prompt": "Where would you go to borrow a book?", "responseOptions": ["The grocery store", "The fire station", "The library", "The post office"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-K-11", "title": "Helper's Job 3", "type": "virtual", "grade": "K", "prompt": "Who brings mail to your house?", "responseOptions": ["A baker", "A mail carrier", "A dentist", "A police officer"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-K-5", "title": "Kind Deed", "type": "offline", "grade": "K", "prompt": "Sophia, do one kind deed today; mark complete." },
            { "id": "ss-civics-1-1", "title": "Mayor Role", "type": "virtual", "grade": "1", "prompt": "Sophia, choose what a mayor does.", "responseOptions": ["Teaches PE class", "Drives the city bus", "Leads the city government", "Owns all the houses"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-1-2", "title": "Laws", "type": "virtual", "grade": "1", "prompt": "Sophia, choose why we have laws.", "responseOptions": ["To buy toys", "To keep people safe", "To make life boring", "To win games"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-1-3", "title": "Citizenship", "type": "virtual", "grade": "1", "prompt": "Sophia, choose an action of a good citizen.", "responseOptions": ["Throwing trash on the ground", "Breaking rules at the park", "Picking up litter", "Hiding from neighbors"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-1-4", "title": "Decision", "type": "virtual", "grade": "1", "prompt": "Sophia, choose a fair way to share a swing.", "responseOptions": ["Push others off", "Use a timer to take turns", "Never share the swing", "Close the swing so no one can use it"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-1-6", "title": "Taxes", "type": "virtual", "grade": "1", "prompt": "Money people pay to the government to help the community is called:", "responseOptions": ["Gifts", "Taxes", "Allowance", "Presents"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-1-7", "title": "What Taxes Pay For", "type": "virtual", "grade": "1", "prompt": "Which of these is paid for by taxes?", "responseOptions": ["Your toys", "Public parks", "Your family's car", "The food you eat"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-1-8", "title": "National Symbol", "type": "virtual", "grade": "1", "prompt": "What are the colors of the American flag?", "responseOptions": ["Green, Yellow, and Blue", "Orange, Purple, and Black", "Red, White, and Blue", "Pink and Brown"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-1-9", "title": "Community Need", "type": "virtual", "grade": "1", "prompt": "Every community needs...", "responseOptions": ["A movie theater", "A toy store", "Rules and laws", "A giant slide"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-1-10", "title": "Leader Qualities", "type": "virtual", "grade": "1", "prompt": "What is a good quality for a leader to have?", "responseOptions": ["Being bossy", "Being a good listener", "Never sharing", "Only thinking of themselves"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-1-11", "title": "Community Event", "type": "virtual", "grade": "1", "prompt": "Which of these is a community event?", "responseOptions": ["Taking a nap", "A town parade", "Watching TV at home", "Brushing your teeth"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-1-5", "title": "Class Charter", "type": "offline", "grade": "1", "prompt": "Let's create a 'Class Charter' or a set of family rules together. First, talk about why rules are important (to keep us safe, to be fair). Then, write down one important rule you both agree on. Observer: Note if she can explain *why* the rule is important for safety or fairness.", "scoring": "manual" },
            { "id": "ss-civics-2-1", "title": "Government Levels", "type": "virtual", "grade": "2", "prompt": "Which leader is in charge of a whole country?", "responseOptions": ["A principal", "A mayor", "A president", "A coach"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-2-2", "title": "Rights/Responsibilities", "type": "virtual", "grade": "2", "prompt": "Being able to go to school is a right. What is a responsibility that comes with it?", "responseOptions": ["Sleeping in class", "Doing your best and being kind", "Never doing homework", "Not listening to the teacher"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-2-3", "title": "Conflict", "type": "virtual", "grade": "2", "prompt": "Sophia, choose a peaceful problem-solving step.", "responseOptions": ["Talk it out", "Yell", "Fight", "Quit"], "correctAnswerIndex": 0 },
            { "id": "ss-civics-2-4", "title": "Community Project", "type": "virtual", "grade": "2", "prompt": "Sophia, choose a way to help the community.", "responseOptions": ["Erase signs", "Plant flowers in a park", "Litter", "Break benches"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-2-6", "title": "Branches of Government", "type": "virtual", "grade": "2", "prompt": "What is the job of a judge?", "responseOptions": ["To write laws", "To enforce laws", "To interpret laws", "To ignore laws"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-2-7", "title": "Historical Figure", "type": "virtual", "grade": "2", "prompt": "Who was Martin Luther King Jr.?", "responseOptions": ["An astronaut", "A sports star", "A leader who fought for equal rights", "A movie director"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-2-8", "title": "Patriotic Song", "type": "virtual", "grade": "2", "prompt": "What is the name of the national anthem of the United States?", "responseOptions": ["'Twinkle, Twinkle, Little Star'", "'The Star-Spangled Banner'", "'Row, Row, Row Your Boat'", "'Happy Birthday'"], "correctAnswerIndex": 1 },
            { "id": "ss-civics-2-9", "title": "Goods and Services", "type": "virtual", "grade": "2", "prompt": "Which of these is a service?", "responseOptions": ["A toy", "A book", "A haircut", "An apple"], "correctAnswerIndex": 2 },
            { "id": "ss-civics-2-10", "title": "Volunteering", "type": "virtual", "grade": "2", "prompt": "When you work to help others without getting paid, it is called...", "responseOptions": ["A job", "A chore", "A business", "Volunteering"], "correctAnswerIndex": 3 },
            { "id": "ss-civics-2-11", "title": "Making a Difference", "type": "virtual", "grade": "2", "prompt": "Which is a way a student can make a positive difference at school?", "responseOptions": ["Being a good friend to a new student", "Ignoring the rules", "Leaving a mess in the cafeteria", "Not participating in class"], "correctAnswerIndex": 0 },
            { "id": "ss-civics-2-5", "title": "Service Plan", "type": "offline", "grade": "2", "prompt": "Sophia, make a small service plan; mark complete." }
          ]
        }
      ]
    },
    {
      "name": "Social-Emotional & Executive Functioning",
      "color": "#F9B5B5",
      "subdomains": [
        {
          "name": "Emotions & Collaboration",
          "items": [
            { "id": "sel-emocol-K-1", "title": "Feelings", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the face that shows happy.", "responseOptions": ["Mad", "Scared", "Happy", "Sad"], "correctAnswerIndex": 2 },
            { "id": "sel-emocol-K-2", "title": "Kind Ask", "type": "virtual", "grade": "K", "prompt": "Sophia, choose kind words to ask for a turn.", "responseOptions": ["Now!", "Give me!", "Please", "Move!"], "correctAnswerIndex": 2 },
            { "id": "sel-emocol-K-3", "title": "Sharing", "type": "virtual", "grade": "K", "prompt": "Sophia, choose a kind choice.", "responseOptions": ["Take turns", "Yell", "Walk away", "Grab toy"], "correctAnswerIndex": 0 },
            { "id": "sel-emocol-K-4", "title": "Calm Tool", "type": "virtual", "grade": "K", "prompt": "Sophia, choose a calm-down tool.", "responseOptions": ["Only jumping", "Deep breath", "Staring", "Shouting"], "correctAnswerIndex": 1 },
            { "id": "sel-emocol-K-5", "title": "Kind Words", "type": "recording", "grade": "K", "prompt": "Sophia, say one kind thing to your adult; mark complete." },
            { "id": "sel-emocol-1-1", "title": "I-Statement", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the best I-statement.", "responseOptions": ["Whatever.", "I feel sad when the game stops.", "You are mean.", "Stop it!"], "correctAnswerIndex": 1 },
            { "id": "sel-emocol-1-2", "title": "Turn Taking", "type": "virtual", "grade": "1", "prompt": "Sophia, choose what to do when two friends want the same toy.", "responseOptions": ["Cry", "Hide it", "Use a timer and share", "Grab it"], "correctAnswerIndex": 2 },
            { "id": "sel-emocol-1-3", "title": "Listening", "type": "virtual", "grade": "1", "prompt": "Sophia, choose a listening behavior.", "responseOptions": ["Covering ears", "Walking away", "Looking at the speaker", "Talking over"], "correctAnswerIndex": 2 },
            { "id": "sel-emocol-1-4", "title": "Help a Friend", "type": "virtual", "grade": "1", "prompt": "Sophia, choose a kind response to a sad friend.", "responseOptions": ["Ignore", "Laugh", "Ask if they want to talk", "Tease"], "correctAnswerIndex": 2 },
            { "id": "sel-emocol-1-5", "title": "Team Build", "type": "offline", "grade": "1", "prompt": "Sophia, build a paper tower with an adult; mark complete." },
            { "id": "sel-emocol-2-1", "title": "Calm First", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the first step to solve a conflict.", "responseOptions": ["Blame", "Calm my body", "Yell", "Quit"], "correctAnswerIndex": 1 },
            { "id": "sel-emocol-2-2", "title": "Empathy", "type": "virtual", "grade": "2", "prompt": "Sophia, choose what shows empathy.", "responseOptions": ["Tell them to stop feeling", "Imagine how they feel", "Win only", "Ignore"], "correctAnswerIndex": 1 },
            { "id": "sel-emocol-2-3", "title": "Plan Homework", "type": "virtual", "grade": "2", "prompt": "Sophia, choose the best plan to finish homework.", "responseOptions": ["Hide it", "Guess", "Make a checklist", "Play first for hours"], "correctAnswerIndex": 2 },
            { "id": "sel-emocol-2-4", "title": "Self-Talk", "type": "virtual", "grade": "2", "prompt": "Sophia, choose helpful self-talk.", "responseOptions": ["I give up", "This is dumb", "I can't do it", "I can try again"], "correctAnswerIndex": 3 },
            { "id": "sel-emocol-2-5", "title": "Reflect", "type": "recording", "grade": "2", "prompt": "Sophia, tell what went well today; mark complete." }
          ]
        },
        {
          "name": "Planning & Organization",
          "items": [
            { "id": "ef-plan-K-1", "title": "Start Task", "type": "virtual", "grade": "K", "prompt": "Sophia, choose what to do first when it's time to clean up.", "responseOptions": ["Throw toys", "Hide toys", "Run outside", "Put toys in the bin"], "correctAnswerIndex": 3 },
            { "id": "ef-plan-K-2", "title": "Follow Steps", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the next step: wash hands after using soap.", "responseOptions": ["Sleep", "Touch dirt", "Rinse with water", "Eat"], "correctAnswerIndex": 2 },
            { "id": "ef-plan-K-3", "title": "Checklist", "type": "virtual", "grade": "K", "prompt": "Sophia, choose what a checklist helps with.", "responseOptions": ["Run faster", "Remember steps", "Draw circles", "Sing better"], "correctAnswerIndex": 1 },
            { "id": "ef-plan-K-4", "title": "Pack Bag", "type": "virtual", "grade": "K", "prompt": "Sophia, choose what belongs in a school bag.", "responseOptions": ["Plant", "Pillow", "Folder", "Spoon"], "correctAnswerIndex": 2 },
            { "id": "ef-plan-K-5", "title": "Ready/Not", "type": "recording", "grade": "K", "prompt": "Sophia, show your adult your ready body; mark complete." },
            { "id": "ef-plan-1-1", "title": "Plan Steps", "type": "virtual", "grade": "1", "prompt": "Sophia, choose the first step to make a sandwich.", "responseOptions": ["Take a nap", "Eat it", "Get bread", "Wash dishes"], "correctAnswerIndex": 2 },
            { "id": "ef-plan-1-2", "title": "Organize Desk", "type": "virtual", "grade": "1", "prompt": "Sophia, choose what keeps a desk organized.", "responseOptions": ["Random piles", "Mystery box", "More trash", "Bins and labels"], "correctAnswerIndex": 3 },
            { "id": "ef-plan-1-3", "title": "Time Sense", "type": "virtual", "grade": "1", "prompt": "Sophia, a timer beeps after 5 minutes. choose what that means.", "responseOptions": ["It's raining", "Start now", "It is midnight", "Time is up"], "correctAnswerIndex": 3 },
            { "id": "ef-plan-1-4", "title": "Check Work", "type": "virtual", "grade": "1", "prompt": "Sophia, choose what to check in writing.", "responseOptions": ["Weather", "Capital letter", "Color of desk", "Shoes"], "correctAnswerIndex": 1 },
            { "id": "ef-plan-1-5", "title": "Mini Plan", "type": "offline", "grade": "1", "prompt": "Sophia, make a 3-step plan with an adult; mark complete." },
            { "id": "ef-plan-2-1", "title": "Prioritize", "type": "virtual", "grade": "2", "prompt": "Sophia, you have reading and a drawing. choose what to do first.", "responseOptions": ["Draw only", "Watch TV", "Skip reading", "Reading first, drawing after"], "correctAnswerIndex": 3 },
            { "id": "ef-plan-2-2", "title": "Break Task", "type": "virtual", "grade": "2", "prompt": "Sophia, choose how to break a big task.", "responseOptions": ["Do all at once", "Forget it", "Small steps", "Don't start"], "correctAnswerIndex": 2 },
            { "id": "ef-plan-2-3", "title": "Working Memory List", "type": "virtual", "grade": "2", "prompt": "Sophia, hear 3 words: cat–sun–tree. choose the list you heard.", "responseOptions": ["cat–sun–tree", "dog–sun–tree", "cat–moon–tree", "cat–tree–sun"], "correctAnswerIndex": 0 },
            { "id": "ef-plan-2-4", "title": "Flexibility Choice", "type": "virtual", "grade": "2", "prompt": "Sophia, recess moved indoors. choose a flexible choice.", "responseOptions": ["Play a board game", "Leave", "Do nothing", "Complain"], "correctAnswerIndex": 0 },
            { "id": "ef-plan-2-5", "title": "Self-Monitor", "type": "offline", "grade": "2", "prompt": "Sophia, after math, check mistakes and mark complete." }
          ]
        },
        {
          "name": "Working Memory",
          "items": [
            { "id": "ef-workmem-K-1", "title": "Repeat 2", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the correct order: red–blue.", "responseOptions": ["red–green", "blue–red", "blue–green", "red–blue"], "correctAnswerIndex": 3 },
            { "id": "ef-workmem-K-2", "title": "Picture Recall", "type": "virtual", "grade": "K", "prompt": "Sophia, look at 3 pictures; choose the one that disappeared.", "responseOptions": ["Car", "Bed", "Tree", "Ball"], "correctAnswerIndex": 3 },
            { "id": "ef-workmem-K-3", "title": "Number Echo", "type": "virtual", "grade": "K", "prompt": "Sophia, choose the numbers you heard: 3–2.", "responseOptions": ["3–4", "2–2", "3–2", "2–3"], "correctAnswerIndex": 2 },
            { "id": "ef-workmem-K-4", "title": "Where Was It?", "type": "virtual", "grade": "K", "prompt": "Sophia, choose where the star was.", "responseOptions": ["Center", "Bottom-right", "Top-right", "Top-left"], "correctAnswerIndex": 2 },
            { "id": "ef-workmem-K-5", "title": "Show & Tell", "type": "offline", "grade": "K", "prompt": "Sophia, remember two items to bring; mark complete." }
          ]
        }
      ]
    }
  ]
}