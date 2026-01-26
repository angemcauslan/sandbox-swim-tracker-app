const { useState, useEffect } = React;

// Lucide React icons as inline SVG components
const Plus = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const X = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Edit2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const Save = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const ChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Users = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Clock = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const SwimTracker = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [expandedClass, setExpandedClass] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportSettings, setReportSettings] = useState({
    studentId: null,
    wordLength: 100,
    reportType: 'midterm'
  });
  const [generatedComment, setGeneratedComment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showingPrompt, setShowingPrompt] = useState(true);
  
  const [newClass, setNewClass] = useState({
    name: '',
    levels: [],
    day: 'Monday',
    time: '',
    sessionLength: 8,
    year: new Date().getFullYear(),
    season: 'Winter'
  });

  const [classError, setClassError] = useState('');

  const [newStudent, setNewStudent] = useState({
    name: '',
    classId: '',
    studentLevel: '',
    pronouns: 'they/them',
    generalComments: ''
  });

  const levels = [
    'Parent & Tot 1', 'Parent & Tot 2', 'Parent & Tot 3',
    'Preschool 1', 'Preschool 2', 'Preschool 3', 'Preschool 4', 'Preschool 5',
    'Swimmer 1', 'Swimmer 2', 'Swimmer 3', 'Swimmer 4', 'Swimmer 5', 'Swimmer 6',
    'Rookie Patrol', 'Ranger Patrol', 'Star Patrol',
    'Adult 1', 'Adult 2', 'Adult 3',
    'Fitness'
  ];

  const skillsByLevel = {
    'Parent & Tot 1': [
      { id: 'pt1-1', name: 'Enter and exit the water safely with tot', category: 'Entries and Exits' },
      { id: 'pt1-2', name: 'Readiness for submersion', category: 'Underwater Skills' },
      { id: 'pt1-3', name: 'Hold tot on front, eye contact', category: 'Movement / Swimming Skills' },
      { id: 'pt1-4', name: 'Hold tot on back, head and back support', category: 'Movement / Swimming Skills' },
      { id: 'pt1-5', name: 'Front float (face out) – assisted', category: 'Movement / Swimming Skills' },
      { id: 'pt1-6', name: 'Back float (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt1-7', name: 'Float wearing PFD (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt1-8', name: 'Arms: splashing, reaching, paddling', category: 'Movement / Swimming Skills' },
      { id: 'pt1-9', name: 'Legs: tickling, splashing, kicking', category: 'Movement / Swimming Skills' },
      { id: 'pt1-10', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Parent & Tot 2': [
      { id: 'pt2-1', name: 'Entry from sitting position (assisted)', category: 'Entries and Exits' },
      { id: 'pt2-2', name: 'Exit the water (assisted)', category: 'Entries and Exits' },
      { id: 'pt2-3', name: 'Blow bubbles on and in water', category: 'Underwater Skills' },
      { id: 'pt2-4', name: 'Face wet and in water', category: 'Underwater Skills' },
      { id: 'pt2-5', name: 'Attempt to recover object below surface', category: 'Underwater Skills' },
      { id: 'pt2-6', name: 'Entry from sitting position wearing PFD and return (assisted)', category: 'Swim to Survive Skills' },
      { id: 'pt2-7', name: 'Front float (face in) – assisted', category: 'Movement / Swimming Skills' },
      { id: 'pt2-8', name: 'Back float (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt2-9', name: 'Kicking on front (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt2-10', name: 'Kicking on back (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt2-11', name: 'Surface passes with continuous contact', category: 'Movement / Swimming Skills' },
      { id: 'pt2-12', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Parent & Tot 3': [
      { id: 'pt3-1', name: 'Jump entry (assisted)', category: 'Entries and Exits' },
      { id: 'pt3-2', name: 'Entry and submerge from sitting position (assisted)', category: 'Entries and Exits' },
      { id: 'pt3-3', name: 'Exit the water (unassisted)', category: 'Entries and Exits' },
      { id: 'pt3-4', name: 'Hold breath underwater (assisted)', category: 'Underwater Skills' },
      { id: 'pt3-5', name: 'Attempt to open eyes underwater', category: 'Underwater Skills' },
      { id: 'pt3-6', name: 'Attempt to recover object from bottom', category: 'Underwater Skills' },
      { id: 'pt3-7', name: 'Standing jump entry, return to edge (assisted)', category: 'Swim to Survive Skills' },
      { id: 'pt3-8', name: 'Jump entry and float wearing PFD (assisted)', category: 'Swim to Survive Skills' },
      { id: 'pt3-9', name: 'Front "starfish" float (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt3-10', name: 'Back "starfish" float (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt3-11', name: 'Front "pencil" float (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt3-12', name: 'Back "pencil" float (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt3-13', name: 'Kicking on front (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt3-14', name: 'Kicking on back (assisted)', category: 'Movement / Swimming Skills' },
      { id: 'pt3-15', name: 'Underwater passes', category: 'Swim to Survive Skills' },
      { id: 'pt3-16', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Preschool 1': [
      { id: 'ps1-1', name: 'Enter and exit shallow water (assisted)', category: 'Entries and Exits' },
      { id: 'ps1-2', name: 'Jump into chest-deep water (assisted)', category: 'Entries and Exits' },
      { id: 'ps1-3', name: 'Face in water', category: 'Underwater Skills' },
      { id: 'ps1-4', name: 'Blow bubbles in water', category: 'Underwater Skills' },
      { id: 'ps1-5', name: 'Float on front (3 sec.) assisted', category: 'Movement / Swimming Skills' },
      { id: 'ps1-6', name: 'Float on back (3 sec.) assisted', category: 'Movement / Swimming Skills' },
      { id: 'ps1-7', name: 'Safe movement in shallow water wearing PFD', category: 'Movement / Swimming Skills' },
      { id: 'ps1-8', name: 'Glide on front (3 m) assisted', category: 'Movement / Swimming Skills' },
      { id: 'ps1-9', name: 'Glide on back (3 m) assisted', category: 'Movement / Swimming Skills' },
      { id: 'ps1-10', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Preschool 2': [
      { id: 'ps2-1', name: 'Enter and exit shallow water', category: 'Entries and Exits' },
      { id: 'ps2-2', name: 'Jump into chest-deep water', category: 'Entries and Exits' },
      { id: 'ps2-3', name: 'Submerge face', category: 'Underwater Skills' },
      { id: 'ps2-4', name: 'Exhale underwater (5 sec.)', category: 'Underwater Skills' },
      { id: 'ps2-5', name: 'Recover object in chest-deep water', category: 'Underwater Skills' },
      { id: 'ps2-6', name: 'Jump into water wearing PFD (assisted)', category: 'Swim to Survive Skills' },
      { id: 'ps2-7', name: 'Tread water wearing PFD (5 sec.)', category: 'Swim to Survive Skills' },
      { id: 'ps2-8', name: 'Float on front (5 sec.)', category: 'Movement / Swimming Skills' },
      { id: 'ps2-9', name: 'Float on back (5 sec.)', category: 'Movement / Swimming Skills' },
      { id: 'ps2-10', name: 'Roll from front to back', category: 'Movement / Swimming Skills' },
      { id: 'ps2-11', name: 'Roll from back to front', category: 'Movement / Swimming Skills' },
      { id: 'ps2-12', name: 'Glide on front (5 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps2-13', name: 'Glide on back (5 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps2-14', name: 'Front swim (3 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps2-15', name: 'Back swim (3 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps2-16', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Preschool 3': [
      { id: 'ps3-1', name: 'Jump into deep water', category: 'Entries and Exits' },
      { id: 'ps3-2', name: 'Sideways entry', category: 'Entries and Exits' },
      { id: 'ps3-3', name: 'Submerge and exhale (10 sec.)', category: 'Underwater Skills' },
      { id: 'ps3-4', name: 'Open eyes underwater', category: 'Underwater Skills' },
      { id: 'ps3-5', name: 'Recover object in deep water (assisted)', category: 'Underwater Skills' },
      { id: 'ps3-6', name: 'Jump into deep water wearing PFD', category: 'Swim to Survive Skills' },
      { id: 'ps3-7', name: 'Tread water wearing PFD (10 sec.)', category: 'Swim to Survive Skills' },
      { id: 'ps3-8', name: 'Front swim (5 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps3-9', name: 'Back swim (5 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps3-10', name: 'Side swim (3 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps3-11', name: 'Swim underwater (2 m)', category: 'Underwater Skills' },
      { id: 'ps3-12', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Preschool 4': [
      { id: 'ps4-1', name: 'Dive entry', category: 'Entries and Exits' },
      { id: 'ps4-2', name: 'Submerge and exhale (15 sec.)', category: 'Underwater Skills' },
      { id: 'ps4-3', name: 'Recover object in deep water', category: 'Underwater Skills' },
      { id: 'ps4-4', name: 'Jump into deep water wearing PFD, tread (20 sec.), swim to edge', category: 'Swim to Survive Skills' },
      { id: 'ps4-5', name: 'Front swim (10 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps4-6', name: 'Back swim (10 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps4-7', name: 'Side swim (5 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps4-8', name: 'Tread water (10 sec.)', category: 'Movement / Swimming Skills' },
      { id: 'ps4-9', name: 'Swim underwater (3 m)', category: 'Underwater Skills' },
      { id: 'ps4-10', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Preschool 5': [
      { id: 'ps5-1', name: 'Standing dive', category: 'Entries and Exits' },
      { id: 'ps5-2', name: 'Submerge and exhale (20 sec.)', category: 'Underwater Skills' },
      { id: 'ps5-3', name: 'Recover object in deep water', category: 'Underwater Skills' },
      { id: 'ps5-4', name: 'Roll into deep water, tread (30 sec.), swim to edge', category: 'Swim to Survive Skills' },
      { id: 'ps5-5', name: 'Front swim (15 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps5-6', name: 'Back swim (15 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps5-7', name: 'Side swim (10 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps5-8', name: 'Tread water (20 sec.)', category: 'Movement / Swimming Skills' },
      { id: 'ps5-9', name: 'Front to back swim (25 m)', category: 'Movement / Swimming Skills' },
      { id: 'ps5-10', name: 'Swim underwater (5 m)', category: 'Underwater Skills' },
      { id: 'ps5-11', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Swimmer 1': [
      { id: 's1-1', name: 'Interval training (25 m)', category: 'Fitness' },
      { id: 's1-2', name: 'Jump entry, tread (1 min.)', category: 'Entries and Exits' },
      { id: 's1-3', name: 'Roll into deep water, tread (45 sec.), swim (15 m)', category: 'Swim to Survive Skills' },
      { id: 's1-4', name: 'Front crawl (15 m)', category: 'Movement / Swimming Skills' },
      { id: 's1-5', name: 'Back crawl (15 m)', category: 'Movement / Swimming Skills' },
      { id: 's1-6', name: 'Whip kick on back (15 m)', category: 'Movement / Swimming Skills' },
      { id: 's1-7', name: 'Flutter kick on side (15 m each side)', category: 'Movement / Swimming Skills' },
      { id: 's1-8', name: 'Swim underwater (5 m)', category: 'Underwater Skills' },
      { id: 's1-9', name: 'Handstand in shallow water', category: 'Movement / Swimming Skills' },
      { id: 's1-10', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Swimmer 2': [
      { id: 's2-1', name: 'Interval training (50 m)', category: 'Fitness' },
      { id: 's2-2', name: 'Stride entry, tread (1 min.)', category: 'Entries and Exits' },
      { id: 's2-3', name: 'Roll into deep water, tread (1 min.), swim (25 m)', category: 'Swim to Survive Skills' },
      { id: 's2-4', name: 'Front crawl (25 m)', category: 'Movement / Swimming Skills' },
      { id: 's2-5', name: 'Back crawl (25 m)', category: 'Movement / Swimming Skills' },
      { id: 's2-6', name: 'Whip kick on back (25 m)', category: 'Movement / Swimming Skills' },
      { id: 's2-7', name: 'Front crawl with breathing (15 m)', category: 'Movement / Swimming Skills' },
      { id: 's2-8', name: 'Eggbeater kick (20 sec.)', category: 'Movement / Swimming Skills' },
      { id: 's2-9', name: 'Swim underwater (7 m)', category: 'Underwater Skills' },
      { id: 's2-10', name: 'Somersault in deep water', category: 'Movement / Swimming Skills' },
      { id: 's2-11', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Swimmer 3': [
      { id: 's3-1', name: 'Interval training (75 m)', category: 'Fitness' },
      { id: 's3-2', name: 'Compact jump entry, tread (1.5 min.)', category: 'Entries and Exits' },
      { id: 's3-3', name: 'Roll into deep water, tread (1.5 min.), swim (35 m)', category: 'Swim to Survive Skills' },
      { id: 's3-4', name: 'Front crawl (50 m)', category: 'Movement / Swimming Skills' },
      { id: 's3-5', name: 'Back crawl (50 m)', category: 'Movement / Swimming Skills' },
      { id: 's3-6', name: 'Breaststroke (15 m)', category: 'Movement / Swimming Skills' },
      { id: 's3-7', name: 'Eggbeater kick (45 sec.)', category: 'Movement / Swimming Skills' },
      { id: 's3-8', name: 'Swim underwater (9 m)', category: 'Underwater Skills' },
      { id: 's3-9', name: 'Vertical somersault in deep water', category: 'Movement / Swimming Skills' },
      { id: 's3-10', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Swimmer 4': [
      { id: 's4-1', name: 'Interval training (100 m)', category: 'Fitness' },
      { id: 's4-2', name: 'Stride entry, tread (2 min.)', category: 'Entries and Exits' },
      { id: 's4-3', name: 'Roll into deep water, tread (2 min.), swim (50 m)', category: 'Swim to Survive Skills' },
      { id: 's4-4', name: 'Front crawl (75 m)', category: 'Movement / Swimming Skills' },
      { id: 's4-5', name: 'Back crawl (75 m)', category: 'Movement / Swimming Skills' },
      { id: 's4-6', name: 'Breaststroke (25 m)', category: 'Movement / Swimming Skills' },
      { id: 's4-7', name: 'Eggbeater kick (1 min.)', category: 'Movement / Swimming Skills' },
      { id: 's4-8', name: 'Swim underwater (12 m)', category: 'Underwater Skills' },
      { id: 's4-9', name: 'Surface dive - pike or tuck position', category: 'Underwater Skills' },
      { id: 's4-10', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Swimmer 5': [
      { id: 's5-1', name: 'Interval training (150 m)', category: 'Fitness' },
      { id: 's5-2', name: 'Stride entry, tread (3 min.)', category: 'Entries and Exits' },
      { id: 's5-3', name: 'Roll into deep water, tread (3 min.), swim (75 m)', category: 'Swim to Survive Skills' },
      { id: 's5-4', name: 'Front crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 's5-5', name: 'Back crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 's5-6', name: 'Breaststroke (50 m)', category: 'Movement / Swimming Skills' },
      { id: 's5-7', name: 'Elementary backstroke (25 m)', category: 'Movement / Swimming Skills' },
      { id: 's5-8', name: 'Eggbeater kick (2 min.)', category: 'Movement / Swimming Skills' },
      { id: 's5-9', name: 'Swim underwater (15 m)', category: 'Underwater Skills' },
      { id: 's5-10', name: 'Surface dive - head first', category: 'Underwater Skills' },
      { id: 's5-11', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Swimmer 6': [
      { id: 's6-1', name: 'Interval training (300 m)', category: 'Fitness' },
      { id: 's6-2', name: 'Stride entry, tread (5 min.)', category: 'Entries and Exits' },
      { id: 's6-3', name: 'Roll into deep water, tread (5 min.), swim (100 m)', category: 'Swim to Survive Skills' },
      { id: 's6-4', name: 'Front crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 's6-5', name: 'Back crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 's6-6', name: 'Breaststroke (50 m)', category: 'Movement / Swimming Skills' },
      { id: 's6-7', name: 'Elementary backstroke (50 m)', category: 'Movement / Swimming Skills' },
      { id: 's6-8', name: 'Butterfly (15 m)', category: 'Movement / Swimming Skills' },
      { id: 's6-9', name: 'Individual medley (100 m)', category: 'Movement / Swimming Skills' },
      { id: 's6-10', name: 'Eggbeater kick (3 min.)', category: 'Movement / Swimming Skills' },
      { id: 's6-11', name: 'Swim underwater (15 m)', category: 'Underwater Skills' },
      { id: 's6-12', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Rookie Patrol': [
      { id: 'rp-1', name: 'Interval training (150 m)', category: 'Fitness' },
      { id: 'rp-2', name: 'Stride entry, tread (2 min.)', category: 'Entries and Exits' },
      { id: 'rp-3', name: 'Tow a person 10 m using contact tow', category: 'Lifesaving Skills' },
      { id: 'rp-4', name: 'Defensive position and release', category: 'Lifesaving Skills' },
      { id: 'rp-5', name: 'Demonstrate rescue in simulated scenario', category: 'Lifesaving Skills' },
      { id: 'rp-6', name: 'Front crawl (75 m)', category: 'Movement / Swimming Skills' },
      { id: 'rp-7', name: 'Back crawl (75 m)', category: 'Movement / Swimming Skills' },
      { id: 'rp-8', name: 'Breaststroke (25 m)', category: 'Movement / Swimming Skills' },
      { id: 'rp-9', name: 'Eggbeater kick (1 min.)', category: 'Movement / Swimming Skills' },
      { id: 'rp-10', name: 'Surface dive - head first', category: 'Underwater Skills' },
      { id: 'rp-11', name: 'Swim underwater (10 m)', category: 'Underwater Skills' },
      { id: 'rp-12', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Ranger Patrol': [
      { id: 'rgp-1', name: 'Interval training (300 m)', category: 'Fitness' },
      { id: 'rgp-2', name: 'Stride entry, tread (3 min.)', category: 'Entries and Exits' },
      { id: 'rgp-3', name: 'Tow a person 15 m using a non-contact tow', category: 'Lifesaving Skills' },
      { id: 'rgp-4', name: 'Demonstrate rescue in simulated scenario', category: 'Lifesaving Skills' },
      { id: 'rgp-5', name: 'Front crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'rgp-6', name: 'Back crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'rgp-7', name: 'Breaststroke (50 m)', category: 'Movement / Swimming Skills' },
      { id: 'rgp-8', name: 'Elementary backstroke (50 m)', category: 'Movement / Swimming Skills' },
      { id: 'rgp-9', name: 'Eggbeater kick (2 min.)', category: 'Movement / Swimming Skills' },
      { id: 'rgp-10', name: 'Surface dive - feet first', category: 'Underwater Skills' },
      { id: 'rgp-11', name: 'Swim underwater (12 m)', category: 'Underwater Skills' },
      { id: 'rgp-12', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Star Patrol': [
      { id: 'sp-1', name: 'Interval training (400 m)', category: 'Fitness' },
      { id: 'sp-2', name: 'Stride entry, tread (5 min.)', category: 'Entries and Exits' },
      { id: 'sp-3', name: 'Tow a person 25 m using a rescue aid', category: 'Lifesaving Skills' },
      { id: 'sp-4', name: 'Demonstrate rescue in simulated scenario', category: 'Lifesaving Skills' },
      { id: 'sp-5', name: 'Front crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'sp-6', name: 'Back crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'sp-7', name: 'Breaststroke (50 m)', category: 'Movement / Swimming Skills' },
      { id: 'sp-8', name: 'Elementary backstroke (50 m)', category: 'Movement / Swimming Skills' },
      { id: 'sp-9', name: 'Butterfly (25 m)', category: 'Movement / Swimming Skills' },
      { id: 'sp-10', name: 'Individual medley (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'sp-11', name: 'Eggbeater kick (3 min.)', category: 'Movement / Swimming Skills' },
      { id: 'sp-12', name: 'Swim underwater (15 m)', category: 'Underwater Skills' },
      { id: 'sp-13', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Adult 1': [
      { id: 'a1-1', name: 'Enter and exit shallow water', category: 'Entries and Exits' },
      { id: 'a1-2', name: 'Jump into deep water, return and exit', category: 'Entries and Exits' },
      { id: 'a1-3', name: 'Sideways entry wearing PFD', category: 'Entries and Exits' },
      { id: 'a1-4', name: 'Tread water 30 sec. wearing PFD', category: 'Surface Support' },
      { id: 'a1-5', name: 'Hold breath underwater 5–10 sec.', category: 'Underwater Skills' },
      { id: 'a1-6', name: 'Submerge and exhale 5–10 times', category: 'Underwater Skills' },
      { id: 'a1-7', name: 'Open eyes underwater', category: 'Underwater Skills' },
      { id: 'a1-8', name: 'Recover object from bottom in chest-deep water', category: 'Underwater Skills' },
      { id: 'a1-9', name: 'Wearing PFD, jump into deep water, tread 30 sec. and swim/kick on back 5–10 m', category: 'Swim to Survive Skills' },
      { id: 'a1-10', name: 'Float on front', category: 'Movement / Swimming Skills' },
      { id: 'a1-11', name: 'Float on back', category: 'Movement / Swimming Skills' },
      { id: 'a1-12', name: 'Roll laterally front to back and back to front', category: 'Movement / Swimming Skills' },
      { id: 'a1-13', name: 'Glide on front 3–5 m', category: 'Movement / Swimming Skills' },
      { id: 'a1-14', name: 'Glide on back 3–5 m', category: 'Movement / Swimming Skills' },
      { id: 'a1-15', name: 'Glide on side 3–5 m', category: 'Movement / Swimming Skills' },
      { id: 'a1-16', name: 'Flutter kick on front 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a1-17', name: 'Flutter kick on back 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a1-18', name: 'Flutter kick on side 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a1-19', name: 'Whip kick in vertical position with PFD 15–30 sec.', category: 'Movement / Swimming Skills' },
      { id: 'a1-20', name: 'Front crawl or back crawl 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a1-21', name: 'Interval training: 4 x 9–12 m flutter kick with 10–15 sec. rests', category: 'Fitness' },
      { id: 'a1-22', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Adult 2': [
      { id: 'a2-1', name: 'Standing dive into deep water', category: 'Entries and Exits' },
      { id: 'a2-2', name: 'Forward roll entry into deep water with PFD', category: 'Entries and Exits' },
      { id: 'a2-3', name: 'Forward roll entry into deep water without PFD', category: 'Entries and Exits' },
      { id: 'a2-4', name: 'Tuck jump (cannonball) into deep water', category: 'Entries and Exits' },
      { id: 'a2-5', name: 'Tread water 1–2 min.', category: 'Surface Support' },
      { id: 'a2-6', name: 'Handstand in shallow water', category: 'Underwater Skills' },
      { id: 'a2-7', name: 'Front somersault (in water)', category: 'Underwater Skills' },
      { id: 'a2-8', name: 'Swim underwater 5–10 m', category: 'Underwater Skills' },
      { id: 'a2-9', name: 'Canadian Swim to Survive Standard: Roll entry into deep water, tread 1 min. and swim 50 m', category: 'Swim to Survive Skills' },
      { id: 'a2-10', name: 'Flutter kick on back 5 m; reverse direction and flutter kick on front 5 m', category: 'Movement / Swimming Skills' },
      { id: 'a2-11', name: 'Flutter kick on front 5 m; reverse direction and flutter kick on back 5 m', category: 'Movement / Swimming Skills' },
      { id: 'a2-12', name: 'Whip kick on back 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a2-13', name: 'Whip kick on front 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a2-14', name: 'Breaststroke arms drill 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a2-15', name: 'Front crawl 25–50 m', category: 'Movement / Swimming Skills' },
      { id: 'a2-16', name: 'Back crawl 25–50 m', category: 'Movement / Swimming Skills' },
      { id: 'a2-17', name: 'Interval training: 4 x 25 m flutter kick with 15–20 sec. rests', category: 'Fitness' },
      { id: 'a2-18', name: 'Interval training: 4 x 25 m front or back crawl with 15–20 sec. rests', category: 'Fitness' },
      { id: 'a2-19', name: 'Sprint front crawl 25 m', category: 'Fitness' },
      { id: 'a2-20', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Adult 3': [
      { id: 'a3-1', name: 'Shallow dive into deep water', category: 'Entries and Exits' },
      { id: 'a3-2', name: 'Stride entry into deep water', category: 'Entries and Exits' },
      { id: 'a3-3', name: 'Compact jump into deep water', category: 'Entries and Exits' },
      { id: 'a3-4', name: 'Legs-only surface support 30–60 sec.', category: 'Surface Support' },
      { id: 'a3-5', name: 'Back somersault (in water)', category: 'Underwater Skills' },
      { id: 'a3-6', name: 'Swim underwater 5–10 m to recover object', category: 'Underwater Skills' },
      { id: 'a3-7', name: 'Eggbeater kick on back or scissor kick on side 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a3-8', name: 'Breaststroke 25–50 m', category: 'Movement / Swimming Skills' },
      { id: 'a3-9', name: 'Front crawl 50–100 m', category: 'Movement / Swimming Skills' },
      { id: 'a3-10', name: 'Back crawl 50–100 m', category: 'Movement / Swimming Skills' },
      { id: 'a3-11', name: 'Head-up front crawl 10–15 m', category: 'Movement / Swimming Skills' },
      { id: 'a3-12', name: 'Interval training: 4 x 50 m front or back crawl or breaststroke with 30 sec. rests', category: 'Fitness' },
      { id: 'a3-13', name: 'Sprint (25–50 m) front crawl, back crawl, or breaststroke', category: 'Fitness' },
      { id: 'a3-14', name: 'Workout 300 m', category: 'Fitness' },
      { id: 'a3-15', name: 'Water Smart messages', category: 'Water Smart Education' }
    ],
    'Fitness': [
      { id: 'fit-1', name: 'Continuous swimming (300 m)', category: 'Fitness' },
      { id: 'fit-2', name: 'Interval training (400 m)', category: 'Fitness' },
      { id: 'fit-3', name: 'Front crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'fit-4', name: 'Back crawl (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'fit-5', name: 'Breaststroke (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'fit-6', name: 'Elementary backstroke (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'fit-7', name: 'Individual medley (100 m)', category: 'Movement / Swimming Skills' },
      { id: 'fit-8', name: 'Tread water (5 min.)', category: 'Movement / Swimming Skills' },
      { id: 'fit-9', name: 'Water Smart messages', category: 'Water Smart Education' }
    ]
  };

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('swimTrackerData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setClasses(data.classes || []);
        setStudents(data.students || []);
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data = { classes, students };
    localStorage.setItem('swimTrackerData', JSON.stringify(data));
  }, [classes, students]);

  const validateTime = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const addClass = () => {
    setClassError('');
    
    if (newClass.name.trim() === '') {
      setClassError('Please enter a class name');
      return;
    }
    if (newClass.levels.length === 0) {
      setClassError('Please select at least one level');
      return;
    }
    if (newClass.time.trim() === '') {
      setClassError('Please enter a time');
      return;
    }
    if (!validateTime(newClass.time)) {
      setClassError('Please enter time in format HH:MM (e.g., 14:30)');
      return;
    }

    const classObj = {
      id: Date.now().toString(),
      ...newClass
    };
    setClasses([...classes, classObj]);
    setNewClass({ 
      name: '', 
      levels: [], 
      day: 'Monday', 
      time: '', 
      sessionLength: 8,
      year: new Date().getFullYear(), 
      season: 'Winter' 
    });
    setShowAddClassForm(false);
    setClassError('');
  };

  const deleteClass = (classId) => {
    setClasses(classes.filter(c => c.id !== classId));
    setStudents(students.filter(s => s.classId !== classId));
  };

  const startEditingClass = (classObj) => {
    setEditingClass({
      id: classObj.id,
      name: classObj.name,
      levels: [...classObj.levels],
      day: classObj.day,
      time: classObj.time,
      sessionLength: classObj.sessionLength || 8,
      year: classObj.year,
      season: classObj.season
    });
  };

  const saveEditClass = () => {
    setClassError('');
    
    if (editingClass.name.trim() === '') {
      setClassError('Please enter a class name');
      return;
    }
    if (editingClass.levels.length === 0) {
      setClassError('Please select at least one level');
      return;
    }
    if (editingClass.time.trim() === '') {
      setClassError('Please enter a time');
      return;
    }
    if (!validateTime(editingClass.time)) {
      setClassError('Please enter time in format HH:MM (e.g., 14:30)');
      return;
    }

    setClasses(classes.map(c => 
      c.id === editingClass.id ? editingClass : c
    ));
    setEditingClass(null);
    setClassError('');
  };

  const addStudent = () => {
    if (newStudent.name.trim() === '' || newStudent.classId === '' || newStudent.studentLevel === '') return;
    const studentObj = {
      id: Date.now().toString(),
      ...newStudent,
      progress: {}
    };
    setStudents([...students, studentObj]);
    setNewStudent({ name: '', classId: '', studentLevel: '', pronouns: 'they/them', generalComments: '' });
    setShowAddStudentForm(false);
  };

  const deleteStudent = (studentId) => {
    setStudents(students.filter(s => s.id !== studentId));
  };

  const startEditingStudent = (student) => {
    setEditingStudent({
      id: student.id,
      name: student.name,
      classId: student.classId,
      studentLevel: student.studentLevel,
      pronouns: student.pronouns,
      generalComments: student.generalComments || ''
    });
  };

  const saveEditStudent = () => {
    if (editingStudent.name.trim() === '' || editingStudent.studentLevel === '') return;
    setStudents(students.map(s => 
      s.id === editingStudent.id 
        ? { ...s, ...editingStudent }
        : s
    ));
    setEditingStudent(null);
  };

  const updateSkillProgress = (studentId, skillId, newStatus) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          progress: {
            ...student.progress,
            [skillId]: newStatus
          }
        };
      }
      return student;
    }));
  };

  const getStudentsByClass = (classId) => {
    return students.filter(s => s.classId === classId);
  };

  const openReportDialog = (studentId) => {
    setReportSettings({ ...reportSettings, studentId });
    setShowReportDialog(true);
    generatePrompt(studentId, reportSettings.wordLength, reportSettings.reportType);
    setShowingPrompt(true);
  };

  const generatePrompt = (studentId = reportSettings.studentId, wordLength = reportSettings.wordLength, reportType = reportSettings.reportType) => {
    if (!studentId) return;
    
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const classObj = classes.find(c => c.id === student.classId);
    const studentSkills = skillsByLevel[student.studentLevel] || [];
    
    const proficientSkills = studentSkills.filter(skill => 
      student.progress[skill.id] === 'proficient'
    );
    const practicingSkills = studentSkills.filter(skill => 
      student.progress[skill.id] === 'practicing'
    );
    const learningSkills = studentSkills.filter(skill => 
      student.progress[skill.id] === 'learning'
    );
    
    let prompt = `Write a swimming lesson progress report for ${student.name} (pronouns: ${student.pronouns}).\n\n`;
    prompt += `Class: ${classObj?.name || 'Unknown'}\n`;
    prompt += `Level: ${student.studentLevel}\n`;
    prompt += `Report Type: ${reportType === 'midterm' ? 'Mid-term Progress Report' : 'Final Report Card'}\n`;
    prompt += `Approximate Length: ${wordLength} words\n\n`;
    
    if (reportType === 'midterm') {
      prompt += `This is a mid-term progress report. Focus on:\n`;
      prompt += `- Current progress and effort\n`;
      prompt += `- Skills being developed\n`;
      prompt += `- Positive encouragement\n`;
      prompt += `- Areas to focus on for continued improvement\n\n`;
    } else {
      prompt += `This is a final report card. Focus on:\n`;
      prompt += `- Overall achievement and growth\n`;
      prompt += `- Skills mastered during the session\n`;
      prompt += `- Readiness for next level (if applicable)\n`;
      prompt += `- Celebration of accomplishments\n\n`;
    }
    
    if (proficientSkills.length > 0) {
      prompt += `Proficient Skills (Mastered):\n`;
      proficientSkills.forEach(skill => {
        prompt += `- ${skill.name}\n`;
      });
      prompt += `\n`;
    }
    
    if (practicingSkills.length > 0) {
      prompt += `Practicing Skills (Developing):\n`;
      practicingSkills.forEach(skill => {
        prompt += `- ${skill.name}\n`;
      });
      prompt += `\n`;
    }
    
    if (learningSkills.length > 0) {
      prompt += `Learning Skills (Beginning):\n`;
      learningSkills.forEach(skill => {
        prompt += `- ${skill.name}\n`;
      });
      prompt += `\n`;
    }
    
    prompt += `Please write the report in a warm, encouraging, professional tone appropriate for parents/guardians.\n`;
    prompt += `Use the student's pronouns correctly throughout.\n`;
    if (reportType === 'midterm') {
      prompt += `Focus on current progress and provide encouragement for continued development.`;
    } else {
      prompt += `Celebrate achievements and provide a comprehensive summary of their growth.`;
    }
    
    setGeneratedComment(prompt);
  };

  const generateActualComment = async () => {
    const apiKey = localStorage.getItem('claudeApiKey');
    if (!apiKey) {
      alert('Please add your Claude API key in the settings first!');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            { role: "user", content: generatedComment }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const comment = data.content[0].text;
      setGeneratedComment(comment);
      setShowingPrompt(false);
    } catch (error) {
      alert(`Error generating comment: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ classes, students }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `swim-tracker-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.classes && data.students) {
          setClasses(data.classes);
          setStudents(data.students);
          alert('Data loaded successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Error reading file: ' + error.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-3xl font-bold text-slate-800">Swim Student Tracker</h1>
          <p className="text-slate-500 mt-1 text-sm">RLSS Swim for Life Program</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowAddClassForm(!showAddClassForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add Class</span>
          </button>
          <button
            onClick={() => setShowAddStudentForm(!showAddStudentForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
          >
            <Users className="w-5 h-5" />
            <span>Add Student</span>
          </button>
        </div>

        {/* Add Class Form */}
        {showAddClassForm && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Add New Class</h2>
            {classError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {classError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Class Name</label>
                <input
                  type="text"
                  placeholder="e.g., Monday Morning"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Day</label>
                <select
                  value={newClass.day}
                  onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Time (HH:MM)</label>
                <input
                  type="text"
                  placeholder="14:30"
                  value={newClass.time}
                  onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Session Length (weeks)</label>
                <select
                  value={newClass.sessionLength}
                  onChange={(e) => setNewClass({ ...newClass, sessionLength: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="4">4 weeks</option>
                  <option value="5">5 weeks</option>
                  <option value="6">6 weeks</option>
                  <option value="7">7 weeks</option>
                  <option value="8">8 weeks</option>
                  <option value="9">9 weeks</option>
                  <option value="10">10 weeks</option>
                  <option value="11">11 weeks</option>
                  <option value="12">12 weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Year</label>
                <input
                  type="number"
                  value={newClass.year}
                  onChange={(e) => setNewClass({ ...newClass, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Season</label>
                <select
                  value={newClass.season}
                  onChange={(e) => setNewClass({ ...newClass, season: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {['Winter', 'Spring', 'Summer', 'Fall'].map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-3 text-slate-700">Levels in This Class</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {levels.map(level => (
                  <label key={level} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={newClass.levels.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewClass({ ...newClass, levels: [...newClass.levels, level] });
                        } else {
                          setNewClass({ ...newClass, levels: newClass.levels.filter(l => l !== level) });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={addClass}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Class
              </button>
              <button
                onClick={() => {
                  setShowAddClassForm(false);
                  setClassError('');
                }}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Student Form */}
        {showAddStudentForm && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Add New Student</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Student Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Class</label>
                <select
                  value={newStudent.classId}
                  onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Select class</option>
                  {classes.map(classObj => (
                    <option key={classObj.id} value={classObj.id}>
                      {classObj.name} - {classObj.day} {classObj.time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Student Level</label>
                <select
                  value={newStudent.studentLevel}
                  onChange={(e) => setNewStudent({ ...newStudent, studentLevel: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Select level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Pronouns</label>
                <select
                  value={newStudent.pronouns}
                  onChange={(e) => setNewStudent({ ...newStudent, pronouns: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="they/them">they/them</option>
                  <option value="she/her">she/her</option>
                  <option value="he/him">he/him</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-2 text-slate-700">General Comments</label>
              <textarea
                value={newStudent.generalComments}
                onChange={(e) => setNewStudent({ ...newStudent, generalComments: e.target.value })}
                placeholder="Add general notes about the student (e.g., goals, concerns, parent requests, medical info, etc.)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                rows="3"
              />
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={addStudent}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Student
              </button>
              <button
                onClick={() => setShowAddStudentForm(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Classes List */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-5">My Classes</h2>
          {classes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="text-slate-400 mb-3">
                <Users className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <p className="text-slate-500 text-lg">No classes yet</p>
              <p className="text-slate-400 text-sm mt-1">Click "Add Class" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map(classObj => {
                const classStudents = getStudentsByClass(classObj.id);
                return (
                  <div key={classObj.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5">
                      {editingClass?.id === classObj.id ? (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit Class</h3>
                          {classError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                              {classError}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-slate-700">Class Name</label>
                              <input
                                type="text"
                                value={editingClass.name}
                                onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-slate-700">Day</label>
                              <select
                                value={editingClass.day}
                                onChange={(e) => setEditingClass({ ...editingClass, day: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                  <option key={day} value={day}>{day}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-slate-700">Time (HH:MM)</label>
                              <input
                                type="text"
                                value={editingClass.time}
                                onChange={(e) => setEditingClass({ ...editingClass, time: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-slate-700">Session Length (weeks)</label>
                              <select
                                value={editingClass.sessionLength}
                                onChange={(e) => setEditingClass({ ...editingClass, sessionLength: parseInt(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              >
                                <option value="4">4 weeks</option>
                                <option value="5">5 weeks</option>
                                <option value="6">6 weeks</option>
                                <option value="7">7 weeks</option>
                                <option value="8">8 weeks</option>
                                <option value="9">9 weeks</option>
                                <option value="10">10 weeks</option>
                                <option value="11">11 weeks</option>
                                <option value="12">12 weeks</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-slate-700">Year</label>
                              <input
                                type="number"
                                value={editingClass.year}
                                onChange={(e) => setEditingClass({ ...editingClass, year: parseInt(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-slate-700">Season</label>
                              <select
                                value={editingClass.season}
                                onChange={(e) => setEditingClass({ ...editingClass, season: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              >
                                {['Winter', 'Spring', 'Summer', 'Fall'].map(season => (
                                  <option key={season} value={season}>{season}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium mb-3 text-slate-700">Levels in This Class</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                              {levels.map(level => (
                                <label key={level} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer transition">
                                  <input
                                    type="checkbox"
                                    checked={editingClass.levels.includes(level)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditingClass({ ...editingClass, levels: [...editingClass.levels, level] });
                                      } else {
                                        setEditingClass({ ...editingClass, levels: editingClass.levels.filter(l => l !== level) });
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-slate-700">{level}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                            <button
                              onClick={saveEditClass}
                              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                            >
                              <Save className="w-4 h-4" />
                              Save Changes
                            </button>
                            <button
                              onClick={() => {
                                setEditingClass(null);
                                setClassError('');
                              }}
                              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-800 mb-2">{classObj.name}</h3>
                              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">📅</span>
                                  {classObj.day}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {classObj.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">📊</span>
                                  {classObj.sessionLength || 8} week session
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">📚</span>
                                  {classObj.season} {classObj.year}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {classObj.levels.map(level => (
                                  <span key={level} className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                                    {level}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => startEditingClass(classObj)}
                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit class"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteClass(classObj.id)}
                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete class"
                              >
                                <X className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setExpandedClass(expandedClass === classObj.id ? null : classObj.id)}
                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              >
                                {expandedClass === classObj.id ? (
                                  <ChevronDown className="w-5 h-5" />
                                ) : (
                                  <ChevronRight className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {expandedClass === classObj.id && (
                            <div className="mt-6 pt-6 border-t border-slate-200">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-slate-800">Students</h4>
                                <span className="text-sm text-slate-500">{classStudents.length} student{classStudents.length !== 1 ? 's' : ''}</span>
                              </div>
                              {classStudents.length === 0 ? (
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                                  <p className="text-slate-500">No students in this class yet</p>
                                  <p className="text-slate-400 text-sm mt-1">Click "Add Student" to get started</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {classStudents.map(student => {
                                    const studentSkills = skillsByLevel[student.studentLevel] || [];
                                    const achievedCount = studentSkills.filter(skill => 
                                      student.progress[skill.id] === 'proficient'
                                    ).length;
                                    const totalSkills = studentSkills.length;
                                    const progressPercent = totalSkills > 0 ? Math.round((achievedCount / totalSkills) * 100) : 0;

                                    return (
                                      <div key={student.id} className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                                        <div className="p-4">
                                          {editingStudent?.id === student.id ? (
                                            <div>
                                              <h4 className="text-base font-semibold text-slate-800 mb-3">Edit Student</h4>
                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                  <label className="block text-sm font-medium mb-2 text-slate-700">Name</label>
                                                  <input
                                                    type="text"
                                                    value={editingStudent.name}
                                                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-sm font-medium mb-2 text-slate-700">Level</label>
                                                  <select
                                                    value={editingStudent.studentLevel}
                                                    onChange={(e) => setEditingStudent({ ...editingStudent, studentLevel: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                                                  >
                                                    {levels.map(level => (
                                                      <option key={level} value={level}>{level}</option>
                                                    ))}
                                                  </select>
                                                </div>
                                                <div>
                                                  <label className="block text-sm font-medium mb-2 text-slate-700">Pronouns</label>
                                                  <select
                                                    value={editingStudent.pronouns}
                                                    onChange={(e) => setEditingStudent({ ...editingStudent, pronouns: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                                                  >
                                                    <option value="they/them">they/them</option>
                                                    <option value="she/her">she/her</option>
                                                    <option value="he/him">he/him</option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div className="mt-4">
                                                <label className="block text-sm font-medium mb-2 text-slate-700">General Comments</label>
                                                <textarea
                                                  value={editingStudent.generalComments || ''}
                                                  onChange={(e) => setEditingStudent({ ...editingStudent, generalComments: e.target.value })}
                                                  placeholder="Add general notes about the student..."
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none text-sm"
                                                  rows="3"
                                                />
                                              </div>
                                              <div className="flex gap-3 mt-4">
                                                <button
                                                  onClick={saveEditStudent}
                                                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition text-sm"
                                                >
                                                  <Save className="w-4 h-4" />
                                                  Save
                                                </button>
                                                <button
                                                  onClick={() => setEditingStudent(null)}
                                                  className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition text-sm"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div>
                                              <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                  <h4 className="text-lg font-semibold text-slate-800">{student.name}</h4>
                                                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-slate-600">
                                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 font-medium">
                                                      {student.studentLevel}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                                                      {student.pronouns}
                                                    </span>
                                                  </div>
                                                  <div className="mt-3">
                                                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                                                      <span>Progress</span>
                                                      <span className="font-medium">{achievedCount}/{totalSkills} ({progressPercent}%)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                      <div 
                                                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                                        style={{ width: `${progressPercent}%` }}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="mt-3">
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">General Comments:</label>
                                                    <textarea
                                                      value={student.generalComments || ''}
                                                      onChange={(e) => {
                                                        setStudents(students.map(s => {
                                                          if (s.id === student.id) {
                                                            return {
                                                              ...s,
                                                              generalComments: e.target.value
                                                            };
                                                          }
                                                          return s;
                                                        }));
                                                      }}
                                                      placeholder="Add general notes about this student..."
                                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none bg-white"
                                                      rows="3"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                  <button
                                                    onClick={() => startEditingStudent(student)}
                                                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                    title="Edit student"
                                                  >
                                                    <Edit2 className="w-4 h-4" />
                                                  </button>
                                                  <button
                                                    onClick={() => deleteStudent(student.id)}
                                                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete student"
                                                  >
                                                    <X className="w-4 h-4" />
                                                  </button>
                                                  <button
                                                    onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                                                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                                                  >
                                                    {expandedStudent === student.id ? (
                                                      <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                      <ChevronRight className="w-4 h-4" />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>

                                              {expandedStudent === student.id && (
                                                <div className="mt-5 pt-5 border-t border-slate-300">
                                                  <h5 className="text-base font-semibold text-slate-800 mb-4">Skills Progress</h5>
                                                  {studentSkills.length === 0 ? (
                                                    <p className="text-slate-500 text-sm">No skills available for this level</p>
                                                  ) : (
                                                    <div className="space-y-4">
                                                      {Object.entries(
                                                        studentSkills.reduce((acc, skill) => {
                                                          if (!acc[skill.category]) acc[skill.category] = [];
                                                          acc[skill.category].push(skill);
                                                          return acc;
                                                        }, {})
                                                      ).map(([category, skills]) => (
                                                        <div key={category}>
                                                          <h6 className="text-sm font-semibold text-slate-700 mb-2">{category}</h6>
                                                          <div className="space-y-3">
                                                            {skills.map(skill => {
                                                              const currentStatus = student.progress[skill.id] || 'not-started';
                                                              const currentComment = student.progress[`${skill.id}_comment`] || '';
                                                              return (
                                                                <div key={skill.id} className="p-3 bg-white rounded-lg border border-slate-200">
                                                                  <div className="flex items-center gap-3 mb-2">
                                                                    <span className="flex-1 text-sm font-medium text-slate-700">{skill.name}</span>
                                                                    <select
                                                                      value={currentStatus}
                                                                      onChange={(e) => updateSkillProgress(student.id, skill.id, e.target.value)}
                                                                      className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                                    >
                                                                      <option value="not-started">Not Started</option>
                                                                      <option value="learning">Learning</option>
                                                                      <option value="practicing">Practicing</option>
                                                                      <option value="proficient">Proficient</option>
                                                                    </select>
                                                                  </div>
                                                                  <textarea
                                                                    value={currentComment}
                                                                    onChange={(e) => {
                                                                      setStudents(students.map(s => {
                                                                        if (s.id === student.id) {
                                                                          return {
                                                                            ...s,
                                                                            progress: {
                                                                              ...s.progress,
                                                                              [`${skill.id}_comment`]: e.target.value
                                                                            }
                                                                          };
                                                                        }
                                                                        return s;
                                                                      }));
                                                                    }}
                                                                    placeholder="Add notes or comments about this skill..."
                                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                                                    rows="2"
                                                                  />
                                                                </div>
                                                              );
                                                            })}
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                  <div className="mt-6 pt-5 border-t border-slate-300">
                                                    <button
                                                      onClick={() => openReportDialog(student.id)}
                                                      className="w-full px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow-md"
                                                    >
                                                      Generate Report Card Comment
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={exportData}
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-md hover:shadow-lg"
          >
            SAVE
          </button>
          <label className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition shadow-md hover:shadow-lg cursor-pointer">
            Load Classes
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Report Card Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Generate Report Card Comment</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Report Type</label>
                <select
                  value={reportSettings.reportType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setReportSettings({ ...reportSettings, reportType: newType });
                    generatePrompt(reportSettings.studentId, reportSettings.wordLength, newType);
                  }}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="midterm">Midterm Report</option>
                  <option value="final">Final Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Approximate Word Length</label>
                <input
                  type="number"
                  value={reportSettings.wordLength}
                  onChange={(e) => {
                    const newLength = parseInt(e.target.value) || 100;
                    setReportSettings({ ...reportSettings, wordLength: newLength });
                    generatePrompt(reportSettings.studentId, newLength, reportSettings.reportType);
                  }}
                  min="50"
                  max="500"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {generatedComment && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  {showingPrompt ? 'Generated Prompt' : 'Generated Comment'}
                </label>
                <textarea
                  value={generatedComment}
                  onChange={(e) => setGeneratedComment(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  rows="15"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedComment);
                    alert(showingPrompt ? 'Prompt copied to clipboard!' : 'Comment copied to clipboard!');
                  }}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-sm"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              {showingPrompt ? (
                <button
                  onClick={generateActualComment}
                  disabled={isGenerating}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:bg-slate-400 shadow-sm"
                >
                  {isGenerating ? 'Generating...' : 'Generate Comment'}
                </button>
              ) : (
                <button
                  onClick={() => generatePrompt()}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-sm"
                >
                  Regenerate Prompt
                </button>
              )}
              <button
                onClick={() => setShowReportDialog(false)}
                className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SwimTracker />);
