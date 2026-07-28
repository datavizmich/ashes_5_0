var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../site/data/ashes-squads.js
var ROLE_ORDER = ["Opener", "Top Order", "Middle Order", "Wicketkeeper", "All-rounder", "Spinner", "Fast Bowler"];
function roleRank(player) {
  if (!player?.roles?.length) return ROLE_ORDER.length;
  const ranks = player.roles.map((role) => ROLE_ORDER.indexOf(role)).filter((index) => index >= 0);
  return ranks.length ? Math.min(...ranks) : ROLE_ORDER.length;
}
__name(roleRank, "roleRank");
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
__name(sortSquadPlayers, "sortSquadPlayers");
function normalizeSquad(squad) {
  return {
    ...squad,
    label: squad.label.replace(/\s+(Ashes|World Cup)\s+squad$/u, ""),
    players: sortSquadPlayers(squad.players)
  };
}
__name(normalizeSquad, "normalizeSquad");
var RAW_ASHES_SQUADS = [
  {
    id: "eng-2005",
    label: "England 2005 Ashes squad",
    team: "England",
    year: 2005,
    players: [
      { name: "Marcus Trescothick", roles: ["Opener"], batting: 88, bowling: 10, fielding: 78, experience: 91 },
      { name: "Andrew Strauss", roles: ["Opener"], batting: 86, bowling: 8, fielding: 80, experience: 92 },
      { name: "Michael Vaughan", roles: ["Top Order"], batting: 83, bowling: 12, fielding: 84, experience: 91 },
      { name: "Kevin Pietersen", roles: ["Top Order", "Middle Order"], batting: 91, bowling: 5, fielding: 79, experience: 88 },
      { name: "Ian Bell", roles: ["Middle Order"], batting: 84, bowling: 0, fielding: 81, experience: 78 },
      { name: "Paul Collingwood", roles: ["Middle Order", "All-rounder"], batting: 80, bowling: 65, fielding: 88, experience: 82 },
      { name: "Andrew Flintoff", roles: ["All-rounder"], batting: 85, bowling: 88, fielding: 85, experience: 90 },
      { name: "Geraint Jones", roles: ["Wicketkeeper"], batting: 72, bowling: 0, fielding: 77, experience: 70 },
      { name: "Ashley Giles", roles: ["Spinner"], batting: 45, bowling: 84, fielding: 78, experience: 86 },
      { name: "Steve Harmison", roles: ["Fast Bowler"], batting: 18, bowling: 89, fielding: 70, experience: 84 },
      { name: "Matthew Hoggard", roles: ["Fast Bowler"], batting: 14, bowling: 87, fielding: 74, experience: 83 },
      { name: "Simon Jones", roles: ["Fast Bowler"], batting: 12, bowling: 86, fielding: 71, experience: 78 }
    ]
  },
  {
    id: "aus-2006",
    label: "Australia 2006-07 Ashes squad",
    team: "Australia",
    year: 2006,
    players: [
      { name: "Matthew Hayden", roles: ["Opener"], batting: 93, bowling: 5, fielding: 76, experience: 96 },
      { name: "Justin Langer", roles: ["Opener"], batting: 91, bowling: 4, fielding: 80, experience: 97 },
      { name: "Ricky Ponting", roles: ["Top Order"], batting: 95, bowling: 10, fielding: 87, experience: 98 },
      { name: "Michael Hussey", roles: ["Middle Order"], batting: 93, bowling: 6, fielding: 86, experience: 89 },
      { name: "Michael Clarke", roles: ["Middle Order"], batting: 87, bowling: 20, fielding: 91, experience: 85 },
      { name: "Adam Gilchrist", roles: ["Wicketkeeper"], batting: 92, bowling: 0, fielding: 89, experience: 97 },
      { name: "Andrew Symonds", roles: ["All-rounder"], batting: 85, bowling: 68, fielding: 92, experience: 88 },
      { name: "Shane Warne", roles: ["Spinner"], batting: 32, bowling: 97, fielding: 76, experience: 99 },
      { name: "Glenn McGrath", roles: ["Fast Bowler"], batting: 15, bowling: 94, fielding: 84, experience: 99 },
      { name: "Brett Lee", roles: ["Fast Bowler"], batting: 20, bowling: 89, fielding: 87, experience: 95 },
      { name: "Stuart Clark", roles: ["Fast Bowler"], batting: 15, bowling: 88, fielding: 82, experience: 84 },
      { name: "Mitchell Johnson", roles: ["Fast Bowler"], batting: 18, bowling: 80, fielding: 80, experience: 65 }
    ]
  },
  {
    id: "aus-2005",
    label: "Australia 2005 Ashes squad",
    team: "Australia",
    year: 2005,
    players: [
      { name: "Matthew Hayden", roles: ["Opener"], batting: 92, bowling: 5, fielding: 75, experience: 95 },
      { name: "Justin Langer", roles: ["Opener"], batting: 89, bowling: 4, fielding: 80, experience: 94 },
      { name: "Ricky Ponting", roles: ["Top Order"], batting: 90, bowling: 10, fielding: 85, experience: 96 },
      { name: "Damien Martyn", roles: ["Middle Order"], batting: 88, bowling: 4, fielding: 88, experience: 86 },
      { name: "Michael Clarke", roles: ["Middle Order"], batting: 84, bowling: 20, fielding: 90, experience: 82 },
      { name: "Adam Gilchrist", roles: ["Wicketkeeper"], batting: 91, bowling: 0, fielding: 88, experience: 95 },
      { name: "Shane Watson", roles: ["All-rounder"], batting: 78, bowling: 72, fielding: 85, experience: 74 },
      { name: "Shane Warne", roles: ["Spinner"], batting: 30, bowling: 96, fielding: 74, experience: 99 },
      { name: "Glenn McGrath", roles: ["Fast Bowler"], batting: 15, bowling: 93, fielding: 82, experience: 97 },
      { name: "Brett Lee", roles: ["Fast Bowler"], batting: 20, bowling: 86, fielding: 86, experience: 93 },
      { name: "Jason Gillespie", roles: ["Fast Bowler"], batting: 16, bowling: 82, fielding: 83, experience: 88 },
      { name: "Michael Kasprowicz", roles: ["Fast Bowler"], batting: 14, bowling: 81, fielding: 80, experience: 82 }
    ]
  },
  {
    id: "eng-2010",
    label: "England 2010-11 Ashes squad",
    team: "England",
    year: 2010,
    players: [
      { name: "Alastair Cook", roles: ["Opener"], batting: 91, bowling: 15, fielding: 82, experience: 92 },
      { name: "Andrew Strauss", roles: ["Opener"], batting: 88, bowling: 8, fielding: 79, experience: 93 },
      { name: "Jonathan Trott", roles: ["Top Order"], batting: 84, bowling: 10, fielding: 82, experience: 85 },
      { name: "Kevin Pietersen", roles: ["Middle Order"], batting: 92, bowling: 5, fielding: 80, experience: 89 },
      { name: "Ian Bell", roles: ["Middle Order"], batting: 86, bowling: 2, fielding: 83, experience: 82 },
      { name: "Eoin Morgan", roles: ["Middle Order", "All-rounder"], batting: 81, bowling: 20, fielding: 79, experience: 74 },
      { name: "Matt Prior", roles: ["Wicketkeeper"], batting: 80, bowling: 0, fielding: 83, experience: 84 },
      { name: "Paul Collingwood", roles: ["All-rounder"], batting: 79, bowling: 60, fielding: 88, experience: 85 },
      { name: "Graeme Swann", roles: ["Spinner"], batting: 35, bowling: 86, fielding: 76, experience: 87 },
      { name: "James Anderson", roles: ["Fast Bowler"], batting: 18, bowling: 86, fielding: 80, experience: 90 },
      { name: "Stuart Broad", roles: ["Fast Bowler"], batting: 24, bowling: 84, fielding: 82, experience: 88 },
      { name: "Steven Finn", roles: ["Fast Bowler"], batting: 12, bowling: 80, fielding: 75, experience: 72 }
    ]
  },
  {
    id: "aus-2013",
    label: "Australia 2013 Ashes squad",
    team: "Australia",
    year: 2013,
    players: [
      { name: "David Warner", roles: ["Opener"], batting: 84, bowling: 8, fielding: 75, experience: 82 },
      { name: "Chris Rogers", roles: ["Opener"], batting: 85, bowling: 5, fielding: 82, experience: 83 },
      { name: "Michael Clarke", roles: ["Top Order", "Middle Order"], batting: 91, bowling: 12, fielding: 88, experience: 94 },
      { name: "Steve Smith", roles: ["Middle Order"], batting: 81, bowling: 18, fielding: 89, experience: 76 },
      { name: "Shane Watson", roles: ["All-rounder"], batting: 82, bowling: 70, fielding: 83, experience: 84 },
      { name: "Brad Haddin", roles: ["Wicketkeeper"], batting: 78, bowling: 0, fielding: 86, experience: 88 },
      { name: "Ashton Agar", roles: ["Spinner"], batting: 48, bowling: 68, fielding: 78, experience: 55 },
      { name: "Nathan Lyon", roles: ["Spinner"], batting: 31, bowling: 84, fielding: 78, experience: 88 },
      { name: "Mitchell Starc", roles: ["Fast Bowler"], batting: 20, bowling: 86, fielding: 84, experience: 86 },
      { name: "Peter Siddle", roles: ["Fast Bowler"], batting: 18, bowling: 85, fielding: 82, experience: 85 },
      { name: "Ryan Harris", roles: ["Fast Bowler"], batting: 16, bowling: 87, fielding: 81, experience: 89 },
      { name: "James Pattinson", roles: ["Fast Bowler"], batting: 14, bowling: 82, fielding: 80, experience: 78 }
    ]
  },
  {
    id: "eng-2015",
    label: "England 2015 Ashes squad",
    team: "England",
    year: 2015,
    players: [
      { name: "Alastair Cook", roles: ["Opener"], batting: 90, bowling: 12, fielding: 82, experience: 94 },
      { name: "Adam Lyth", roles: ["Opener"], batting: 78, bowling: 8, fielding: 76, experience: 70 },
      { name: "Joe Root", roles: ["Top Order", "Middle Order"], batting: 92, bowling: 20, fielding: 88, experience: 95 },
      { name: "Ian Bell", roles: ["Middle Order"], batting: 85, bowling: 3, fielding: 82, experience: 84 },
      { name: "Ben Stokes", roles: ["All-rounder"], batting: 88, bowling: 78, fielding: 86, experience: 84 },
      { name: "Jonny Bairstow", roles: ["Wicketkeeper", "Middle Order"], batting: 84, bowling: 12, fielding: 85, experience: 80 },
      { name: "Moeen Ali", roles: ["All-rounder", "Spinner"], batting: 83, bowling: 75, fielding: 82, experience: 81 },
      { name: "Adil Rashid", roles: ["Spinner"], batting: 40, bowling: 84, fielding: 74, experience: 79 },
      { name: "Stuart Broad", roles: ["Fast Bowler"], batting: 24, bowling: 84, fielding: 84, experience: 89 },
      { name: "James Anderson", roles: ["Fast Bowler"], batting: 18, bowling: 86, fielding: 86, experience: 91 },
      { name: "Mark Wood", roles: ["Fast Bowler"], batting: 15, bowling: 82, fielding: 82, experience: 76 },
      { name: "Steven Finn", roles: ["Fast Bowler"], batting: 12, bowling: 80, fielding: 78, experience: 70 }
    ]
  },
  {
    id: "aus-2023",
    label: "Australia 2023 Ashes squad",
    team: "Australia",
    year: 2023,
    players: [
      { name: "Usman Khawaja", roles: ["Opener"], batting: 90, bowling: 8, fielding: 82, experience: 88 },
      { name: "David Warner", roles: ["Opener"], batting: 84, bowling: 5, fielding: 78, experience: 89 },
      { name: "Marnus Labuschagne", roles: ["Top Order"], batting: 89, bowling: 10, fielding: 86, experience: 90 },
      { name: "Steve Smith", roles: ["Middle Order"], batting: 93, bowling: 18, fielding: 91, experience: 96 },
      { name: "Travis Head", roles: ["Middle Order"], batting: 88, bowling: 24, fielding: 84, experience: 85 },
      { name: "Alex Carey", roles: ["Wicketkeeper"], batting: 79, bowling: 0, fielding: 88, experience: 80 },
      { name: "Cameron Green", roles: ["All-rounder"], batting: 84, bowling: 74, fielding: 86, experience: 75 },
      { name: "Nathan Lyon", roles: ["Spinner"], batting: 31, bowling: 88, fielding: 80, experience: 91 },
      { name: "Pat Cummins", roles: ["Fast Bowler"], batting: 28, bowling: 87, fielding: 87, experience: 92 },
      { name: "Mitchell Starc", roles: ["Fast Bowler"], batting: 24, bowling: 84, fielding: 84, experience: 88 },
      { name: "Josh Hazlewood", roles: ["Fast Bowler"], batting: 20, bowling: 85, fielding: 85, experience: 90 },
      { name: "Scott Boland", roles: ["Fast Bowler"], batting: 18, bowling: 83, fielding: 82, experience: 74 }
    ]
  },
  {
    id: "eng-2023",
    label: "England 2023 Ashes squad",
    team: "England",
    year: 2023,
    players: [
      { name: "Zak Crawley", roles: ["Opener"], batting: 80, bowling: 8, fielding: 74, experience: 78 },
      { name: "Ben Duckett", roles: ["Opener"], batting: 83, bowling: 5, fielding: 77, experience: 77 },
      { name: "Ollie Pope", roles: ["Top Order"], batting: 85, bowling: 8, fielding: 81, experience: 82 },
      { name: "Joe Root", roles: ["Middle Order"], batting: 92, bowling: 15, fielding: 88, experience: 96 },
      { name: "Harry Brook", roles: ["Middle Order"], batting: 90, bowling: 10, fielding: 84, experience: 72 },
      { name: "Ben Stokes", roles: ["All-rounder"], batting: 89, bowling: 72, fielding: 86, experience: 92 },
      { name: "Jonny Bairstow", roles: ["Wicketkeeper"], batting: 81, bowling: 0, fielding: 79, experience: 86 },
      { name: "Moeen Ali", roles: ["All-rounder", "Spinner"], batting: 82, bowling: 74, fielding: 80, experience: 83 },
      { name: "Stuart Broad", roles: ["Fast Bowler"], batting: 24, bowling: 85, fielding: 84, experience: 92 },
      { name: "James Anderson", roles: ["Fast Bowler"], batting: 18, bowling: 87, fielding: 87, experience: 93 },
      { name: "Mark Wood", roles: ["Fast Bowler"], batting: 16, bowling: 84, fielding: 83, experience: 80 },
      { name: "Josh Tongue", roles: ["Fast Bowler"], batting: 14, bowling: 82, fielding: 80, experience: 64 }
    ]
  },
  {
    id: "aus-2019",
    label: "Australia 2019 Ashes squad",
    team: "Australia",
    year: 2019,
    players: [
      { name: "David Warner", roles: ["Opener"], batting: 84, bowling: 4, fielding: 78, experience: 92 },
      { name: "Cameron Bancroft", roles: ["Opener"], batting: 76, bowling: 3, fielding: 78, experience: 73 },
      { name: "Marnus Labuschagne", roles: ["Top Order"], batting: 88, bowling: 10, fielding: 86, experience: 84 },
      { name: "Steve Smith", roles: ["Middle Order"], batting: 96, bowling: 16, fielding: 92, experience: 96 },
      { name: "Travis Head", roles: ["Middle Order"], batting: 84, bowling: 18, fielding: 83, experience: 80 },
      { name: "Matthew Wade", roles: ["Middle Order"], batting: 77, bowling: 6, fielding: 82, experience: 78 },
      { name: "Mitchell Marsh", roles: ["All-rounder"], batting: 76, bowling: 80, fielding: 84, experience: 78 },
      { name: "Nathan Lyon", roles: ["Spinner"], batting: 30, bowling: 88, fielding: 81, experience: 92 },
      { name: "Pat Cummins", roles: ["Fast Bowler"], batting: 28, bowling: 88, fielding: 87, experience: 91 },
      { name: "Josh Hazlewood", roles: ["Fast Bowler"], batting: 20, bowling: 86, fielding: 84, experience: 89 },
      { name: "Mitchell Starc", roles: ["Fast Bowler"], batting: 22, bowling: 85, fielding: 83, experience: 87 },
      { name: "Peter Siddle", roles: ["Fast Bowler"], batting: 18, bowling: 82, fielding: 81, experience: 86 }
    ]
  },
  {
    id: "eng-2019",
    label: "England 2019 Ashes squad",
    team: "England",
    year: 2019,
    players: [
      { name: "Rory Burns", roles: ["Opener"], batting: 84, bowling: 4, fielding: 77, experience: 76 },
      { name: "Jason Roy", roles: ["Opener"], batting: 78, bowling: 3, fielding: 76, experience: 72 },
      { name: "Joe Root", roles: ["Top Order", "Middle Order"], batting: 93, bowling: 14, fielding: 89, experience: 96 },
      { name: "Joe Denly", roles: ["Middle Order"], batting: 74, bowling: 18, fielding: 78, experience: 68 },
      { name: "Ben Stokes", roles: ["All-rounder"], batting: 94, bowling: 79, fielding: 88, experience: 93 },
      { name: "Jos Buttler", roles: ["Wicketkeeper"], batting: 86, bowling: 0, fielding: 85, experience: 86 },
      { name: "Moeen Ali", roles: ["All-rounder", "Spinner"], batting: 80, bowling: 76, fielding: 82, experience: 84 },
      { name: "Jack Leach", roles: ["Spinner"], batting: 31, bowling: 83, fielding: 79, experience: 73 },
      { name: "Jofra Archer", roles: ["Fast Bowler"], batting: 24, bowling: 90, fielding: 86, experience: 78 },
      { name: "Stuart Broad", roles: ["Fast Bowler"], batting: 25, bowling: 86, fielding: 84, experience: 92 },
      { name: "James Anderson", roles: ["Fast Bowler"], batting: 18, bowling: 87, fielding: 87, experience: 94 },
      { name: "Chris Woakes", roles: ["Fast Bowler", "All-rounder"], batting: 69, bowling: 84, fielding: 85, experience: 85 }
    ]
  },
  {
    id: "eng-2001",
    label: "England 2001 Ashes squad",
    team: "England",
    year: 2001,
    players: [
      { name: "Michael Atherton", roles: ["Opener"], batting: 86, bowling: 10, fielding: 85, experience: 94 },
      { name: "Marcus Trescothick", roles: ["Opener"], batting: 84, bowling: 8, fielding: 79, experience: 79 },
      { name: "Mark Butcher", roles: ["Top Order"], batting: 82, bowling: 12, fielding: 81, experience: 80 },
      { name: "Nasser Hussain", roles: ["Middle Order"], batting: 80, bowling: 14, fielding: 83, experience: 88 },
      { name: "Graham Thorpe", roles: ["Middle Order"], batting: 87, bowling: 8, fielding: 85, experience: 90 },
      { name: "Alec Stewart", roles: ["Wicketkeeper"], batting: 83, bowling: 5, fielding: 88, experience: 94 },
      { name: "Andrew Flintoff", roles: ["All-rounder"], batting: 80, bowling: 77, fielding: 83, experience: 73 },
      { name: "Ashley Giles", roles: ["Spinner"], batting: 41, bowling: 81, fielding: 76, experience: 82 },
      { name: "Matthew Hoggard", roles: ["Fast Bowler"], batting: 16, bowling: 84, fielding: 76, experience: 78 },
      { name: "Darren Gough", roles: ["Fast Bowler"], batting: 19, bowling: 85, fielding: 78, experience: 87 },
      { name: "Andy Caddick", roles: ["Fast Bowler"], batting: 14, bowling: 83, fielding: 75, experience: 85 },
      { name: "James Ormond", roles: ["Fast Bowler"], batting: 12, bowling: 79, fielding: 73, experience: 70 }
    ]
  },
  {
    id: "aus-1997",
    label: "Australia 1997 Ashes squad",
    team: "Australia",
    year: 1997,
    players: [
      { name: "Matthew Hayden", roles: ["Opener"], batting: 88, bowling: 6, fielding: 76, experience: 81 },
      { name: "Mark Taylor", roles: ["Opener"], batting: 85, bowling: 8, fielding: 82, experience: 92 },
      { name: "Ricky Ponting", roles: ["Top Order"], batting: 86, bowling: 10, fielding: 84, experience: 74 },
      { name: "Steve Waugh", roles: ["Middle Order"], batting: 89, bowling: 20, fielding: 88, experience: 95 },
      { name: "Greg Blewett", roles: ["Middle Order"], batting: 78, bowling: 12, fielding: 80, experience: 70 },
      { name: "Ian Healy", roles: ["Wicketkeeper"], batting: 74, bowling: 5, fielding: 89, experience: 90 },
      { name: "Shane Warne", roles: ["Spinner"], batting: 32, bowling: 92, fielding: 75, experience: 96 },
      { name: "Tom Moody", roles: ["All-rounder"], batting: 77, bowling: 68, fielding: 82, experience: 80 },
      { name: "Glenn McGrath", roles: ["Fast Bowler"], batting: 14, bowling: 88, fielding: 86, experience: 89 },
      { name: "Paul Reiffel", roles: ["Fast Bowler"], batting: 18, bowling: 82, fielding: 80, experience: 83 },
      { name: "Damien Fleming", roles: ["Fast Bowler"], batting: 12, bowling: 80, fielding: 77, experience: 82 },
      { name: "Michael Kasprowicz", roles: ["Fast Bowler"], batting: 14, bowling: 79, fielding: 78, experience: 74 }
    ]
  },
  {
    id: "aus-1989",
    label: "Australia 1989 Ashes squad",
    team: "Australia",
    year: 1989,
    players: [
      { name: "Mark Taylor", roles: ["Opener"], batting: 84, bowling: 6, fielding: 80, experience: 88 },
      { name: "Geoff Marsh", roles: ["Opener"], batting: 80, bowling: 4, fielding: 78, experience: 84 },
      { name: "Allan Border", roles: ["Top Order", "Middle Order"], batting: 86, bowling: 10, fielding: 85, experience: 95 },
      { name: "David Boon", roles: ["Middle Order"], batting: 82, bowling: 8, fielding: 80, experience: 89 },
      { name: "Steve Waugh", roles: ["Middle Order", "All-rounder"], batting: 83, bowling: 72, fielding: 86, experience: 86 },
      { name: "Ian Healy", roles: ["Wicketkeeper"], batting: 70, bowling: 0, fielding: 88, experience: 82 },
      { name: "Trevor Hohns", roles: ["Spinner"], batting: 28, bowling: 79, fielding: 74, experience: 84 },
      { name: "Terry Alderman", roles: ["Fast Bowler"], batting: 11, bowling: 89, fielding: 72, experience: 88 },
      { name: "Merv Hughes", roles: ["Fast Bowler"], batting: 15, bowling: 85, fielding: 75, experience: 88 },
      { name: "Craig McDermott", roles: ["Fast Bowler"], batting: 12, bowling: 83, fielding: 74, experience: 84 },
      { name: "Bruce Reid", roles: ["Fast Bowler"], batting: 10, bowling: 82, fielding: 73, experience: 79 },
      { name: "Geoff Lawson", roles: ["Fast Bowler"], batting: 12, bowling: 84, fielding: 73, experience: 85 }
    ]
  },
  {
    id: "eng-1989",
    label: "England 1989 Ashes squad",
    team: "England",
    year: 1989,
    players: [
      { name: "Graham Gooch", roles: ["Opener"], batting: 87, bowling: 10, fielding: 82, experience: 94 },
      { name: "Tim Robinson", roles: ["Opener"], batting: 78, bowling: 5, fielding: 76, experience: 78 },
      { name: "Allan Lamb", roles: ["Top Order"], batting: 82, bowling: 14, fielding: 80, experience: 88 },
      { name: "Robin Smith", roles: ["Middle Order"], batting: 84, bowling: 7, fielding: 81, experience: 86 },
      { name: "David Gower", roles: ["Middle Order"], batting: 86, bowling: 6, fielding: 80, experience: 93 },
      { name: "Jack Russell", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 91, experience: 90 },
      { name: "Phil DeFreitas", roles: ["All-rounder"], batting: 71, bowling: 72, fielding: 78, experience: 80 },
      { name: "John Emburey", roles: ["Spinner"], batting: 32, bowling: 81, fielding: 73, experience: 87 },
      { name: "Devon Malcolm", roles: ["Fast Bowler"], batting: 14, bowling: 83, fielding: 74, experience: 76 },
      { name: "Gladstone Small", roles: ["Fast Bowler"], batting: 12, bowling: 82, fielding: 72, experience: 85 },
      { name: "Neil Foster", roles: ["Fast Bowler"], batting: 11, bowling: 80, fielding: 71, experience: 78 },
      { name: "Derek Pringle", roles: ["Fast Bowler", "All-rounder"], batting: 55, bowling: 77, fielding: 75, experience: 83 }
    ]
  },
  {
    id: "eng-1986",
    label: "England 1986-87 Ashes squad",
    team: "England",
    year: 1986,
    players: [
      { name: "Chris Broad", roles: ["Opener"], batting: 84, bowling: 3, fielding: 78, experience: 80 },
      { name: "Bill Athey", roles: ["Opener", "Top Order"], batting: 77, bowling: 4, fielding: 77, experience: 76 },
      { name: "Mike Gatting", roles: ["Top Order", "Middle Order"], batting: 84, bowling: 12, fielding: 82, experience: 88 },
      { name: "David Gower", roles: ["Top Order", "Middle Order"], batting: 89, bowling: 6, fielding: 83, experience: 93 },
      { name: "Allan Lamb", roles: ["Middle Order"], batting: 83, bowling: 14, fielding: 80, experience: 88 },
      { name: "Ian Botham", roles: ["All-rounder"], batting: 84, bowling: 82, fielding: 84, experience: 92 },
      { name: "Jack Richards", roles: ["Wicketkeeper"], batting: 71, bowling: 0, fielding: 84, experience: 82 },
      { name: "John Emburey", roles: ["Spinner"], batting: 33, bowling: 82, fielding: 74, experience: 88 },
      { name: "Phil Edmonds", roles: ["Spinner"], batting: 44, bowling: 79, fielding: 75, experience: 84 },
      { name: "Phil DeFreitas", roles: ["Fast Bowler", "All-rounder"], batting: 72, bowling: 76, fielding: 79, experience: 77 },
      { name: "Graham Dilley", roles: ["Fast Bowler"], batting: 16, bowling: 84, fielding: 74, experience: 86 },
      { name: "Gladstone Small", roles: ["Fast Bowler"], batting: 13, bowling: 80, fielding: 73, experience: 78 }
    ]
  },
  {
    id: "aus-1981",
    label: "Australia 1981 Ashes squad",
    team: "Australia",
    year: 1981,
    players: [
      { name: "Allan Border", roles: ["Opener", "Middle Order"], batting: 88, bowling: 12, fielding: 86, experience: 84 },
      { name: "Graeme Wood", roles: ["Opener"], batting: 81, bowling: 5, fielding: 78, experience: 76 },
      { name: "Rod Marsh", roles: ["Wicketkeeper"], batting: 72, bowling: 0, fielding: 90, experience: 92 },
      { name: "Greg Chappell", roles: ["Top Order"], batting: 90, bowling: 8, fielding: 85, experience: 94 },
      { name: "Kim Hughes", roles: ["Middle Order"], batting: 84, bowling: 10, fielding: 80, experience: 84 },
      { name: "Trevor Chappell", roles: ["All-rounder"], batting: 76, bowling: 68, fielding: 79, experience: 81 },
      { name: "Ray Bright", roles: ["Spinner"], batting: 30, bowling: 80, fielding: 74, experience: 77 },
      { name: "Dennis Lillee", roles: ["Fast Bowler"], batting: 18, bowling: 90, fielding: 78, experience: 96 },
      { name: "Jeff Thomson", roles: ["Fast Bowler"], batting: 16, bowling: 89, fielding: 76, experience: 91 },
      { name: "Len Pascoe", roles: ["Fast Bowler"], batting: 14, bowling: 82, fielding: 72, experience: 80 },
      { name: "Gary Cosier", roles: ["Middle Order"], batting: 74, bowling: 12, fielding: 77, experience: 70 },
      { name: "Bruce Yardley", roles: ["All-rounder"], batting: 62, bowling: 74, fielding: 78, experience: 83 }
    ]
  },
  {
    id: "eng-1981",
    label: "England 1981 Ashes squad",
    team: "England",
    year: 1981,
    players: [
      { name: "Geoffrey Boycott", roles: ["Opener"], batting: 86, bowling: 6, fielding: 78, experience: 96 },
      { name: "Graham Gooch", roles: ["Opener"], batting: 83, bowling: 8, fielding: 80, experience: 79 },
      { name: "Mike Gatting", roles: ["Middle Order"], batting: 84, bowling: 12, fielding: 81, experience: 85 },
      { name: "David Gower", roles: ["Top Order"], batting: 88, bowling: 6, fielding: 82, experience: 88 },
      { name: "Allan Lamb", roles: ["Middle Order"], batting: 81, bowling: 14, fielding: 79, experience: 80 },
      { name: "Bob Taylor", roles: ["Wicketkeeper"], batting: 66, bowling: 0, fielding: 90, experience: 91 },
      { name: "Ian Botham", roles: ["All-rounder"], batting: 87, bowling: 84, fielding: 85, experience: 95 },
      { name: "John Emburey", roles: ["Spinner"], batting: 33, bowling: 79, fielding: 74, experience: 83 },
      { name: "Bob Willis", roles: ["Fast Bowler"], batting: 18, bowling: 88, fielding: 76, experience: 93 },
      { name: "Derek Underwood", roles: ["Spinner"], batting: 22, bowling: 82, fielding: 75, experience: 92 },
      { name: "Geoff Arnold", roles: ["Fast Bowler"], batting: 12, bowling: 80, fielding: 71, experience: 74 },
      { name: "Chris Old", roles: ["Fast Bowler"], batting: 16, bowling: 81, fielding: 73, experience: 82 }
    ]
  },
  {
    id: "aus-1978",
    label: "Australia 1978-79 Ashes squad",
    team: "Australia",
    year: 1978,
    players: [
      { name: "Graeme Wood", roles: ["Opener"], batting: 78, bowling: 5, fielding: 78, experience: 74 },
      { name: "Andrew Hilditch", roles: ["Opener"], batting: 77, bowling: 4, fielding: 76, experience: 70 },
      { name: "Rick Darling", roles: ["Top Order", "Middle Order"], batting: 75, bowling: 6, fielding: 77, experience: 71 },
      { name: "Graham Yallop", roles: ["Top Order", "Middle Order"], batting: 82, bowling: 10, fielding: 80, experience: 84 },
      { name: "Kim Hughes", roles: ["Middle Order"], batting: 83, bowling: 10, fielding: 81, experience: 80 },
      { name: "Allan Border", roles: ["Middle Order"], batting: 81, bowling: 12, fielding: 84, experience: 78 },
      { name: "Peter Toohey", roles: ["Middle Order"], batting: 72, bowling: 4, fielding: 76, experience: 70 },
      { name: "Jim Higgs", roles: ["Wicketkeeper"], batting: 63, bowling: 0, fielding: 86, experience: 74 },
      { name: "Bruce Yardley", roles: ["All-rounder", "Spinner"], batting: 60, bowling: 76, fielding: 78, experience: 82 },
      { name: "Rodney Hogg", roles: ["Fast Bowler"], batting: 14, bowling: 87, fielding: 73, experience: 82 },
      { name: "Alan Hurst", roles: ["Fast Bowler"], batting: 12, bowling: 81, fielding: 72, experience: 76 },
      { name: "Geoff Dymock", roles: ["Fast Bowler"], batting: 13, bowling: 80, fielding: 74, experience: 80 }
    ]
  },
  {
    id: "aus-1972",
    label: "Australia 1972 Ashes squad",
    team: "Australia",
    year: 1972,
    players: [
      { name: "Keith Stackpole", roles: ["Opener"], batting: 84, bowling: 5, fielding: 78, experience: 86 },
      { name: "Ross Edwards", roles: ["Opener", "Middle Order"], batting: 78, bowling: 6, fielding: 80, experience: 74 },
      { name: "Ian Chappell", roles: ["Top Order", "Middle Order"], batting: 90, bowling: 12, fielding: 86, experience: 88 },
      { name: "Greg Chappell", roles: ["Top Order"], batting: 92, bowling: 8, fielding: 85, experience: 84 },
      { name: "Doug Walters", roles: ["Middle Order", "All-rounder"], batting: 84, bowling: 68, fielding: 82, experience: 87 },
      { name: "Rod Marsh", roles: ["Wicketkeeper"], batting: 74, bowling: 0, fielding: 90, experience: 86 },
      { name: "John Inverarity", roles: ["All-rounder"], batting: 74, bowling: 68, fielding: 80, experience: 78 },
      { name: "Ashley Mallett", roles: ["Spinner"], batting: 28, bowling: 84, fielding: 76, experience: 83 },
      { name: "Dennis Lillee", roles: ["Fast Bowler"], batting: 18, bowling: 88, fielding: 79, experience: 88 },
      { name: "Bob Massie", roles: ["Fast Bowler"], batting: 15, bowling: 82, fielding: 74, experience: 76 },
      { name: "David Colley", roles: ["Fast Bowler"], batting: 13, bowling: 78, fielding: 72, experience: 70 },
      { name: "Jeff Hammond", roles: ["Fast Bowler"], batting: 14, bowling: 79, fielding: 73, experience: 71 }
    ]
  },
  {
    id: "aus-1968",
    label: "Australia 1968 Ashes squad",
    team: "Australia",
    year: 1968,
    players: [
      { name: "Bill Lawry", roles: ["Opener"], batting: 86, bowling: 4, fielding: 80, experience: 95 },
      { name: "Ian Redpath", roles: ["Opener", "Top Order"], batting: 83, bowling: 6, fielding: 82, experience: 88 },
      { name: "Ian Chappell", roles: ["Top Order", "Middle Order"], batting: 89, bowling: 12, fielding: 86, experience: 90 },
      { name: "Bob Cowper", roles: ["Top Order", "Middle Order"], batting: 87, bowling: 8, fielding: 82, experience: 88 },
      { name: "Doug Walters", roles: ["Middle Order", "All-rounder"], batting: 86, bowling: 64, fielding: 83, experience: 89 },
      { name: "Paul Sheahan", roles: ["Middle Order"], batting: 78, bowling: 6, fielding: 79, experience: 75 },
      { name: "Brian Taber", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 89, experience: 84 },
      { name: "Ashley Mallett", roles: ["Spinner"], batting: 29, bowling: 86, fielding: 76, experience: 84 },
      { name: "John Gleeson", roles: ["Spinner"], batting: 24, bowling: 82, fielding: 74, experience: 78 },
      { name: "Graham McKenzie", roles: ["Fast Bowler"], batting: 16, bowling: 87, fielding: 77, experience: 91 },
      { name: "Alan Connolly", roles: ["Fast Bowler"], batting: 14, bowling: 84, fielding: 75, experience: 86 },
      { name: "Neil Hawke", roles: ["Fast Bowler"], batting: 18, bowling: 79, fielding: 76, experience: 82 }
    ]
  },
  {
    id: "eng-1961",
    label: "England 1961 Ashes squad",
    team: "England",
    year: 1961,
    players: [
      { name: "Geoff Pullar", roles: ["Opener"], batting: 82, bowling: 4, fielding: 78, experience: 80 },
      { name: "Raman Subba Row", roles: ["Opener"], batting: 78, bowling: 5, fielding: 76, experience: 76 },
      { name: "Ted Dexter", roles: ["Top Order"], batting: 88, bowling: 8, fielding: 84, experience: 90 },
      { name: "Colin Cowdrey", roles: ["Middle Order"], batting: 86, bowling: 4, fielding: 86, experience: 95 },
      { name: "Peter May", roles: ["Middle Order"], batting: 87, bowling: 6, fielding: 85, experience: 93 },
      { name: "John Murray", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 88, experience: 80 },
      { name: "Fred Trueman", roles: ["Fast Bowler"], batting: 16, bowling: 89, fielding: 76, experience: 91 },
      { name: "Brian Statham", roles: ["Fast Bowler"], batting: 12, bowling: 86, fielding: 74, experience: 88 },
      { name: "David Allen", roles: ["Spinner"], batting: 32, bowling: 82, fielding: 75, experience: 84 },
      { name: "Ray Illingworth", roles: ["All-rounder"], batting: 70, bowling: 78, fielding: 81, experience: 86 },
      { name: "Tom Graveney", roles: ["Middle Order"], batting: 84, bowling: 4, fielding: 80, experience: 88 },
      { name: "Ken Barrington", roles: ["Top Order"], batting: 88, bowling: 4, fielding: 79, experience: 89 }
    ]
  },
  {
    id: "aus-1956",
    label: "Australia 1956 Ashes squad",
    team: "Australia",
    year: 1956,
    players: [
      { name: "Neil Harvey", roles: ["Top Order"], batting: 88, bowling: 8, fielding: 86, experience: 92 },
      { name: "Colin McDonald", roles: ["Opener"], batting: 84, bowling: 5, fielding: 79, experience: 88 },
      { name: "Arthur Morris", roles: ["Opener"], batting: 85, bowling: 4, fielding: 78, experience: 87 },
      { name: "Lindsay Hassett", roles: ["Middle Order"], batting: 83, bowling: 12, fielding: 82, experience: 90 },
      { name: "Keith Miller", roles: ["All-rounder"], batting: 86, bowling: 80, fielding: 84, experience: 95 },
      { name: "Ritchie Benaud", roles: ["All-rounder", "Spinner"], batting: 76, bowling: 84, fielding: 85, experience: 90 },
      { name: "Gil Langley", roles: ["Wicketkeeper"], batting: 66, bowling: 0, fielding: 89, experience: 82 },
      { name: "Ian Johnson", roles: ["Spinner"], batting: 30, bowling: 82, fielding: 75, experience: 83 },
      { name: "Ray Lindwall", roles: ["Fast Bowler"], batting: 18, bowling: 88, fielding: 78, experience: 94 },
      { name: "Bill Johnston", roles: ["Fast Bowler"], batting: 14, bowling: 82, fielding: 74, experience: 85 },
      { name: "Ron Archer", roles: ["All-rounder", "Fast Bowler"], batting: 70, bowling: 82, fielding: 78, experience: 84 },
      { name: "Ken Mackay", roles: ["Middle Order", "All-rounder"], batting: 75, bowling: 62, fielding: 78, experience: 82 }
    ]
  },
  {
    id: "eng-1948",
    label: "England 1948 Ashes squad",
    team: "England",
    year: 1948,
    players: [
      { name: "Len Hutton", roles: ["Opener"], batting: 90, bowling: 4, fielding: 82, experience: 97 },
      { name: "Cyril Washbrook", roles: ["Opener"], batting: 82, bowling: 6, fielding: 79, experience: 88 },
      { name: "Denis Compton", roles: ["Top Order"], batting: 88, bowling: 12, fielding: 84, experience: 94 },
      { name: "Joe Hardstaff", roles: ["Middle Order"], batting: 81, bowling: 8, fielding: 80, experience: 83 },
      { name: "George Mann", roles: ["Middle Order"], batting: 79, bowling: 8, fielding: 81, experience: 85 },
      { name: "Les Ames", roles: ["Wicketkeeper"], batting: 70, bowling: 0, fielding: 90, experience: 92 },
      { name: "Jim Laker", roles: ["Spinner"], batting: 28, bowling: 91, fielding: 77, experience: 90 },
      { name: "Alec Bedser", roles: ["Fast Bowler"], batting: 20, bowling: 88, fielding: 78, experience: 93 },
      { name: "Bill Edrich", roles: ["All-rounder"], batting: 75, bowling: 58, fielding: 80, experience: 89 },
      { name: "Trevor Bailey", roles: ["All-rounder"], batting: 72, bowling: 76, fielding: 84, experience: 91 },
      { name: "Roy Tattersall", roles: ["Spinner"], batting: 24, bowling: 80, fielding: 74, experience: 80 },
      { name: "Norman Yardley", roles: ["Middle Order"], batting: 76, bowling: 18, fielding: 79, experience: 86 }
    ]
  },
  {
    id: "aus-1934",
    label: "Australia 1934 Ashes squad",
    team: "Australia",
    year: 1934,
    players: [
      { name: "Bill Woodfull", roles: ["Opener"], batting: 86, bowling: 4, fielding: 78, experience: 94 },
      { name: "Bill Ponsford", roles: ["Opener"], batting: 90, bowling: 4, fielding: 80, experience: 92 },
      { name: "Don Bradman", roles: ["Top Order"], batting: 99, bowling: 10, fielding: 90, experience: 99 },
      { name: "Stan McCabe", roles: ["Middle Order"], batting: 88, bowling: 38, fielding: 84, experience: 89 },
      { name: "Vic Richardson", roles: ["Middle Order"], batting: 83, bowling: 22, fielding: 82, experience: 88 },
      { name: "Bert Oldfield", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 90, experience: 90 },
      { name: "Clarrie Grimmett", roles: ["Spinner"], batting: 28, bowling: 89, fielding: 76, experience: 94 },
      { name: "Bill O'Reilly", roles: ["Spinner"], batting: 24, bowling: 90, fielding: 75, experience: 92 },
      { name: "Tim Wall", roles: ["Fast Bowler"], batting: 12, bowling: 81, fielding: 73, experience: 80 },
      { name: "Ernie McCormick", roles: ["Fast Bowler"], batting: 11, bowling: 80, fielding: 72, experience: 76 },
      { name: "Chuck Fleetwood-Smith", roles: ["Spinner"], batting: 22, bowling: 82, fielding: 74, experience: 81 },
      { name: "Jack Fingleton", roles: ["Top Order"], batting: 82, bowling: 4, fielding: 82, experience: 82 }
    ]
  },
  {
    id: "eng-1926",
    label: "England 1926 Ashes squad",
    team: "England",
    year: 1926,
    players: [
      { name: "Jack Hobbs", roles: ["Opener"], batting: 95, bowling: 10, fielding: 88, experience: 99 },
      { name: "Herbert Sutcliffe", roles: ["Opener"], batting: 92, bowling: 8, fielding: 84, experience: 96 },
      { name: "Wally Hammond", roles: ["Top Order"], batting: 94, bowling: 12, fielding: 89, experience: 95 },
      { name: "Patsy Hendren", roles: ["Middle Order"], batting: 86, bowling: 10, fielding: 82, experience: 89 },
      { name: "Maurice Tate", roles: ["All-rounder"], batting: 76, bowling: 82, fielding: 83, experience: 90 },
      { name: "Alec Kennedy", roles: ["Fast Bowler"], batting: 14, bowling: 85, fielding: 74, experience: 88 },
      { name: "George Geary", roles: ["Fast Bowler"], batting: 12, bowling: 82, fielding: 72, experience: 84 },
      { name: "Arthur Gilligan", roles: ["All-rounder"], batting: 72, bowling: 70, fielding: 80, experience: 86 },
      { name: "Arthur Carr", roles: ["Middle Order"], batting: 78, bowling: 8, fielding: 79, experience: 82 },
      { name: "Leslie Ames", roles: ["Wicketkeeper"], batting: 74, bowling: 0, fielding: 91, experience: 93 },
      { name: "Jack Newman", roles: ["Spinner"], batting: 26, bowling: 80, fielding: 73, experience: 77 },
      { name: "Freddie Brown", roles: ["Middle Order"], batting: 80, bowling: 14, fielding: 81, experience: 85 }
    ]
  },
  {
    id: "aus-1909",
    label: "Australia 1909 Ashes squad",
    team: "Australia",
    year: 1909,
    players: [
      { name: "Victor Trumper", roles: ["Opener"], batting: 96, bowling: 8, fielding: 88, experience: 98 },
      { name: "Warren Bardsley", roles: ["Opener"], batting: 88, bowling: 6, fielding: 82, experience: 86 },
      { name: "Syd Gregory", roles: ["Top Order"], batting: 84, bowling: 6, fielding: 82, experience: 88 },
      { name: "Clem Hill", roles: ["Top Order"], batting: 90, bowling: 8, fielding: 86, experience: 92 },
      { name: "Monty Noble", roles: ["All-rounder"], batting: 80, bowling: 82, fielding: 84, experience: 94 },
      { name: "Sammy Carter", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 89, experience: 84 },
      { name: "Charlie Macartney", roles: ["Middle Order", "All-rounder"], batting: 85, bowling: 70, fielding: 81, experience: 86 },
      { name: "Frank Laver", roles: ["All-rounder"], batting: 74, bowling: 70, fielding: 80, experience: 85 },
      { name: "Tibby Cotter", roles: ["Fast Bowler"], batting: 18, bowling: 86, fielding: 73, experience: 82 },
      { name: "Bill Whitty", roles: ["Fast Bowler"], batting: 12, bowling: 82, fielding: 70, experience: 78 },
      { name: "Jack O'Connor", roles: ["Spinner"], batting: 28, bowling: 80, fielding: 73, experience: 77 },
      { name: "Warwick Armstrong", roles: ["All-rounder"], batting: 82, bowling: 76, fielding: 82, experience: 88 }
    ]
  },
  {
    id: "eng-1902",
    label: "England 1902 Ashes squad",
    team: "England",
    year: 1902,
    players: [
      { name: "C.B. Fry", roles: ["Top Order"], batting: 94, bowling: 12, fielding: 90, experience: 96 },
      { name: "Ranjitsinhji", roles: ["Middle Order"], batting: 95, bowling: 6, fielding: 88, experience: 94 },
      { name: "Johnny Tyldesley", roles: ["Opener"], batting: 84, bowling: 4, fielding: 80, experience: 86 },
      { name: "Archie MacLaren", roles: ["Top Order"], batting: 88, bowling: 8, fielding: 83, experience: 90 },
      { name: "Leslie Laws", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 88, experience: 82 },
      { name: "Wilfred Rhodes", roles: ["All-rounder", "Spinner"], batting: 80, bowling: 88, fielding: 84, experience: 97 },
      { name: "George Hirst", roles: ["All-rounder", "Fast Bowler"], batting: 76, bowling: 84, fielding: 82, experience: 95 },
      { name: "Stanley Jackson", roles: ["Middle Order"], batting: 82, bowling: 16, fielding: 80, experience: 88 },
      { name: "Bernard Bosanquet", roles: ["Spinner"], batting: 30, bowling: 82, fielding: 75, experience: 84 },
      { name: "Sydney Barnes", roles: ["Fast Bowler"], batting: 14, bowling: 90, fielding: 76, experience: 92 },
      { name: "Len Braund", roles: ["All-rounder"], batting: 74, bowling: 74, fielding: 79, experience: 85 },
      { name: "Vernon Royle", roles: ["Opener"], batting: 78, bowling: 6, fielding: 78, experience: 80 }
    ]
  },
  {
    id: "eng-1993",
    label: "England 1993 Ashes squad",
    team: "England",
    year: 1993,
    players: [
      { name: "Alec Stewart", roles: ["Opener", "Wicketkeeper"], batting: 84, bowling: 4, fielding: 89, experience: 84 },
      { name: "Mike Atherton", roles: ["Opener"], batting: 87, bowling: 6, fielding: 84, experience: 88 },
      { name: "Graeme Hick", roles: ["Top Order"], batting: 84, bowling: 12, fielding: 80, experience: 82 },
      { name: "Robin Smith", roles: ["Middle Order"], batting: 85, bowling: 6, fielding: 82, experience: 89 },
      { name: "Graham Gooch", roles: ["Middle Order"], batting: 88, bowling: 10, fielding: 82, experience: 97 },
      { name: "David Gower", roles: ["Middle Order"], batting: 86, bowling: 6, fielding: 80, experience: 96 },
      { name: "Chris Lewis", roles: ["All-rounder"], batting: 72, bowling: 76, fielding: 80, experience: 79 },
      { name: "Ian Salisbury", roles: ["Spinner"], batting: 26, bowling: 77, fielding: 73, experience: 68 },
      { name: "Devon Malcolm", roles: ["Fast Bowler"], batting: 14, bowling: 87, fielding: 74, experience: 84 },
      { name: "Phil Tufnell", roles: ["Spinner"], batting: 22, bowling: 82, fielding: 72, experience: 84 },
      { name: "Angus Fraser", roles: ["Fast Bowler"], batting: 12, bowling: 85, fielding: 74, experience: 87 },
      { name: "Martin Bicknell", roles: ["Fast Bowler"], batting: 11, bowling: 80, fielding: 72, experience: 74 }
    ]
  },
  {
    id: "eng-1932",
    label: "England 1932-33 Ashes squad",
    team: "England",
    year: 1932,
    players: [
      { name: "Herbert Sutcliffe", roles: ["Opener"], batting: 95, bowling: 8, fielding: 85, experience: 98 },
      { name: "Bob Wyatt", roles: ["Opener", "Top Order"], batting: 82, bowling: 8, fielding: 82, experience: 88 },
      { name: "Wally Hammond", roles: ["Top Order"], batting: 96, bowling: 14, fielding: 90, experience: 97 },
      { name: "Douglas Jardine", roles: ["Middle Order"], batting: 86, bowling: 6, fielding: 86, experience: 93 },
      { name: "Maurice Leyland", roles: ["Middle Order"], batting: 88, bowling: 10, fielding: 84, experience: 90 },
      { name: "Les Ames", roles: ["Wicketkeeper"], batting: 78, bowling: 0, fielding: 92, experience: 95 },
      { name: "Gubby Allen", roles: ["All-rounder"], batting: 74, bowling: 82, fielding: 82, experience: 90 },
      { name: "Hedley Verity", roles: ["Spinner"], batting: 24, bowling: 92, fielding: 76, experience: 95 },
      { name: "Harold Larwood", roles: ["Fast Bowler"], batting: 16, bowling: 94, fielding: 76, experience: 97 },
      { name: "Bill Voce", roles: ["Fast Bowler"], batting: 14, bowling: 88, fielding: 74, experience: 90 },
      { name: "Bill Bowes", roles: ["Fast Bowler"], batting: 12, bowling: 86, fielding: 73, experience: 88 },
      { name: "Walter Robins", roles: ["All-rounder", "Spinner"], batting: 74, bowling: 74, fielding: 80, experience: 84 }
    ]
  },
  {
    id: "aus-1920",
    label: "Australia 1920-21 Ashes squad",
    team: "Australia",
    year: 1920,
    players: [
      { name: "Warren Bardsley", roles: ["Opener"], batting: 90, bowling: 6, fielding: 84, experience: 93 },
      { name: "Herbie Collins", roles: ["Opener"], batting: 84, bowling: 8, fielding: 80, experience: 86 },
      { name: "Charlie Macartney", roles: ["Top Order", "All-rounder"], batting: 92, bowling: 72, fielding: 84, experience: 92 },
      { name: "Johnny Taylor", roles: ["Middle Order"], batting: 82, bowling: 8, fielding: 80, experience: 84 },
      { name: "Jack Ryder", roles: ["Middle Order"], batting: 86, bowling: 18, fielding: 82, experience: 88 },
      { name: "Sammy Carter", roles: ["Wicketkeeper"], batting: 70, bowling: 0, fielding: 90, experience: 88 },
      { name: "Warwick Armstrong", roles: ["All-rounder"], batting: 88, bowling: 80, fielding: 86, experience: 98 },
      { name: "Arthur Mailey", roles: ["Spinner"], batting: 28, bowling: 87, fielding: 75, experience: 89 },
      { name: "Jack Gregory", roles: ["Fast Bowler", "All-rounder"], batting: 76, bowling: 89, fielding: 84, experience: 94 },
      { name: "Ted McDonald", roles: ["Fast Bowler"], batting: 14, bowling: 88, fielding: 75, experience: 91 },
      { name: "Clarence Everett", roles: ["Fast Bowler"], batting: 12, bowling: 80, fielding: 72, experience: 80 },
      { name: "Bert Oldfield", roles: ["Wicketkeeper"], batting: 68, bowling: 0, fielding: 91, experience: 92 }
    ]
  },
  {
    id: "aus-1882",
    label: "Australia 1882 Ashes squad",
    team: "Australia",
    year: 1882,
    players: [
      { name: "Billy Murdoch", roles: ["Top Order", "Wicketkeeper"], batting: 88, bowling: 18, fielding: 88, experience: 96 },
      { name: "George Bonnor", roles: ["Opener"], batting: 84, bowling: 8, fielding: 80, experience: 84 },
      { name: "Hugh Massie", roles: ["Top Order"], batting: 82, bowling: 6, fielding: 79, experience: 82 },
      { name: "George Giffen", roles: ["All-rounder"], batting: 80, bowling: 82, fielding: 84, experience: 92 },
      { name: "Fred Spofforth", roles: ["Fast Bowler"], batting: 18, bowling: 92, fielding: 76, experience: 98 },
      { name: "Fred Leslie", roles: ["Fast Bowler"], batting: 14, bowling: 85, fielding: 74, experience: 86 },
      { name: "Harry Boyle", roles: ["Fast Bowler"], batting: 12, bowling: 84, fielding: 72, experience: 88 },
      { name: "Percy McDonnell", roles: ["Middle Order"], batting: 78, bowling: 10, fielding: 78, experience: 80 },
      { name: "Jack Blackham", roles: ["Wicketkeeper"], batting: 70, bowling: 0, fielding: 90, experience: 94 },
      { name: "Jack Conway", roles: ["Middle Order"], batting: 76, bowling: 12, fielding: 77, experience: 78 },
      { name: "Alfred Shaw", roles: ["Spinner"], batting: 26, bowling: 80, fielding: 74, experience: 82 },
      { name: "Percy Murphy", roles: ["All-rounder"], batting: 68, bowling: 70, fielding: 78, experience: 79 }
    ]
  }
];
var ASHES_SQUADS = RAW_ASHES_SQUADS.map(normalizeSquad);

// ../site/shared/ashes-core.js
var CANONICAL_SITE_ORIGIN = "https://ashes-5-0.co.uk";
var TEAM_DATA_VERSION = "ashes-5-0-data-v1";
var RESULT_SIMULATION_VERSION = "ashes-5-0-sim-v1";
var DISPLAY_NAME_MAX = 40;
var XI_SLOTS = [
  { label: "Opener", accepts: ["Opener"], focus: "batting", row: 5, col: 2 },
  { label: "Opener", accepts: ["Opener"], focus: "batting", row: 5, col: 4 },
  { label: "#3", accepts: ["Top Order", "Middle Order"], focus: "batting", row: 4, col: 3 },
  { label: "#4", accepts: ["Middle Order", "Top Order", "All-rounder"], focus: "batting", row: 3, col: 2 },
  { label: "#5", accepts: ["Middle Order", "All-rounder", "Top Order"], focus: "batting", row: 3, col: 4 },
  { label: "WK", accepts: ["Wicketkeeper"], focus: "fielding", row: 2, col: 3 },
  { label: "AR", accepts: ["All-rounder"], focus: "mixed", row: 3, col: 1 },
  { label: "Spin", accepts: ["Spinner"], focus: "bowling", row: 2, col: 1 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 1 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 3 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 5 }
];
function normalizePlayableMode(value) {
  if (value === "classic" || value === "memory") return value;
  return null;
}
__name(normalizePlayableMode, "normalizePlayableMode");
function sanitizePlainText(value, maxLength = 160) {
  return String(value ?? "").replace(/[<>&]/gu, "").replace(/\s+/gu, " ").trim().slice(0, maxLength);
}
__name(sanitizePlainText, "sanitizePlainText");
function normalizeDisplayName(value, maxLength = DISPLAY_NAME_MAX) {
  return sanitizePlainText(value, maxLength);
}
__name(normalizeDisplayName, "normalizeDisplayName");
function stablePlayerIdFromName(name) {
  const slug = String(name ?? "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "");
  return slug || "player";
}
__name(stablePlayerIdFromName, "stablePlayerIdFromName");
function buildCatalogFromSquads(squads) {
  return squads.flatMap(
    (squad) => squad.players.map((player, index) => ({
      ...player,
      id: `${squad.id}:${index}`,
      stableId: stablePlayerIdFromName(player.name),
      squadId: squad.id,
      squadLabel: squad.label,
      squadTeam: squad.team,
      squadYear: squad.year
    }))
  );
}
__name(buildCatalogFromSquads, "buildCatalogFromSquads");
function slotAcceptsPlayer(slot, player) {
  return slot.accepts.some((role) => player.roles.includes(role));
}
__name(slotAcceptsPlayer, "slotAcceptsPlayer");
function playerOverall(player) {
  return Math.round(player.batting * 0.4 + player.bowling * 0.3 + player.fielding * 0.2 + player.experience * 0.1);
}
__name(playerOverall, "playerOverall");
function playerSlotScore(player, slot) {
  const roleBonus = slotAcceptsPlayer(slot, player) ? 22 : 0;
  const batting = player.batting * 0.35;
  const bowling = player.bowling * 0.35;
  const fielding = player.fielding * 0.2;
  const experience = player.experience * 0.1;
  if (slot.focus === "batting") return batting + fielding + experience + roleBonus;
  if (slot.focus === "bowling") return bowling + fielding + experience + roleBonus;
  return batting * 0.35 + bowling * 0.35 + fielding * 0.2 + experience * 0.1 + roleBonus;
}
__name(playerSlotScore, "playerSlotScore");
var ASHES_CATALOG = buildCatalogFromSquads(ASHES_SQUADS);
var ASHES_CATALOG_INDEX_BY_ID = new Map(ASHES_CATALOG.map((player, index) => [player.id, index]));
var ASHES_PLAYER_BY_ID = new Map(ASHES_CATALOG.map((player) => [player.id, player]));
var ASHES_SQUAD_BY_ID = new Map(ASHES_SQUADS.map((squad) => [squad.id, squad]));
var stablePlayers = /* @__PURE__ */ new Map();
var bestCatalogPlayers = /* @__PURE__ */ new Map();
for (const player of ASHES_CATALOG) {
  const existing = stablePlayers.get(player.stableId);
  if (!existing) {
    stablePlayers.set(player.stableId, {
      id: player.stableId,
      name: player.name,
      roles: [...player.roles]
    });
  } else {
    for (const role of player.roles) {
      if (!existing.roles.includes(role)) {
        existing.roles.push(role);
      }
    }
  }
  const bestExisting = bestCatalogPlayers.get(player.stableId);
  if (!bestExisting || playerOverall(player) > playerOverall(bestExisting)) {
    bestCatalogPlayers.set(player.stableId, player);
  }
}
var ASHES_PLAYERS = [...stablePlayers.values()].sort((left, right) => left.name.localeCompare(right.name));
var ASHES_PLAYER_BY_STABLE_ID = new Map(ASHES_PLAYERS.map((player) => [player.id, player]));
var BEST_ASHES_PLAYER_BY_STABLE_ID = new Map(bestCatalogPlayers);
function lineupIdsToPlayers(lineupPlayerIds) {
  if (!Array.isArray(lineupPlayerIds)) return null;
  const lineup = lineupPlayerIds.map((playerId) => ASHES_PLAYER_BY_ID.get(playerId) ?? null);
  return lineup.every(Boolean) ? lineup : null;
}
__name(lineupIdsToPlayers, "lineupIdsToPlayers");
function validateLineupPlayerIds(lineupPlayerIds) {
  if (!Array.isArray(lineupPlayerIds) || lineupPlayerIds.length !== XI_SLOTS.length) {
    return null;
  }
  const lineup = lineupIdsToPlayers(lineupPlayerIds);
  if (!lineup) return null;
  const ids = lineup.map((player) => player.id);
  if (new Set(ids).size !== XI_SLOTS.length) {
    return null;
  }
  const valid = lineup.every((player, index) => slotAcceptsPlayer(XI_SLOTS[index], player));
  return valid ? lineup : null;
}
__name(validateLineupPlayerIds, "validateLineupPlayerIds");
function assignBestValidLineup(players) {
  if (!Array.isArray(players) || players.length !== XI_SLOTS.length) {
    return null;
  }
  const pool = [...players];
  const seenStableIds = /* @__PURE__ */ new Set();
  for (const player of pool) {
    const stableId = player?.stableId ?? stablePlayerIdFromName(player?.name ?? "");
    if (seenStableIds.has(stableId)) {
      return null;
    }
    seenStableIds.add(stableId);
  }
  const slotOrder = XI_SLOTS.map((slot, index) => ({
    slot,
    index,
    candidates: pool.map((player, playerIndex) => ({
      player,
      playerIndex,
      score: playerSlotScore(player, slot)
    })).filter(({ player }) => slotAcceptsPlayer(slot, player)).sort((left, right) => right.score - left.score || playerOverall(right.player) - playerOverall(left.player))
  })).sort((left, right) => left.candidates.length - right.candidates.length);
  if (slotOrder.some((entry) => !entry.candidates.length)) {
    return null;
  }
  let bestAssignment = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const used = new Array(pool.length).fill(false);
  const assignment = new Array(XI_SLOTS.length).fill(null);
  function search(orderIndex, score) {
    if (orderIndex >= slotOrder.length) {
      if (score > bestScore) {
        bestScore = score;
        bestAssignment = [...assignment];
      }
      return;
    }
    const { slot, index, candidates } = slotOrder[orderIndex];
    for (const candidate of candidates) {
      if (used[candidate.playerIndex]) continue;
      used[candidate.playerIndex] = true;
      assignment[index] = candidate.player;
      search(orderIndex + 1, score + playerSlotScore(candidate.player, slot));
      assignment[index] = null;
      used[candidate.playerIndex] = false;
    }
  }
  __name(search, "search");
  search(0, 0);
  return bestAssignment;
}
__name(assignBestValidLineup, "assignBestValidLineup");
function challengeUrlForId(challengeId) {
  return `${CANONICAL_SITE_ORIGIN}/c/${challengeId}`;
}
__name(challengeUrlForId, "challengeUrlForId");
function resultUrlForId(resultId) {
  return `${CANONICAL_SITE_ORIGIN}/r/${resultId}`;
}
__name(resultUrlForId, "resultUrlForId");

// _lib/http.js
var JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};
function byteLength(text) {
  return new TextEncoder().encode(text).length;
}
__name(byteLength, "byteLength");
function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...headers
    }
  });
}
__name(json, "json");
function errorResponse(status, error, extras = {}) {
  return json(
    {
      ok: false,
      error,
      ...extras
    },
    status
  );
}
__name(errorResponse, "errorResponse");
function methodNotAllowed() {
  return errorResponse(405, "Method not allowed.");
}
__name(methodNotAllowed, "methodNotAllowed");
async function readJson(request, { maxBytes = 48e3 } = {}) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const error = new Error("Request body must be JSON.");
    error.status = 415;
    throw error;
  }
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    const error = new Error("Request body is too large.");
    error.status = 413;
    throw error;
  }
  const text = await request.text();
  if (byteLength(text) > maxBytes) {
    const error = new Error("Request body is too large.");
    error.status = 413;
    throw error;
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error("Invalid JSON request body.");
    error.status = 400;
    throw error;
  }
}
__name(readJson, "readJson");

// ../site/shared/ashes-sim.js
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
__name(clamp, "clamp");
function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
__name(average, "average");
function createSeededRandom(seedText) {
  let seed = 1779033703 ^ String(seedText ?? "").length;
  for (let index = 0; index < String(seedText ?? "").length; index += 1) {
    seed = Math.imul(seed ^ String(seedText)[index].charCodeAt(0), 3432918353);
    seed = seed << 13 | seed >>> 19;
  }
  return () => {
    seed = Math.imul(seed ^ seed >>> 16, 2246822507);
    seed = Math.imul(seed ^ seed >>> 13, 3266489909);
    seed ^= seed >>> 16;
    return (seed >>> 0) / 4294967296;
  };
}
__name(createSeededRandom, "createSeededRandom");
function normalRandom(rng) {
  return (rng() + rng() + rng() + rng() + rng() + rng()) / 6 - 0.5;
}
__name(normalRandom, "normalRandom");
function randomChoice(values, rng) {
  if (!values.length) return null;
  return values[Math.floor(rng() * values.length)];
}
__name(randomChoice, "randomChoice");
function weightedPick(items, getWeight, rng) {
  const total = items.reduce((sum, item) => sum + Math.max(0, getWeight(item)), 0);
  let roll = rng() * total;
  for (const item of items) {
    roll -= Math.max(0, getWeight(item));
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}
__name(weightedPick, "weightedPick");
function pluralize(value, singular, plural = `${singular}s`) {
  return value === 1 ? singular : plural;
}
__name(pluralize, "pluralize");
function lineupScore(lineup) {
  const batting = average(lineup.slice(0, 7).map((player) => player.batting));
  const bowling = average(lineup.slice(7).map((player) => player.bowling));
  const fielding = average(lineup.map((player) => player.fielding));
  const experience = average(lineup.map((player) => player.experience));
  return {
    batting,
    bowling,
    fielding,
    experience,
    power: batting * 0.48 + bowling * 0.34 + fielding * 0.1 + experience * 0.08
  };
}
__name(lineupScore, "lineupScore");
function gradeFromOverall(overall) {
  if (overall >= 94) return "A+";
  if (overall >= 90) return "A";
  if (overall >= 86) return "A-";
  if (overall >= 82) return "B+";
  if (overall >= 78) return "B";
  if (overall >= 74) return "B-";
  if (overall >= 68) return "C+";
  if (overall >= 62) return "C";
  return "D";
}
__name(gradeFromOverall, "gradeFromOverall");
function teamMetricsFromLineup(lineup) {
  const score = lineupScore(lineup);
  const batting = clamp(Math.round(score.batting), 0, 99);
  const bowling = clamp(Math.round(score.bowling), 0, 99);
  const fielding = clamp(Math.round(score.fielding), 0, 99);
  const overall = clamp(Math.round(score.power), 0, 99);
  return {
    batting,
    bowling,
    fielding,
    overall,
    grade: gradeFromOverall(overall)
  };
}
__name(teamMetricsFromLineup, "teamMetricsFromLineup");
function ballsToOvers(balls) {
  const overs = Math.floor(balls / 6);
  const remainder = balls % 6;
  return remainder === 0 ? `${overs}` : `${overs}.${remainder}`;
}
__name(ballsToOvers, "ballsToOvers");
function teamBowlingRanking(lineup, teamEdge, rng) {
  return [...lineup].map((player) => {
    const roleBoost = player.roles.includes("Fast Bowler") ? 8 : player.roles.includes("Spinner") ? 7 : player.roles.includes("All-rounder") ? 4 : 0;
    const noise = normalRandom(rng) * 22;
    return {
      player,
      value: player.bowling * 1.2 + player.experience * 0.16 + roleBoost + teamEdge * 0.45 + noise
    };
  }).sort((left, right) => right.value - left.value);
}
__name(teamBowlingRanking, "teamBowlingRanking");
function teamBattingRanking(lineup, teamEdge, rng) {
  return [...lineup].map((player) => {
    const roleBoost = player.roles.includes("Opener") ? 14 : player.roles.includes("Top Order") ? 10 : player.roles.includes("Middle Order") ? 6 : player.roles.includes("All-rounder") ? 3 : player.roles.includes("Wicketkeeper") ? 2 : 0;
    const bowlingPenalty = player.roles.includes("Fast Bowler") || player.roles.includes("Spinner") ? -8 : 0;
    const noise = normalRandom(rng) * 18;
    return {
      player,
      value: player.batting * 1.25 + player.experience * 0.18 + roleBoost + bowlingPenalty + teamEdge * 0.35 + noise
    };
  }).sort((left, right) => right.value - left.value);
}
__name(teamBattingRanking, "teamBattingRanking");
function battingOrder(lineup, teamEdge, rng) {
  return teamBattingRanking(lineup, teamEdge, rng).map((item) => item.player);
}
__name(battingOrder, "battingOrder");
function sampleBatterScore(player, bowlingStrength, pitch, inningsIndex, rng) {
  const batting = player?.batting ?? 45;
  const experience = player?.experience ?? 50;
  const pitchDifficulty = {
    flat: -10,
    balanced: 0,
    green: 12,
    turning: 8,
    deteriorating: 18
  }[pitch] ?? 0;
  const inningsDifficulty = [0, 3, 6, 14][inningsIndex - 1] ?? 0;
  const mean = clamp(
    22 + batting * 0.55 + experience * 0.12 - bowlingStrength * 0.35 - pitchDifficulty - inningsDifficulty,
    4,
    95
  );
  const duckChance = clamp(0.16 - batting / 900 + pitchDifficulty / 220, 0.04, 0.25);
  if (rng() < duckChance) {
    return Math.floor(rng() * 6);
  }
  const volatility = 0.95;
  const logMean = Math.log(mean) - volatility * volatility / 2;
  const score = Math.exp(logMean + normalRandom(rng) * 6 * volatility);
  return clamp(Math.round(score), 0, 260);
}
__name(sampleBatterScore, "sampleBatterScore");
function shouldDeclare(runs, wickets, inningsIndex, lead, rng) {
  if (!(inningsIndex === 1 || inningsIndex === 3)) return false;
  if (wickets >= 9) return false;
  if (inningsIndex === 1) {
    return runs >= 500 && rng() < 0.25;
  }
  if (inningsIndex === 3) {
    return runs + lead >= 380 && wickets <= 8 && rng() < 0.45;
  }
  return false;
}
__name(shouldDeclare, "shouldDeclare");
function buildBattingScorecard(lineup, opposition, inningsIndex, conditions, rng, chaseTarget = null, firstInningsLead = 0) {
  const order = battingOrder(lineup, 0, rng);
  const battingStrength = lineupScore(lineup).batting;
  const bowlingStrength = lineupScore(opposition).bowling;
  const pitch = conditions.pitch ?? "balanced";
  const extras = clamp(
    Math.round(2 + rng() * 12 + bowlingStrength / 18 + inningsIndex * 1.4),
    0,
    24
  );
  let runs = 0;
  let wickets = 0;
  let declared = false;
  let chaseComplete = false;
  const batters = [];
  for (let index = 0; index < order.length; index += 1) {
    const player = order[index];
    const rawRuns = sampleBatterScore(player, bowlingStrength, pitch, inningsIndex, rng);
    const adjustedRuns = clamp(
      Math.round(rawRuns * (0.85 + battingStrength / 260) + normalRandom(rng) * 5),
      0,
      260
    );
    const balls = adjustedRuns === 0 ? clamp(Math.round(2 + rng() * 11), 1, 24) : clamp(Math.round(adjustedRuns * (1.2 + rng() * 0.7) + 5), 1, 260);
    const fours = adjustedRuns === 0 ? 0 : clamp(Math.round(adjustedRuns / 11 + rng() * 3), 0, Math.max(0, Math.floor(adjustedRuns / 4)));
    const sixes = adjustedRuns === 0 ? 0 : clamp(Math.round(adjustedRuns / 32 + rng() * 2), 0, Math.max(0, Math.floor(adjustedRuns / 6)));
    const dismissalOptions = ["c", "lbw", "b", "st", "c&b"];
    const card = {
      name: player.name,
      runs: adjustedRuns,
      balls,
      fours,
      sixes,
      out: true,
      notOut: false,
      dismissal: randomChoice(dismissalOptions, rng) ?? "c"
    };
    runs += adjustedRuns;
    if (chaseTarget !== null && runs + extras >= chaseTarget) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      chaseComplete = true;
      batters.push(card);
      break;
    }
    if (shouldDeclare(runs + extras, wickets, inningsIndex, firstInningsLead, rng)) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      declared = true;
      batters.push(card);
      break;
    }
    wickets += 1;
    batters.push(card);
    if (wickets >= 10) break;
  }
  while (batters.length < order.length) {
    const player = order[batters.length];
    batters.push({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      out: false,
      notOut: false,
      dismissal: "DNB",
      dnb: true
    });
  }
  const total = runs + extras;
  const ballsFaced = clamp(Math.round(total * 1.45 + wickets * 4 + rng() * 20), 60, 540);
  const notOutCount = batters.filter((card) => card.notOut).length;
  const topBatter = [...batters].filter((card) => !card.dnb).sort((left, right) => right.runs - left.runs)[0] ?? batters[0] ?? null;
  return {
    batters,
    extras,
    runs,
    wickets,
    declared,
    chaseComplete,
    total,
    balls: ballsFaced,
    overs: ballsToOvers(ballsFaced),
    topBatter,
    notOutCount
  };
}
__name(buildBattingScorecard, "buildBattingScorecard");
function buildBowlingScorecard(lineup, inningsTotal, wickets, teamEdge, rng) {
  const ranked = teamBowlingRanking(lineup, teamEdge, rng);
  const bowlers = ranked.map(({ player, value }) => ({
    name: player.name,
    player,
    value,
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0
  }));
  const used = bowlers.filter((entry) => entry.player.roles.some((role) => ["Fast Bowler", "Spinner", "All-rounder"].includes(role)));
  const totalOvers = clamp(Math.round(inningsTotal / 5), 15, 120);
  const working = (used.length ? used : bowlers.slice(0, Math.min(5, bowlers.length))).slice(0, Math.min(totalOvers, bowlers.length));
  const weighted = working.map((bowler) => {
    const weight = Math.max(1, bowler.player.bowling + bowler.value / 4);
    const exact = totalOvers * weight / working.reduce((sum, item) => sum + Math.max(1, item.player.bowling + item.value / 4), 0);
    const base = Math.max(1, Math.floor(exact));
    return {
      bowler,
      base,
      remainder: exact - base
    };
  });
  let oversLeft = totalOvers - weighted.reduce((sum, entry) => sum + entry.base, 0);
  weighted.sort((left, right) => right.remainder - left.remainder);
  for (const entry of weighted) {
    if (oversLeft <= 0) break;
    entry.base += 1;
    oversLeft -= 1;
  }
  weighted.forEach((entry) => {
    entry.bowler.balls = entry.base * 6;
  });
  const wicketPool = [];
  for (let index = 0; index < wickets; index += 1) {
    const wicketWorking = weighted.map((entry) => entry.bowler).filter((bowler) => bowler.balls > 0);
    wicketPool.push(
      weightedPick(wicketWorking, (bowler) => Math.max(1, bowler.player.bowling + bowler.value / 3 - bowler.wickets * 12), rng)
    );
  }
  wicketPool.forEach((bowler) => {
    bowler.wickets += 1;
  });
  weighted.forEach((entry) => {
    const bowler = entry.bowler;
    const ballShare = bowler.balls / (totalOvers * 6);
    bowler.runs = clamp(
      Math.round(inningsTotal * ballShare + (100 - bowler.player.bowling) * 0.22 + rng() * 7),
      0,
      Math.max(0, inningsTotal + 24)
    );
    bowler.maidens = clamp(
      Math.round(bowler.balls / 24 + (bowler.player.bowling - 50) / 24 + rng() * 1.4),
      0,
      12
    );
  });
  return weighted.map((entry) => entry.bowler).filter((bowler) => bowler.balls > 0).map((bowler) => ({
    name: bowler.name,
    overs: ballsToOvers(bowler.balls),
    maidens: bowler.maidens,
    runs: bowler.runs,
    wickets: bowler.wickets
  })).sort((left, right) => right.wickets - left.wickets || left.runs - right.runs);
}
__name(buildBowlingScorecard, "buildBowlingScorecard");
function buildInningsSummary(teamLabel, batting, bowling) {
  const topRuns = batting.topBatter ? `${batting.topBatter.name} ${batting.topBatter.runs}` : "No score";
  const topBowler = bowling[0] ? `${bowling[0].name} ${bowling[0].wickets}/${bowling[0].runs}` : "No figures";
  const status = batting.chaseComplete ? "Chased down" : batting.declared ? "Declared" : batting.wickets >= 10 ? "All out" : "Closed";
  return {
    teamLabel,
    batting,
    bowling,
    status,
    topRuns,
    topBowler
  };
}
__name(buildInningsSummary, "buildInningsSummary");
function bestBattersFromInnings(inningsList) {
  const batters = inningsList.flatMap((innings) => innings?.batting?.batters ?? innings?.batters ?? []);
  return batters.filter((card) => !card.dnb).sort((left, right) => right.runs - left.runs || right.balls - left.balls)[0] ?? null;
}
__name(bestBattersFromInnings, "bestBattersFromInnings");
function bestBowlerFromInnings(inningsList) {
  const bowlers = inningsList.flatMap((innings) => innings?.bowling ?? innings?.bowlers ?? []).filter((bowler) => bowler && bowler.overs !== "0");
  return bowlers.sort((left, right) => right.wickets - left.wickets || left.runs - right.runs)[0] ?? null;
}
__name(bestBowlerFromInnings, "bestBowlerFromInnings");
function buildMatchBoxScore(sideInnings) {
  const batter = bestBattersFromInnings(sideInnings.batting) ?? { name: "Unknown", runs: 0 };
  const bowler = bestBowlerFromInnings(sideInnings.bowling) ?? { name: "Unknown", wickets: 0, runs: 0, overs: "0" };
  return {
    batter,
    bowler: {
      ...bowler,
      figures: `${bowler.wickets}/${bowler.runs}`
    }
  };
}
__name(buildMatchBoxScore, "buildMatchBoxScore");
function generateHeadline(match2) {
  const batters = [
    ...match2.innings.user1?.batters ?? [],
    ...match2.innings.user2?.batters ?? [],
    ...match2.innings.star1?.batters ?? [],
    ...match2.innings.star2?.batters ?? []
  ];
  const bowlers = [
    ...match2.innings.user1.bowling ?? [],
    ...match2.innings.user2.bowling ?? [],
    ...match2.innings.star1.bowling ?? [],
    ...match2.innings.star2.bowling ?? []
  ];
  const topBat = [...batters].filter((card) => !card.dnb).sort((left, right) => right.runs - left.runs)[0] ?? null;
  const topBowl = [...bowlers].sort((left, right) => right.wickets - left.wickets || left.runs - right.runs)[0] ?? null;
  if (topBowl && topBowl.wickets >= 5) {
    return `${topBowl.name} destroys the chase with ${topBowl.wickets} wickets`;
  }
  if (topBat && topBat.runs >= 140) {
    return `${topBat.name}'s ${topBat.runs} seals the Test`;
  }
  if (match2.result === "draw") {
    return "A stubborn final session salvages the draw";
  }
  return topBat ? `${topBat.name} anchors the innings with ${topBat.runs}` : "A tight Test goes down to the final innings";
}
__name(generateHeadline, "generateHeadline");
function matchMarginText(match2) {
  const { user1, star1, user2, star2 } = match2.innings;
  const userTotal = user1.total + user2.total;
  const starTotal = star1.total + star2.total;
  if (match2.result === "draw") return "Match drawn";
  if (match2.result === "win") {
    if (user2.chaseComplete) {
      return `Won by ${10 - user2.wickets} ${pluralize(10 - user2.wickets, "wicket")}`;
    }
    if (star2.wickets >= 10 && userTotal > starTotal) {
      return `Won by ${userTotal - starTotal} ${pluralize(userTotal - starTotal, "run")}`;
    }
    if (user1.total > star1.total + star2.total) {
      return `Won by an innings and ${user1.total - (star1.total + star2.total)} ${pluralize(user1.total - (star1.total + star2.total), "run")}`;
    }
  } else if (match2.result === "loss") {
    if (star2.chaseComplete) {
      return `Lost by ${10 - star2.wickets} ${pluralize(10 - star2.wickets, "wicket")}`;
    }
    if (user2.wickets >= 10 && starTotal > userTotal) {
      return `Lost by ${starTotal - userTotal} ${pluralize(starTotal - userTotal, "run")}`;
    }
    if (star1.total > user1.total + user2.total) {
      return `Lost by an innings and ${star1.total - (user1.total + user2.total)} ${pluralize(star1.total - (user1.total + user2.total), "run")}`;
    }
  }
  return match2.result === "win" ? "Won the Test" : "Lost the Test";
}
__name(matchMarginText, "matchMarginText");
function performancePointsForCard(card) {
  return (card.runs ?? 0) + (card.wickets ?? 0) * 25 + (card.centuries ?? 0) * 18 + (card.fiveFors ?? 0) * 22;
}
__name(performancePointsForCard, "performancePointsForCard");
function collectSeriesStats(series) {
  const leaderMap = /* @__PURE__ */ new Map();
  const addCardStats = /* @__PURE__ */ __name((side, card) => {
    const key = `${side}:${card.name}`;
    const entry = leaderMap.get(key) ?? {
      side,
      name: card.name,
      runs: 0,
      wickets: 0,
      centuries: 0,
      fiveFors: 0,
      points: 0
    };
    entry.runs += card.runs ?? 0;
    entry.points += performancePointsForCard(card);
    if ((card.runs ?? 0) >= 100) entry.centuries += 1;
    leaderMap.set(key, entry);
  }, "addCardStats");
  const addBowlerStats = /* @__PURE__ */ __name((side, bowler) => {
    const key = `${side}:${bowler.name}`;
    const entry = leaderMap.get(key) ?? {
      side,
      name: bowler.name,
      runs: 0,
      wickets: 0,
      centuries: 0,
      fiveFors: 0,
      points: 0
    };
    entry.wickets += bowler.wickets ?? 0;
    entry.points += (bowler.wickets ?? 0) * 20;
    if ((bowler.wickets ?? 0) >= 5) entry.fiveFors += 1;
    leaderMap.set(key, entry);
  }, "addBowlerStats");
  const addInningsStats = /* @__PURE__ */ __name((battingSide, bowlingSide, innings) => {
    if (!innings) return;
    (innings.batters ?? []).forEach((card) => {
      if (!card.dnb) addCardStats(battingSide, card);
    });
    (innings.bowling ?? []).forEach((bowler) => addBowlerStats(bowlingSide, bowler));
  }, "addInningsStats");
  for (const match2 of series.matches) {
    addInningsStats("your", "star", match2.inningsData?.user1?.batting);
    addInningsStats("star", "your", match2.inningsData?.star1?.batting);
    addInningsStats("your", "star", match2.inningsData?.user2?.batting);
    addInningsStats("star", "your", match2.inningsData?.star2?.batting);
  }
  const leaders = [...leaderMap.values()];
  const overallLeader = [...leaders].sort((left, right) => right.points - left.points || right.runs - left.runs || right.wickets - left.wickets)[0] ?? null;
  return {
    overallLeader,
    mostRuns: [...leaders].sort((left, right) => right.runs - left.runs)[0] ?? null,
    mostWickets: [...leaders].sort((left, right) => right.wickets - left.wickets)[0] ?? null,
    mostCenturies: [...leaders].sort((left, right) => right.centuries - left.centuries || right.runs - left.runs)[0] ?? null,
    mostFiveFors: [...leaders].sort((left, right) => right.fiveFors - left.fiveFors || right.wickets - left.wickets)[0] ?? null,
    userRuns: leaders.filter((item) => item.side === "your").reduce((sum, item) => sum + item.runs, 0),
    userWickets: leaders.filter((item) => item.side === "your").reduce((sum, item) => sum + item.wickets, 0)
  };
}
__name(collectSeriesStats, "collectSeriesStats");
function simulateDeterministicTestMatch(userLineup, oppositionLineup, conditions, rng) {
  const user1 = buildBattingScorecard(userLineup, oppositionLineup, 1, conditions, rng);
  const star1 = buildBattingScorecard(oppositionLineup, userLineup, 2, conditions, rng);
  const userLead = user1.total - star1.total;
  const user2 = buildBattingScorecard(userLineup, oppositionLineup, 3, conditions, rng, null, userLead);
  const target = user1.total + user2.total - star1.total + 1;
  const star2 = target <= 0 ? {
    batters: battingOrder(oppositionLineup, 0, rng).map((player) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      out: false,
      notOut: false,
      dismissal: "DNB",
      dnb: true
    })),
    extras: 0,
    runs: 0,
    wickets: 0,
    declared: false,
    chaseComplete: true,
    didNotBat: true,
    total: 0,
    balls: 0,
    overs: "0.0",
    topBatter: null,
    bowling: []
  } : buildBattingScorecard(oppositionLineup, userLineup, 4, conditions, rng, target);
  const user1Bowling = buildBowlingScorecard(oppositionLineup, user1.total, user1.wickets, 0, rng);
  const star1Bowling = buildBowlingScorecard(userLineup, star1.total, star1.wickets, 0, rng);
  const user2Bowling = buildBowlingScorecard(oppositionLineup, user2.total, user2.wickets, userLead, rng);
  const star2Bowling = target <= 0 ? [] : buildBowlingScorecard(userLineup, star2.total, star2.wickets, -userLead, rng);
  user1.bowling = user1Bowling;
  star1.bowling = star1Bowling;
  user2.bowling = user2Bowling;
  star2.bowling = star2Bowling;
  const userTotal = user1.total + user2.total;
  const starTotal = star1.total + star2.total;
  let result;
  if (star2.chaseComplete && starTotal > userTotal) {
    result = "loss";
  } else if (star2.wickets >= 10 && starTotal < userTotal) {
    result = "win";
  } else if (starTotal === userTotal) {
    result = "draw";
  } else if (starTotal > userTotal) {
    result = "loss";
  } else {
    result = "draw";
  }
  return {
    result,
    format: "tests",
    innings: { user1, star1, user2, star2 },
    userTotal,
    starTotal
  };
}
__name(simulateDeterministicTestMatch, "simulateDeterministicTestMatch");
function buildSingleTestSeries(userLineup, oppositionLineup, conditions = {}, seed = "") {
  const rng = createSeededRandom(seed);
  const match2 = simulateDeterministicTestMatch(userLineup, oppositionLineup, conditions, rng);
  const venueLabel = conditions.venueLabel || conditions.venue || "Daily conditions";
  const userInnings1 = match2.innings.user1;
  const starInnings1 = match2.innings.star1;
  const userInnings2 = match2.innings.user2;
  const starInnings2 = match2.innings.star2;
  const matchRecord = {
    format: "tests",
    matchNumber: 1,
    testNumber: 1,
    venue: venueLabel,
    result: match2.result,
    summary: matchMarginText(match2),
    headline: generateHeadline(match2),
    innings: [
      { label: "Your XI 1st inns", score: `${userInnings1.total}/${userInnings1.wickets}${userInnings1.declared ? "d" : ""}` },
      { label: "Opposition 1st inns", score: `${starInnings1.total}/${starInnings1.wickets}${starInnings1.declared ? "d" : ""}` },
      { label: "Your XI 2nd inns", score: `${userInnings2.total}/${userInnings2.wickets}${userInnings2.declared ? "d" : ""}` },
      { label: "Opposition 2nd inns", score: starInnings2.didNotBat ? "DNB" : `${starInnings2.total}/${starInnings2.wickets}${starInnings2.declared ? "d" : ""}` }
    ],
    scoreline: `${userInnings1.total}/${userInnings1.wickets} & ${userInnings2.total}/${userInnings2.wickets} | ${starInnings1.total}/${starInnings1.wickets} & ${starInnings2.didNotBat ? "DNB" : `${starInnings2.total}/${starInnings2.wickets}`}`,
    inningsData: {
      user1: buildInningsSummary("Your XI 1st innings", userInnings1, match2.innings.user1.bowling),
      star1: buildInningsSummary("Opposition 1st innings", starInnings1, match2.innings.star1.bowling),
      user2: buildInningsSummary("Your XI 2nd innings", userInnings2, match2.innings.user2.bowling),
      star2: buildInningsSummary("Opposition 2nd innings", starInnings2, match2.innings.star2.bowling)
    }
  };
  matchRecord.userBox = buildMatchBoxScore({
    batting: [matchRecord.inningsData.user1, matchRecord.inningsData.user2],
    bowling: [matchRecord.inningsData.star1, matchRecord.inningsData.star2]
  });
  matchRecord.starBox = buildMatchBoxScore({
    batting: [matchRecord.inningsData.star1, matchRecord.inningsData.star2],
    bowling: [matchRecord.inningsData.user1, matchRecord.inningsData.user2]
  });
  const userWins = match2.result === "win" ? 1 : 0;
  const starWins = match2.result === "loss" ? 1 : 0;
  const draws = match2.result === "draw" ? 1 : 0;
  const matches = [matchRecord];
  const leaders = collectSeriesStats({ matches });
  return {
    userLineup,
    starLineup: oppositionLineup,
    userTeam: teamMetricsFromLineup(userLineup),
    starTeam: teamMetricsFromLineup(oppositionLineup),
    matches,
    revealed: 1,
    userWins,
    starWins,
    draws,
    leaders,
    achievements: [],
    playerOfSeries: leaders.overallLeader
  };
}
__name(buildSingleTestSeries, "buildSingleTestSeries");

// ../site/shared/daily-ashes.js
var DAILY_TOTAL_ROLLS = 4;
var DAILY_CHALLENGE_VERSION = "ashes-daily-v2";
var CATALOG_PLAYER_BY_SQUAD_AND_STABLE_ID = new Map(
  ASHES_CATALOG.map((player) => [`${player.squadId}:${player.stableId}`, player])
);
var BEST_ASHES_PLAYERS = [...BEST_ASHES_PLAYER_BY_STABLE_ID.values()];
var DAILY_CHALLENGE_CACHE = /* @__PURE__ */ new Map();
var DAILY_GENERATED_TEMPLATE_SLOT_SETS = [
  [0, 1, 2, 5, 7, 8, 9],
  [0, 1, 4, 5, 7, 8, 9],
  [0, 1, 2, 5, 7, 8, 10]
];
var DAILY_CONDITIONS = [
  {
    pitch: "balanced",
    venue: "The Oval",
    venueLabel: "The Oval",
    summary: "A balanced pitch with enough pace for the quicks and value for patient batting."
  },
  {
    pitch: "green",
    venue: "Lord's",
    venueLabel: "Lord's",
    summary: "Fresh grass and cloud cover bring the seamers into play from the start."
  },
  {
    pitch: "flat",
    venue: "Adelaide",
    venueLabel: "Adelaide",
    summary: "True bounce and fast outfield reward strokeplay if you can survive the new ball."
  },
  {
    pitch: "turning",
    venue: "Old Trafford",
    venueLabel: "Old Trafford",
    summary: "A dry surface should bring spin and control into the game as the Test moves on."
  },
  {
    pitch: "deteriorating",
    venue: "Headingley",
    venueLabel: "Headingley",
    summary: "Variable bounce later in the match puts a premium on balance and resilience."
  }
];
function isoDate(value) {
  return String(value ?? "").slice(0, 10);
}
__name(isoDate, "isoDate");
function challengeIdForDate(date) {
  return `daily-ashes-${date}`;
}
__name(challengeIdForDate, "challengeIdForDate");
function createSeededRandom2(seedText) {
  const text = String(seedText ?? "");
  let seed = 1779033703 ^ text.length;
  for (let index = 0; index < text.length; index += 1) {
    seed = Math.imul(seed ^ text.charCodeAt(index), 3432918353);
    seed = seed << 13 | seed >>> 19;
  }
  return () => {
    seed = Math.imul(seed ^ seed >>> 16, 2246822507);
    seed = Math.imul(seed ^ seed >>> 13, 3266489909);
    seed ^= seed >>> 16;
    return (seed >>> 0) / 4294967296;
  };
}
__name(createSeededRandom2, "createSeededRandom");
function shuffle(values, rng) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
__name(shuffle, "shuffle");
function weightedPick2(items, getWeight, rng) {
  const weighted = items.map((item) => ({
    item,
    weight: Math.max(0, Number(getWeight(item) ?? 0))
  })).filter((entry) => entry.weight > 0);
  if (!weighted.length) return null;
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let remaining = rng() * total;
  for (const entry of weighted) {
    remaining -= entry.weight;
    if (remaining <= 0) return entry.item;
  }
  return weighted[weighted.length - 1]?.item ?? null;
}
__name(weightedPick2, "weightedPick");
function stableDateText(value) {
  const text = isoDate(value);
  return /^\d{4}-\d{2}-\d{2}$/u.test(text) ? text : "";
}
__name(stableDateText, "stableDateText");
function rollEligibleCandidates(squadId, openSlotIndexes, excludedStableIds = /* @__PURE__ */ new Set()) {
  return ASHES_CATALOG.filter(
    (player) => player.squadId === squadId && !excludedStableIds.has(player.stableId) && openSlotIndexes.some((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], player))
  ).sort((left, right) => playerOverall(right) - playerOverall(left));
}
__name(rollEligibleCandidates, "rollEligibleCandidates");
function pickFixedAssignments(slotIndexes, seedText) {
  const rng = createSeededRandom2(seedText);
  const assignments = [];
  const usedStableIds = /* @__PURE__ */ new Set();
  const orderedSlotIndexes = [...slotIndexes];
  for (const slotIndex of orderedSlotIndexes) {
    const slot = XI_SLOTS[slotIndex];
    const candidates = BEST_ASHES_PLAYERS.filter((player2) => !usedStableIds.has(player2.stableId) && slotAcceptsPlayer(slot, player2)).sort((left, right) => playerSlotScore(right, slot) - playerSlotScore(left, slot) || playerOverall(right) - playerOverall(left)).slice(0, 18);
    const player = weightedPick2(
      candidates,
      (candidate) => playerSlotScore(candidate, slot) * 2 + playerOverall(candidate),
      rng
    );
    if (!player) return null;
    usedStableIds.add(player.stableId);
    assignments.push({
      slotIndex,
      stableId: player.stableId
    });
  }
  return assignments.sort((left, right) => left.slotIndex - right.slotIndex);
}
__name(pickFixedAssignments, "pickFixedAssignments");
function pickRollPlayersForSquad(squadId, openSlotIndexes, excludedStableIds, seedText) {
  const rng = createSeededRandom2(seedText);
  const candidates = rollEligibleCandidates(squadId, openSlotIndexes, excludedStableIds);
  if (candidates.length < 5) return null;
  const remaining = [...candidates];
  const selected = [];
  const coveredSlots = /* @__PURE__ */ new Set();
  while (selected.length < 5 && remaining.length) {
    remaining.sort((left, right) => {
      const leftSlots = openSlotIndexes.filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], left));
      const rightSlots = openSlotIndexes.filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], right));
      const leftUncovered = leftSlots.filter((slotIndex) => !coveredSlots.has(slotIndex)).length;
      const rightUncovered = rightSlots.filter((slotIndex) => !coveredSlots.has(slotIndex)).length;
      const leftScore = leftUncovered * 1e3 + leftSlots.length * 140 + playerOverall(left) * 4 + rng() * 25;
      const rightScore = rightUncovered * 1e3 + rightSlots.length * 140 + playerOverall(right) * 4 + rng() * 25;
      return rightScore - leftScore;
    });
    const next = remaining.shift();
    if (!next) break;
    selected.push(next);
    openSlotIndexes.filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], next)).forEach((slotIndex) => coveredSlots.add(slotIndex));
  }
  if (selected.length < 5) return null;
  return selected.map((player) => player.stableId);
}
__name(pickRollPlayersForSquad, "pickRollPlayersForSquad");
function pickDailyRolls(fixedAssignments, seedText) {
  const openSlotIndexes = XI_SLOTS.map((_, index) => index).filter((index) => !fixedAssignments.some((assignment) => assignment.slotIndex === index));
  const fixedStableIds = new Set(fixedAssignments.map((assignment) => assignment.stableId));
  const squadRng = createSeededRandom2(`${seedText}|squads`);
  const squads = shuffle([...ASHES_SQUAD_BY_ID.values()], squadRng).filter((squad) => rollEligibleCandidates(squad.id, openSlotIndexes, fixedStableIds).length >= 5);
  if (squads.length < DAILY_TOTAL_ROLLS) return null;
  for (let startIndex = 0; startIndex <= squads.length - DAILY_TOTAL_ROLLS; startIndex += 1) {
    const rolls = [];
    const usedStableIds = new Set(fixedStableIds);
    let valid = true;
    for (let rollOffset = 0; rollOffset < DAILY_TOTAL_ROLLS; rollOffset += 1) {
      const squad = squads[startIndex + rollOffset];
      const eligibleStableIds = pickRollPlayersForSquad(
        squad.id,
        openSlotIndexes,
        usedStableIds,
        `${seedText}|roll|${rollOffset + 1}|${squad.id}|${[...usedStableIds].sort().join(",")}`
      );
      if (!eligibleStableIds) {
        valid = false;
        break;
      }
      eligibleStableIds.forEach((stableId) => usedStableIds.add(stableId));
      rolls.push({
        squadId: squad.id,
        eligibleStableIds
      });
    }
    if (valid && rolls.length === DAILY_TOTAL_ROLLS) {
      return rolls;
    }
  }
  return null;
}
__name(pickDailyRolls, "pickDailyRolls");
function pickOppositionStableIds(excludedStableIds, seedText) {
  const rng = createSeededRandom2(seedText);
  const lineup = [];
  const usedStableIds = new Set(excludedStableIds);
  for (let slotIndex = 0; slotIndex < XI_SLOTS.length; slotIndex += 1) {
    const slot = XI_SLOTS[slotIndex];
    const candidates = BEST_ASHES_PLAYERS.filter((player) => !usedStableIds.has(player.stableId) && slotAcceptsPlayer(slot, player)).sort((left, right) => playerSlotScore(right, slot) - playerSlotScore(left, slot) || playerOverall(right) - playerOverall(left)).slice(0, 18);
    const chosen = weightedPick2(
      candidates,
      (candidate) => playerSlotScore(candidate, slot) * 2 + playerOverall(candidate),
      rng
    );
    if (!chosen) return null;
    usedStableIds.add(chosen.stableId);
    lineup[slotIndex] = chosen;
  }
  return lineup.map((player) => player.stableId);
}
__name(pickOppositionStableIds, "pickOppositionStableIds");
function pickDailyConditions(seedText) {
  const rng = createSeededRandom2(seedText);
  return weightedPick2(DAILY_CONDITIONS, () => 1, rng) ?? DAILY_CONDITIONS[0];
}
__name(pickDailyConditions, "pickDailyConditions");
function buildChallengeDefinition(date, config) {
  const fixedAssignments = Array.isArray(config.fixedAssignments) ? [...config.fixedAssignments].map((assignment) => ({
    slotIndex: Number(assignment.slotIndex),
    stableId: String(assignment.stableId ?? "")
  })).filter((assignment) => Number.isInteger(assignment.slotIndex) && assignment.slotIndex >= 0 && assignment.slotIndex < XI_SLOTS.length && assignment.stableId).sort((left, right) => left.slotIndex - right.slotIndex) : [...config.fixedPlayerStableIds ?? []].map((stableId, index) => ({
    slotIndex: index,
    stableId: String(stableId ?? "")
  })).filter((assignment) => assignment.stableId);
  return {
    id: challengeIdForDate(date),
    date,
    label: `Daily Ashes Challenge \xB7 ${date}`,
    challengeNumber: Number(date.replaceAll("-", "")),
    version: DAILY_CHALLENGE_VERSION,
    fixedAssignments,
    fixedPlayerStableIds: fixedAssignments.map((assignment) => assignment.stableId),
    oppositionStableIds: [...config.oppositionStableIds],
    oppositionLabel: sanitizePlainText(config.oppositionLabel, 80) || "Historic opposition XI",
    conditions: {
      pitch: config.conditions?.pitch ?? "balanced",
      venue: sanitizePlainText(config.conditions?.venue, 80) || "Historic venue",
      venueLabel: sanitizePlainText(config.conditions?.venueLabel, 80) || sanitizePlainText(config.conditions?.venue, 80) || "Historic venue",
      summary: sanitizePlainText(config.conditions?.summary, 120) || "Balanced conditions"
    },
    rolls: config.rolls.map((roll, index) => ({
      rollNumber: index + 1,
      squadId: roll.squadId,
      eligibleStableIds: [...roll.eligibleStableIds]
    }))
  };
}
__name(buildChallengeDefinition, "buildChallengeDefinition");
var DAILY_CHALLENGE_SCHEDULE = [
  buildChallengeDefinition("2026-07-26", {
    fixedAssignments: [
      { slotIndex: 0, stableId: "jack-hobbs" },
      { slotIndex: 1, stableId: "alastair-cook" },
      { slotIndex: 2, stableId: "don-bradman" },
      { slotIndex: 3, stableId: "steve-smith" },
      { slotIndex: 5, stableId: "adam-gilchrist" },
      { slotIndex: 7, stableId: "shane-warne" },
      { slotIndex: 8, stableId: "james-anderson" }
    ],
    oppositionStableIds: [
      "herbert-sutcliffe",
      "victor-trumper",
      "ricky-ponting",
      "greg-chappell",
      "allan-border",
      "rod-marsh",
      "keith-miller",
      "bill-o-reilly",
      "pat-cummins",
      "glenn-mcgrath",
      "sydney-barnes"
    ],
    oppositionLabel: "Historic Australia greats",
    conditions: {
      pitch: "green",
      venue: "Lord's",
      venueLabel: "Lord's",
      summary: "Fresh Lord's surface with seam movement on day one."
    },
    rolls: [
      {
        squadId: "eng-2005",
        eligibleStableIds: [
          "kevin-pietersen",
          "paul-collingwood",
          "andrew-flintoff",
          "steve-harmison",
          "matthew-hoggard"
        ]
      },
      {
        squadId: "aus-2006",
        eligibleStableIds: [
          "ricky-ponting",
          "michael-hussey",
          "andrew-symonds",
          "brett-lee",
          "glenn-mcgrath"
        ]
      },
      {
        squadId: "eng-2019",
        eligibleStableIds: [
          "joe-root",
          "ben-stokes",
          "chris-woakes",
          "jofra-archer",
          "stuart-broad"
        ]
      },
      {
        squadId: "aus-2023",
        eligibleStableIds: [
          "marnus-labuschagne",
          "travis-head",
          "cameron-green",
          "pat-cummins",
          "mitchell-starc"
        ]
      }
    ]
  })
];
var DAILY_CHALLENGE_BY_ID = new Map(DAILY_CHALLENGE_SCHEDULE.map((challenge) => [challenge.id, challenge]));
var DAILY_CHALLENGE_BY_DATE = new Map(DAILY_CHALLENGE_SCHEDULE.map((challenge) => [challenge.date, challenge]));
function completionStateKey(definition, selections, nextRollNumber) {
  const normalized = normalizeDailySelections(selections);
  const usedStableIds = [
    ...definition.fixedPlayerStableIds,
    ...normalized.map((selection) => selection.stableId)
  ].sort();
  const occupiedSlots = [
    ...(definition.fixedAssignments ?? []).map((assignment) => assignment.slotIndex),
    ...normalized.map((selection) => selection.slotIndex).filter((slotIndex) => Number.isInteger(slotIndex))
  ].sort((left, right) => left - right);
  return `${nextRollNumber}|${usedStableIds.join(",")}|${occupiedSlots.join(",")}`;
}
__name(completionStateKey, "completionStateKey");
function getCompletionSolver(definition) {
  const memo = /* @__PURE__ */ new Map();
  function hasPathFromSelections(selections, nextRollNumber) {
    const stateKey = completionStateKey(definition, selections, nextRollNumber);
    if (memo.has(stateKey)) {
      return memo.get(stateKey);
    }
    let result = false;
    if (nextRollNumber > definition.rolls.length) {
      result = Boolean(buildDailyCompletedXI(definition, selections));
    } else {
      const roll = getDailyRoll(definition, nextRollNumber);
      if (roll) {
        const usedStableIds = lockedStableIds(definition, selections);
        for (const stableId of roll.eligibleStableIds) {
          if (usedStableIds.has(stableId)) continue;
          const player = resolveSquadPlayer(roll.squadId, stableId);
          if (!player) continue;
          const candidateSlots = openSlotIndexesForSelections(definition, selections).filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], player));
          for (const slotIndex of candidateSlots) {
            const nextSelections = [
              ...normalizeDailySelections(selections),
              {
                rollNumber: roll.rollNumber,
                squadId: roll.squadId,
                playerId: player.id,
                stableId,
                slotIndex
              }
            ];
            if (hasPathFromSelections(nextSelections, nextRollNumber + 1)) {
              result = true;
              break;
            }
          }
          if (result) break;
        }
      }
    }
    memo.set(stateKey, result);
    return result;
  }
  __name(hasPathFromSelections, "hasPathFromSelections");
  return hasPathFromSelections;
}
__name(getCompletionSolver, "getCompletionSolver");
function validateGeneratedDailyDefinition(definition) {
  const fixedPlayers = getDailyFixedPlayers(definition);
  const oppositionPlayers = getDailyOppositionPlayers(definition);
  if (fixedPlayers.length !== 7 || oppositionPlayers.length !== 11) return false;
  if (definition.rolls.length !== DAILY_TOTAL_ROLLS) return false;
  if (definition.rolls.some((roll) => roll.eligibleStableIds.length !== 5)) return false;
  const firstRoll = buildDailyRollPublicState(definition, 1, []);
  if (!firstRoll) return false;
  if (firstRoll.players.filter((player) => player.selectable).length < 2) return false;
  return countDailyCompletionPaths(definition, [], 1, 12) >= 4;
}
__name(validateGeneratedDailyDefinition, "validateGeneratedDailyDefinition");
function buildGeneratedChallenge(date) {
  const dateText = stableDateText(date);
  if (!dateText) return null;
  const cached = DAILY_CHALLENGE_CACHE.get(dateText);
  if (cached) return cached;
  for (let variant = 0; variant < 48; variant += 1) {
    const templateRng = createSeededRandom2(`${dateText}|template|${variant}`);
    const slotIndexes = shuffle(DAILY_GENERATED_TEMPLATE_SLOT_SETS, templateRng)[0] ?? DAILY_GENERATED_TEMPLATE_SLOT_SETS[0];
    const fixedAssignments = pickFixedAssignments(slotIndexes, `${dateText}|fixed|${variant}`);
    if (!fixedAssignments) continue;
    const rolls = pickDailyRolls(fixedAssignments, `${dateText}|rolls|${variant}`);
    if (!rolls) continue;
    const excludedStableIds = new Set(fixedAssignments.map((assignment) => assignment.stableId));
    rolls.forEach((roll) => roll.eligibleStableIds.forEach((stableId) => excludedStableIds.add(stableId)));
    const oppositionStableIds = pickOppositionStableIds(excludedStableIds, `${dateText}|opposition|${variant}`);
    if (!oppositionStableIds) continue;
    const definition = buildChallengeDefinition(dateText, {
      fixedAssignments,
      oppositionStableIds,
      oppositionLabel: "Historic Ashes challengers",
      conditions: pickDailyConditions(`${dateText}|conditions|${variant}`),
      rolls
    });
    if (validateGeneratedDailyDefinition(definition)) {
      DAILY_CHALLENGE_CACHE.set(dateText, definition);
      return definition;
    }
  }
  const fallbackSource = DAILY_CHALLENGE_SCHEDULE[0];
  if (!fallbackSource) return null;
  const fallback = buildChallengeDefinition(dateText, {
    fixedAssignments: fallbackSource.fixedAssignments,
    oppositionStableIds: fallbackSource.oppositionStableIds,
    oppositionLabel: fallbackSource.oppositionLabel,
    conditions: fallbackSource.conditions,
    rolls: fallbackSource.rolls
  });
  DAILY_CHALLENGE_CACHE.set(dateText, fallback);
  return fallback;
}
__name(buildGeneratedChallenge, "buildGeneratedChallenge");
function getDailyChallengeById(challengeId) {
  const normalizedId = String(challengeId ?? "").trim();
  const scheduled = DAILY_CHALLENGE_BY_ID.get(normalizedId);
  if (scheduled) return scheduled;
  const match2 = normalizedId.match(/^daily-ashes-(\d{4}-\d{2}-\d{2})$/u);
  if (!match2) return null;
  return buildGeneratedChallenge(match2[1]);
}
__name(getDailyChallengeById, "getDailyChallengeById");
function getCurrentDailyChallenge(referenceDate = /* @__PURE__ */ new Date()) {
  const dateText = stableDateText(referenceDate instanceof Date ? referenceDate.toISOString() : referenceDate);
  if (!dateText) return null;
  return DAILY_CHALLENGE_BY_DATE.get(dateText) ?? buildGeneratedChallenge(dateText);
}
__name(getCurrentDailyChallenge, "getCurrentDailyChallenge");
function resolveBestAshesPlayer(stableId) {
  return BEST_ASHES_PLAYER_BY_STABLE_ID.get(stableId) ?? null;
}
__name(resolveBestAshesPlayer, "resolveBestAshesPlayer");
function resolveSquadPlayer(squadId, stableId) {
  return CATALOG_PLAYER_BY_SQUAD_AND_STABLE_ID.get(`${squadId}:${stableId}`) ?? null;
}
__name(resolveSquadPlayer, "resolveSquadPlayer");
function getDailyFixedPlayers(definition) {
  return (definition.fixedAssignments ?? []).map((assignment) => {
    const player = resolveBestAshesPlayer(assignment.stableId);
    return player ? { ...player, slotIndex: assignment.slotIndex } : null;
  }).filter(Boolean);
}
__name(getDailyFixedPlayers, "getDailyFixedPlayers");
function getDailyOppositionPlayers(definition) {
  return definition.oppositionStableIds.map((stableId) => resolveBestAshesPlayer(stableId)).filter(Boolean);
}
__name(getDailyOppositionPlayers, "getDailyOppositionPlayers");
function getDailyRoll(definition, rollNumber) {
  return definition.rolls.find((roll) => roll.rollNumber === Number(rollNumber)) ?? null;
}
__name(getDailyRoll, "getDailyRoll");
function normalizeDailySelections(selections) {
  return Array.isArray(selections) ? [...selections].map((selection) => {
    const slotIndexValue = selection?.slotIndex;
    const parsedSlotIndex = slotIndexValue === null || slotIndexValue === void 0 ? null : Number(slotIndexValue);
    return {
      rollNumber: Number(selection.rollNumber),
      squadId: String(selection.squadId ?? ""),
      playerId: String(selection.playerId ?? ""),
      stableId: String(selection.stableId ?? stablePlayerIdFromName(selection.playerName ?? "")),
      slotIndex: Number.isInteger(parsedSlotIndex) ? parsedSlotIndex : null
    };
  }).filter((selection) => selection.rollNumber >= 1 && selection.playerId && selection.stableId).sort((left, right) => left.rollNumber - right.rollNumber) : [];
}
__name(normalizeDailySelections, "normalizeDailySelections");
function lockedStableIds(definition, selections) {
  return /* @__PURE__ */ new Set([
    ...definition.fixedPlayerStableIds,
    ...normalizeDailySelections(selections).map((selection) => selection.stableId)
  ]);
}
__name(lockedStableIds, "lockedStableIds");
function openSlotIndexesForSelections(definition, selections) {
  const occupied = new Set((definition.fixedAssignments ?? []).map((assignment) => assignment.slotIndex));
  normalizeDailySelections(selections).map((selection) => selection.slotIndex).filter((slotIndex) => Number.isInteger(slotIndex)).forEach((slotIndex) => occupied.add(slotIndex));
  return XI_SLOTS.map((_, index) => index).filter((index) => !occupied.has(index));
}
__name(openSlotIndexesForSelections, "openSlotIndexesForSelections");
function buildDailyPlayerPool(definition, selections) {
  const fixedPlayers = getDailyFixedPlayers(definition);
  const selectedPlayers = normalizeDailySelections(selections).map((selection) => ASHES_PLAYER_BY_ID.get(selection.playerId) ?? resolveBestAshesPlayer(selection.stableId)).filter(Boolean);
  return [...fixedPlayers, ...selectedPlayers];
}
__name(buildDailyPlayerPool, "buildDailyPlayerPool");
function buildDailyCompletedXI(definition, selections) {
  const normalizedSelections = normalizeDailySelections(selections);
  if (normalizedSelections.length !== definition.rolls.length) return null;
  const fixedPlayers = getDailyFixedPlayers(definition);
  const allHaveSlots = fixedPlayers.every((player) => Number.isInteger(player.slotIndex)) && normalizedSelections.every((selection) => Number.isInteger(selection.slotIndex));
  if (allHaveSlots) {
    const lineup = new Array(XI_SLOTS.length).fill(null);
    const usedStableIds = /* @__PURE__ */ new Set();
    for (const player of fixedPlayers) {
      if (lineup[player.slotIndex] || !slotAcceptsPlayer(XI_SLOTS[player.slotIndex], player) || usedStableIds.has(player.stableId)) {
        return null;
      }
      lineup[player.slotIndex] = player;
      usedStableIds.add(player.stableId);
    }
    for (const selection of normalizedSelections) {
      const player = ASHES_PLAYER_BY_ID.get(selection.playerId);
      if (!player || lineup[selection.slotIndex] || !slotAcceptsPlayer(XI_SLOTS[selection.slotIndex], player) || usedStableIds.has(player.stableId)) {
        return null;
      }
      lineup[selection.slotIndex] = player;
      usedStableIds.add(player.stableId);
    }
    return lineup.every(Boolean) ? lineup : null;
  }
  const pool = buildDailyPlayerPool(definition, normalizedSelections);
  if (pool.length !== XI_SLOTS.length) return null;
  return assignBestValidLineup(pool);
}
__name(buildDailyCompletedXI, "buildDailyCompletedXI");
function validSlotIndexesForPlayer(definition, selections, rollNumber, playerId) {
  const roll = getDailyRoll(definition, rollNumber);
  if (!roll || roll.rollNumber !== Number(rollNumber)) {
    return [];
  }
  const player = ASHES_PLAYER_BY_ID.get(playerId);
  if (!player || player.squadId !== roll.squadId) {
    return [];
  }
  if (!roll.eligibleStableIds.includes(player.stableId)) {
    return [];
  }
  const used = lockedStableIds(definition, selections);
  if (used.has(player.stableId)) {
    return [];
  }
  const solver = getCompletionSolver(definition);
  const openSlotIndexes = openSlotIndexesForSelections(definition, selections).filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], player));
  return openSlotIndexes.filter((slotIndex) => solver([
    ...normalizeDailySelections(selections),
    {
      rollNumber: roll.rollNumber,
      squadId: roll.squadId,
      playerId: player.id,
      stableId: player.stableId,
      slotIndex
    }
  ], roll.rollNumber + 1));
}
__name(validSlotIndexesForPlayer, "validSlotIndexesForPlayer");
function canSelectDailyPlayer(definition, selections, rollNumber, playerId, slotIndex = null) {
  const validSlotIndexes = validSlotIndexesForPlayer(definition, selections, rollNumber, playerId);
  if (!validSlotIndexes.length) return false;
  if (slotIndex === null || slotIndex === void 0 || slotIndex === "") return true;
  const parsedSlotIndex = Number(slotIndex);
  if (!Number.isInteger(parsedSlotIndex)) return false;
  return validSlotIndexes.includes(parsedSlotIndex);
}
__name(canSelectDailyPlayer, "canSelectDailyPlayer");
function getVisiblePlayersForRoll(definition, rollNumber, selections) {
  const roll = getDailyRoll(definition, rollNumber);
  if (!roll) return [];
  const used = lockedStableIds(definition, selections);
  return roll.eligibleStableIds.map((stableId) => resolveSquadPlayer(roll.squadId, stableId)).filter(Boolean).map((player) => {
    if (used.has(player.stableId)) {
      return {
        ...player,
        selectable: false,
        validSlotIndexes: [],
        unavailableReason: "Already locked into this XI."
      };
    }
    const validSlotIndexes = validSlotIndexesForPlayer(definition, selections, roll.rollNumber, player.id);
    return {
      ...player,
      selectable: validSlotIndexes.length > 0,
      validSlotIndexes,
      unavailableReason: validSlotIndexes.length ? "" : "This choice would leave no valid way to complete the XI."
    };
  }).sort((left, right) => playerOverall(right) - playerOverall(left));
}
__name(getVisiblePlayersForRoll, "getVisiblePlayersForRoll");
function buildDailyRollPublicState(definition, rollNumber, selections) {
  const roll = getDailyRoll(definition, rollNumber);
  if (!roll) return null;
  const squad = ASHES_SQUAD_BY_ID.get(roll.squadId);
  if (!squad) return null;
  return {
    rollNumber: roll.rollNumber,
    squadId: roll.squadId,
    squadLabel: squad.label,
    squadTeam: squad.team,
    squadYear: squad.year,
    players: getVisiblePlayersForRoll(definition, roll.rollNumber, selections)
  };
}
__name(buildDailyRollPublicState, "buildDailyRollPublicState");
function buildDailyRecap(definition, selections) {
  const byRoll = new Map(normalizeDailySelections(selections).map((selection) => [selection.rollNumber, selection]));
  return definition.rolls.map((roll) => {
    const squad = ASHES_SQUAD_BY_ID.get(roll.squadId);
    const selected = byRoll.get(roll.rollNumber) ?? null;
    const selectedPlayer = selected ? ASHES_PLAYER_BY_ID.get(selected.playerId) ?? null : null;
    return {
      rollNumber: roll.rollNumber,
      squadId: roll.squadId,
      squadLabel: squad?.label ?? roll.squadId,
      squadTeam: squad?.team ?? "",
      squadYear: squad?.year ?? "",
      slotIndex: selected?.slotIndex ?? null,
      selectedPlayer,
      players: roll.eligibleStableIds.map((stableId) => resolveSquadPlayer(roll.squadId, stableId)).filter(Boolean).sort((left, right) => playerOverall(right) - playerOverall(left))
    };
  });
}
__name(buildDailyRecap, "buildDailyRecap");
function selectionOrderKey(selections) {
  return normalizeDailySelections(selections).map((selection) => selection.stableId).join("|");
}
__name(selectionOrderKey, "selectionOrderKey");
function laterRoleOptions(definition, rollNumber, roles) {
  const laterRolls = definition.rolls.filter((roll) => roll.rollNumber > rollNumber);
  const roleSet = new Set(roles);
  return laterRolls.some(
    (roll) => roll.eligibleStableIds.some((stableId) => {
      const player = resolveSquadPlayer(roll.squadId, stableId);
      return player?.roles?.some((role) => roleSet.has(role));
    })
  );
}
__name(laterRoleOptions, "laterRoleOptions");
function normalizeLeaderboardName(value, fallback = "Anonymous") {
  return normalizeDisplayName(value) || fallback;
}
__name(normalizeLeaderboardName, "normalizeLeaderboardName");
function parseWinMargin(summary) {
  const text = String(summary ?? "").trim();
  let match2 = text.match(/^Won by an innings and (\d+) run(?:s)?$/iu);
  if (match2) {
    return {
      kind: "innings",
      amount: Number(match2[1]),
      sortRank: 3,
      label: text
    };
  }
  match2 = text.match(/^Won by (\d+) wicket(?:s)?$/iu);
  if (match2) {
    return {
      kind: "wickets",
      amount: Number(match2[1]),
      sortRank: 2,
      label: text
    };
  }
  match2 = text.match(/^Won by (\d+) run(?:s)?$/iu);
  if (match2) {
    return {
      kind: "runs",
      amount: Number(match2[1]),
      sortRank: 1,
      label: text
    };
  }
  return null;
}
__name(parseWinMargin, "parseWinMargin");
function buildDailyResultsLeaderboard(completedRankedAttempts, currentAttemptId = "") {
  const winners = Array.isArray(completedRankedAttempts) ? completedRankedAttempts.map((attempt) => {
    const match2 = attempt.result?.matches?.[0] ?? null;
    const margin = parseWinMargin(match2?.summary);
    if (!margin) return null;
    return {
      attemptId: attempt.id,
      displayName: normalizeLeaderboardName(attempt.displayName),
      margin: margin.label,
      marginKind: margin.kind,
      marginAmount: margin.amount,
      isCurrentUser: attempt.id === currentAttemptId,
      sortRank: margin.sortRank,
      completedAt: attempt.completedAt ?? attempt.updatedAt ?? attempt.createdAt ?? ""
    };
  }).filter(Boolean).sort(
    (left, right) => right.sortRank - left.sortRank || right.marginAmount - left.marginAmount || left.completedAt.localeCompare(right.completedAt) || left.displayName.localeCompare(right.displayName)
  ) : [];
  return {
    totalWinners: winners.length,
    entries: winners.slice(0, 5)
  };
}
__name(buildDailyResultsLeaderboard, "buildDailyResultsLeaderboard");
function buildDailyCommunityStats(definition, completedRankedAttempts, userSelections) {
  const attempts = Array.isArray(completedRankedAttempts) ? completedRankedAttempts.filter((attempt) => normalizeDailySelections(attempt.selections).length === definition.rolls.length) : [];
  const totalCompleted = attempts.length;
  const rolls = definition.rolls.map((roll) => {
    const counts = /* @__PURE__ */ new Map();
    for (const attempt of attempts) {
      const selection = normalizeDailySelections(attempt.selections).find((entry) => entry.rollNumber === roll.rollNumber);
      if (!selection) continue;
      counts.set(selection.stableId, (counts.get(selection.stableId) ?? 0) + 1);
    }
    const players = roll.eligibleStableIds.map((stableId) => resolveSquadPlayer(roll.squadId, stableId)).filter(Boolean).map((player) => {
      const count = counts.get(player.stableId) ?? 0;
      const percentage = totalCompleted ? Math.round(count / totalCompleted * 100) : 0;
      return {
        ...player,
        count,
        percentage
      };
    }).sort((left, right) => right.count - left.count || playerOverall(right) - playerOverall(left));
    return {
      rollNumber: roll.rollNumber,
      squadLabel: ASHES_SQUAD_BY_ID.get(roll.squadId)?.label ?? roll.squadId,
      selections: players,
      mostPopularSelection: players[0] ?? null
    };
  });
  const userOrder = selectionOrderKey(userSelections);
  const sameFourChoicesCount = attempts.filter((attempt) => selectionOrderKey(attempt.selections) === userOrder).length;
  const sameFourChoicesPercentage = totalCompleted ? Math.round(sameFourChoicesCount / totalCompleted * 100) : 0;
  const userSelectionShares = normalizeDailySelections(userSelections).map((selection) => {
    const rollStats = rolls.find((roll) => roll.rollNumber === selection.rollNumber);
    const playerStats = rollStats?.selections?.find((player) => player.stableId === selection.stableId) ?? null;
    return {
      rollNumber: selection.rollNumber,
      player: ASHES_PLAYER_BY_ID.get(selection.playerId) ?? null,
      percentage: playerStats?.percentage ?? 0,
      squadLabel: rollStats?.squadLabel ?? ""
    };
  }).filter((entry) => entry.player);
  const mostUnusualSelection = [...userSelectionShares].sort((left, right) => left.percentage - right.percentage)[0] ?? null;
  const roleCounts = /* @__PURE__ */ new Map();
  for (const attempt of attempts) {
    for (const selection of normalizeDailySelections(attempt.selections)) {
      const player = ASHES_PLAYER_BY_ID.get(selection.playerId);
      if (!player) continue;
      for (const role of player.roles) {
        if (!laterRoleOptions(definition, selection.rollNumber, [role])) continue;
        const entry = roleCounts.get(role) ?? { role, count: 0 };
        entry.count += 1;
        roleCounts.set(role, entry);
      }
    }
  }
  return {
    totalCompleted,
    rolls,
    sameFourChoicesPercentage,
    mostUnusualSelection,
    roleTimingStats: [...roleCounts.values()].map((entry) => ({
      ...entry,
      percentage: totalCompleted ? Math.round(entry.count / totalCompleted * 100) : 0
    })).sort((left, right) => right.count - left.count)
  };
}
__name(buildDailyCommunityStats, "buildDailyCommunityStats");
function buildDailyChallengeSummary(definition, rankedAttempt = null) {
  const fixedPlayers = getDailyFixedPlayers(definition);
  return {
    id: definition.id,
    date: definition.date,
    label: definition.label,
    challengeNumber: definition.challengeNumber,
    totalRolls: definition.rolls.length,
    fixedPlayers,
    opposition: {
      label: definition.oppositionLabel,
      summary: `${definition.oppositionLabel} under ${definition.conditions.venueLabel} conditions.`
    },
    conditions: definition.conditions,
    rankedAttempt: rankedAttempt ? {
      attemptId: rankedAttempt.id,
      draftComplete: Boolean(rankedAttempt.draftComplete),
      simulationComplete: Boolean(rankedAttempt.simulationComplete),
      attemptMode: rankedAttempt.attemptMode,
      currentRollNumber: rankedAttempt.currentRollNumber,
      displayName: normalizeLeaderboardName(rankedAttempt.displayName, "")
    } : null
  };
}
__name(buildDailyChallengeSummary, "buildDailyChallengeSummary");
function countDailyCompletionPaths(definition, selections = [], rollNumber = 1, limit = 24) {
  if (limit <= 0) return 0;
  if (rollNumber > definition.rolls.length) {
    return buildDailyCompletedXI(definition, selections) ? 1 : 0;
  }
  const roll = buildDailyRollPublicState(definition, rollNumber, selections);
  if (!roll) return 0;
  let total = 0;
  for (const player of roll.players.filter((entry) => entry.selectable)) {
    for (const slotIndex of player.validSlotIndexes ?? []) {
      total += countDailyCompletionPaths(
        definition,
        [
          ...normalizeDailySelections(selections),
          {
            rollNumber,
            squadId: roll.squadId,
            playerId: player.id,
            stableId: player.stableId,
            slotIndex
          }
        ],
        rollNumber + 1,
        limit - total
      );
      if (total >= limit) {
        return total;
      }
    }
  }
  return total;
}
__name(countDailyCompletionPaths, "countDailyCompletionPaths");

// _lib/daily.js
function asAttemptError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}
__name(asAttemptError, "asAttemptError");
function validateSubmissionKey(value, label) {
  const normalized = String(value ?? "").trim();
  if (!/^[A-Za-z0-9_-]{10,64}$/u.test(normalized)) {
    throw asAttemptError(`${label} is invalid.`);
  }
  return normalized;
}
__name(validateSubmissionKey, "validateSubmissionKey");
function validateDailyParticipantId(value) {
  const normalized = String(value ?? "").trim();
  if (!/^[A-Za-z0-9_-]{12,80}$/u.test(normalized)) {
    throw asAttemptError("Participant id is invalid.");
  }
  return normalized;
}
__name(validateDailyParticipantId, "validateDailyParticipantId");
function validateDailyStartPayload(payload) {
  const body = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
  if (!body) throw asAttemptError("Daily challenge payload is invalid.");
  const attemptMode = body.attemptMode === "practice" ? "practice" : "ranked";
  return {
    participantId: validateDailyParticipantId(body.participantId),
    submissionKey: validateSubmissionKey(body.submissionKey, "Submission key"),
    attemptMode,
    displayName: normalizeDisplayName(body.displayName)
  };
}
__name(validateDailyStartPayload, "validateDailyStartPayload");
function validateDailySelectPayload(payload) {
  const body = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
  if (!body) throw asAttemptError("Daily selection payload is invalid.");
  const currentRollNumber = Number(body.currentRollNumber);
  if (!Number.isInteger(currentRollNumber) || currentRollNumber < 1 || currentRollNumber > 4) {
    throw asAttemptError("Current roll number is invalid.");
  }
  const selectedPlayerId = String(body.selectedPlayerId ?? "").trim();
  if (!selectedPlayerId) {
    throw asAttemptError("Selected player id is invalid.");
  }
  const slotIndex = Number(body.slotIndex);
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 10) {
    throw asAttemptError("Selected slot is invalid.");
  }
  return {
    participantId: validateDailyParticipantId(body.participantId),
    currentRollNumber,
    selectedPlayerId,
    slotIndex
  };
}
__name(validateDailySelectPayload, "validateDailySelectPayload");
function validateDailySimulatePayload(payload) {
  const body = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
  if (!body) throw asAttemptError("Daily simulation payload is invalid.");
  return {
    participantId: validateDailyParticipantId(body.participantId),
    displayName: normalizeDisplayName(body.displayName)
  };
}
__name(validateDailySimulatePayload, "validateDailySimulatePayload");
function assertDailyAttemptOwnership(definition, attempt, participantId) {
  if (!attempt) {
    throw asAttemptError("Daily attempt not found.", 404);
  }
  if (attempt.challengeId !== definition.id) {
    throw asAttemptError("Daily attempt does not belong to this challenge.", 400);
  }
  if (attempt.participantId !== participantId) {
    throw asAttemptError("Daily attempt does not belong to this participant.", 403);
  }
}
__name(assertDailyAttemptOwnership, "assertDailyAttemptOwnership");
function buildLockedSelectionsPayload(definition, selections) {
  const recap = buildDailyRecap(definition, selections);
  return recap.filter((roll) => roll.selectedPlayer).map((roll) => ({
    rollNumber: roll.rollNumber,
    squadId: roll.squadId,
    squadLabel: roll.squadLabel,
    squadTeam: roll.squadTeam,
    squadYear: roll.squadYear,
    slotIndex: roll.slotIndex,
    player: roll.selectedPlayer
  }));
}
__name(buildLockedSelectionsPayload, "buildLockedSelectionsPayload");
function buildCompletedXiPayload(definition, selections) {
  const completedXI = buildDailyCompletedXI(definition, selections);
  if (!completedXI) {
    throw asAttemptError("The completed XI is invalid.", 400);
  }
  return completedXI;
}
__name(buildCompletedXiPayload, "buildCompletedXiPayload");
function buildDailyAttemptResponse(definition, attempt, selections, completedRankedAttempts = null) {
  const normalizedSelections = normalizeDailySelections(selections);
  const summary = buildDailyChallengeSummary(definition, attempt);
  const lockedSelections = buildLockedSelectionsPayload(definition, normalizedSelections);
  const fixedPlayers = getDailyFixedPlayers(definition);
  const pool = buildDailyPlayerPool(definition, normalizedSelections);
  const response = {
    ok: true,
    challenge: {
      id: summary.id,
      date: summary.date,
      label: summary.label,
      challengeNumber: summary.challengeNumber,
      totalRolls: summary.totalRolls,
      conditions: summary.conditions,
      opposition: summary.opposition
    },
    attempt: {
      id: attempt.id,
      attemptMode: attempt.attemptMode,
      displayName: attempt.displayName ?? "",
      currentRollNumber: attempt.currentRollNumber,
      draftComplete: Boolean(attempt.draftComplete),
      simulationComplete: Boolean(attempt.simulationComplete)
    },
    fixedPlayers,
    lockedSelections,
    currentTeamPool: pool,
    draftProgress: {
      lockedSelections: lockedSelections.length,
      totalSelections: definition.rolls.length,
      remainingSelections: Math.max(0, definition.rolls.length - lockedSelections.length)
    }
  };
  if (!attempt.draftComplete) {
    response.currentRoll = buildDailyRollPublicState(definition, attempt.currentRollNumber, normalizedSelections);
    return response;
  }
  response.completedXI = buildCompletedXiPayload(definition, normalizedSelections);
  response.recap = buildDailyRecap(definition, normalizedSelections);
  if (attempt.simulationComplete && completedRankedAttempts) {
    response.communityStats = buildDailyCommunityStats(definition, completedRankedAttempts, normalizedSelections);
    response.dailyLeaderboard = buildDailyResultsLeaderboard(completedRankedAttempts, attempt.id);
  }
  if (attempt.simulationComplete && attempt.result) {
    response.result = attempt.result;
  }
  return response;
}
__name(buildDailyAttemptResponse, "buildDailyAttemptResponse");
function buildDailySimulationResult(definition, selections) {
  const completedXI = buildCompletedXiPayload(definition, selections);
  const oppositionLineup = getDailyOppositionPlayers(definition);
  const seed = [
    definition.id,
    ...completedXI.map((player) => player.id),
    definition.conditions.pitch,
    definition.conditions.venueLabel
  ].join("|");
  return buildSingleTestSeries(completedXI, oppositionLineup, definition.conditions, seed);
}
__name(buildDailySimulationResult, "buildDailySimulationResult");
function assertSelectableDailyPlayer(definition, selections, rollNumber, selectedPlayerId, slotIndex = null) {
  if (!canSelectDailyPlayer(definition, selections, rollNumber, selectedPlayerId, slotIndex)) {
    throw asAttemptError("That player cannot be locked from this roll.", 400);
  }
}
__name(assertSelectableDailyPlayer, "assertSelectableDailyPlayer");

// _lib/store.js
function randomUrlSafeToken(byteLength2 = 6) {
  const bytes = new Uint8Array(byteLength2);
  crypto.getRandomValues(bytes);
  const binary = Array.from(bytes, (value) => String.fromCharCode(value)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}
__name(randomUrlSafeToken, "randomUrlSafeToken");
function buildTeamRecord(row) {
  if (!row) return null;
  const lineupPlayerIds = JSON.parse(row.lineup_json);
  return {
    id: row.id,
    submissionKey: row.submission_key,
    source: row.source,
    mode: row.mode,
    displayName: row.display_name ?? "",
    lineupPlayerIds,
    lineup: lineupPlayerIds.map((playerId) => ASHES_PLAYER_BY_ID.get(playerId)).filter(Boolean),
    dataVersion: row.data_version,
    createdAt: row.created_at
  };
}
__name(buildTeamRecord, "buildTeamRecord");
function buildChallengeRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    url: challengeUrlForId(row.id),
    createdAt: row.created_at,
    expiresAt: row.expires_at ?? null
  };
}
__name(buildChallengeRecord, "buildChallengeRecord");
function buildResultRecord(row) {
  if (!row) return null;
  const result = JSON.parse(row.result_json);
  return {
    ...result,
    id: row.id,
    publicId: row.id,
    shortUrl: resultUrlForId(row.id),
    challengeId: row.challenge_id,
    createdAt: row.created_at
  };
}
__name(buildResultRecord, "buildResultRecord");
async function fetchTeamBySubmissionKey(db, submissionKey) {
  const row = await db.prepare(
    `SELECT id, submission_key, source, mode, display_name, lineup_json, data_version, created_at
       FROM teams
       WHERE submission_key = ?1`
  ).bind(submissionKey).first();
  return buildTeamRecord(row);
}
__name(fetchTeamBySubmissionKey, "fetchTeamBySubmissionKey");
async function fetchChallengeBySubmissionKey(db, submissionKey) {
  const row = await db.prepare(
    `SELECT id, creator_team_id, created_at, expires_at
       FROM challenges
       WHERE submission_key = ?1`
  ).bind(submissionKey).first();
  return buildChallengeRecord(row);
}
__name(fetchChallengeBySubmissionKey, "fetchChallengeBySubmissionKey");
async function fetchChallengeByCreatorTeamId(db, creatorTeamId) {
  const row = await db.prepare(
    `SELECT id, creator_team_id, created_at, expires_at
       FROM challenges
       WHERE creator_team_id = ?1`
  ).bind(creatorTeamId).first();
  return buildChallengeRecord(row);
}
__name(fetchChallengeByCreatorTeamId, "fetchChallengeByCreatorTeamId");
async function fetchResultBySubmissionKey(db, submissionKey) {
  const row = await db.prepare(
    `SELECT id, challenge_id, responder_team_id, result_json, challenger_wins, responder_wins, draws, winner,
              simulation_version, created_at
       FROM results
       WHERE submission_key = ?1`
  ).bind(submissionKey).first();
  return buildResultRecord(row);
}
__name(fetchResultBySubmissionKey, "fetchResultBySubmissionKey");
async function fetchResultByResponderTeamId(db, responderTeamId) {
  const row = await db.prepare(
    `SELECT id, challenge_id, responder_team_id, result_json, challenger_wins, responder_wins, draws, winner,
              simulation_version, created_at
       FROM results
       WHERE responder_team_id = ?1`
  ).bind(responderTeamId).first();
  return buildResultRecord(row);
}
__name(fetchResultByResponderTeamId, "fetchResultByResponderTeamId");
async function fetchChallengeDetails(db, challengeId) {
  const row = await db.prepare(
    `SELECT c.id, c.created_at, c.expires_at,
              t.id AS team_id, t.submission_key, t.source, t.mode, t.display_name, t.lineup_json,
              t.data_version, t.created_at AS team_created_at
       FROM challenges c
       JOIN teams t ON t.id = c.creator_team_id
       WHERE c.id = ?1`
  ).bind(challengeId).first();
  if (!row) return null;
  return {
    challenge: buildChallengeRecord(row),
    team: buildTeamRecord({
      id: row.team_id,
      submission_key: row.submission_key,
      source: row.source,
      mode: row.mode,
      display_name: row.display_name,
      lineup_json: row.lineup_json,
      data_version: row.data_version,
      created_at: row.team_created_at
    })
  };
}
__name(fetchChallengeDetails, "fetchChallengeDetails");
async function fetchResultDetails(db, resultId) {
  const row = await db.prepare(
    `SELECT r.id, r.challenge_id, r.responder_team_id, r.result_json, r.challenger_wins, r.responder_wins, r.draws,
              r.winner, r.simulation_version, r.created_at,
              c.created_at AS challenge_created_at, c.expires_at,
              creator.id AS creator_team_id, creator.submission_key AS creator_submission_key, creator.source AS creator_source,
              creator.mode AS creator_mode, creator.display_name AS creator_display_name, creator.lineup_json AS creator_lineup_json,
              creator.data_version AS creator_data_version,
              creator.created_at AS creator_created_at,
              responder.id AS responder_team_id_row, responder.submission_key AS responder_submission_key, responder.source AS responder_source,
              responder.mode AS responder_mode, responder.display_name AS responder_display_name, responder.lineup_json AS responder_lineup_json,
              responder.data_version AS responder_data_version,
              responder.created_at AS responder_created_at
       FROM results r
       JOIN challenges c ON c.id = r.challenge_id
       JOIN teams creator ON creator.id = c.creator_team_id
       JOIN teams responder ON responder.id = r.responder_team_id
       WHERE r.id = ?1`
  ).bind(resultId).first();
  if (!row) return null;
  return {
    result: buildResultRecord(row),
    challenge: buildChallengeRecord({
      id: row.challenge_id,
      created_at: row.challenge_created_at,
      expires_at: row.expires_at
    }),
    creatorTeam: buildTeamRecord({
      id: row.creator_team_id,
      submission_key: row.creator_submission_key,
      source: row.creator_source,
      mode: row.creator_mode,
      display_name: row.creator_display_name,
      lineup_json: row.creator_lineup_json,
      data_version: row.creator_data_version,
      created_at: row.creator_created_at
    }),
    responderTeam: buildTeamRecord({
      id: row.responder_team_id_row,
      submission_key: row.responder_submission_key,
      source: row.responder_source,
      mode: row.responder_mode,
      display_name: row.responder_display_name,
      lineup_json: row.responder_lineup_json,
      data_version: row.responder_data_version,
      created_at: row.responder_created_at
    })
  };
}
__name(fetchResultDetails, "fetchResultDetails");
async function createUniquePublicId(db, tableName, byteLength2 = 6, maxAttempts = 6) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = randomUrlSafeToken(byteLength2);
    const existing = await db.prepare(`SELECT id FROM ${tableName} WHERE id = ?1`).bind(candidate).first();
    if (!existing) {
      return candidate;
    }
  }
  throw new Error(`Could not allocate a unique public id for ${tableName}.`);
}
__name(createUniquePublicId, "createUniquePublicId");
async function createTeam(db, team, source, createdAt) {
  const statements = [
    db.prepare(
      `INSERT INTO teams (id, submission_key, source, mode, display_name, lineup_json, data_version, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
    ).bind(
      team.submissionKey,
      team.submissionKey,
      source,
      team.mode,
      team.displayName || null,
      JSON.stringify(team.lineupPlayerIds),
      team.dataVersion,
      createdAt
    ),
    ...team.lineup.map(
      (player, index) => db.prepare(
        `INSERT INTO team_players (team_id, player_id, lineup_player_id, slot_index)
         VALUES (?1, ?2, ?3, ?4)`
      ).bind(
        team.submissionKey,
        player.stableId,
        player.id,
        index
      )
    )
  ];
  await db.batch(statements);
  return await fetchTeamBySubmissionKey(db, team.submissionKey);
}
__name(createTeam, "createTeam");
async function createChallenge(db, challengeSubmissionKey, team, createdAt) {
  const existingChallenge = await fetchChallengeBySubmissionKey(db, challengeSubmissionKey);
  if (existingChallenge) {
    return existingChallenge;
  }
  let creatorTeam = await fetchTeamBySubmissionKey(db, team.submissionKey);
  if (!creatorTeam) {
    creatorTeam = await createTeam(db, team, "challenge_creator", createdAt);
  }
  const existingForTeam = await fetchChallengeByCreatorTeamId(db, creatorTeam.id);
  if (existingForTeam) {
    return existingForTeam;
  }
  const publicId = await createUniquePublicId(db, "challenges");
  await db.batch([
    db.prepare(
      `INSERT INTO challenges (id, submission_key, creator_team_id, created_at, expires_at)
       VALUES (?1, ?2, ?3, ?4, NULL)`
    ).bind(publicId, challengeSubmissionKey, creatorTeam.id, createdAt)
  ]);
  return buildChallengeRecord({
    id: publicId,
    created_at: createdAt,
    expires_at: null
  });
}
__name(createChallenge, "createChallenge");
async function createSoloTeam(db, team, createdAt) {
  let soloTeam = await fetchTeamBySubmissionKey(db, team.submissionKey);
  if (!soloTeam) {
    soloTeam = await createTeam(db, team, "solo", createdAt);
  }
  return soloTeam;
}
__name(createSoloTeam, "createSoloTeam");
async function createResult(db, challenge, responderTeamPayload, resultSubmissionKey, resultPayload, createdAt) {
  const existingResult = await fetchResultBySubmissionKey(db, resultSubmissionKey);
  if (existingResult) {
    return existingResult;
  }
  let responderTeam = await fetchTeamBySubmissionKey(db, responderTeamPayload.submissionKey);
  if (!responderTeam) {
    responderTeam = await createTeam(db, responderTeamPayload, "challenge_responder", createdAt);
  }
  const existingForTeam = await fetchResultByResponderTeamId(db, responderTeam.id);
  if (existingForTeam) {
    return existingForTeam;
  }
  const publicId = await createUniquePublicId(db, "results");
  const resultRecord = {
    ...resultPayload,
    responseId: publicId,
    publicId,
    shortUrl: resultUrlForId(publicId),
    challengeId: challenge.challenge.id,
    challengerDisplayName: challenge.team.displayName,
    responderDisplayName: responderTeam.displayName,
    challengerLineup: challenge.team.lineup,
    responderLineup: responderTeam.lineup,
    completedAt: createdAt
  };
  const winner = resultRecord.userWins > resultRecord.starWins ? "responder" : resultRecord.userWins < resultRecord.starWins ? "challenger" : "draw";
  await db.batch([
    db.prepare(
      `INSERT INTO results (id, submission_key, challenge_id, responder_team_id, result_json, challenger_wins,
                            responder_wins, draws, winner, simulation_version, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
    ).bind(
      publicId,
      resultSubmissionKey,
      challenge.challenge.id,
      responderTeam.id,
      JSON.stringify(resultRecord),
      resultRecord.starWins,
      resultRecord.userWins,
      resultRecord.draws,
      winner,
      resultRecord.simulationVersion,
      createdAt
    )
  ]);
  return buildResultRecord({
    id: publicId,
    challenge_id: challenge.challenge.id,
    responder_team_id: responderTeam.id,
    result_json: JSON.stringify(resultRecord),
    challenger_wins: resultRecord.starWins,
    responder_wins: resultRecord.userWins,
    draws: resultRecord.draws,
    winner,
    simulation_version: resultRecord.simulationVersion,
    created_at: createdAt
  });
}
__name(createResult, "createResult");
function isoTimestamp() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
__name(isoTimestamp, "isoTimestamp");

// _lib/daily-store.js
var DAILY_SCHEMA_BASE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS daily_attempts (
     id TEXT PRIMARY KEY,
     challenge_id TEXT NOT NULL,
     participant_id TEXT NOT NULL,
     attempt_mode TEXT NOT NULL CHECK (attempt_mode IN ('ranked', 'practice')),
     submission_key TEXT NOT NULL UNIQUE,
     display_name TEXT NOT NULL DEFAULT '',
     current_roll_number INTEGER NOT NULL DEFAULT 1,
     draft_complete INTEGER NOT NULL DEFAULT 0 CHECK (draft_complete IN (0, 1)),
     simulation_complete INTEGER NOT NULL DEFAULT 0 CHECK (simulation_complete IN (0, 1)),
     result_json TEXT,
     created_at TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     completed_at TEXT
   )`,
  `CREATE TABLE IF NOT EXISTS daily_attempt_selections (
     attempt_id TEXT NOT NULL,
     roll_number INTEGER NOT NULL,
     squad_id TEXT NOT NULL,
     player_id TEXT NOT NULL,
     lineup_player_id TEXT NOT NULL,
     slot_index INTEGER,
     created_at TEXT NOT NULL,
     PRIMARY KEY (attempt_id, roll_number),
     UNIQUE (attempt_id, player_id),
     UNIQUE (attempt_id, lineup_player_id),
     FOREIGN KEY (attempt_id) REFERENCES daily_attempts(id) ON DELETE CASCADE,
     FOREIGN KEY (player_id) REFERENCES players(id)
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_ranked_attempts_participant
   ON daily_attempts(challenge_id, participant_id)
   WHERE attempt_mode = 'ranked'`,
  `CREATE INDEX IF NOT EXISTS idx_daily_attempts_challenge_mode
   ON daily_attempts(challenge_id, attempt_mode, draft_complete, simulation_complete)`,
  `CREATE INDEX IF NOT EXISTS idx_daily_attempt_selections_attempt
   ON daily_attempt_selections(attempt_id, roll_number)`
];
var DAILY_SCHEMA_SLOT_INDEX_STATEMENTS = [
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_attempt_selections_slot
   ON daily_attempt_selections(attempt_id, slot_index)
   WHERE slot_index IS NOT NULL`
];
var dailySchemaReady = /* @__PURE__ */ new WeakMap();
async function tableColumnNames(db, tableName) {
  const result = await db.prepare(`PRAGMA table_info(${tableName})`).all();
  return new Set((result.results ?? []).map((row) => String(row.name ?? "")));
}
__name(tableColumnNames, "tableColumnNames");
async function ensureDailyStoreColumns(db) {
  const dailyAttemptColumns = await tableColumnNames(db, "daily_attempts");
  if (!dailyAttemptColumns.has("display_name")) {
    await db.prepare("ALTER TABLE daily_attempts ADD COLUMN display_name TEXT NOT NULL DEFAULT ''").run();
  }
  const selectionColumns = await tableColumnNames(db, "daily_attempt_selections");
  if (!selectionColumns.has("slot_index")) {
    await db.prepare("ALTER TABLE daily_attempt_selections ADD COLUMN slot_index INTEGER").run();
  }
}
__name(ensureDailyStoreColumns, "ensureDailyStoreColumns");
async function ensureDailyStoreSchema(db) {
  if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
    throw new Error("Daily challenge database binding is unavailable.");
  }
  const existing = dailySchemaReady.get(db);
  if (existing) {
    await existing;
    return;
  }
  const pending = db.batch(DAILY_SCHEMA_BASE_STATEMENTS.map((statement) => db.prepare(statement))).then(() => ensureDailyStoreColumns(db)).then(async () => {
    for (const statement of DAILY_SCHEMA_SLOT_INDEX_STATEMENTS) {
      await db.prepare(statement).run();
    }
  }).then(() => void 0).catch((error) => {
    dailySchemaReady.delete(db);
    throw error;
  });
  dailySchemaReady.set(db, pending);
  await pending;
}
__name(ensureDailyStoreSchema, "ensureDailyStoreSchema");
function buildDailyAttemptRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    challengeId: row.challenge_id,
    participantId: row.participant_id,
    attemptMode: row.attempt_mode,
    submissionKey: row.submission_key,
    displayName: row.display_name ?? "",
    currentRollNumber: Number(row.current_roll_number ?? 1),
    draftComplete: Boolean(row.draft_complete),
    simulationComplete: Boolean(row.simulation_complete),
    result: row.result_json ? JSON.parse(row.result_json) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at ?? null
  };
}
__name(buildDailyAttemptRecord, "buildDailyAttemptRecord");
function buildDailySelectionRecord(row) {
  if (!row) return null;
  const slotIndex = row.slot_index === null || row.slot_index === void 0 ? null : Number(row.slot_index);
  return {
    attemptId: row.attempt_id,
    rollNumber: Number(row.roll_number),
    squadId: row.squad_id,
    stableId: row.player_id,
    playerId: row.lineup_player_id,
    slotIndex: Number.isInteger(slotIndex) ? slotIndex : null,
    createdAt: row.created_at
  };
}
__name(buildDailySelectionRecord, "buildDailySelectionRecord");
async function fetchDailyAttemptById(db, attemptId) {
  const row = await db.prepare(
    `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
              draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       FROM daily_attempts
       WHERE id = ?1`
  ).bind(attemptId).first();
  return buildDailyAttemptRecord(row);
}
__name(fetchDailyAttemptById, "fetchDailyAttemptById");
async function fetchRankedDailyAttemptByParticipant(db, challengeId, participantId) {
  const row = await db.prepare(
    `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
              draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       FROM daily_attempts
       WHERE challenge_id = ?1 AND participant_id = ?2 AND attempt_mode = 'ranked'`
  ).bind(challengeId, participantId).first();
  return buildDailyAttemptRecord(row);
}
__name(fetchRankedDailyAttemptByParticipant, "fetchRankedDailyAttemptByParticipant");
async function listDailySelectionsForAttempt(db, attemptId) {
  const result = await db.prepare(
    `SELECT attempt_id, roll_number, squad_id, player_id, lineup_player_id, slot_index, created_at
       FROM daily_attempt_selections
       WHERE attempt_id = ?1
       ORDER BY roll_number ASC`
  ).bind(attemptId).all();
  return (result.results ?? []).map(buildDailySelectionRecord).filter(Boolean);
}
__name(listDailySelectionsForAttempt, "listDailySelectionsForAttempt");
async function fetchDailyAttemptState(db, attemptId) {
  const attempt = await fetchDailyAttemptById(db, attemptId);
  if (!attempt) return null;
  const selections = await listDailySelectionsForAttempt(db, attemptId);
  return { attempt, selections };
}
__name(fetchDailyAttemptState, "fetchDailyAttemptState");
async function createDailyAttempt(db, payload, createdAt) {
  const publicId = await createUniquePublicId(db, "daily_attempts");
  await db.prepare(
    `INSERT INTO daily_attempts (
         id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
         draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 1, 0, 0, NULL, ?7, ?7, NULL)`
  ).bind(
    publicId,
    payload.challengeId,
    payload.participantId,
    payload.attemptMode,
    payload.submissionKey,
    payload.displayName ?? "",
    createdAt
  ).run();
  return await fetchDailyAttemptById(db, publicId);
}
__name(createDailyAttempt, "createDailyAttempt");
async function createOrFetchRankedDailyAttempt(db, payload, createdAt) {
  const existing = await fetchRankedDailyAttemptByParticipant(db, payload.challengeId, payload.participantId);
  if (existing) return existing;
  try {
    return await createDailyAttempt(db, { ...payload, attemptMode: "ranked" }, createdAt);
  } catch (error) {
    return await fetchRankedDailyAttemptByParticipant(db, payload.challengeId, payload.participantId);
  }
}
__name(createOrFetchRankedDailyAttempt, "createOrFetchRankedDailyAttempt");
async function addDailySelection(db, attemptId, selection, createdAt) {
  await db.prepare(
    `INSERT INTO daily_attempt_selections (
         attempt_id, roll_number, squad_id, player_id, lineup_player_id, slot_index, created_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
  ).bind(
    attemptId,
    selection.rollNumber,
    selection.squadId,
    selection.stableId,
    selection.playerId,
    Number.isInteger(selection.slotIndex) ? selection.slotIndex : null,
    createdAt
  ).run();
}
__name(addDailySelection, "addDailySelection");
async function updateDailyAttemptDisplayName(db, attemptId, displayName, updatedAt) {
  await db.prepare(
    `UPDATE daily_attempts
       SET display_name = ?2,
           updated_at = ?3
       WHERE id = ?1`
  ).bind(attemptId, displayName ?? "", updatedAt).run();
}
__name(updateDailyAttemptDisplayName, "updateDailyAttemptDisplayName");
async function updateDailyAttemptProgress(db, attemptId, currentRollNumber, draftComplete, updatedAt) {
  await db.prepare(
    `UPDATE daily_attempts
       SET current_roll_number = ?2,
           draft_complete = ?3,
           updated_at = ?4
       WHERE id = ?1`
  ).bind(attemptId, currentRollNumber, draftComplete ? 1 : 0, updatedAt).run();
}
__name(updateDailyAttemptProgress, "updateDailyAttemptProgress");
async function saveDailyAttemptResult(db, attemptId, result, updatedAt) {
  await db.prepare(
    `UPDATE daily_attempts
       SET simulation_complete = 1,
           result_json = ?2,
           updated_at = ?3,
           completed_at = ?3
       WHERE id = ?1`
  ).bind(attemptId, JSON.stringify(result), updatedAt).run();
}
__name(saveDailyAttemptResult, "saveDailyAttemptResult");
async function listCompletedRankedDailyAttempts(db, challengeId) {
  const attemptsResult = await db.prepare(
    `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
              draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       FROM daily_attempts
       WHERE challenge_id = ?1 AND attempt_mode = 'ranked' AND draft_complete = 1`
  ).bind(challengeId).all();
  const attempts = (attemptsResult.results ?? []).map(buildDailyAttemptRecord).filter(Boolean);
  if (!attempts.length) return [];
  const selectionsResult = await db.prepare(
    `SELECT s.attempt_id, s.roll_number, s.squad_id, s.player_id, s.lineup_player_id, s.slot_index, s.created_at
       FROM daily_attempt_selections s
       JOIN daily_attempts a ON a.id = s.attempt_id
       WHERE a.challenge_id = ?1 AND a.attempt_mode = 'ranked' AND a.draft_complete = 1
       ORDER BY attempt_id ASC, roll_number ASC`
  ).bind(challengeId).all();
  const selectionsByAttemptId = /* @__PURE__ */ new Map();
  for (const row of selectionsResult.results ?? []) {
    const selection = buildDailySelectionRecord(row);
    if (!selection) continue;
    const existing = selectionsByAttemptId.get(selection.attemptId) ?? [];
    existing.push(selection);
    selectionsByAttemptId.set(selection.attemptId, existing);
  }
  return attempts.map((attempt) => ({
    ...attempt,
    selections: selectionsByAttemptId.get(attempt.id) ?? []
  }));
}
__name(listCompletedRankedDailyAttempts, "listCompletedRankedDailyAttempts");

// _lib/security.js
var RATE_LIMIT_BUCKETS = /* @__PURE__ */ new Map();
function hashText(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
__name(hashText, "hashText");
function extractClientKey(request) {
  const forwarded = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown";
  return hashText(forwarded.split(",")[0]?.trim() ?? "unknown");
}
__name(extractClientKey, "extractClientKey");
function sweepExpiredBuckets(now) {
  for (const [key, bucket] of RATE_LIMIT_BUCKETS.entries()) {
    if (bucket.expiresAt <= now) {
      RATE_LIMIT_BUCKETS.delete(key);
    }
  }
}
__name(sweepExpiredBuckets, "sweepExpiredBuckets");
function checkRateLimit(request, scope, { limit = 8, windowMs = 6e4 } = {}) {
  const now = Date.now();
  if (RATE_LIMIT_BUCKETS.size > 500) {
    sweepExpiredBuckets(now);
  }
  const bucketKey = `${scope}:${extractClientKey(request)}`;
  const bucket = RATE_LIMIT_BUCKETS.get(bucketKey) ?? {
    count: 0,
    resetAt: now + windowMs,
    expiresAt: now + windowMs * 2
  };
  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
    bucket.expiresAt = now + windowMs * 2;
  }
  bucket.count += 1;
  RATE_LIMIT_BUCKETS.set(bucketKey, bucket);
  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1e3))
  };
}
__name(checkRateLimit, "checkRateLimit");

// api/daily/[id]/attempts/[attemptId]/select.js
async function onRequestPost(context) {
  const rateLimit = checkRateLimit(context.request, "api:daily-select", { limit: 20, windowMs: 6e4 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many daily selections. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }
  const definition = getDailyChallengeById(context.params.id);
  if (!definition) {
    return errorResponse(404, "Daily challenge not found.");
  }
  try {
    await ensureDailyStoreSchema(context.env.DB);
    const payload = validateDailySelectPayload(await readJson(context.request));
    const attemptState = await fetchDailyAttemptState(context.env.DB, context.params.attemptId);
    assertDailyAttemptOwnership(definition, attemptState?.attempt, payload.participantId);
    if (attemptState.attempt.draftComplete) {
      return errorResponse(400, "This draft is already complete.");
    }
    if (attemptState.attempt.currentRollNumber !== payload.currentRollNumber) {
      return errorResponse(409, "That is not the current unresolved roll.");
    }
    assertSelectableDailyPlayer(definition, attemptState.selections, payload.currentRollNumber, payload.selectedPlayerId, payload.slotIndex);
    const selectedPlayer = ASHES_PLAYER_BY_ID.get(payload.selectedPlayerId);
    if (!selectedPlayer) {
      return errorResponse(400, "Selected player is invalid.");
    }
    const timestamp = isoTimestamp();
    await addDailySelection(context.env.DB, attemptState.attempt.id, {
      rollNumber: payload.currentRollNumber,
      squadId: selectedPlayer.squadId,
      stableId: selectedPlayer.stableId,
      playerId: selectedPlayer.id,
      slotIndex: payload.slotIndex
    }, timestamp);
    const draftComplete = payload.currentRollNumber >= definition.rolls.length;
    const nextRollNumber = draftComplete ? definition.rolls.length : payload.currentRollNumber + 1;
    await updateDailyAttemptProgress(context.env.DB, attemptState.attempt.id, nextRollNumber, draftComplete, timestamp);
    const refreshed = await fetchDailyAttemptState(context.env.DB, attemptState.attempt.id);
    const completedRankedAttempts = refreshed.attempt.simulationComplete ? await listCompletedRankedDailyAttempts(context.env.DB, definition.id) : null;
    return json(buildDailyAttemptResponse(
      definition,
      refreshed.attempt,
      refreshed.selections,
      completedRankedAttempts
    ));
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not lock that selection.");
  }
}
__name(onRequestPost, "onRequestPost");
function onRequest() {
  return methodNotAllowed();
}
__name(onRequest, "onRequest");

// api/daily/[id]/attempts/[attemptId]/simulate.js
async function onRequestPost2(context) {
  const rateLimit = checkRateLimit(context.request, "api:daily-simulate", { limit: 8, windowMs: 6e4 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many daily simulations. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }
  const definition = getDailyChallengeById(context.params.id);
  if (!definition) {
    return errorResponse(404, "Daily challenge not found.");
  }
  try {
    await ensureDailyStoreSchema(context.env.DB);
    const payload = validateDailySimulatePayload(await readJson(context.request));
    const attemptState = await fetchDailyAttemptState(context.env.DB, context.params.attemptId);
    assertDailyAttemptOwnership(definition, attemptState?.attempt, payload.participantId);
    if (!attemptState.attempt.draftComplete) {
      return errorResponse(400, "Finish the draft before simulating the Test.");
    }
    if (payload.displayName !== attemptState.attempt.displayName) {
      await updateDailyAttemptDisplayName(context.env.DB, attemptState.attempt.id, payload.displayName, isoTimestamp());
    }
    if (!attemptState.attempt.simulationComplete) {
      const result = buildDailySimulationResult(definition, attemptState.selections);
      await saveDailyAttemptResult(context.env.DB, attemptState.attempt.id, result, isoTimestamp());
    }
    const refreshed = await fetchDailyAttemptState(context.env.DB, attemptState.attempt.id);
    const completedRankedAttempts = await listCompletedRankedDailyAttempts(context.env.DB, definition.id);
    return json(buildDailyAttemptResponse(
      definition,
      refreshed.attempt,
      refreshed.selections,
      completedRankedAttempts
    ));
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not simulate the daily Test.");
  }
}
__name(onRequestPost2, "onRequestPost");
function onRequest2() {
  return methodNotAllowed();
}
__name(onRequest2, "onRequest");

// api/daily/[id]/attempts/[attemptId].js
async function onRequestGet(context) {
  const definition = getDailyChallengeById(context.params.id);
  if (!definition) {
    return errorResponse(404, "Daily challenge not found.");
  }
  try {
    await ensureDailyStoreSchema(context.env.DB);
    const url = new URL(context.request.url);
    const participantId = validateDailyParticipantId(url.searchParams.get("participantId"));
    const attemptState = await fetchDailyAttemptState(context.env.DB, context.params.attemptId);
    assertDailyAttemptOwnership(definition, attemptState?.attempt, participantId);
    const completedRankedAttempts = attemptState.attempt.simulationComplete ? await listCompletedRankedDailyAttempts(context.env.DB, definition.id) : null;
    return json(buildDailyAttemptResponse(
      definition,
      attemptState.attempt,
      attemptState.selections,
      completedRankedAttempts
    ));
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not load the daily attempt.");
  }
}
__name(onRequestGet, "onRequestGet");
function onRequest3() {
  return methodNotAllowed();
}
__name(onRequest3, "onRequest");

// _lib/validation.js
function asBoundedInteger(value, label, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}
__name(asBoundedInteger, "asBoundedInteger");
function ensurePlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}
__name(ensurePlainObject, "ensurePlainObject");
function validateSubmissionKey2(value, label) {
  const normalized = String(value ?? "").trim();
  if (!/^[A-Za-z0-9_-]{10,64}$/u.test(normalized)) {
    throw new Error(`${label} is invalid.`);
  }
  return normalized;
}
__name(validateSubmissionKey2, "validateSubmissionKey");
function sanitizeResultBox(box, label) {
  const normalizedBox = ensurePlainObject(box, label);
  const batter = ensurePlainObject(normalizedBox.batter, `${label} batter`);
  const bowler = ensurePlainObject(normalizedBox.bowler, `${label} bowler`);
  return {
    batter: {
      name: sanitizePlainText(batter.name, 60) || "Unknown",
      runs: asBoundedInteger(Math.round(Number(batter.runs) || 0), `${label} batter runs`, 0, 999)
    },
    bowler: {
      name: sanitizePlainText(bowler.name, 60) || "Unknown",
      figures: sanitizePlainText(bowler.figures, 24) || "0/0"
    }
  };
}
__name(sanitizeResultBox, "sanitizeResultBox");
function sanitizeLeaderSnapshot(entry) {
  if (!entry) return null;
  const snapshot = ensurePlainObject(entry, "Series leader");
  return {
    side: snapshot.side === "star" ? "star" : "your",
    name: sanitizePlainText(snapshot.name, 60) || "Unknown",
    runs: asBoundedInteger(Math.round(Number(snapshot.runs) || 0), "Leader runs", 0, 9999),
    wickets: asBoundedInteger(Math.round(Number(snapshot.wickets) || 0), "Leader wickets", 0, 999),
    centuries: asBoundedInteger(Math.round(Number(snapshot.centuries) || 0), "Leader centuries", 0, 99),
    fiveFors: asBoundedInteger(Math.round(Number(snapshot.fiveFors) || 0), "Leader five-fors", 0, 99),
    points: asBoundedInteger(Math.round(Number(snapshot.points) || 0), "Leader points", 0, 9999)
  };
}
__name(sanitizeLeaderSnapshot, "sanitizeLeaderSnapshot");
function sanitizeResultMatch(match2, expectedNumber) {
  const normalizedMatch = ensurePlainObject(match2, "Test result");
  const innings = Array.isArray(normalizedMatch.innings) ? normalizedMatch.innings : [];
  if (!innings.length || innings.length > 4) {
    throw new Error(`Test ${expectedNumber} innings summary is invalid.`);
  }
  const normalizedInnings = innings.map((entry) => {
    const summary = ensurePlainObject(entry, `Test ${expectedNumber} innings summary`);
    return {
      label: sanitizePlainText(summary.label, 48),
      score: sanitizePlainText(summary.score, 32)
    };
  });
  const result = normalizedMatch.result === "loss" || normalizedMatch.result === "draw" ? normalizedMatch.result : normalizedMatch.result === "win" ? "win" : null;
  if (!result) {
    throw new Error(`Test ${expectedNumber} result is invalid.`);
  }
  return {
    format: "tests",
    snapshotOnly: true,
    matchNumber: expectedNumber,
    testNumber: expectedNumber,
    venue: sanitizePlainText(normalizedMatch.venue, 60) || "Historic venue",
    result,
    headline: sanitizePlainText(normalizedMatch.headline, 120) || "Series result",
    summary: sanitizePlainText(normalizedMatch.summary, 120) || "Test complete",
    scoreline: sanitizePlainText(normalizedMatch.scoreline, 120),
    innings: normalizedInnings,
    userBox: sanitizeResultBox(normalizedMatch.userBox, `Test ${expectedNumber} user box`),
    starBox: sanitizeResultBox(normalizedMatch.starBox, `Test ${expectedNumber} opposition box`)
  };
}
__name(sanitizeResultMatch, "sanitizeResultMatch");
function validateTeamPayload(payload) {
  const team = ensurePlainObject(payload, "Team payload");
  const submissionKey = validateSubmissionKey2(team.submissionKey, "Submission key");
  const mode = normalizePlayableMode(team.mode);
  if (!mode) {
    throw new Error("Mode is invalid.");
  }
  if (team.dataVersion !== TEAM_DATA_VERSION) {
    throw new Error("Unsupported team data version.");
  }
  const lineupPlayerIds = Array.isArray(team.lineupPlayerIds) ? team.lineupPlayerIds.map((playerId) => String(playerId)) : null;
  const lineup = validateLineupPlayerIds(lineupPlayerIds);
  if (!lineup) {
    throw new Error(`Team must contain exactly ${XI_SLOTS.length} unique valid players.`);
  }
  return {
    submissionKey,
    mode,
    displayName: normalizeDisplayName(team.displayName),
    lineupPlayerIds,
    lineup,
    dataVersion: team.dataVersion
  };
}
__name(validateTeamPayload, "validateTeamPayload");
function validateChallengeCreationPayload(payload) {
  const body = ensurePlainObject(payload, "Challenge payload");
  return {
    challengeSubmissionKey: validateSubmissionKey2(body.challengeSubmissionKey, "Challenge submission key"),
    team: validateTeamPayload(body.team)
  };
}
__name(validateChallengeCreationPayload, "validateChallengeCreationPayload");
function validateSoloTeamPayload(payload) {
  const body = ensurePlainObject(payload, "Solo team payload");
  return {
    team: validateTeamPayload(body.team)
  };
}
__name(validateSoloTeamPayload, "validateSoloTeamPayload");
function validateResultCreationPayload(payload, challengeTeam) {
  const body = ensurePlainObject(payload, "Result payload");
  const team = validateTeamPayload(body.team);
  const challengeLineupIds = challengeTeam.lineupPlayerIds;
  if (team.mode !== challengeTeam.mode) {
    throw new Error("Result team mode does not match the challenge.");
  }
  const resultSubmissionKey = validateSubmissionKey2(body.resultSubmissionKey, "Result submission key");
  const result = ensurePlainObject(body.result, "Result record");
  if (result.dataVersion !== TEAM_DATA_VERSION) {
    throw new Error("Unsupported result data version.");
  }
  if (result.simulationVersion !== RESULT_SIMULATION_VERSION) {
    throw new Error("Unsupported simulation version.");
  }
  const mode = normalizePlayableMode(result.mode);
  if (!mode || mode !== challengeTeam.mode) {
    throw new Error("Result mode is invalid.");
  }
  const challengerLineup = lineupIdsToPlayers(
    Array.isArray(result.challengerLineup) ? result.challengerLineup.map((player) => player?.id) : []
  );
  const responderLineup = lineupIdsToPlayers(
    Array.isArray(result.responderLineup) ? result.responderLineup.map((player) => player?.id) : []
  );
  if (!challengerLineup || !responderLineup) {
    throw new Error("Result lineups are invalid.");
  }
  const challengerIds = challengerLineup.map((player) => player.id);
  const responderIds = responderLineup.map((player) => player.id);
  if (challengerIds.join("|") !== challengeLineupIds.join("|")) {
    throw new Error("Result challenger XI does not match the challenge.");
  }
  if (responderIds.join("|") !== team.lineupPlayerIds.join("|")) {
    throw new Error("Result responder XI does not match the submitted team.");
  }
  const matches = Array.isArray(result.matches) ? result.matches.map((match2, index) => sanitizeResultMatch(match2, index + 1)) : null;
  if (!matches || matches.length !== 5) {
    throw new Error("Result must contain five completed Tests.");
  }
  const responderWins = asBoundedInteger(Math.round(Number(result.userWins) || 0), "Responder wins", 0, 5);
  const challengerWins = asBoundedInteger(Math.round(Number(result.starWins) || 0), "Challenger wins", 0, 5);
  const draws = asBoundedInteger(Math.round(Number(result.draws) || 0), "Draws", 0, 5);
  if (responderWins + challengerWins + draws !== 5) {
    throw new Error("Result totals must add up to five Tests.");
  }
  const derivedResponderWins = matches.filter((match2) => match2.result === "win").length;
  const derivedChallengerWins = matches.filter((match2) => match2.result === "loss").length;
  const derivedDraws = matches.filter((match2) => match2.result === "draw").length;
  if (responderWins !== derivedResponderWins || challengerWins !== derivedChallengerWins || draws !== derivedDraws) {
    throw new Error("Result summary does not match the Test-by-Test outcomes.");
  }
  const leaderData = result.leaders ? ensurePlainObject(result.leaders, "Series leaders") : null;
  const leaders = leaderData ? {
    overallLeader: sanitizeLeaderSnapshot(leaderData.overallLeader),
    mostRuns: sanitizeLeaderSnapshot(leaderData.mostRuns),
    mostWickets: sanitizeLeaderSnapshot(leaderData.mostWickets),
    mostCenturies: sanitizeLeaderSnapshot(leaderData.mostCenturies),
    mostFiveFors: sanitizeLeaderSnapshot(leaderData.mostFiveFors),
    userRuns: asBoundedInteger(Math.round(Number(leaderData.userRuns) || 0), "User runs", 0, 99999),
    userWickets: asBoundedInteger(Math.round(Number(leaderData.userWickets) || 0), "User wickets", 0, 9999)
  } : null;
  const achievements = Array.isArray(result.achievements) ? result.achievements.map((item) => sanitizePlainText(item, 40)).filter(Boolean) : [];
  return {
    resultSubmissionKey,
    team,
    result: {
      challengeRef: sanitizePlainText(result.challengeRef, 40),
      mode,
      matches,
      userWins: responderWins,
      starWins: challengerWins,
      draws,
      leaders,
      playerOfSeries: sanitizeLeaderSnapshot(result.playerOfSeries),
      achievements,
      simulationVersion: result.simulationVersion,
      dataVersion: result.dataVersion
    }
  };
}
__name(validateResultCreationPayload, "validateResultCreationPayload");

// api/challenges/[id]/results.js
async function onRequestPost3(context) {
  const rateLimit = checkRateLimit(context.request, "api:challenge-result-create", { limit: 10, windowMs: 6e4 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many result submissions. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }
  const challengeId = String(context.params.id ?? "").trim();
  if (!challengeId) {
    return errorResponse(400, "Challenge id is invalid.");
  }
  const challenge = await fetchChallengeDetails(context.env.DB, challengeId);
  if (!challenge) {
    return errorResponse(404, "Challenge not found.");
  }
  try {
    const payload = await readJson(context.request);
    const { resultSubmissionKey, team, result } = validateResultCreationPayload(payload, challenge.team);
    const createdResult = await createResult(
      context.env.DB,
      challenge,
      team,
      resultSubmissionKey,
      result,
      isoTimestamp()
    );
    return json({ ok: true, id: createdResult.id, url: createdResult.shortUrl });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not save result.");
  }
}
__name(onRequestPost3, "onRequestPost");
function onRequest4() {
  return methodNotAllowed();
}
__name(onRequest4, "onRequest");

// api/daily/[id]/start.js
async function onRequestPost4(context) {
  const rateLimit = checkRateLimit(context.request, "api:daily-start", { limit: 12, windowMs: 6e4 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many daily challenge requests. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }
  const definition = getDailyChallengeById(context.params.id);
  if (!definition) {
    return errorResponse(404, "Daily challenge not found.");
  }
  try {
    await ensureDailyStoreSchema(context.env.DB);
    const payload = validateDailyStartPayload(await readJson(context.request));
    let attempt;
    if (payload.attemptMode === "practice") {
      const rankedAttempt = await fetchRankedDailyAttemptByParticipant(context.env.DB, definition.id, payload.participantId);
      if (!rankedAttempt?.draftComplete) {
        return errorResponse(400, "Finish the ranked draft before starting practice mode.");
      }
      attempt = await createDailyAttempt(context.env.DB, {
        challengeId: definition.id,
        participantId: payload.participantId,
        attemptMode: "practice",
        submissionKey: payload.submissionKey,
        displayName: payload.displayName
      }, isoTimestamp());
    } else {
      attempt = await createOrFetchRankedDailyAttempt(context.env.DB, {
        challengeId: definition.id,
        participantId: payload.participantId,
        submissionKey: payload.submissionKey,
        displayName: payload.displayName
      }, isoTimestamp());
    }
    if (!attempt) {
      return errorResponse(500, "Could not create the daily attempt.");
    }
    if (payload.displayName !== attempt.displayName) {
      await updateDailyAttemptDisplayName(context.env.DB, attempt.id, payload.displayName, isoTimestamp());
    }
    const attemptState = await fetchDailyAttemptState(context.env.DB, attempt.id);
    if (!attemptState) {
      return errorResponse(500, "Daily attempt state could not be loaded.");
    }
    const completedRankedAttempts = attemptState?.attempt?.simulationComplete ? await listCompletedRankedDailyAttempts(context.env.DB, definition.id) : null;
    return json(buildDailyAttemptResponse(
      definition,
      attemptState.attempt,
      attemptState.selections,
      completedRankedAttempts
    ));
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not start the daily challenge.");
  }
}
__name(onRequestPost4, "onRequestPost");
function onRequest5() {
  return methodNotAllowed();
}
__name(onRequest5, "onRequest");

// api/daily/current.js
async function onRequestGet2(context) {
  try {
    await ensureDailyStoreSchema(context.env.DB);
    const definition = getCurrentDailyChallenge((/* @__PURE__ */ new Date()).toISOString());
    const url = new URL(context.request.url);
    const participantIdParam = url.searchParams.get("participantId");
    let rankedAttempt = null;
    if (participantIdParam) {
      const participantId = validateDailyParticipantId(participantIdParam);
      rankedAttempt = await fetchRankedDailyAttemptByParticipant(context.env.DB, definition.id, participantId);
    }
    return json({
      ok: true,
      challenge: buildDailyChallengeSummary(definition, rankedAttempt)
    });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not load the daily challenge.");
  }
}
__name(onRequestGet2, "onRequestGet");
function onRequest6() {
  return methodNotAllowed();
}
__name(onRequest6, "onRequest");

// api/leaderboards/players.js
var METRICS = /* @__PURE__ */ new Set(["selected"]);
var PERIODS = /* @__PURE__ */ new Set(["all", "30d"]);
var MODES = /* @__PURE__ */ new Set(["all", "classic", "memory"]);
var MAX_LEADERBOARD_ROWS = 20;
function isMissingSchemaError(error) {
  return error instanceof Error && /\bno such table\b/i.test(error.message);
}
__name(isMissingSchemaError, "isMissingSchemaError");
function isLocalPagesRequest(requestUrl) {
  const { hostname } = new URL(requestUrl);
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
}
__name(isLocalPagesRequest, "isLocalPagesRequest");
async function proxyCanonicalLeaderboard(request) {
  const currentUrl = new URL(request.url);
  const upstreamUrl = new URL(`${currentUrl.pathname}${currentUrl.search}`, CANONICAL_SITE_ORIGIN);
  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      Accept: request.headers.get("accept") ?? "application/json"
    }
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
__name(proxyCanonicalLeaderboard, "proxyCanonicalLeaderboard");
function buildFilters(period, mode) {
  const whereClauses = [];
  const bindings = [];
  if (mode !== "all") {
    whereClauses.push("t.mode = ?");
    bindings.push(mode);
  }
  if (period === "30d") {
    whereClauses.push("datetime(t.created_at) >= datetime('now', '-30 days')");
  }
  return {
    whereSql: whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "",
    bindings
  };
}
__name(buildFilters, "buildFilters");
async function onRequestGet3(context) {
  const url = new URL(context.request.url);
  const metric = String(url.searchParams.get("metric") ?? "selected");
  const period = String(url.searchParams.get("period") ?? "all");
  const mode = String(url.searchParams.get("mode") ?? "all");
  if (!METRICS.has(metric)) {
    return errorResponse(400, "Unsupported leaderboard metric.");
  }
  if (!PERIODS.has(period)) {
    return errorResponse(400, "Unsupported leaderboard period.");
  }
  if (!MODES.has(mode)) {
    return errorResponse(400, "Unsupported leaderboard mode.");
  }
  if (!context.env.DB || typeof context.env.DB.prepare !== "function") {
    return errorResponse(500, "DB binding 'DB' is missing for the leaderboard function.");
  }
  if (isLocalPagesRequest(context.request.url)) {
    try {
      return await proxyCanonicalLeaderboard(context.request);
    } catch (error) {
      return errorResponse(
        502,
        error instanceof Error ? `Leaderboard proxy failed: ${error.message}` : "Leaderboard proxy failed."
      );
    }
  }
  try {
    const filters = buildFilters(period, mode);
    const totalTeamsQuery = context.env.DB.prepare(
      `SELECT COUNT(*) AS total_teams
       FROM teams t
       ${filters.whereSql}`
    ).bind(...filters.bindings);
    const rowsQuery = context.env.DB.prepare(
      `SELECT p.id, p.name, COUNT(*) AS count
       FROM team_players tp
       JOIN teams t ON t.id = tp.team_id
       JOIN players p ON p.id = tp.player_id
       ${filters.whereSql}
       GROUP BY p.id, p.name
       ORDER BY count DESC, p.name ASC
       LIMIT ?`
    ).bind(...filters.bindings, MAX_LEADERBOARD_ROWS);
    const [totalTeamsResult, rowsResult] = await context.env.DB.batch([totalTeamsQuery, rowsQuery]);
    const totalTeams = Number(totalTeamsResult.results?.[0]?.total_teams ?? 0);
    const entries = (rowsResult.results ?? []).map((row) => ({
      playerId: row.id,
      name: row.name,
      count: Number(row.count ?? 0)
    }));
    return json({
      ok: true,
      metric,
      period,
      mode,
      totalTeams,
      entries,
      limit: MAX_LEADERBOARD_ROWS
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return errorResponse(
        503,
        "Leaderboard data is unavailable until the local D1 migrations have been applied."
      );
    }
    return errorResponse(
      500,
      error instanceof Error ? `Leaderboard query failed: ${error.message}` : "Leaderboard query failed."
    );
  }
}
__name(onRequestGet3, "onRequestGet");
function onRequest7() {
  return methodNotAllowed();
}
__name(onRequest7, "onRequest");

// api/teams/solo.js
async function onRequestPost5(context) {
  const rateLimit = checkRateLimit(context.request, "api:solo-team-create", { limit: 10, windowMs: 6e4 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many team submissions. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }
  try {
    const payload = await readJson(context.request);
    const { team } = validateSoloTeamPayload(payload);
    const storedTeam = await createSoloTeam(context.env.DB, team, isoTimestamp());
    return json({ ok: true, id: storedTeam.id });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not save team.");
  }
}
__name(onRequestPost5, "onRequestPost");
function onRequest8() {
  return methodNotAllowed();
}
__name(onRequest8, "onRequest");

// api/challenges/[id].js
async function onRequestGet4(context) {
  const challengeId = String(context.params.id ?? "").trim();
  if (!challengeId) {
    return errorResponse(400, "Challenge id is invalid.");
  }
  const challenge = await fetchChallengeDetails(context.env.DB, challengeId);
  if (!challenge) {
    return errorResponse(404, "Challenge not found.");
  }
  return json({
    ok: true,
    challenge: challenge.challenge,
    team: challenge.team
  });
}
__name(onRequestGet4, "onRequestGet");
function onRequest9() {
  return methodNotAllowed();
}
__name(onRequest9, "onRequest");

// api/results/[id].js
async function onRequestGet5(context) {
  const resultId = String(context.params.id ?? "").trim();
  if (!resultId) {
    return errorResponse(400, "Result id is invalid.");
  }
  const result = await fetchResultDetails(context.env.DB, resultId);
  if (!result) {
    return errorResponse(404, "Result not found.");
  }
  return json({
    ok: true,
    result: result.result,
    challenge: result.challenge,
    creatorTeam: result.creatorTeam,
    responderTeam: result.responderTeam
  });
}
__name(onRequestGet5, "onRequestGet");
function onRequest10() {
  return methodNotAllowed();
}
__name(onRequest10, "onRequest");

// api/challenges/index.js
async function onRequestPost6(context) {
  const rateLimit = checkRateLimit(context.request, "api:challenge-create", { limit: 8, windowMs: 6e4 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many challenge submissions. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }
  try {
    const payload = await readJson(context.request);
    const { challengeSubmissionKey, team } = validateChallengeCreationPayload(payload);
    const challenge = await createChallenge(context.env.DB, challengeSubmissionKey, team, isoTimestamp());
    return json({ ok: true, id: challenge.id, url: challenge.url });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not create challenge.");
  }
}
__name(onRequestPost6, "onRequestPost");
function onRequest11() {
  return methodNotAllowed();
}
__name(onRequest11, "onRequest");

// api/feedback.js
function json2(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
__name(json2, "json");
async function readPayload(request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }
  return {};
}
__name(readPayload, "readPayload");
function buildForwardBody(payload) {
  const params = new URLSearchParams();
  params.set("message", String(payload.message ?? "").trim());
  params.set("pageUrl", String(payload.pageUrl ?? "").trim());
  params.set("mode", String(payload.mode ?? "classic").trim());
  params.set("website", String(payload.website ?? "").trim());
  params.set("userAgent", String(payload.userAgent ?? "").trim());
  return params;
}
__name(buildForwardBody, "buildForwardBody");
async function onRequestPost7(context) {
  const { request, env } = context;
  const rateLimit = checkRateLimit(request, "api:feedback", { limit: 5, windowMs: 6e4 });
  if (!rateLimit.allowed) {
    return json2({ ok: false, error: "Too many feedback submissions. Please try again shortly." }, 429);
  }
  const payload = await readPayload(request).catch(() => null);
  if (!payload) {
    return json2({ ok: false, error: "Invalid request body." }, 400);
  }
  const message = String(payload.message ?? "").trim();
  const honeypot = String(payload.website ?? "").trim();
  if (honeypot) {
    return json2({ ok: true });
  }
  if (message.length < 5) {
    return json2({ ok: false, error: "Please enter a longer message." }, 400);
  }
  const scriptUrl = env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return json2(
      {
        ok: false,
        error: "Feedback endpoint is not configured. Set GOOGLE_APPS_SCRIPT_URL in Pages environment variables."
      },
      500
    );
  }
  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: buildForwardBody({
      ...payload,
      message,
      userAgent: request.headers.get("user-agent") ?? "Unknown"
    })
  });
  const text = await response.text().catch(() => "");
  if (!response.ok) {
    return json2(
      {
        ok: false,
        error: text ? `Google Sheets feedback endpoint failed (${response.status}). ${text.slice(0, 300)}` : `Google Sheets feedback endpoint failed (${response.status}).`
      },
      502
    );
  }
  return json2({ ok: true });
}
__name(onRequestPost7, "onRequestPost");
function onRequest12() {
  return json2({ ok: false, error: "Method not allowed." }, 405);
}
__name(onRequest12, "onRequest");

// ../site/shared/public-pages.js
var SITE_SOCIAL_IMAGE_URL = `${CANONICAL_SITE_ORIGIN}/android-chrome-512x512.png`;
var PUBLIC_PAGE_DEFS = {
  home: {
    key: "home",
    path: "/",
    title: "Ashes 5-0 Game - Build an All-Time Cricket XI",
    description: "Can your all-time Ashes XI win 5-0? Roll historic squads, make hidden picks, simulate a five-Test series and challenge friends to beat your team."
  },
  ashes: {
    key: "ashes",
    path: "/ashes",
    title: "Ashes 5-0 - Build an All-Time Ashes XI",
    description: "Roll historic England and Australia squads, choose one player at a time and build an all-time Ashes XI capable of winning a five-Test series 5-0."
  },
  daily: {
    key: "daily",
    path: "/daily",
    title: "Ashes 5-0 Daily - Today's Cricket XI Challenge",
    description: "Play today's shared Ashes challenge. Complete your XI through four hidden squad rolls, play one Test and compare your result with the daily leaderboard."
  },
  challenge: {
    key: "challenge",
    path: "/challenge",
    title: "Ashes 5-0 Challenge - Build an XI and Face a Friend",
    description: "Build a historic cricket XI, send a private challenge link and see whether a friend can draft a team capable of beating yours."
  },
  leaderboard: {
    key: "leaderboard",
    path: "/leaderboard",
    title: "Ashes 5-0 Leaderboard - Most Selected Cricket Legends",
    description: "See the cricket legends most frequently selected in completed Ashes 5-0 teams, Daily Challenges and community drafts."
  },
  howToPlay: {
    key: "howToPlay",
    path: "/how-to-play",
    title: "How to Play Ashes 5-0 - Cricket XI Draft Rules",
    description: "Learn how to roll historic squads, make hidden player selections, build your XI, play the Daily Ashes Challenge and challenge friends."
  },
  about: {
    key: "about",
    path: "/about",
    title: "About Ashes 5-0 - The Historic Cricket XI Game",
    description: "Learn about Ashes 5-0, a historic cricket drafting game featuring classic squads, Test simulations, daily challenges and friend challenges."
  },
  worldCup: {
    key: "worldCup",
    path: "/world-cup",
    title: "World Cup Cricket XI Game | Ashes 5-0",
    description: "Build a World Cup cricket XI from historic tournament squads, make one selection at a time and simulate how your team performs."
  }
};
var PUBLIC_PAGE_ENTRIES = Object.values(PUBLIC_PAGE_DEFS);
function canonicalUrlForPageKey(pageKey) {
  const page = PUBLIC_PAGE_DEFS[pageKey] ?? null;
  return page ? new URL(page.path, CANONICAL_SITE_ORIGIN).href : `${CANONICAL_SITE_ORIGIN}/`;
}
__name(canonicalUrlForPageKey, "canonicalUrlForPageKey");

// _lib/spa.js
var DEFAULT_TITLE = "Ashes 5-0 Game - Build an All-Time Cricket XI";
var DEFAULT_DESCRIPTION = "Can your all-time Ashes XI win 5-0? Roll historic squads, make hidden picks, simulate a five-Test series and challenge friends to beat your team.";
function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
__name(escapeHtml, "escapeHtml");
function escapeBootstrapJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e");
}
__name(escapeBootstrapJson, "escapeBootstrapJson");
function replaceOrInsert(html, pattern, replacement, fallbackAnchor) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace(fallbackAnchor, `${replacement}
${fallbackAnchor}`);
}
__name(replaceOrInsert, "replaceOrInsert");
function buildBootstrapScript(bootstrap) {
  if (!bootstrap) return "";
  return `<script>window.__ASHES_BOOTSTRAP__=${escapeBootstrapJson(bootstrap)};<\/script>
`;
}
__name(buildBootstrapScript, "buildBootstrapScript");
function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
__name(escapeRegex, "escapeRegex");
function replaceElementInnerHtml(html, dataAttribute, replacement) {
  const pattern = new RegExp(
    `(<([a-z0-9-]+)([^>]*\\s${escapeRegex(dataAttribute)}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?[^>]*)>)[\\s\\S]*?(</\\2>)`,
    "iu"
  );
  return html.replace(pattern, `$1${replacement}$4`);
}
__name(replaceElementInnerHtml, "replaceElementInnerHtml");
function replaceElementText(html, dataAttribute, text) {
  return replaceElementInnerHtml(html, dataAttribute, escapeHtml(text));
}
__name(replaceElementText, "replaceElementText");
function retagElement(html, dataAttribute, nextTagName) {
  const pattern = new RegExp(
    `<([a-z0-9-]+)([^>]*\\s${escapeRegex(dataAttribute)}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?[^>]*)>([\\s\\S]*?)</\\1>`,
    "iu"
  );
  return html.replace(pattern, `<${nextTagName}$2>$3</${nextTagName}>`);
}
__name(retagElement, "retagElement");
function setElementHidden(html, dataAttribute, hidden) {
  const pattern = new RegExp(`(<[a-z0-9-]+[^>]*\\s${escapeRegex(dataAttribute)}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?[^>]*)(>)`, "iu");
  return html.replace(pattern, (_, start, end) => {
    const hasHidden = /\shidden(?:=|>|\s)/iu.test(start + end);
    if (hidden && !hasHidden) {
      return `${start} hidden${end}`;
    }
    if (!hidden && hasHidden) {
      return `${start.replace(/\shidden(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/iu, "")}${end}`;
    }
    return `${start}${end}`;
  });
}
__name(setElementHidden, "setElementHidden");
function setBodyAttribute(html, attributeName, value) {
  const bodyPattern = /<body([^>]*)>/iu;
  return html.replace(bodyPattern, (_, attrs) => {
    const attrPattern = new RegExp(`\\s${escapeRegex(attributeName)}=(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "iu");
    const cleaned = attrs.replace(attrPattern, "");
    return `<body${cleaned} ${attributeName}="${escapeHtml(value)}">`;
  });
}
__name(setBodyAttribute, "setBodyAttribute");
async function renderSpaPage(context, options = {}) {
  const title = options.title ?? DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const canonical = options.canonical ?? `${CANONICAL_SITE_ORIGIN}/`;
  const ogUrl = options.ogUrl ?? canonical;
  const ogTitle = options.ogTitle ?? title;
  const ogDescription = options.ogDescription ?? description;
  const ogImage = options.ogImage ?? SITE_SOCIAL_IMAGE_URL;
  const twitterCard = options.twitterCard ?? "summary_large_image";
  const robots = options.robots ?? "index, follow";
  const bootstrapScript = buildBootstrapScript(options.bootstrap);
  const structuredDataMarkup = options.structuredData ? `<script type="application/ld+json">${escapeBootstrapJson(options.structuredData)}<\/script>
` : "";
  const response = await context.env.ASSETS.fetch(new URL("/", context.request.url));
  const originalHtml = await response.text();
  let html = originalHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/u, `<title>${escapeHtml(title)}</title>`);
  html = replaceOrInsert(
    html,
    /<meta\s+name="description"[^>]*>/u,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<link\s+rel="canonical"[^>]*>/u,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:title"[^>]*>/u,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:description"[^>]*>/u,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:url"[^>]*>/u,
    `<meta property="og:url" content="${escapeHtml(ogUrl)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:image"[^>]*>/u,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="robots"[^>]*>/u,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:card"[^>]*>/u,
    `<meta name="twitter:card" content="${escapeHtml(twitterCard)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:title"[^>]*>/u,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:description"[^>]*>/u,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:url"[^>]*>/u,
    `<meta name="twitter:url" content="${escapeHtml(ogUrl)}" />`,
    "</head>"
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:image"[^>]*>/u,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    "</head>"
  );
  if (structuredDataMarkup) {
    html = html.replace("</head>", `${structuredDataMarkup}</head>`);
  }
  if (bootstrapScript) {
    html = html.replace(
      /<script type="module" src="\/app\.js"><\/script>/u,
      `${bootstrapScript}<script type="module" src="/app.js"><\/script>`
    );
  }
  if (typeof options.htmlTransform === "function") {
    html = options.htmlTransform(html);
  }
  return new Response(html, {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": robots
    }
  });
}
__name(renderSpaPage, "renderSpaPage");

// c/[id].js
async function onRequestGet6(context) {
  const challengeId = String(context.params.id ?? "").trim();
  const details = challengeId ? await fetchChallengeDetails(context.env.DB, challengeId) : null;
  if (!details) {
    return renderSpaPage(context, {
      status: 404,
      title: "Challenge Not Found | Ashes 5-0",
      description: "This Ashes 5-0 challenge link could not be found. Start a new XI or ask for a fresh invite.",
      canonical: `https://ashes-5-0.co.uk/c/${challengeId}`,
      ogUrl: `https://ashes-5-0.co.uk/c/${challengeId}`,
      robots: "noindex, follow",
      bootstrap: {
        route: {
          type: "challenge-not-found",
          id: challengeId
        }
      }
    });
  }
  const creatorName = details.team.displayName;
  const modeLabel = details.team.mode === "memory" ? "Memory" : "Classic";
  const title = creatorName ? `${creatorName}'s ${modeLabel} Challenge | Ashes 5-0` : `${modeLabel} Challenge | Ashes 5-0`;
  const description = creatorName ? `Open ${creatorName}'s Ashes 5-0 ${modeLabel.toLowerCase()} challenge, draft your XI, and play the five-Test series.` : `Open an Ashes 5-0 ${modeLabel.toLowerCase()} challenge, draft your XI, and play the five-Test series.`;
  return renderSpaPage(context, {
    title,
    description,
    canonical: details.challenge.url,
    ogUrl: details.challenge.url,
    robots: "noindex, follow",
    bootstrap: {
      route: {
        type: "challenge",
        id: details.challenge.id
      },
      challenge: details.challenge,
      team: details.team
    }
  });
}
__name(onRequestGet6, "onRequestGet");

// r/[id].js
function scoreLabel(result) {
  return `${result.userWins}-${result.starWins}${result.draws ? `-${result.draws}` : ""}`;
}
__name(scoreLabel, "scoreLabel");
async function onRequestGet7(context) {
  const resultId = String(context.params.id ?? "").trim();
  const details = resultId ? await fetchResultDetails(context.env.DB, resultId) : null;
  if (!details) {
    return renderSpaPage(context, {
      status: 404,
      title: "Result Not Found | Ashes 5-0",
      description: "This saved Ashes 5-0 result could not be found. Start a new series or ask for a fresh result link.",
      canonical: `https://ashes-5-0.co.uk/r/${resultId}`,
      ogUrl: `https://ashes-5-0.co.uk/r/${resultId}`,
      robots: "noindex, follow",
      bootstrap: {
        route: {
          type: "result-not-found",
          id: resultId
        }
      }
    });
  }
  const challengerLabel = details.result.challengerDisplayName ? `${details.result.challengerDisplayName}'s XI` : "Challenger's XI";
  const responderLabel = details.result.responderDisplayName ? `${details.result.responderDisplayName}'s XI` : "Responder's XI";
  const title = `${responderLabel} vs ${challengerLabel} | Challenge Result | Ashes 5-0`;
  const description = `${responderLabel} completed an Ashes 5-0 ${details.result.mode} challenge against ${challengerLabel}. Final score: ${scoreLabel(details.result)}.`;
  return renderSpaPage(context, {
    title,
    description,
    canonical: details.result.shortUrl,
    ogUrl: details.result.shortUrl,
    ogTitle: title,
    ogDescription: description,
    robots: "noindex, follow",
    bootstrap: {
      route: {
        type: "result",
        id: details.result.id
      },
      result: details.result,
      challenge: details.challenge,
      creatorTeam: details.creatorTeam,
      responderTeam: details.responderTeam
    }
  });
}
__name(onRequestGet7, "onRequestGet");

// _lib/public-page-render.js
var TITLE_ATTRS = [
  "data-home-title",
  "data-leaderboard-title",
  "data-game-title",
  "data-series-title"
];
var VIEW_ATTRS = {
  home: "data-home-view",
  leaderboard: "data-leaderboard-view",
  game: "data-game-view",
  series: "data-series-view"
};
function todayLongDate() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(/* @__PURE__ */ new Date());
}
__name(todayLongDate, "todayLongDate");
function copyCard({ title, body, list = [] }) {
  return `
    <article class="copy-card">
      <h3>${title}</h3>
      <p>${body}</p>
      ${list.length ? `<ul>${list.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    </article>
  `;
}
__name(copyCard, "copyCard");
function copyGrid(cards) {
  return cards.map(copyCard).join("");
}
__name(copyGrid, "copyGrid");
function breadcrumbStructuredData(name, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${CANONICAL_SITE_ORIGIN}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: canonicalUrl
      }
    ]
  };
}
__name(breadcrumbStructuredData, "breadcrumbStructuredData");
function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ashes 5-0",
    url: `${CANONICAL_SITE_ORIGIN}/`,
    description: PUBLIC_PAGE_DEFS.home.description
  };
}
__name(websiteStructuredData, "websiteStructuredData");
function applyBaseView(html, { activeView = "home", activeTitleAttr = "data-home-title", competition = "ashes" } = {}) {
  let nextHtml = setBodyAttribute(html, "data-competition", competition);
  for (const titleAttr of TITLE_ATTRS) {
    nextHtml = retagElement(nextHtml, titleAttr, "h2");
  }
  nextHtml = retagElement(nextHtml, activeTitleAttr, "h1");
  for (const [viewKey, dataAttr] of Object.entries(VIEW_ATTRS)) {
    nextHtml = setElementHidden(nextHtml, dataAttr, viewKey !== activeView);
  }
  return nextHtml;
}
__name(applyBaseView, "applyBaseView");
function applyHomeLanding(html, options = {}) {
  let nextHtml = applyBaseView(html, {
    activeView: "home",
    activeTitleAttr: "data-home-title",
    competition: options.competition ?? "ashes"
  });
  nextHtml = replaceElementText(nextHtml, "data-home-eyebrow", options.eyebrow ?? "Ashes 5-0");
  nextHtml = replaceElementText(nextHtml, "data-home-title", options.title);
  nextHtml = replaceElementText(nextHtml, "data-home-tagline", options.tagline ?? "Roll a squad. Lock one player. Build your XI.");
  nextHtml = replaceElementText(nextHtml, "data-home-lede", options.lede);
  nextHtml = replaceElementText(nextHtml, "data-home-panel-kicker", options.panelKicker ?? "How it works");
  nextHtml = replaceElementText(nextHtml, "data-home-panel-title", options.panelTitle ?? "Squad Roller");
  nextHtml = replaceElementInnerHtml(nextHtml, "data-home-panel-copy", options.panelCopy ?? "");
  nextHtml = replaceElementText(nextHtml, "data-play-game", options.playLabel ?? "Start a solo game");
  nextHtml = setElementHidden(nextHtml, "data-home-panel-copy", !options.panelCopy);
  nextHtml = setElementHidden(nextHtml, "data-home-config-grid", Boolean(options.hideConfigGrid));
  nextHtml = setElementHidden(nextHtml, "data-home-controls", Boolean(options.controlsHidden));
  nextHtml = setElementHidden(nextHtml, "data-home-response-name-row", true);
  nextHtml = setElementHidden(nextHtml, "data-play-game", Boolean(options.playButtonHidden));
  if (options.rulesHtml) {
    nextHtml = replaceElementInnerHtml(nextHtml, "data-home-rules-grid", options.rulesHtml);
  }
  if (typeof options.homeChallengeHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-challenge", options.homeChallengeHidden);
  }
  if (typeof options.homeDailyHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-daily", options.homeDailyHidden);
  }
  if (typeof options.homeLeaderboardHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-leaderboard", options.homeLeaderboardHidden);
  }
  if (typeof options.homeCompetitionHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-competition", options.homeCompetitionHidden);
  }
  return nextHtml;
}
__name(applyHomeLanding, "applyHomeLanding");
function applyDailyLanding(html) {
  const dateText = todayLongDate();
  let nextHtml = applyBaseView(html, {
    activeView: "game",
    activeTitleAttr: "data-game-title",
    competition: "ashes"
  });
  nextHtml = replaceElementText(nextHtml, "data-game-squad-count", dateText);
  nextHtml = replaceElementText(nextHtml, "data-game-player-count", "4 hidden rolls");
  nextHtml = replaceElementText(nextHtml, "data-game-mode", "Memory Daily");
  nextHtml = replaceElementText(nextHtml, "data-game-eyebrow", "Daily Challenge");
  nextHtml = replaceElementText(nextHtml, "data-game-title", "Play today's shared Ashes XI challenge");
  nextHtml = replaceElementText(nextHtml, "data-current-squad", "Reveal the first squad");
  nextHtml = replaceElementText(nextHtml, "data-lineup-status", "7 / 11 selected");
  nextHtml = replaceElementText(nextHtml, "data-roster-kicker", "How it works");
  nextHtml = replaceElementText(nextHtml, "data-roster-title", "Seven players are already locked in");
  nextHtml = replaceElementText(
    nextHtml,
    "data-roster-summary",
    "Everyone gets the same hidden sequence. Your first ranked attempt is the entry that counts toward the daily leaderboard."
  );
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-roster-grid",
    copyGrid([
      {
        title: "7 players pre-selected",
        body: "7 players are already locked into your XI. No new squad is revealed until the draft begins."
      },
      {
        title: "4 hidden squad rolls",
        body: "4 historic squads appear one at a time. You select 1 player from each squad and cannot preview future rolls."
      },
      {
        title: "Shared deterministic draft",
        body: `Every player receives the same sequence for ${dateText}, so results are directly comparable.`
      },
      {
        title: "One Test decides it",
        body: "Once your XI is complete, you play a single Test. Only the first ranked attempt is eligible for the daily leaderboard."
      }
    ])
  );
  nextHtml = replaceElementText(nextHtml, "data-board-title", "Your daily XI");
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board-copy",
    'Future squads stay hidden until you lock each pick. Read the <a href="/how-to-play">full rules</a> or compare completed teams on the <a href="/leaderboard">leaderboard</a>.'
  );
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board",
    `<div class="placeholder">Load today's challenge to reveal the first squad.</div>`
  );
  nextHtml = replaceElementText(nextHtml, "data-roll-squad", "Load today's challenge");
  nextHtml = setElementHidden(nextHtml, "data-start-series", true);
  nextHtml = setElementHidden(nextHtml, "data-draft-meter", true);
  return nextHtml;
}
__name(applyDailyLanding, "applyDailyLanding");
function applyLeaderboardLanding(html) {
  return applyBaseView(html, {
    activeView: "leaderboard",
    activeTitleAttr: "data-leaderboard-title",
    competition: "ashes"
  });
}
__name(applyLeaderboardLanding, "applyLeaderboardLanding");
function applyHowToPlayLanding(html) {
  return applyHomeLanding(html, {
    eyebrow: "How to Play",
    title: "How to play Ashes 5-0",
    tagline: "Historic squads. Hidden future rolls. One player at a time.",
    lede: "Learn the drafting rules, daily format, challenge mode, World Cup mode and how completed teams reach the leaderboard.",
    panelKicker: "Rules",
    panelTitle: "Cricket XI draft guide",
    panelCopy: 'Use the <a href="/ashes">full Ashes mode</a>, try the <a href="/daily">Daily Challenge</a>, build a private <a href="/challenge">Challenge a Friend</a> link, or switch to <a href="/world-cup">World Cup mode</a>.',
    playButtonHidden: true,
    controlsHidden: true,
    hideConfigGrid: true,
    homeChallengeHidden: true,
    homeDailyHidden: true,
    homeLeaderboardHidden: true,
    homeCompetitionHidden: true,
    rulesHtml: copyGrid([
      {
        title: "Full XI drafting",
        body: "Roll a historic squad, choose one player, and lock that player into a valid XI slot. Keep going until your team is full."
      },
      {
        title: "Hidden future squad rolls",
        body: "Each choice matters because the next squad stays hidden until you confirm the current pick."
      },
      {
        title: "Team-composition rules",
        body: "Every slot has a role requirement, so you still need a balanced batting order, wicketkeeper, spin option and pace attack."
      },
      {
        title: "Five-Test simulation",
        body: "A completed Ashes XI plays a full five-Test series against an all-star side drawn from the same historical pool."
      },
      {
        title: "Daily Ashes Challenge",
        body: "The daily mode starts with seven fixed players. Four hidden squad rolls follow, one pick per roll, then one Test decides the result."
      },
      {
        title: "Challenge a Friend",
        body: "Complete a team, generate a private link, and let someone else draft their XI before playing a five-Test head-to-head series."
      },
      {
        title: "World Cup mode",
        body: "World Cup mode uses historic tournament squads and a tournament route. It keeps its own format and is not presented as an Ashes whitewash."
      },
      {
        title: "Leaderboards",
        body: "Completed solo teams, friend challenges and finished daily drafts feed the player-selection leaderboard over time."
      },
      {
        title: "Frequently asked questions",
        body: "Can I see future squads? No. Do daily practice runs count? No. Do short challenge links stay private? Yes, and generated challenge and result URLs are excluded from indexing."
      }
    ])
  });
}
__name(applyHowToPlayLanding, "applyHowToPlayLanding");
function applyAboutLanding(html) {
  return applyHomeLanding(html, {
    eyebrow: "About Ashes 5-0",
    title: "The historic cricket XI game",
    tagline: "Draft a side from the past and see how it performs.",
    lede: "Ashes 5-0 is an independent cricket project built around historic squads, hidden future choices and simulation-led series outcomes.",
    panelKicker: "About",
    panelTitle: "What the project is",
    panelCopy: 'Play the <a href="/ashes">Ashes mode</a>, try the <a href="/daily">Daily Challenge</a>, set up a private <a href="/challenge">friend challenge</a>, or read the <a href="/how-to-play">rules guide</a>.',
    playButtonHidden: true,
    controlsHidden: true,
    hideConfigGrid: true,
    homeChallengeHidden: true,
    homeDailyHidden: true,
    homeLeaderboardHidden: true,
    homeCompetitionHidden: true,
    rulesHtml: copyGrid([
      {
        title: "What Ashes 5-0 is",
        body: "It is a historic cricket drafting game where you build an XI from classic squads and then simulate how that team performs."
      },
      {
        title: "Why it was created",
        body: "The project focuses on the fun of comparing great cricketers across eras while adding tension through constrained drafting and hidden future rolls."
      },
      {
        title: "What makes it distinctive",
        body: "You cannot see the next squad before committing to the current pick, so every selection is both a team-building choice and a risk-management decision."
      },
      {
        title: "Available modes",
        body: "The site includes a full Ashes draft, a Daily Ashes Challenge, Challenge a Friend links, a World Cup mode and a community selection leaderboard."
      },
      {
        title: "Simulations and ratings",
        body: "At a high level, player ratings feed batting, bowling, fielding and experience balances, which then shape the simulated Test or tournament outcomes."
      },
      {
        title: "Independent cricket project",
        body: "Ashes 5-0 is an independent project. It does not claim endorsement from the ECB, Cricket Australia, the ICC or any player."
      },
      {
        title: "Entertainment only",
        body: "Results and rankings are intended for entertainment and comparison rather than official historical judgement."
      },
      {
        title: "Feedback",
        body: "Use the feedback form in the footer to report bugs, suggest ideas or share thoughts on the drafting and simulation experience."
      }
    ])
  });
}
__name(applyAboutLanding, "applyAboutLanding");
function applyWorldCupLanding(html) {
  let nextHtml = applyHomeLanding(html, {
    competition: "worldcup",
    eyebrow: "World Cup XI",
    title: "Build your World Cup XI",
    tagline: "Roll a World Cup squad. Lock one player. Build your XI.",
    lede: "Build a World Cup cricket XI from historic tournament squads, make one selection at a time and see how your side performs across the tournament route.",
    panelKicker: "How it works",
    panelTitle: "World Cup mode",
    panelCopy: 'Looking for the Test-match format? Return to <a href="/ashes">Ashes mode</a>, browse the <a href="/how-to-play">rules guide</a>, or compare players on the <a href="/leaderboard">leaderboard</a>.',
    playLabel: "Start World Cup",
    homeChallengeHidden: true,
    homeDailyHidden: true,
    homeLeaderboardHidden: true
  });
  nextHtml = replaceElementText(nextHtml, "data-home-format-value", "ODI");
  nextHtml = replaceElementText(nextHtml, "data-home-format-label", "Match format");
  nextHtml = replaceElementText(nextHtml, "data-home-squads-label", "World Cup squads");
  nextHtml = replaceElementText(nextHtml, "data-home-rule-one", "Roll a historic World Cup squad.");
  nextHtml = replaceElementText(nextHtml, "data-home-rule-three", "Repeat until your XI is full, then simulate the tournament.");
  nextHtml = replaceElementText(nextHtml, "data-home-competition", "Ashes mode");
  return nextHtml;
}
__name(applyWorldCupLanding, "applyWorldCupLanding");
function applyAshesLanding(html) {
  const nextHtml = applyHomeLanding(html, {
    eyebrow: "Ashes 5-0",
    title: "Can your Ashes XI go 5-0?",
    tagline: "Roll a squad. Lock one player. Build your XI.",
    lede: "Roll historic England and Australia squads, lock one player at a time and build an all-time Ashes XI capable of completing a five-Test whitewash.",
    panelKicker: "How it works",
    panelTitle: "Ashes mode",
    panelCopy: 'Try the <a href="/daily">Daily Challenge</a>, create a private <a href="/challenge">Challenge a Friend</a> link, or read the <a href="/how-to-play">full rules</a> before you draft.',
    playLabel: "Start Ashes mode"
  });
  return nextHtml;
}
__name(applyAshesLanding, "applyAshesLanding");
function applyHomepage(html) {
  const nextHtml = applyHomeLanding(html, {
    eyebrow: "Ashes 5-0",
    title: "Can your Ashes XI go 5-0?",
    tagline: "Roll a squad. Lock one player. Build your XI.",
    lede: "Roll historic squads, lock one player at a time and build an all-time XI capable of completing an Ashes whitewash.",
    panelKicker: "How it works",
    panelTitle: "Ashes 5-0",
    panelCopy: 'Play the full <a href="/ashes">Ashes mode</a>, try the <a href="/daily">Daily Challenge</a>, create a private <a href="/challenge">friend challenge</a>, or explore the <a href="/leaderboard">community picks</a>.',
    playLabel: "Start a solo game"
  });
  return nextHtml;
}
__name(applyHomepage, "applyHomepage");
function applyChallengeLanding(html) {
  let nextHtml = applyBaseView(html, {
    activeView: "game",
    activeTitleAttr: "data-game-title",
    competition: "ashes"
  });
  nextHtml = replaceElementText(nextHtml, "data-game-squad-count", "Historic squads");
  nextHtml = replaceElementText(nextHtml, "data-game-player-count", "11 picks");
  nextHtml = replaceElementText(nextHtml, "data-game-mode", "Challenge");
  nextHtml = replaceElementText(nextHtml, "data-game-eyebrow", "Challenge a Friend");
  nextHtml = replaceElementText(nextHtml, "data-game-title", "Build a cricket XI and face a friend");
  nextHtml = replaceElementText(nextHtml, "data-current-squad", "Roll a squad");
  nextHtml = replaceElementText(nextHtml, "data-lineup-status", "Awaiting first pick");
  nextHtml = replaceElementText(nextHtml, "data-roster-kicker", "How it works");
  nextHtml = replaceElementText(nextHtml, "data-roster-title", "How Challenge a Friend works");
  nextHtml = replaceElementText(nextHtml, "data-roster-summary", "Build a team, share a private link, and compare the result when your friend is done.");
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-roster-grid",
    copyGrid([
      {
        title: "1. Build your XI",
        body: "Draft a full historic cricket XI in classic or memory mode and lock the side you want to send."
      },
      {
        title: "2. Generate and share a private link",
        body: "Create a short URL that saves the team privately and keeps generated challenge pages excluded from indexing."
      },
      {
        title: "3. Your friend drafts and plays",
        body: "They open the link, draft their own XI and then play a five-Test series against your saved team."
      },
      {
        title: "4. Compare or challenge them back",
        body: "Review the final result, send it back, and set up a rematch if you both want another go."
      }
    ])
  );
  nextHtml = replaceElementText(nextHtml, "data-board-title", "Your challenge XI");
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board-copy",
    'Need the rules first? Read <a href="/how-to-play">How to Play</a>, compare community picks on the <a href="/leaderboard">leaderboard</a>, or return to the main <a href="/ashes">Ashes mode</a>.'
  );
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board",
    '<div class="placeholder">Roll an Ashes squad to begin your challenge XI.</div>'
  );
  nextHtml = replaceElementText(nextHtml, "data-roll-squad", "Roll Ashes squad");
  nextHtml = setElementHidden(nextHtml, "data-start-series", true);
  return nextHtml;
}
__name(applyChallengeLanding, "applyChallengeLanding");
function pageHtmlTransform(pageKey) {
  switch (pageKey) {
    case "home":
      return applyHomepage;
    case "ashes":
      return applyAshesLanding;
    case "daily":
      return applyDailyLanding;
    case "challenge":
      return applyChallengeLanding;
    case "leaderboard":
      return applyLeaderboardLanding;
    case "howToPlay":
      return applyHowToPlayLanding;
    case "about":
      return applyAboutLanding;
    case "worldCup":
      return applyWorldCupLanding;
    default:
      return (html) => html;
  }
}
__name(pageHtmlTransform, "pageHtmlTransform");
function pageBootstrap(pageKey) {
  switch (pageKey) {
    case "daily":
      return {
        route: {
          type: "daily",
          pageKey,
          currentDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
        }
      };
    case "challenge":
      return {
        route: {
          type: "challenge-landing",
          pageKey
        }
      };
    case "leaderboard":
      return {
        route: {
          type: "leaderboard",
          pageKey
        }
      };
    case "worldCup":
      return {
        route: {
          type: "world-cup",
          pageKey
        }
      };
    default:
      return {
        route: {
          type: "landing",
          pageKey
        }
      };
  }
}
__name(pageBootstrap, "pageBootstrap");
async function renderPublicPage(context, pageKey) {
  const page = PUBLIC_PAGE_DEFS[pageKey];
  if (!page) {
    throw new Error(`Unknown public page: ${pageKey}`);
  }
  const canonical = canonicalUrlForPageKey(pageKey);
  const structuredData = pageKey === "home" ? websiteStructuredData() : breadcrumbStructuredData(
    pageKey === "howToPlay" ? "How to Play" : pageKey === "worldCup" ? "World Cup mode" : page.title,
    canonical
  );
  return renderSpaPage(context, {
    title: page.title,
    description: page.description,
    canonical,
    ogUrl: canonical,
    ogTitle: page.title,
    ogDescription: page.description,
    robots: "index, follow",
    bootstrap: pageBootstrap(pageKey),
    structuredData,
    htmlTransform: pageHtmlTransform(pageKey)
  });
}
__name(renderPublicPage, "renderPublicPage");

// about.js
async function onRequestGet8(context) {
  return renderPublicPage(context, "about");
}
__name(onRequestGet8, "onRequestGet");

// ashes.js
async function onRequestGet9(context) {
  return renderPublicPage(context, "ashes");
}
__name(onRequestGet9, "onRequestGet");

// challenge.js
async function onRequestGet10(context) {
  return renderPublicPage(context, "challenge");
}
__name(onRequestGet10, "onRequestGet");

// daily.js
async function onRequestGet11(context) {
  return renderPublicPage(context, "daily");
}
__name(onRequestGet11, "onRequestGet");

// how-to-play.js
async function onRequestGet12(context) {
  return renderPublicPage(context, "howToPlay");
}
__name(onRequestGet12, "onRequestGet");

// leaderboard.js
async function onRequestGet13(context) {
  return renderPublicPage(context, "leaderboard");
}
__name(onRequestGet13, "onRequestGet");

// world-cup.js
async function onRequestGet14(context) {
  return renderPublicPage(context, "worldCup");
}
__name(onRequestGet14, "onRequestGet");

// index.js
async function onRequestGet15(context) {
  return renderPublicPage(context, "home");
}
__name(onRequestGet15, "onRequestGet");

// ../.wrangler/tmp/pages-0pYtmQ/functionsRoutes-0.05240351738315385.mjs
var routes = [
  {
    routePath: "/api/daily/:id/attempts/:attemptId/select",
    mountPath: "/api/daily/:id/attempts/:attemptId",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/daily/:id/attempts/:attemptId/simulate",
    mountPath: "/api/daily/:id/attempts/:attemptId",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/daily/:id/attempts/:attemptId/select",
    mountPath: "/api/daily/:id/attempts/:attemptId",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/daily/:id/attempts/:attemptId/simulate",
    mountPath: "/api/daily/:id/attempts/:attemptId",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/daily/:id/attempts/:attemptId",
    mountPath: "/api/daily/:id/attempts",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/daily/:id/attempts/:attemptId",
    mountPath: "/api/daily/:id/attempts",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/challenges/:id/results",
    mountPath: "/api/challenges/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/daily/:id/start",
    mountPath: "/api/daily/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/challenges/:id/results",
    mountPath: "/api/challenges/:id",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/daily/:id/start",
    mountPath: "/api/daily/:id",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/daily/current",
    mountPath: "/api/daily",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/leaderboards/players",
    mountPath: "/api/leaderboards",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/teams/solo",
    mountPath: "/api/teams",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/daily/current",
    mountPath: "/api/daily",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/leaderboards/players",
    mountPath: "/api/leaderboards",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/api/teams/solo",
    mountPath: "/api/teams",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/challenges/:id",
    mountPath: "/api/challenges",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/results/:id",
    mountPath: "/api/results",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/challenges/:id",
    mountPath: "/api/challenges",
    method: "",
    middlewares: [],
    modules: [onRequest9]
  },
  {
    routePath: "/api/results/:id",
    mountPath: "/api/results",
    method: "",
    middlewares: [],
    modules: [onRequest10]
  },
  {
    routePath: "/api/challenges",
    mountPath: "/api/challenges",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/feedback",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/challenges",
    mountPath: "/api/challenges",
    method: "",
    middlewares: [],
    modules: [onRequest11]
  },
  {
    routePath: "/api/feedback",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest12]
  },
  {
    routePath: "/c/:id",
    mountPath: "/c",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/r/:id",
    mountPath: "/r",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/about",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/ashes",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/challenge",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/daily",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet11]
  },
  {
    routePath: "/how-to-play",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet12]
  },
  {
    routePath: "/leaderboard",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet13]
  },
  {
    routePath: "/world-cup",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet14]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet15]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex2 = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex2, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex2, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex2, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex2, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-lJh7aG/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-lJh7aG/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.013663235826992581.mjs.map
