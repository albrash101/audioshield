const baseDictionary = {
  "wahala": "trouble",
  "chop": "eat",
  "oga": "boss",
  "pikin": "child",
  "dey": "is/are",
  "na": "is",
  "abi": "right?",
  "madam": "lady",
  "palava": "problem",
  "mugu": "victim",
  "hwfa": "how far",
  "bros": "brother",
  "sis": "sister",
  "naija": "Nigeria",
  "sef": "even",
  "fit": "can",
  "go-slow": "traffic jam",
  "gist": "chat",
  "yarn": "talk",
  "dash": "give for free",
  "waka": "walk/go",
  "biko": "please",
  "oya": "come on/let’s go",
  "shakara": "showing off",
  "gbese": "debt",
  "japa": "run away",
  "ajebo": "rich kid",
  "ajepako": "street kid",
  "wah": "wow",
  "no wahala": "no problem",
  "jollof": "popular West African rice dish",
  "agbada": "traditional flowing robe",
  "programme": "British/Nigerian spelling of 'program', used in academic contexts",
  "matriculation": "Formal ceremony admitting students to university",
  "convocation": "Graduation ceremony in Nigerian universities",
  "carry-over": "Repeating a failed course in Nigerian universities",
  "first class honours": "Highest undergraduate degree classification",
  "second class upper": "Second highest undergraduate degree classification",
  "second class lower": "Third undergraduate degree classification",
  "third class": "Lowest undergraduate degree classification before pass",
  "pass degree": "Awarded to students who barely meet graduation requirements",
  "faculty": "Academic division within a university",
  "department": "Sub-unit of a faculty, focused on a specific discipline",
  "lecturer": "University teaching staff",
  "semester": "Half of an academic year",
  "session": "Full academic year in Nigerian universities",
  "exam malpractice": "Cheating during examinations",
  "continuous assessment": "Ongoing evaluation of students during a semester",
  "GPA": "Grade Point Average, measure of student performance",
  "CGPA": "Cumulative Grade Point Average across semesters",
  "JAMB": "Joint Admissions and Matriculation Board, entrance exam body",
  "UTME": "Unified Tertiary Matriculation Examination, entrance exam",
  "post-UTME": "Screening test after UTME for university admission",
  "strike": "Industrial action by lecturers or staff",
  "ASUU": "Academic Staff Union of Universities",
  "NYSC": "National Youth Service Corps, post-graduation service year",
  "VC": "Vice-Chancellor, head of a university",
  "registrar": "University official responsible for records",
  "bursar": "University official responsible for finances",
  "provost": "Head of a college within a university",
  "HND": "Higher National Diploma",
  "ND": "National Diploma",
  "PGD": "Postgraduate Diploma",
  "MSc": "Master of Science degree",
  "PhD": "Doctor of Philosophy degree",
  "thesis": "Formal research document for postgraduate degrees",
  "dissertation": "Formal research document, often for master's degrees",
  "course registration": "Process of enrolling in courses",
  "exam officer": "Lecturer in charge of exam coordination",
  "exam script": "Written answer booklet for exams",
  "exam hall": "Venue for examinations",
  "invigilator": "Person supervising exams",
  "result compilation": "Process of collating student grades",
  "academic probation": "Status for students with poor performance",
  "expulsion": "Permanent removal from university",
  "rustication": "Temporary suspension from university",
  "orientation": "Introductory programme for new students",
  "lecture theatre": "Large hall for teaching",
  "tutorial": "Small group teaching session",
  "handout": "Printed material given to students",
  "syllabus": "Outline of topics for a course",
  "curriculum": "Overall academic plan",
  "course outline": "Detailed plan for a specific course",
  "exam timetable": "Schedule of examinations",
  "lecture timetable": "Schedule of lectures",
  "academic calendar": "Official schedule of academic activities",
  "library card": "Card granting access to university library",
  "fellowship": "Award for postgraduate study/research",
  "sabbatical": "Leave for lecturers to research/teach elsewhere",
  "promotion": "Advancement in academic rank",
  "tenure": "Permanent academic appointment"
};

const statesAndCapitals = {
  "Abia": "Umuahia",
  "Adamawa": "Yola",
  "Akwa Ibom": "Uyo",
  "Anambra": "Awka",
  "Bauchi": "Bauchi",
  "Bayelsa": "Yenagoa",
  "Benue": "Makurdi",
  "Borno": "Maiduguri",
  "Cross River": "Calabar",
  "Delta": "Asaba",
  "Ebonyi": "Abakaliki",
  "Edo": "Benin City",
  "Ekiti": "Ado-Ekiti",
  "Enugu": "Enugu",
  "FCT": "Abuja",
  "Gombe": "Gombe",
  "Imo": "Owerri",
  "Jigawa": "Dutse",
  "Kaduna": "Kaduna",
  "Kano": "Kano",
  "Katsina": "Katsina",
  "Kebbi": "Birnin Kebbi",
  "Kogi": "Lokoja",
  "Kwara": "Ilorin",
  "Lagos": "Ikeja",
  "Nasarawa": "Lafia",
  "Niger": "Minna",
  "Ogun": "Abeokuta",
  "Ondo": "Akure",
  "Osun": "Osogbo",
  "Oyo": "Ibadan",
  "Plateau": "Jos",
  "Rivers": "Port Harcourt",
  "Sokoto": "Sokoto",
  "Taraba": "Jalingo",
  "Yobe": "Damaturu",
  "Zamfara": "Gusau"
};

const tribes = [
  "Hausa",
  "Yoruba",
  "Igbo",
  "Fulani",
  "Tiv",
  "Kanuri",
  "Ibibio",
  "Edo",
  "Nupe",
  "Urhobo",
  "Itsekiri",
  "Ijaw",
  "Gbagyi",
  "Idoma",
  "Igala",
  "Efik",
  "Annang",
  "Isoko",
  "Berom",
  "Ikwere",
  "Ogoni"
];

const foods = [
  "jollof rice",
  "suya",
  "kilishi",
  "akara",
  "moi moi",
  "egusi soup",
  "ogbono soup",
  "banga soup",
  "ewedu",
  "amala",
  "pounded yam",
  "garri",
  "fufu",
  "tuwo shinkafa",
  "tuwo masara",
  "pepper soup",
  "ofada rice",
  "beans porridge",
  "nkwobi",
  "isi ewu",
  "abacha",
  "okpa",
  "bole",
  "zobo",
  "kunu",
  "puff puff",
  "afang soup",
  "edikaikong",
  "miyan kuka",
  "masa"
];

const extraVocabulary = {
  "danfo": "yellow Lagos bus",
  "okada": "motorcycle taxi",
  "keke": "tricycle taxi",
  "area boy": "street tout",
  "NEPA": "electricity authority slang",
  "light no dey": "power outage",
  "bariga": "Lagos neighborhood",
  "obaniko": "market slang",
  "kpali": "certificate",
  "tokunbo": "foreign-used item",
  "no gree for anybody": "don’t let anyone push you around",
  "gba gbe": "carry it",
  "ehen": "interjection of realization",
  "sha": "emphasis particle",
  "na so": "that’s how it is",
  "I swear": "strong affirmation",
  "sharp sharp": "quickly",
  "maga": "gullible person",
  "agbada": "flowing robe",
  "buba": "loose top",
  "gele": "head tie"
};

Object.entries(statesAndCapitals).forEach(([state, capital]) => {
  baseDictionary[state] = `Capital: ${capital}`;
});
tribes.forEach((t) => {
  baseDictionary[t] = "Nigerian ethnic group";
});
foods.forEach((f) => {
  baseDictionary[f] = "Nigerian food";
});
Object.entries(extraVocabulary).forEach(([term, meaning]) => {
  baseDictionary[term] = meaning;
});

const hausaNames = [
  "Amina","Usman","Sani","Bala","Zainab","Kabiru","Abubakar","Musa","Halima","Maryam",
  "Yusuf","Abdulrahman","Sa'adatu","Hajara","Umar","Faruk","Nafisa","Salihu","Fatima","Habiba"
];
const yorubaNames = [
  "Ade","Adeola","Adebayo","Adenike","Ayodele","Oluwaseun","Tolulope","Funke","Bamidele","Olabode",
  "Olamide","Yewande","Segun","Taiwo","Kehinde","Temitope","Folake","Bukola","Sade","Femi"
];
const igboNames = [
  "Chinedu","Chukwuemeka","Nkechi","Chiamaka","Ifunanya","Obinna","Amaka","Chika","Ngozi","Uche",
  "Nnamdi","Ifeanyi","Onyeka","Kelechi","Chibuzo","Adaeze","Ogechi","Chisom","Somtochukwu","Ebuka"
];
hausaNames.forEach((n) => { baseDictionary[n] = "Hausa name"; });
yorubaNames.forEach((n) => { baseDictionary[n] = "Yoruba name"; });
igboNames.forEach((n) => { baseDictionary[n] = "Igbo name"; });

const terms = Object.keys(baseDictionary);

export const NigerianDictionary = {
  terms,
  entries: baseDictionary
};
