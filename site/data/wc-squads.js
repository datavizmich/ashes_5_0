const ROLE_ORDER = ["Opener", "Top Order", "Middle Order", "Wicketkeeper", "All-rounder", "Spinner", "Fast Bowler"];

function roleRank(player) {
  if (!player?.roles?.length) return ROLE_ORDER.length;
  const ranks = player.roles.map((role) => ROLE_ORDER.indexOf(role)).filter((index) => index >= 0);
  return ranks.length ? Math.min(...ranks) : ROLE_ORDER.length;
}

function sortSquadPlayers(players) {
  return [...players].sort((a, b) => {
    const roleDelta = roleRank(a) - roleRank(b);
    if (roleDelta !== 0) return roleDelta;
    const battingDelta = b.batting - a.batting;
    if (battingDelta !== 0) return battingDelta;
    const bowlingDelta = b.bowling - a.bowling;
    if (bowlingDelta !== 0) return bowlingDelta;
    return a.name.localeCompare(b.name);
  });
}

function normalizeSquad(squad) {
  return {
    ...squad,
    label: squad.label.replace(/\s+(Ashes|World Cup)\s+squad$/u, ""),
    players: sortSquadPlayers(squad.players),
  };
}

const RAW_WORLD_CUP_SQUADS = [
  {
    id: "aus-2023wc",
    label: "Australia 2023 World Cup squad",
    team: "Australia",
    year: 2023,
    players: [
      { name: "David Warner", roles: ["Opener"], batting: 91, bowling: 5, fielding: 82, experience: 98 },
      { name: "Travis Head", roles: ["Opener"], batting: 92, bowling: 35, fielding: 84, experience: 88 },
      { name: "Mitchell Marsh", roles: ["Top Order", "All-rounder"], batting: 88, bowling: 72, fielding: 80, experience: 91 },
      { name: "Steve Smith", roles: ["Top Order"], batting: 92, bowling: 20, fielding: 88, experience: 99 },
      { name: "Marnus Labuschagne", roles: ["Middle Order"], batting: 86, bowling: 25, fielding: 84, experience: 82 },
      { name: "Glenn Maxwell", roles: ["All-rounder"], batting: 92, bowling: 78, fielding: 86, experience: 95 },
      { name: "Marcus Stoinis", roles: ["All-rounder"], batting: 82, bowling: 72, fielding: 80, experience: 85 },
      { name: "Josh Inglis", roles: ["Wicketkeeper"], batting: 80, bowling: 0, fielding: 83, experience: 72 },
      { name: "Pat Cummins", roles: ["Fast Bowler"], batting: 40, bowling: 93, fielding: 82, experience: 95 },
      { name: "Mitchell Starc", roles: ["Fast Bowler"], batting: 28, bowling: 95, fielding: 80, experience: 97 },
      { name: "Josh Hazlewood", roles: ["Fast Bowler"], batting: 20, bowling: 92, fielding: 79, experience: 94 },
      { name: "Adam Zampa", roles: ["Spinner"], batting: 12, bowling: 89, fielding: 76, experience: 88 }
    ]
  },
  {
    id: "ind-2023wc",
    label: "India 2023 World Cup squad",
    team: "India",
    year: 2023,
    players: [
      { name: "Rohit Sharma", roles: ["Opener"], batting: 93, bowling: 8, fielding: 82, experience: 99 },
      { name: "Shubman Gill", roles: ["Opener"], batting: 92, bowling: 0, fielding: 82, experience: 75 },
      { name: "Virat Kohli", roles: ["Top Order"], batting: 96, bowling: 10, fielding: 90, experience: 100 },
      { name: "Shreyas Iyer", roles: ["Middle Order"], batting: 88, bowling: 0, fielding: 80, experience: 78 },
      { name: "KL Rahul", roles: ["Middle Order", "Wicketkeeper"], batting: 89, bowling: 0, fielding: 84, experience: 90 },
      { name: "Suryakumar Yadav", roles: ["Middle Order"], batting: 84, bowling: 0, fielding: 82, experience: 76 },
      { name: "Hardik Pandya", roles: ["All-rounder"], batting: 87, bowling: 80, fielding: 86, experience: 88 },
      { name: "Ravindra Jadeja", roles: ["All-rounder"], batting: 82, bowling: 90, fielding: 95, experience: 98 },
      { name: "Kuldeep Yadav", roles: ["Spinner"], batting: 18, bowling: 89, fielding: 78, experience: 85 },
      { name: "Mohammed Shami", roles: ["Fast Bowler"], batting: 18, bowling: 94, fielding: 75, experience: 94 },
      { name: "Jasprit Bumrah", roles: ["Fast Bowler"], batting: 22, bowling: 96, fielding: 80, experience: 92 },
      { name: "Mohammed Siraj", roles: ["Fast Bowler"], batting: 16, bowling: 88, fielding: 76, experience: 78 }
    ]
  },
  {
    id: "sa-2023wc",
    label: "South Africa 2023 World Cup squad",
    team: "South Africa",
    year: 2023,
    players: [
      { name: "Quinton de Kock", roles: ["Opener", "Wicketkeeper"], batting: 92, bowling: 0, fielding: 86, experience: 97 },
      { name: "Temba Bavuma", roles: ["Top Order"], batting: 81, bowling: 0, fielding: 78, experience: 84 },
      { name: "Rassie van der Dussen", roles: ["Top Order"], batting: 89, bowling: 0, fielding: 82, experience: 83 },
      { name: "Aiden Markram", roles: ["Middle Order"], batting: 90, bowling: 48, fielding: 86, experience: 86 },
      { name: "Heinrich Klaasen", roles: ["Middle Order"], batting: 91, bowling: 0, fielding: 82, experience: 80 },
      { name: "David Miller", roles: ["Middle Order"], batting: 89, bowling: 5, fielding: 84, experience: 95 },
      { name: "Marco Jansen", roles: ["All-rounder"], batting: 72, bowling: 86, fielding: 80, experience: 72 },
      { name: "Keshav Maharaj", roles: ["Spinner"], batting: 32, bowling: 87, fielding: 80, experience: 89 },
      { name: "Kagiso Rabada", roles: ["Fast Bowler"], batting: 26, bowling: 93, fielding: 79, experience: 94 },
      { name: "Lungi Ngidi", roles: ["Fast Bowler"], batting: 18, bowling: 85, fielding: 76, experience: 84 },
      { name: "Gerald Coetzee", roles: ["Fast Bowler"], batting: 20, bowling: 87, fielding: 76, experience: 62 },
      { name: "Tabraiz Shamsi", roles: ["Spinner"], batting: 10, bowling: 84, fielding: 74, experience: 85 }
    ]
  },
  {
    id: "eng-2023wc",
    label: "England 2023 World Cup squad",
    team: "England",
    year: 2023,
    players: [
      { name: "Jonny Bairstow", roles: ["Opener"], batting: 88, bowling: 0, fielding: 82, experience: 94 },
      { name: "Dawid Malan", roles: ["Opener"], batting: 86, bowling: 0, fielding: 76, experience: 84 },
      { name: "Joe Root", roles: ["Top Order"], batting: 93, bowling: 25, fielding: 88, experience: 99 },
      { name: "Ben Stokes", roles: ["Middle Order", "All-rounder"], batting: 91, bowling: 70, fielding: 88, experience: 98 },
      { name: "Jos Buttler", roles: ["Wicketkeeper"], batting: 91, bowling: 0, fielding: 87, experience: 96 },
      { name: "Harry Brook", roles: ["Middle Order"], batting: 84, bowling: 0, fielding: 82, experience: 68 },
      { name: "Moeen Ali", roles: ["All-rounder"], batting: 80, bowling: 82, fielding: 82, experience: 95 },
      { name: "Sam Curran", roles: ["All-rounder"], batting: 76, bowling: 82, fielding: 82, experience: 78 },
      { name: "Chris Woakes", roles: ["Fast Bowler"], batting: 62, bowling: 88, fielding: 82, experience: 95 },
      { name: "Mark Wood", roles: ["Fast Bowler"], batting: 16, bowling: 91, fielding: 78, experience: 90 },
      { name: "Reece Topley", roles: ["Fast Bowler"], batting: 10, bowling: 85, fielding: 74, experience: 72 },
      { name: "Adil Rashid", roles: ["Spinner"], batting: 20, bowling: 89, fielding: 80, experience: 97 }
    ]
  },
  {
    id: "aus-2007wc",
    label: "Australia 2007 World Cup squad",
    team: "Australia",
    year: 2007,
    players: [
      { name: "Adam Gilchrist", roles: ["Opener", "Wicketkeeper"], batting: 95, bowling: 0, fielding: 90, experience: 99 },
      { name: "Matthew Hayden", roles: ["Opener"], batting: 94, bowling: 0, fielding: 82, experience: 98 },
      { name: "Ricky Ponting", roles: ["Top Order"], batting: 97, bowling: 25, fielding: 92, experience: 100 },
      { name: "Michael Clarke", roles: ["Middle Order"], batting: 90, bowling: 45, fielding: 88, experience: 88 },
      { name: "Andrew Symonds", roles: ["All-rounder"], batting: 91, bowling: 82, fielding: 94, experience: 95 },
      { name: "Michael Hussey", roles: ["Middle Order"], batting: 92, bowling: 10, fielding: 86, experience: 89 },
      { name: "Shane Watson", roles: ["All-rounder"], batting: 85, bowling: 82, fielding: 84, experience: 82 },
      { name: "Brad Haddin", roles: ["Wicketkeeper"], batting: 78, bowling: 0, fielding: 84, experience: 76 },
      { name: "Brett Lee", roles: ["Fast Bowler"], batting: 32, bowling: 95, fielding: 84, experience: 96 },
      { name: "Glenn McGrath", roles: ["Fast Bowler"], batting: 10, bowling: 97, fielding: 85, experience: 100 },
      { name: "Nathan Bracken", roles: ["Fast Bowler"], batting: 15, bowling: 89, fielding: 80, experience: 88 },
      { name: "Brad Hogg", roles: ["Spinner"], batting: 42, bowling: 87, fielding: 82, experience: 91 }
    ]
  },
  
  {
    id: "ken-2003wc",
    label: "Kenya 2003 World Cup squad",
    team: "Kenya",
    year: 2003,
    players: [
      { name: "Kennedy Otieno", roles: ["Opener"], batting: 67, bowling: 0, fielding: 72, experience: 82 },
      { name: "Ravindu Shah", roles: ["Opener"], batting: 69, bowling: 10, fielding: 74, experience: 76 },
      { name: "Steve Tikolo", roles: ["Top Order"], batting: 84, bowling: 62, fielding: 80, experience: 95 },
      { name: "Maurice Odumbe", roles: ["All-rounder"], batting: 76, bowling: 74, fielding: 77, experience: 90 },
      { name: "David Obuya", roles: ["Middle Order"], batting: 70, bowling: 0, fielding: 74, experience: 68 },
      { name: "Thomas Odoyo", roles: ["All-rounder"], batting: 72, bowling: 76, fielding: 78, experience: 74 },
      { name: "Collins Obuya", roles: ["Spinner"], batting: 58, bowling: 84, fielding: 75, experience: 65 },
      { name: "Brijal Patel", roles: ["Wicketkeeper"], batting: 64, bowling: 0, fielding: 76, experience: 72 },
      { name: "Martin Suji", roles: ["Fast Bowler"], batting: 28, bowling: 80, fielding: 72, experience: 85 },
      { name: "Peter Ongondo", roles: ["Fast Bowler"], batting: 18, bowling: 76, fielding: 70, experience: 68 },
      { name: "Tony Suji", roles: ["Fast Bowler"], batting: 24, bowling: 75, fielding: 71, experience: 76 }
    ]
  },
  
  {
    id: "ind-2011wc",
    label: "India 2011 World Cup squad",
    team: "India",
    year: 2011,
    players: [
      { name: "Virender Sehwag", roles: ["Opener"], batting: 93, bowling: 25, fielding: 80, experience: 96 },
      { name: "Sachin Tendulkar", roles: ["Opener"], batting: 98, bowling: 30, fielding: 84, experience: 100 },
      { name: "Gautam Gambhir", roles: ["Top Order"], batting: 89, bowling: 0, fielding: 80, experience: 88 },
      { name: "Virat Kohli", roles: ["Middle Order"], batting: 84, bowling: 5, fielding: 85, experience: 68 },
      { name: "Yuvraj Singh", roles: ["All-rounder"], batting: 92, bowling: 85, fielding: 90, experience: 94 },
      { name: "MS Dhoni", roles: ["Wicketkeeper"], batting: 91, bowling: 0, fielding: 94, experience: 98 },
      { name: "Suresh Raina", roles: ["Middle Order"], batting: 84, bowling: 20, fielding: 88, experience: 82 },
      { name: "Harbhajan Singh", roles: ["Spinner"], batting: 42, bowling: 89, fielding: 82, experience: 95 },
      { name: "Zaheer Khan", roles: ["Fast Bowler"], batting: 25, bowling: 93, fielding: 80, experience: 97 },
      { name: "Munaf Patel", roles: ["Fast Bowler"], batting: 12, bowling: 82, fielding: 72, experience: 80 },
      { name: "Ashish Nehra", roles: ["Fast Bowler"], batting: 15, bowling: 84, fielding: 74, experience: 88 }
    ]
  },
  
  {
    id: "ned-2011wc",
    label: "Netherlands 2011 World Cup squad",
    team: "Netherlands",
    year: 2011,
    players: [
      { name: "Alexei Kervezee", roles: ["Opener"], batting: 68, bowling: 0, fielding: 70, experience: 70 },
      { name: "Eric Szwarczynski", roles: ["Opener"], batting: 65, bowling: 0, fielding: 68, experience: 66 },
      { name: "Ryan ten Doeschate", roles: ["All-rounder"], batting: 86, bowling: 80, fielding: 84, experience: 90 },
      { name: "Tom Cooper", roles: ["Middle Order"], batting: 76, bowling: 10, fielding: 74, experience: 72 },
      { name: "Peter Borren", roles: ["All-rounder"], batting: 72, bowling: 72, fielding: 76, experience: 78 },
      { name: "Wesley Barresi", roles: ["Wicketkeeper"], batting: 72, bowling: 0, fielding: 78, experience: 74 },
      { name: "Mudassar Bukhari", roles: ["All-rounder"], batting: 68, bowling: 76, fielding: 74, experience: 76 },
      { name: "Pieter Seelaar", roles: ["Spinner"], batting: 42, bowling: 80, fielding: 78, experience: 72 },
      { name: "Dirk Nannes", roles: ["Fast Bowler"], batting: 15, bowling: 86, fielding: 76, experience: 88 },
      { name: "Bernard Loots", roles: ["Fast Bowler"], batting: 18, bowling: 72, fielding: 68, experience: 68 },
      { name: "Edgar Schiferli", roles: ["Fast Bowler"], batting: 12, bowling: 70, fielding: 68, experience: 72 }
    ]
  },
  
  {
    id: "aus-2015wc",
    label: "Australia 2015 World Cup squad",
    team: "Australia",
    year: 2015,
    players: [
      { name: "David Warner", roles: ["Opener"], batting: 92, bowling: 5, fielding: 82, experience: 90 },
      { name: "Aaron Finch", roles: ["Opener"], batting: 89, bowling: 0, fielding: 80, experience: 84 },
      { name: "Steve Smith", roles: ["Top Order"], batting: 92, bowling: 40, fielding: 88, experience: 86 },
      { name: "Michael Clarke", roles: ["Middle Order"], batting: 88, bowling: 15, fielding: 84, experience: 98 },
      { name: "Shane Watson", roles: ["All-rounder"], batting: 87, bowling: 80, fielding: 84, experience: 96 },
      { name: "Glenn Maxwell", roles: ["All-rounder"], batting: 88, bowling: 74, fielding: 86, experience: 80 },
      { name: "Brad Haddin", roles: ["Wicketkeeper"], batting: 82, bowling: 0, fielding: 84, experience: 96 },
      { name: "Mitchell Marsh", roles: ["All-rounder"], batting: 76, bowling: 78, fielding: 78, experience: 68 },
      { name: "Mitchell Johnson", roles: ["Fast Bowler"], batting: 34, bowling: 94, fielding: 82, experience: 97 },
      { name: "Mitchell Starc", roles: ["Fast Bowler"], batting: 20, bowling: 95, fielding: 80, experience: 86 },
      { name: "Josh Hazlewood", roles: ["Fast Bowler"], batting: 15, bowling: 88, fielding: 76, experience: 70 }
    ]
  },
  
  {
    id: "ire-2015wc",
    label: "Ireland 2015 World Cup squad",
    team: "Ireland",
    year: 2015,
    players: [
      { name: "Paul Stirling", roles: ["Opener"], batting: 82, bowling: 35, fielding: 80, experience: 82 },
      { name: "William Porterfield", roles: ["Opener"], batting: 78, bowling: 0, fielding: 76, experience: 90 },
      { name: "Ed Joyce", roles: ["Top Order"], batting: 80, bowling: 0, fielding: 76, experience: 92 },
      { name: "Niall O'Brien", roles: ["Wicketkeeper"], batting: 76, bowling: 0, fielding: 78, experience: 88 },
      { name: "Gary Wilson", roles: ["Middle Order"], batting: 72, bowling: 0, fielding: 80, experience: 84 },
      { name: "Kevin O'Brien", roles: ["All-rounder"], batting: 80, bowling: 70, fielding: 76, experience: 86 },
      { name: "John Mooney", roles: ["All-rounder"], batting: 72, bowling: 76, fielding: 74, experience: 80 },
      { name: "George Dockrell", roles: ["Spinner"], batting: 48, bowling: 82, fielding: 76, experience: 74 },
      { name: "Tim Murtagh", roles: ["Fast Bowler"], batting: 18, bowling: 84, fielding: 72, experience: 88 },
      { name: "Max Sorensen", roles: ["Fast Bowler"], batting: 16, bowling: 78, fielding: 70, experience: 70 },
      { name: "Craig Young", roles: ["Fast Bowler"], batting: 14, bowling: 74, fielding: 68, experience: 62 }
    ]
  },

  {
    id: "eng-2019wc",
    label: "England 2019 World Cup squad",
    team: "England",
    year: 2019,
    players: [
      { name: "Jason Roy", roles: ["Opener"], batting: 90, bowling: 0, fielding: 82, experience: 88 },
      { name: "Jonny Bairstow", roles: ["Opener"], batting: 91, bowling: 0, fielding: 83, experience: 90 },
      { name: "Joe Root", roles: ["Top Order"], batting: 94, bowling: 25, fielding: 88, experience: 98 },
      { name: "Eoin Morgan", roles: ["Middle Order"], batting: 89, bowling: 5, fielding: 82, experience: 98 },
      { name: "Ben Stokes", roles: ["All-rounder"], batting: 91, bowling: 84, fielding: 89, experience: 92 },
      { name: "Jos Buttler", roles: ["Wicketkeeper"], batting: 93, bowling: 0, fielding: 88, experience: 94 },
      { name: "Moeen Ali", roles: ["All-rounder"], batting: 82, bowling: 84, fielding: 82, experience: 90 },
      { name: "Chris Woakes", roles: ["All-rounder"], batting: 72, bowling: 89, fielding: 84, experience: 92 },
      { name: "Jofra Archer", roles: ["Fast Bowler"], batting: 28, bowling: 92, fielding: 80, experience: 68 },
      { name: "Liam Plunkett", roles: ["Fast Bowler"], batting: 22, bowling: 84, fielding: 76, experience: 88 },
      { name: "Adil Rashid", roles: ["Spinner"], batting: 18, bowling: 89, fielding: 80, experience: 92 }
    ]
  },
  
  {
    id: "nz-2019wc",
    label: "New Zealand 2019 World Cup squad",
    team: "New Zealand",
    year: 2019,
    players: [
      { name: "Martin Guptill", roles: ["Opener"], batting: 88, bowling: 0, fielding: 84, experience: 95 },
      { name: "Henry Nicholls", roles: ["Opener"], batting: 80, bowling: 0, fielding: 78, experience: 78 },
      { name: "Kane Williamson", roles: ["Top Order"], batting: 95, bowling: 30, fielding: 90, experience: 96 },
      { name: "Ross Taylor", roles: ["Middle Order"], batting: 90, bowling: 10, fielding: 82, experience: 99 },
      { name: "Tom Latham", roles: ["Wicketkeeper"], batting: 84, bowling: 0, fielding: 86, experience: 84 },
      { name: "James Neesham", roles: ["All-rounder"], batting: 80, bowling: 78, fielding: 80, experience: 82 },
      { name: "Colin de Grandhomme", roles: ["All-rounder"], batting: 78, bowling: 80, fielding: 78, experience: 84 },
      { name: "Mitchell Santner", roles: ["Spinner"], batting: 68, bowling: 87, fielding: 84, experience: 86 },
      { name: "Trent Boult", roles: ["Fast Bowler"], batting: 18, bowling: 93, fielding: 82, experience: 94 },
      { name: "Lockie Ferguson", roles: ["Fast Bowler"], batting: 14, bowling: 90, fielding: 76, experience: 76 },
      { name: "Matt Henry", roles: ["Fast Bowler"], batting: 16, bowling: 86, fielding: 74, experience: 80 }
    ]
  },
  
  {
    id: "ban-2019wc",
    label: "Bangladesh 2019 World Cup squad",
    team: "Bangladesh",
    year: 2019,
    players: [
      { name: "Tamim Iqbal", roles: ["Opener"], batting: 86, bowling: 0, fielding: 78, experience: 97 },
      { name: "Soumya Sarkar", roles: ["Opener"], batting: 76, bowling: 45, fielding: 76, experience: 76 },
      { name: "Shakib Al Hasan", roles: ["All-rounder"], batting: 93, bowling: 90, fielding: 88, experience: 98 },
      { name: "Mushfiqur Rahim", roles: ["Wicketkeeper"], batting: 88, bowling: 0, fielding: 84, experience: 96 },
      { name: "Mahmudullah", roles: ["All-rounder"], batting: 84, bowling: 72, fielding: 80, experience: 94 },
      { name: "Mosaddek Hossain", roles: ["Middle Order"], batting: 74, bowling: 50, fielding: 76, experience: 68 },
      { name: "Sabbir Rahman", roles: ["Middle Order"], batting: 74, bowling: 20, fielding: 78, experience: 72 },
      { name: "Mehidy Hasan", roles: ["Spinner"], batting: 68, bowling: 84, fielding: 78, experience: 72 },
      { name: "Mashrafe Mortaza", roles: ["Fast Bowler"], batting: 48, bowling: 84, fielding: 80, experience: 99 },
      { name: "Mustafizur Rahman", roles: ["Fast Bowler"], batting: 18, bowling: 89, fielding: 76, experience: 82 },
      { name: "Rubel Hossain", roles: ["Fast Bowler"], batting: 14, bowling: 80, fielding: 72, experience: 82 }
    ]
  },
  
  {
    id: "afg-2019wc",
    label: "Afghanistan 2019 World Cup squad",
    team: "Afghanistan",
    year: 2019,
    players: [
      { name: "Hazratullah Zazai", roles: ["Opener"], batting: 78, bowling: 0, fielding: 70, experience: 64 },
      { name: "Noor Ali Zadran", roles: ["Opener"], batting: 70, bowling: 0, fielding: 68, experience: 84 },
      { name: "Rahmat Shah", roles: ["Top Order"], batting: 80, bowling: 10, fielding: 74, experience: 78 },
      { name: "Hashmatullah Shahidi", roles: ["Middle Order"], batting: 76, bowling: 0, fielding: 74, experience: 72 },
      { name: "Mohammad Nabi", roles: ["All-rounder"], batting: 86, bowling: 88, fielding: 84, experience: 96 },
      { name: "Asghar Afghan", roles: ["Middle Order"], batting: 78, bowling: 10, fielding: 76, experience: 92 },
      { name: "Najibullah Zadran", roles: ["Middle Order"], batting: 80, bowling: 0, fielding: 74, experience: 78 },
      { name: "Rashid Khan", roles: ["Spinner"], batting: 70, bowling: 94, fielding: 84, experience: 80 },
      { name: "Mujeeb Ur Rahman", roles: ["Spinner"], batting: 24, bowling: 88, fielding: 76, experience: 72 },
      { name: "Dawlat Zadran", roles: ["Fast Bowler"], batting: 16, bowling: 80, fielding: 72, experience: 84 },
      { name: "Hamid Hassan", roles: ["Fast Bowler"], batting: 12, bowling: 78, fielding: 70, experience: 80 }
    ]
  },
  
  {
    id: "sl-1996wc",
    label: "Sri Lanka 1996 World Cup squad",
    team: "Sri Lanka",
    year: 1996,
    players: [
      { name: "Sanath Jayasuriya", roles: ["Opener", "All-rounder"], batting: 93, bowling: 78, fielding: 88, experience: 84 },
      { name: "Romesh Kaluwitharana", roles: ["Opener", "Wicketkeeper"], batting: 84, bowling: 0, fielding: 82, experience: 80 },
      { name: "Asanka Gurusinha", roles: ["Top Order"], batting: 84, bowling: 20, fielding: 78, experience: 86 },
      { name: "Aravinda de Silva", roles: ["Middle Order"], batting: 95, bowling: 68, fielding: 86, experience: 95 },
      { name: "Arjuna Ranatunga", roles: ["Middle Order"], batting: 90, bowling: 20, fielding: 78, experience: 99 },
      { name: "Hashan Tillakaratne", roles: ["Middle Order"], batting: 82, bowling: 0, fielding: 82, experience: 90 },
      { name: "Roshan Mahanama", roles: ["Middle Order"], batting: 80, bowling: 0, fielding: 84, experience: 92 },
      { name: "Kumar Dharmasena", roles: ["All-rounder"], batting: 72, bowling: 82, fielding: 80, experience: 84 },
      { name: "Muttiah Muralitharan", roles: ["Spinner"], batting: 18, bowling: 92, fielding: 76, experience: 78 },
      { name: "Chaminda Vaas", roles: ["Fast Bowler"], batting: 28, bowling: 88, fielding: 82, experience: 74 },
      { name: "Pramodya Wickramasinghe", roles: ["Fast Bowler"], batting: 18, bowling: 80, fielding: 72, experience: 76 }
    ]
  },
  
  {
    id: "zim-1999wc",
    label: "Zimbabwe 1999 World Cup squad",
    team: "Zimbabwe",
    year: 1999,
    players: [
      { name: "Neil Johnson", roles: ["All-rounder"], batting: 88, bowling: 84, fielding: 84, experience: 82 },
      { name: "Grant Flower", roles: ["Opener"], batting: 82, bowling: 20, fielding: 80, experience: 90 },
      { name: "Andy Flower", roles: ["Wicketkeeper"], batting: 95, bowling: 0, fielding: 90, experience: 92 },
      { name: "Alistair Campbell", roles: ["Top Order"], batting: 80, bowling: 0, fielding: 78, experience: 90 },
      { name: "Stuart Carlisle", roles: ["Middle Order"], batting: 74, bowling: 0, fielding: 74, experience: 76 },
      { name: "Guy Whittall", roles: ["All-rounder"], batting: 74, bowling: 76, fielding: 78, experience: 84 },
      { name: "Heath Streak", roles: ["All-rounder"], batting: 72, bowling: 92, fielding: 82, experience: 94 },
      { name: "Paul Strang", roles: ["Spinner"], batting: 62, bowling: 84, fielding: 78, experience: 86 },
      { name: "Henry Olonga", roles: ["Fast Bowler"], batting: 18, bowling: 82, fielding: 72, experience: 76 },
      { name: "Mpumelelo Mbangwa", roles: ["Fast Bowler"], batting: 14, bowling: 80, fielding: 70, experience: 84 },
      { name: "Pommie Mbangwa", roles: ["Fast Bowler"], batting: 12, bowling: 78, fielding: 70, experience: 86 }
    ]
  },
  
  {
    id: "pak-1992wc",
    label: "Pakistan 1992 World Cup squad",
    team: "Pakistan",
    year: 1992,
    players: [
      { name: "Aamer Sohail", roles: ["Opener"], batting: 86, bowling: 20, fielding: 78, experience: 84 },
      { name: "Rameez Raja", roles: ["Opener"], batting: 84, bowling: 0, fielding: 80, experience: 92 },
      { name: "Javed Miandad", roles: ["Top Order"], batting: 96, bowling: 15, fielding: 82, experience: 100 },
      { name: "Inzamam-ul-Haq", roles: ["Middle Order"], batting: 84, bowling: 0, fielding: 76, experience: 62 },
      { name: "Saleem Malik", roles: ["Middle Order"], batting: 90, bowling: 10, fielding: 80, experience: 94 },
      { name: "Imran Khan", roles: ["All-rounder"], batting: 90, bowling: 94, fielding: 88, experience: 100 },
      { name: "Wasim Akram", roles: ["All-rounder"], batting: 82, bowling: 97, fielding: 88, experience: 92 },
      { name: "Moin Khan", roles: ["Wicketkeeper"], batting: 74, bowling: 0, fielding: 84, experience: 74 },
      { name: "Mushtaq Ahmed", roles: ["Spinner"], batting: 20, bowling: 88, fielding: 76, experience: 68 },
      { name: "Aaqib Javed", roles: ["Fast Bowler"], batting: 18, bowling: 86, fielding: 74, experience: 78 },
      { name: "Waqar Younis", roles: ["Fast Bowler"], batting: 20, bowling: 96, fielding: 78, experience: 86 }
    ]
  },
  
  {
    id: "ken-1996wc",
    label: "Kenya 1996 World Cup squad",
    team: "Kenya",
    year: 1996,
    players: [
      { name: "Dipak Chudasama", roles: ["Opener"], batting: 68, bowling: 0, fielding: 72, experience: 70 },
      { name: "Kennedy Otieno", roles: ["Opener"], batting: 66, bowling: 0, fielding: 72, experience: 74 },
      { name: "Steve Tikolo", roles: ["Top Order"], batting: 80, bowling: 60, fielding: 80, experience: 76 },
      { name: "Maurice Odumbe", roles: ["All-rounder"], batting: 74, bowling: 74, fielding: 76, experience: 82 },
      { name: "Hitesh Modi", roles: ["Middle Order"], batting: 70, bowling: 20, fielding: 72, experience: 78 },
      { name: "Ravi Shah", roles: ["Middle Order"], batting: 68, bowling: 10, fielding: 72, experience: 70 },
      { name: "Thomas Odoyo", roles: ["All-rounder"], batting: 68, bowling: 72, fielding: 74, experience: 66 },
      { name: "David Obuya", roles: ["Wicketkeeper"], batting: 62, bowling: 0, fielding: 74, experience: 60 },
      { name: "Rajab Ali", roles: ["Spinner"], batting: 32, bowling: 76, fielding: 70, experience: 72 },
      { name: "Martin Suji", roles: ["Fast Bowler"], batting: 20, bowling: 78, fielding: 70, experience: 72 },
      { name: "Aasif Karim", roles: ["Spinner"], batting: 34, bowling: 80, fielding: 74, experience: 80 }
    ]
  },
  
  {
    id: "ber-2007wc",
    label: "Bermuda 2007 World Cup squad",
    team: "Bermuda",
    year: 2007,
    players: [
      { name: "Stephen Outerbridge", roles: ["Opener"], batting: 61, bowling: 0, fielding: 67, experience: 70 },
      { name: "Oliver Pitcher", roles: ["Opener"], batting: 59, bowling: 0, fielding: 65, experience: 66 },
      { name: "Irving Romaine", roles: ["Top Order"], batting: 66, bowling: 20, fielding: 68, experience: 84 },
      { name: "David Hemp", roles: ["Middle Order"], batting: 78, bowling: 35, fielding: 74, experience: 90 },
      { name: "Delyone Borden", roles: ["Middle Order"], batting: 58, bowling: 40, fielding: 66, experience: 65 },
      { name: "Lionel Cann", roles: ["All-rounder"], batting: 69, bowling: 68, fielding: 72, experience: 82 },
      { name: "Dean Minors", roles: ["Wicketkeeper"], batting: 60, bowling: 0, fielding: 74, experience: 79 },
      { name: "Dwayne Leverock", roles: ["Spinner"], batting: 38, bowling: 70, fielding: 85, experience: 80 },
      { name: "Malachi Jones", roles: ["Fast Bowler"], batting: 22, bowling: 72, fielding: 66, experience: 60 },
      { name: "Stefan Kelly", roles: ["Fast Bowler"], batting: 20, bowling: 68, fielding: 65, experience: 62 },
      { name: "Kevin Hurdle", roles: ["Fast Bowler"], batting: 18, bowling: 71, fielding: 68, experience: 72 }
    ]
  },

  {
    id: "ind-1983wc",
    label: "India 1983 World Cup squad",
    team: "India",
    year: 1983,
    players: [
      { name: "Sunil Gavaskar", roles: ["Opener"], batting: 95, bowling: 5, fielding: 82, experience: 100 },
      { name: "Krishnamachari Srikkanth", roles: ["Opener"], batting: 82, bowling: 25, fielding: 78, experience: 76 },
      { name: "Mohinder Amarnath", roles: ["All-rounder"], batting: 88, bowling: 82, fielding: 80, experience: 92 },
      { name: "Yashpal Sharma", roles: ["Top Order"], batting: 84, bowling: 10, fielding: 78, experience: 84 },
      { name: "Sandeep Patil", roles: ["Middle Order"], batting: 86, bowling: 5, fielding: 80, experience: 80 },
      { name: "Kapil Dev", roles: ["All-rounder"], batting: 92, bowling: 94, fielding: 88, experience: 94 },
      { name: "Kirti Azad", roles: ["All-rounder"], batting: 72, bowling: 72, fielding: 76, experience: 76 },
      { name: "Syed Kirmani", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 90, experience: 92 },
      { name: "Roger Binny", roles: ["All-rounder"], batting: 72, bowling: 84, fielding: 80, experience: 82 },
      { name: "Madan Lal", roles: ["Fast Bowler"], batting: 68, bowling: 82, fielding: 78, experience: 84 },
      { name: "Balwinder Sandhu", roles: ["Fast Bowler"], batting: 52, bowling: 78, fielding: 74, experience: 76 }
    ]
  },
  
  {
    id: "wi-1983wc",
    label: "West Indies 1983 World Cup squad",
    team: "West Indies",
    year: 1983,
    players: [
      { name: "Gordon Greenidge", roles: ["Opener"], batting: 94, bowling: 0, fielding: 82, experience: 98 },
      { name: "Desmond Haynes", roles: ["Opener"], batting: 92, bowling: 0, fielding: 82, experience: 94 },
      { name: "Viv Richards", roles: ["Top Order"], batting: 99, bowling: 45, fielding: 92, experience: 100 },
      { name: "Larry Gomes", roles: ["Middle Order"], batting: 84, bowling: 0, fielding: 78, experience: 88 },
      { name: "Clive Lloyd", roles: ["Middle Order"], batting: 92, bowling: 10, fielding: 82, experience: 100 },
      { name: "Jeff Dujon", roles: ["Wicketkeeper"], batting: 82, bowling: 0, fielding: 92, experience: 92 },
      { name: "Malcolm Marshall", roles: ["Fast Bowler"], batting: 58, bowling: 96, fielding: 84, experience: 90 },
      { name: "Joel Garner", roles: ["Fast Bowler"], batting: 32, bowling: 95, fielding: 82, experience: 94 },
      { name: "Michael Holding", roles: ["Fast Bowler"], batting: 24, bowling: 95, fielding: 80, experience: 96 },
      { name: "Andy Roberts", roles: ["Fast Bowler"], batting: 28, bowling: 94, fielding: 80, experience: 98 },
      { name: "Roger Harper", roles: ["All-rounder"], batting: 66, bowling: 78, fielding: 86, experience: 72 }
    ]
  },
  
  {
    id: "aus-1987wc",
    label: "Australia 1987 World Cup squad",
    team: "Australia",
    year: 1987,
    players: [
      { name: "Geoff Marsh", roles: ["Opener"], batting: 88, bowling: 0, fielding: 80, experience: 88 },
      { name: "David Boon", roles: ["Opener"], batting: 90, bowling: 0, fielding: 80, experience: 92 },
      { name: "Dean Jones", roles: ["Top Order"], batting: 92, bowling: 20, fielding: 88, experience: 90 },
      { name: "Allan Border", roles: ["Middle Order"], batting: 95, bowling: 35, fielding: 84, experience: 100 },
      { name: "Steve Waugh", roles: ["All-rounder"], batting: 86, bowling: 82, fielding: 88, experience: 82 },
      { name: "Tom Moody", roles: ["All-rounder"], batting: 78, bowling: 78, fielding: 80, experience: 72 },
      { name: "Greg Dyer", roles: ["Wicketkeeper"], batting: 70, bowling: 0, fielding: 84, experience: 78 },
      { name: "Craig McDermott", roles: ["Fast Bowler"], batting: 24, bowling: 88, fielding: 76, experience: 80 },
      { name: "Bruce Reid", roles: ["Fast Bowler"], batting: 22, bowling: 90, fielding: 76, experience: 82 },
      { name: "Simon O'Donnell", roles: ["All-rounder"], batting: 74, bowling: 82, fielding: 78, experience: 80 },
      { name: "Tim May", roles: ["Spinner"], batting: 38, bowling: 80, fielding: 76, experience: 70 }
    ]
  },
  
  {
    id: "zim-1987wc",
    label: "Zimbabwe 1987 World Cup squad",
    team: "Zimbabwe",
    year: 1987,
    players: [
      { name: "David Houghton", roles: ["Top Order"], batting: 82, bowling: 0, fielding: 78, experience: 86 },
      { name: "Ali Shah", roles: ["Opener"], batting: 68, bowling: 10, fielding: 70, experience: 74 },
      { name: "Kevin Curran", roles: ["All-rounder"], batting: 78, bowling: 80, fielding: 78, experience: 84 },
      { name: "Andy Pycroft", roles: ["Middle Order"], batting: 74, bowling: 0, fielding: 74, experience: 80 },
      { name: "Iain Butchart", roles: ["All-rounder"], batting: 70, bowling: 74, fielding: 74, experience: 78 },
      { name: "Grant Paterson", roles: ["Wicketkeeper"], batting: 66, bowling: 0, fielding: 80, experience: 72 },
      { name: "John Traicos", roles: ["Spinner"], batting: 52, bowling: 82, fielding: 76, experience: 95 },
      { name: "Eddo Brandes", roles: ["Fast Bowler"], batting: 24, bowling: 80, fielding: 74, experience: 72 },
      { name: "Gary Crocker", roles: ["Fast Bowler"], batting: 22, bowling: 76, fielding: 72, experience: 74 },
      { name: "Phil Carlson", roles: ["Fast Bowler"], batting: 20, bowling: 74, fielding: 70, experience: 70 },
      { name: "Patrick Shah", roles: ["Middle Order"], batting: 68, bowling: 0, fielding: 70, experience: 72 }
    ]
  },
  
  {
    id: "sa-2003wc",
    label: "South Africa 2003 World Cup squad",
    team: "South Africa",
    year: 2003,
    players: [
      { name: "Graeme Smith", roles: ["Opener"], batting: 88, bowling: 0, fielding: 82, experience: 78 },
      { name: "Herschelle Gibbs", roles: ["Opener"], batting: 92, bowling: 20, fielding: 90, experience: 90 },
      { name: "Jacques Kallis", roles: ["All-rounder"], batting: 96, bowling: 90, fielding: 88, experience: 98 },
      { name: "Gary Kirsten", roles: ["Top Order"], batting: 90, bowling: 0, fielding: 82, experience: 98 },
      { name: "Boeta Dippenaar", roles: ["Middle Order"], batting: 80, bowling: 0, fielding: 76, experience: 80 },
      { name: "Mark Boucher", roles: ["Wicketkeeper"], batting: 84, bowling: 0, fielding: 92, experience: 92 },
      { name: "Lance Klusener", roles: ["All-rounder"], batting: 88, bowling: 86, fielding: 84, experience: 96 },
      { name: "Shaun Pollock", roles: ["All-rounder"], batting: 82, bowling: 94, fielding: 88, experience: 98 },
      { name: "Makhaya Ntini", roles: ["Fast Bowler"], batting: 20, bowling: 90, fielding: 76, experience: 86 },
      { name: "Allan Donald", roles: ["Fast Bowler"], batting: 16, bowling: 95, fielding: 80, experience: 100 },
      { name: "Robin Peterson", roles: ["Spinner"], batting: 50, bowling: 80, fielding: 78, experience: 70 }
    ]
  },
  
  {
    id: "ned-2003wc",
    label: "Netherlands 2003 World Cup squad",
    team: "Netherlands",
    year: 2003,
    players: [
      { name: "Robert van Oosterom", roles: ["Opener"], batting: 62, bowling: 0, fielding: 68, experience: 72 },
      { name: "Daan van Bunge", roles: ["Opener"], batting: 66, bowling: 0, fielding: 68, experience: 68 },
      { name: "Tim de Leede", roles: ["All-rounder"], batting: 82, bowling: 80, fielding: 82, experience: 94 },
      { name: "Bas Zuiderent", roles: ["Middle Order"], batting: 72, bowling: 20, fielding: 74, experience: 80 },
      { name: "Luuk van Troost", roles: ["Wicketkeeper"], batting: 66, bowling: 0, fielding: 76, experience: 84 },
      { name: "Feiko Kloppenburg", roles: ["All-rounder"], batting: 64, bowling: 74, fielding: 72, experience: 74 },
      { name: "Roland Lefebvre", roles: ["All-rounder"], batting: 68, bowling: 76, fielding: 74, experience: 88 },
      { name: "Adeel Raja", roles: ["Spinner"], batting: 40, bowling: 74, fielding: 72, experience: 68 },
      { name: "Edgar Schiferli", roles: ["Fast Bowler"], batting: 18, bowling: 72, fielding: 68, experience: 62 },
      { name: "Victor Grandia", roles: ["Fast Bowler"], batting: 16, bowling: 70, fielding: 68, experience: 70 },
      { name: "Jeroen Smits", roles: ["Middle Order"], batting: 64, bowling: 0, fielding: 74, experience: 78 }
    ]
  },
  
  {
    id: "ned-2023wc",
    label: "Netherlands 2023 World Cup squad",
    team: "Netherlands",
    year: 2023,
    players: [
      { name: "Max O'Dowd", roles: ["Opener"], batting: 74, bowling: 5, fielding: 74, experience: 75 },
      { name: "Vikram Singh", roles: ["Opener"], batting: 70, bowling: 0, fielding: 71, experience: 62 },
      { name: "Colin Ackermann", roles: ["All-rounder"], batting: 78, bowling: 70, fielding: 76, experience: 82 },
      { name: "Bas de Leede", roles: ["All-rounder"], batting: 82, bowling: 78, fielding: 80, experience: 68 },
      { name: "Teja Nidamanuru", roles: ["Middle Order"], batting: 76, bowling: 0, fielding: 73, experience: 64 },
      { name: "Scott Edwards", roles: ["Wicketkeeper"], batting: 80, bowling: 0, fielding: 84, experience: 76 },
      { name: "Sybrand Engelbrecht", roles: ["All-rounder"], batting: 75, bowling: 65, fielding: 78, experience: 72 },
      { name: "Roelof van der Merwe", roles: ["Spinner"], batting: 65, bowling: 82, fielding: 80, experience: 92 },
      { name: "Paul van Meekeren", roles: ["Fast Bowler"], batting: 22, bowling: 82, fielding: 74, experience: 80 },
      { name: "Aryan Dutt", roles: ["Spinner"], batting: 25, bowling: 78, fielding: 72, experience: 58 },
      { name: "Ryan Klein", roles: ["Fast Bowler"], batting: 18, bowling: 74, fielding: 70, experience: 55 }
    ]
  },
  
  {
    id: "afg-2023wc",
    label: "Afghanistan 2023 World Cup squad",
    team: "Afghanistan",
    year: 2023,
    players: [
      { name: "Rahmanullah Gurbaz", roles: ["Opener", "Wicketkeeper"], batting: 86, bowling: 0, fielding: 82, experience: 74 },
      { name: "Ibrahim Zadran", roles: ["Opener"], batting: 84, bowling: 0, fielding: 78, experience: 72 },
      { name: "Rahmat Shah", roles: ["Top Order"], batting: 82, bowling: 10, fielding: 76, experience: 86 },
      { name: "Hashmatullah Shahidi", roles: ["Middle Order"], batting: 82, bowling: 0, fielding: 76, experience: 88 },
      { name: "Azmatullah Omarzai", roles: ["All-rounder"], batting: 84, bowling: 82, fielding: 80, experience: 72 },
      { name: "Mohammad Nabi", roles: ["All-rounder"], batting: 84, bowling: 88, fielding: 84, experience: 99 },
      { name: "Rashid Khan", roles: ["Spinner"], batting: 74, bowling: 95, fielding: 86, experience: 92 },
      { name: "Mujeeb Ur Rahman", roles: ["Spinner"], batting: 24, bowling: 89, fielding: 78, experience: 84 },
      { name: "Naveen-ul-Haq", roles: ["Fast Bowler"], batting: 18, bowling: 84, fielding: 74, experience: 78 },
      { name: "Fazalhaq Farooqi", roles: ["Fast Bowler"], batting: 16, bowling: 86, fielding: 74, experience: 72 },
      { name: "Noor Ahmad", roles: ["Spinner"], batting: 18, bowling: 84, fielding: 76, experience: 64 }
    ]
  }
  
];

export const WORLD_CUP_SQUADS = RAW_WORLD_CUP_SQUADS.map(normalizeSquad);
