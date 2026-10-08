export interface JobRole {
  id: string;
  title: string;
  shortTagline: string;
  category: 
    | 'Software & Web' 
    | 'Data & AI' 
    | 'Cybersecurity' 
    | 'Cloud & Infrastructure' 
    | 'Hardware & Robotics' 
    | 'Blockchain & Emerging' 
    | 'Product, Design & Support';
  iconName: string;
  whatIsThisJob: string;
  everydayActivities: string[];
  skillsNeeded: string[];
  technologiesUsed: string[];
  whatToLearn: string[];
  realWorldExample: string;
  careerGrowth: string[];
  relatedAlgoriseTopics: { label: string; tab: string; extraId?: string }[];
}

export const jobRolesCategories = [
  'All',
  'Software & Web',
  'Data & AI',
  'Cybersecurity',
  'Cloud & Infrastructure',
  'Hardware & Robotics',
  'Blockchain & Emerging',
  'Product, Design & Support'
];

export const jobRolesData: JobRole[] = [
  // ==========================================
  // 1. SOFTWARE & WEB DEVELOPMENT (1-7)
  // ==========================================
  {
    id: 'software-developer',
    title: 'Software Developer',
    shortTagline: 'The Digital Toy Builder',
    category: 'Software & Web',
    iconName: 'Code',
    whatIsThisJob: 'A Software Developer is like a digital Lego master! They write special instructions (called code) that tell computers, phones, and gadgets what to do.',
    everydayActivities: [
      'Writes code instructions to build new features on computers',
      'Fixes small computer hiccups (called bugs) when things do not work right',
      'Talks with teammates to plan what fun digital tools to build next',
      'Tests programs to make sure they run super fast and smooth'
    ],
    skillsNeeded: ['Logical Thinking', 'Creative Problem Solving', 'Patience & Persistence', 'Curiosity'],
    technologiesUsed: ['Python', 'Java', 'C++', 'VS Code', 'Git'],
    whatToLearn: [
      '1. Pick your first programming language (like Python or JavaScript)',
      '2. Learn basic rules like variables, loops, and functions',
      '3. Build a simple project like a digital calculator or quiz game',
      '4. Learn how to store and clean up computer data'
    ],
    realWorldExample: 'Think of a microwave at home. When you push the "30 Seconds" button to warm up milk, a Software Developer wrote the instructions that tell the microwave to spin and heat for exactly 30 seconds!',
    careerGrowth: ['Junior Builder (Beginner)', 'Software Developer (Mid-Level)', 'Senior Architect (Master)', 'Chief Technology Officer (Leader)'],
    relatedAlgoriseTopics: [
      { label: 'Programming Foundations', tab: 'learn' },
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Two Sum Problem', tab: 'problem_detail', extraId: 'two-sum' }
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    shortTagline: 'The Painter of Computer Screens',
    category: 'Software & Web',
    iconName: 'Layout',
    whatIsThisJob: 'A Frontend Developer builds everything you can see, tap, and click on your computer or phone screen — like shiny buttons, colorful pictures, and fun animations!',
    everydayActivities: [
      'Paints web pages using computer colors, fonts, and layouts',
      'Makes buttons react smoothly when you click or tap on them',
      'Makes sure websites look awesome on big TV screens and tiny phone screens',
      'Connects the screen design to secret backend data engines'
    ],
    skillsNeeded: ['Eye for Pretty Colors & Designs', 'User Empathy', 'Attention to Detail', 'Teamwork'],
    technologiesUsed: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
    whatToLearn: [
      '1. Learn HTML to build the bones of a web page',
      '2. Learn CSS to add colors, fonts, and cool layouts',
      '3. Learn JavaScript to make buttons move and react',
      '4. Master a framework like React to build big websites easily'
    ],
    realWorldExample: 'Imagine a toy store. The Frontend Developer decorates the front window, paints the walls bright colors, and sets up signs so kids can easily find their favorite toys!',
    careerGrowth: ['Junior Frontend Developer', 'Senior UI Engineer', 'Frontend Architect', 'Director of Web Experience'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Web Development', tab: 'interview' }
    ]
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    shortTagline: 'The Secret Kitchen Engine Manager',
    category: 'Software & Web',
    iconName: 'Server',
    whatIsThisJob: 'A Backend Developer works behind the scenes! They build the hidden engines, vaults, and power grids that keep apps running safely without anyone seeing them.',
    everydayActivities: [
      'Builds hidden computer engines that process requests',
      'Stores user passwords and high scores in safe digital vaults (databases)',
      'Makes sure the server can handle millions of users without crashing',
      'Locks down secret data so internet pirates cannot steal it'
    ],
    skillsNeeded: ['Deep Logic', 'Data Organization', 'Security Awareness', 'Problem Solving'],
    technologiesUsed: ['Node.js', 'Python', 'Java', 'SQL', 'PostgreSQL', 'Docker'],
    whatToLearn: [
      '1. Master a backend language like Node.js or Python',
      '2. Learn SQL to talk to databases and save information',
      '3. Learn how to build APIs that send data to phone screens',
      '4. Practice keeping data secret and safe'
    ],
    realWorldExample: 'When you order a pizza online, the screen shows photos of pizza (Frontend), but the Backend Developer built the secret computer system that tells the kitchen oven what toppings to bake and keeps your payment safe!',
    careerGrowth: ['Junior Backend Coder', 'Backend Engineer', 'Systems Architect', 'Principal Systems Engineer'],
    relatedAlgoriseTopics: [
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'Stacks & Queues', tab: 'learn' },
      { label: 'DBMS & SQL', tab: 'interview' }
    ]
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    shortTagline: 'The All-Round Master Builder',
    category: 'Software & Web',
    iconName: 'Layers',
    whatIsThisJob: 'A Full Stack Developer can do it ALL! They know how to build both the pretty front screen and the hidden backend engine underneath.',
    everydayActivities: [
      'Draws interactive screens for users to click on',
      'Connects screens to hidden database vaults',
      'Fixes bugs on both the front and back of software apps',
      'Builds complete websites from scratch all by themselves'
    ],
    skillsNeeded: ['Versatility', 'Big-Picture Thinking', 'Fast Learning', 'Adaptability'],
    technologiesUsed: ['JavaScript/TypeScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    whatToLearn: [
      '1. Start with frontend basics (HTML, CSS, JavaScript)',
      '2. Learn backend servers (Node.js & Express)',
      '3. Learn database management (MongoDB or SQL)',
      '4. Connect both sides into one complete application'
    ],
    realWorldExample: 'Like a restaurant chef who designs the menu, paints the dining room walls, AND cooks the delicious meals in the kitchen all by themselves!',
    careerGrowth: ['Full Stack Developer', 'Senior Full Stack Specialist', 'Tech Lead', 'Startup Founder / Chief Engineer'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Hashing', tab: 'learn' },
      { label: 'Web Development', tab: 'interview' }
    ]
  },
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer',
    shortTagline: 'The Pocket Gadget Creator',
    category: 'Software & Web',
    iconName: 'Smartphone',
    whatIsThisJob: 'A Mobile App Developer makes cool games, tools, and social apps specifically designed for small touchscreen phones and tablets!',
    everydayActivities: [
      'Codes buttons and swipes for phone touchscreens',
      'Connects phone features like the camera, GPS, and flashlight',
      'Makes sure apps do not drain your phone battery quickly',
      'Publishes completed apps on the Apple App Store or Google Play Store'
    ],
    skillsNeeded: ['Touch Interaction Sense', 'Performance Awareness', 'Creativity'],
    technologiesUsed: ['Flutter', 'React Native', 'Swift (iOS)', 'Kotlin (Android)'],
    whatToLearn: [
      '1. Pick a mobile path (Swift for iPhone or Kotlin for Android)',
      '2. Learn screen layouts and touchscreen gestures',
      '3. Learn how to fetch data from web servers',
      '4. Build and publish your first phone app'
    ],
    realWorldExample: 'Building a map app on your smartphone that uses your phone’s GPS to show you where the nearest ice cream truck is driving right now!',
    careerGrowth: ['Junior Mobile Developer', 'Mobile App Engineer', 'Senior Mobile Architect', 'Head of Mobile Products'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Stacks & Queues', tab: 'learn' }
    ]
  },
  {
    id: 'game-developer',
    title: 'Game Developer',
    shortTagline: 'The World Creator & Fun Maker',
    category: 'Software & Web',
    iconName: 'Gamepad',
    whatIsThisJob: 'A Game Developer builds interactive 2D and 3D digital worlds where players can run, jump, solve puzzles, and go on grand adventures!',
    everydayActivities: [
      'Codes character gravity physics so heroes jump high',
      'Writes instructions for computer monsters and enemies',
      'Builds fun levels, mazes, and obstacle courses',
      'Fixes bugs so characters do not fall through the floor!'
    ],
    skillsNeeded: ['Creativity', '3D Math Thinking', 'Fun Gameplay Sense', 'Perseverance'],
    technologiesUsed: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Blender'],
    whatToLearn: [
      '1. Learn C# or C++ programming',
      '2. Download a game engine like Unity or Unreal Engine',
      '3. Learn basic physics math (speed, jumping, collision)',
      '4. Make your first simple 2D platformer game'
    ],
    realWorldExample: 'Coding Mario so when you press the "Jump" button on your controller, Mario leaps into the air and lands right on top of a rolling turtle shell!',
    careerGrowth: ['Game Programmer', 'Senior Game Developer', 'Lead Game Designer', 'Creative Studio Director'],
    relatedAlgoriseTopics: [
      { label: 'Recursion', tab: 'learn' },
      { label: 'Trees & BST', tab: 'learn' },
      { label: 'Graphs & Networks', tab: 'learn' }
    ]
  },
  {
    id: 'web-developer',
    title: 'Web Developer',
    shortTagline: 'The Website Construction Expert',
    category: 'Software & Web',
    iconName: 'Globe',
    whatIsThisJob: 'A Web Developer builds, formats, and maintains websites on the internet so people around the world can open them in web browsers like Chrome or Safari!',
    everydayActivities: [
      'Creates web page layouts and navigation menus',
      'Ensures websites load fast and look great on laptops and tablets',
      'Connects websites to web forms, shopping carts, and databases',
      'Fixes broken website links and security certificates'
    ],
    skillsNeeded: ['Web Fundamentals', 'Design Sensitivity', 'Debugging Skill'],
    technologiesUsed: ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'React'],
    whatToLearn: [
      '1. Learn HTML structure and tags',
      '2. Master CSS layout styling',
      '3. Learn JavaScript DOM manipulation',
      '4. Learn web hosting and deployment'
    ],
    realWorldExample: 'Building the official website for a school so parents can check lunch menus, holiday calendars, and teacher announcements anytime online!',
    careerGrowth: ['Junior Web Developer', 'Web Developer', 'Lead Web Architect', 'Digital Agency Director'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Web Development', tab: 'interview' }
    ]
  },

  // ==========================================
  // 2. DATA, AI & MACHINE LEARNING (8-18)
  // ==========================================
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    shortTagline: 'The Detective of Numbers',
    category: 'Data & AI',
    iconName: 'BarChart',
    whatIsThisJob: 'A Data Analyst is like a detective who looks at piles of numbers and pictures to find secret clues and help people make smart choices!',
    everydayActivities: [
      'Gathers piles of data numbers from databases',
      'Cleans up messy information tables so they make sense',
      'Draws colorful pie charts and bar graphs',
      'Tells simple stories using numbers to help bosses make decisions'
    ],
    skillsNeeded: ['Curiosity', 'Pattern Spotting', 'Storytelling', 'Attention to Detail'],
    technologiesUsed: ['Excel', 'SQL', 'Python', 'Tableau', 'Power BI'],
    whatToLearn: [
      '1. Learn how to organize data tables in Excel',
      '2. Master SQL queries to find specific answers in databases',
      '3. Learn chart-making tools like Tableau or Power BI',
      '4. Learn basic Python for processing numbers'
    ],
    realWorldExample: 'Counting which ice cream flavor kids bought the most this summer so the shop owner knows to buy extra chocolate next week!',
    careerGrowth: ['Junior Analyst', 'Data Analyst', 'Senior Business Intelligence Lead', 'Chief Data Officer'],
    relatedAlgoriseTopics: [
      { label: 'Searching & Sorting', tab: 'learn' },
      { label: 'DBMS & SQL', tab: 'interview' }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    shortTagline: 'The Wizard of Future Predictions',
    category: 'Data & AI',
    iconName: 'Brain',
    whatIsThisJob: 'A Data Scientist uses math spells and computer formulas to look at huge piles of data and guess what will happen in the future!',
    everydayActivities: [
      'Writes smart math formulas to spot hidden trends',
      'Teaches computer models to guess future habits',
      'Runs experiments with huge data sets',
      'Explains scientific findings to company leaders'
    ],
    skillsNeeded: ['Advanced Math & Statistics', 'Scientific Mindset', 'Curiosity', 'Coding Skill'],
    technologiesUsed: ['Python', 'R', 'Pandas', 'Scikit-Learn', 'Jupyter Notebooks'],
    whatToLearn: [
      '1. Learn Python programming and data libraries',
      '2. Study math statistics and averages',
      '3. Learn machine learning prediction models',
      '4. Practice working with real-world big datasets'
    ],
    realWorldExample: 'Looking at 10 years of weather numbers to predict if it will rain on your birthday party next month!',
    careerGrowth: ['Data Scientist', 'Senior Machine Learning Scientist', 'Principal Data Scientist', 'Head of AI Research'],
    relatedAlgoriseTopics: [
      { label: 'Searching & Sorting', tab: 'learn' },
      { label: 'Recursion', tab: 'learn' },
      { label: 'AI/ML Basics', tab: 'interview' }
    ]
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    shortTagline: 'The High-Speed Data Highway Builder',
    category: 'Data & AI',
    iconName: 'Database',
    whatIsThisJob: 'A Data Engineer builds giant digital pipes and waterworks that move millions of data points smoothly from raw sources into clean database lakes!',
    everydayActivities: [
      'Constructs automated data pipelines (ETL flows)',
      'Cleans and organizes massive streams of incoming data',
      'Ensures database lakes never overflow or slow down',
      'Provides clean data pipes for Data Scientists to use'
    ],
    skillsNeeded: ['Systems Plumbing', 'Data Structuring', 'Efficiency', 'SQL Mastery'],
    technologiesUsed: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Snowflake', 'Airflow'],
    whatToLearn: [
      '1. Master SQL and database design',
      '2. Learn Python data manipulation',
      '3. Learn Big Data processing tools like Spark',
      '4. Build automated data pipeline workflows'
    ],
    realWorldExample: 'Building a giant pipeline system that collects every swipe from 5 million metro train cards in a city and stores them safely in a central vault every minute!',
    careerGrowth: ['Data Engineer', 'Senior Data Pipeline Architect', 'Principal Data Engineer', 'VP of Data Platform'],
    relatedAlgoriseTopics: [
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'DBMS & SQL', tab: 'interview' }
    ]
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    shortTagline: 'The Artificial Brain Creator',
    category: 'Data & AI',
    iconName: 'Cpu',
    whatIsThisJob: 'An AI Engineer connects smart artificial intelligence models (like ChatGPT or image generators) into software apps so computers can talk, write, and see!',
    everydayActivities: [
      'Connects AI models to real-world software applications',
      'Writes prompts and fine-tunes AI responses',
      'Builds smart chatbots, voice assistants, and recommendation systems',
      'Monitors AI models so they provide safe, accurate answers'
    ],
    skillsNeeded: ['AI Integration', 'Prompt Engineering', 'API Usage', 'Problem Solving'],
    technologiesUsed: ['Python', 'OpenAI API', 'LangChain', 'LlamaIndex', 'Vector Databases'],
    whatToLearn: [
      '1. Learn Python coding basics',
      '2. Understand how Large Language Models (LLMs) work',
      '3. Learn vector databases for AI searching',
      '4. Build AI agents that can perform tasks'
    ],
    realWorldExample: 'Building a smart customer helper bot on a shopping site that answers customer questions instantly in 50 languages!',
    careerGrowth: ['AI Engineer', 'Senior AI Systems Lead', 'AI Solutions Architect', 'Chief AI Officer'],
    relatedAlgoriseTopics: [
      { label: 'Trees & BST', tab: 'learn' },
      { label: 'AI/ML & Data Science', tab: 'interview' }
    ]
  },
  {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    shortTagline: 'The Computer Trainer & Coach',
    category: 'Data & AI',
    iconName: 'Brain',
    whatIsThisJob: 'A Machine Learning Engineer trains computer algorithms on data examples so the software learns how to recognize patterns and make predictions automatically!',
    everydayActivities: [
      'Feeds training data into learning algorithms',
      'Tunes model knobs (hyperparameters) to improve accuracy',
      'Packages trained ML models into production servers',
      'Monitors models to make sure they stay accurate over time'
    ],
    skillsNeeded: ['Algorithm Tuning', 'Applied Math', 'Software Engineering', 'Experimentation'],
    technologiesUsed: ['Python', 'Scikit-Learn', 'PyTorch', 'TensorFlow', 'MLflow'],
    whatToLearn: [
      '1. Master Python and numerical libraries (NumPy, Pandas)',
      '2. Study core ML algorithms (Regression, Decision Trees)',
      '3. Learn model training and validation techniques',
      '4. Practice deploying ML models to servers'
    ],
    realWorldExample: 'Training a spam filter to inspect incoming emails and automatically move junk scam letters straight into the trash folder!',
    careerGrowth: ['Junior ML Engineer', 'ML Engineer', 'Senior ML Specialist', 'Head of Machine Learning'],
    relatedAlgoriseTopics: [
      { label: 'Trees & BST', tab: 'learn' },
      { label: 'Graphs & Networks', tab: 'learn' },
      { label: 'AI/ML Basics', tab: 'interview' }
    ]
  },
  {
    id: 'deep-learning-engineer',
    title: 'Deep Learning Engineer',
    shortTagline: 'The Deep Neural Network Sculptor',
    category: 'Data & AI',
    iconName: 'Cpu',
    whatIsThisJob: 'A Deep Learning Engineer builds massive artificial neural networks inspired by the human brain to solve super complex tasks like self-driving cars and voice recognition!',
    everydayActivities: [
      'Designs multi-layered deep neural network architectures',
      'Trains huge models on thousands of GPU graphics cards',
      'Optimizes neural weights using backpropagation calculus',
      'Pushes the boundaries of computer perception'
    ],
    skillsNeeded: ['Deep Neural Math', 'GPU Hardware Understanding', 'High Math', 'Persistence'],
    technologiesUsed: ['PyTorch', 'TensorFlow', 'CUDA', 'Python', 'Keras'],
    whatToLearn: [
      '1. Learn deep learning math (calculus & linear algebra)',
      '2. Understand neural network layers (Convolutional, Recurrent)',
      '3. Train deep networks using PyTorch or TensorFlow',
      '4. Optimize GPU hardware processing speed'
    ],
    realWorldExample: 'Building the neural vision brain inside a self-driving electric car so it can instantly spot pedestrians, traffic lights, and stop signs while driving!',
    careerGrowth: ['Deep Learning Researcher', 'Senior DL Specialist', 'Principal Neural Engineer', 'Director of Deep Learning'],
    relatedAlgoriseTopics: [
      { label: 'Graphs & Networks', tab: 'learn' },
      { label: 'AI/ML & Data Science', tab: 'interview' }
    ]
  },
  {
    id: 'nlp-engineer',
    title: 'NLP Engineer (Natural Language Processing)',
    shortTagline: 'The Computer Language Translator',
    category: 'Data & AI',
    iconName: 'MessageSquare',
    whatIsThisJob: 'An NLP Engineer teaches computers how to read, understand, translate, and speak human languages (like English, Spanish, or Hindi) just like a person!',
    everydayActivities: [
      'Processes text words and sentences for computer understanding',
      'Builds language translation and text summarization models',
      'Teaches computers sentiment analysis (detecting happy or sad text)',
      'Finetunes Transformer models on large text books'
    ],
    skillsNeeded: ['Linguistics Interest', 'Text Algorithms', 'Python Coding', 'Attention to Detail'],
    technologiesUsed: ['Python', 'NLTK', 'Spacy', 'Hugging Face Transformers', 'BERT'],
    whatToLearn: [
      '1. Learn text processing and tokenization',
      '2. Study natural language processing concepts',
      '3. Learn Hugging Face library and pre-trained Transformer models',
      '4. Build text classification or translation apps'
    ],
    realWorldExample: 'Building a real-time voice translator app that listens to someone speaking French and instantly speaks back the exact sentence in English!',
    careerGrowth: ['NLP Specialist', 'Senior NLP Engineer', 'Principal Speech & Language Scientist', 'Head of NLP'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'AI/ML & Data Science', tab: 'interview' }
    ]
  },
  {
    id: 'computer-vision-engineer',
    title: 'Computer Vision Engineer',
    shortTagline: 'The Digital Eye Specialist',
    category: 'Data & AI',
    iconName: 'Eye',
    whatIsThisJob: 'A Computer Vision Engineer gives computers digital eyes by building software that can look at photos and videos and understand what is in them!',
    everydayActivities: [
      'Processes camera video frames and pixel matrices',
      'Builds object detection and face recognition algorithms',
      'Tracks moving objects across video feeds',
      'Optimizes video processing to run in real-time'
    ],
    skillsNeeded: ['Image Math', '3D Geometry', 'Algorithm Optimization', 'Python/C++'],
    technologiesUsed: ['OpenCV', 'PyTorch', 'YOLO', 'C++', 'Python'],
    whatToLearn: [
      '1. Learn image processing basics with OpenCV',
      '2. Study Convolutional Neural Networks (CNNs)',
      '3. Master object detection frameworks like YOLO',
      '4. Practice real-time video stream processing'
    ],
    realWorldExample: 'Building the face unlock camera on your smartphone that scans your face in 3D to instantly unlock your phone when you look at it!',
    careerGrowth: ['Vision Engineer', 'Senior Computer Vision Architect', 'Principal Vision Scientist', 'VP of Perceptual AI'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Visualizer Engine', tab: 'visualizer' }
    ]
  },
  {
    id: 'ml-platform-engineer',
    title: 'ML Platform Engineer',
    shortTagline: 'The AI Factory Conveyor Belt Builder',
    category: 'Data & AI',
    iconName: 'Server',
    whatIsThisJob: 'An ML Platform Engineer builds the infrastructure, tools, and servers that allow Data Scientists to easily train, test, and deploy AI models at huge scale!',
    everydayActivities: [
      'Builds automated training platforms for ML models',
      'Manages GPU cluster computing servers',
      'Sets up feature stores and model tracking registries',
      'Ensures AI predictions return in milliseconds'
    ],
    skillsNeeded: ['Cloud Infrastructure', 'ML Workflows', 'Systems Engineering', 'Scalability'],
    technologiesUsed: ['Kubeflow', 'MLflow', 'Docker', 'Kubernetes', 'Python', 'Go'],
    whatToLearn: [
      '1. Learn DevOps and Kubernetes orchestration',
      '2. Study Machine Learning lifecycle (MLOps)',
      '3. Learn ML workflow tools like Kubeflow or MLflow',
      '4. Build automated model deployment pipelines'
    ],
    realWorldExample: 'Building the giant server factory that allows 500 AI scientists at Netflix to test new movie recommendation algorithms simultaneously!',
    careerGrowth: ['MLOps Engineer', 'Senior ML Platform Engineer', 'Principal MLOps Architect', 'Director of AI Infrastructure'],
    relatedAlgoriseTopics: [
      { label: 'Cloud Computing & DevOps', tab: 'interview' },
      { label: 'System Design', tab: 'interview' }
    ]
  },
  {
    id: 'ai-researcher',
    title: 'AI Researcher',
    shortTagline: 'The Explorer of New AI Frontiers',
    category: 'Data & AI',
    iconName: 'Sparkles',
    whatIsThisJob: 'An AI Researcher invents brand new mathematical algorithms and neural architectures that make artificial intelligence smarter than ever before!',
    everydayActivities: [
      'Invents new neural network math formulas',
      'Writes scientific research papers for global AI conferences',
      'Runs groundbreaking experiments on supercomputers',
      'Tests new theories about how intelligence works'
    ],
    skillsNeeded: ['High Mathematics', 'Scientific Genius', 'Deep Curiosity', 'Research Rigor'],
    technologiesUsed: ['PyTorch', 'Python', 'LaTeX', 'CUDA', 'Supercomputers'],
    whatToLearn: [
      '1. Master advanced mathematics (Calculus, Linear Algebra, Probability)',
      '2. Read groundbreaking AI research papers',
      '3. Write custom neural network math in PyTorch',
      '4. Publish novel research findings'
    ],
    realWorldExample: 'Inventing the original math behind ChatGPT (the Transformer architecture) that revolutionized how computers understand human words!',
    careerGrowth: ['AI Research Scientist', 'Senior Staff Researcher', 'Principal Research Scientist', 'Head of AI Research Lab'],
    relatedAlgoriseTopics: [
      { label: 'Trees & BST', tab: 'learn' },
      { label: 'Graphs & Networks', tab: 'learn' },
      { label: 'AI/ML & Data Science', tab: 'interview' }
    ]
  },
  {
    id: 'data-architect',
    title: 'Data Architect',
    shortTagline: 'The Blueprint Designer of Data Empires',
    category: 'Data & AI',
    iconName: 'Database',
    whatIsThisJob: 'A Data Architect designs the master blueprints for how an entire company stores, organizes, connects, and protects all of its data systems!',
    everydayActivities: [
      'Draws master database blueprints and schemas',
      'Sets standards for data storage and governance',
      'Selects database technologies (Relational vs NoSQL)',
      'Ensures company data is organized and secure'
    ],
    skillsNeeded: ['Big-Picture Vision', 'Database Mastery', 'Enterprise Architecture', 'Leadership'],
    technologiesUsed: ['ERD Tools', 'Snowflake', 'PostgreSQL', 'MongoDB', 'AWS Redshift'],
    whatToLearn: [
      '1. Master database modeling and normalization',
      '2. Study distributed database systems',
      '3. Learn cloud data warehouse architectures',
      '4. Design enterprise data blueprints'
    ],
    realWorldExample: 'Designing the master blueprint for a global bank showing exactly how checking accounts, credit cards, and ATMs safely share financial records!',
    careerGrowth: ['Data Modeler', 'Senior Data Architect', 'Principal Enterprise Data Architect', 'Chief Data Architect'],
    relatedAlgoriseTopics: [
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'DBMS & SQL', tab: 'interview' }
    ]
  },

  // ==========================================
  // 3. CYBERSECURITY & PROTECTION (19-23)
  // ==========================================
  {
    id: 'cybersecurity-engineer',
    title: 'Cybersecurity Engineer',
    shortTagline: 'The Digital Castle Guard',
    category: 'Cybersecurity',
    iconName: 'Shield',
    whatIsThisJob: 'A Cybersecurity Engineer protects computer systems from bad digital pirates and sneaky hackers who try to steal secret passwords!',
    everydayActivities: [
      'Builds digital walls (firewalls) around computer networks',
      'Tests locks to find any weak spots before bad guys do',
      'Encodes private messages into secret scrambled codes',
      'Rushes in to stop digital attacks if an alarm rings'
    ],
    skillsNeeded: ['Vigilance', 'Investigative Mindset', 'Ethics', 'Quick Action'],
    technologiesUsed: ['Wireshark', 'Linux', 'Python', 'Firewalls', 'Metasploit'],
    whatToLearn: [
      '1. Learn how computer networks send messages',
      '2. Learn Linux operating system commands',
      '3. Understand secret codes (encryption) and passwords',
      '4. Practice ethical hacking and safety testing'
    ],
    realWorldExample: 'Like a security guard at a bank who checks everyone’s ID card and locks the heavy metal vault doors at night to keep money safe!',
    careerGrowth: ['Security Analyst', 'Ethical Hacker (Penetration Tester)', 'Cybersecurity Architect', 'Chief Information Security Officer'],
    relatedAlgoriseTopics: [
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'Computer Networks', tab: 'interview' },
      { label: 'Cybersecurity', tab: 'interview' }
    ]
  },
  {
    id: 'ethical-hacker',
    title: 'Ethical Hacker (Penetration Tester)',
    shortTagline: 'The Friendly Digital Burglar',
    category: 'Cybersecurity',
    iconName: 'ShieldAlert',
    whatIsThisJob: 'An Ethical Hacker is a good guy hired by companies to try to break into their own computer systems like a burglar, to find secret trapdoors before bad hackers do!',
    everydayActivities: [
      'Simulates real hacker attacks on company websites',
      'Hunts for hidden software bugs and trapdoors',
      'Writes reports explaining how to patch security holes',
      'Helps developers fix weak security locks'
    ],
    skillsNeeded: ['Out-of-the-Box Thinking', 'Deep System Knowledge', 'Ethics', 'Persistence'],
    technologiesUsed: ['Burp Suite', 'Metasploit', 'Nmap', 'Kali Linux', 'Python'],
    whatToLearn: [
      '1. Learn networking protocols and web security basics',
      '2. Master Kali Linux tools and scripting',
      '3. Learn web application vulnerability testing (OWASP Top 10)',
      '4. Earn certifications like CEH or OSCP'
    ],
    realWorldExample: 'Hiring a locksmith to try to pick your front door lock so you can replace it with a stronger lock before any real thieves try!',
    careerGrowth: ['Junior Pen Tester', 'Ethical Hacker', 'Senior Security Consultant', 'Head of Red Team Ops'],
    relatedAlgoriseTopics: [
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'Cybersecurity & Web Security', tab: 'interview' }
    ]
  },
  {
    id: 'security-analyst',
    title: 'Security Analyst',
    shortTagline: 'The Digital Security Watchman',
    category: 'Cybersecurity',
    iconName: 'Eye',
    whatIsThisJob: 'A Security Analyst sits in a digital control room, watching security screens 24/7 to catch any suspicious activity or unauthorized break-in attempts!',
    everydayActivities: [
      'Monitors network traffic for suspicious alarms',
      'Investigates security alerts and suspicious emails',
      'Enforces password and security policies',
      'Responds immediately to active security incidents'
    ],
    skillsNeeded: ['Observation Skill', 'Analytical Thinking', 'Calm Under Pressure', 'Attention to Detail'],
    technologiesUsed: ['Splunk', 'SIEM Tools', 'Wireshark', 'Antivirus Systems', 'Log Analyzers'],
    whatToLearn: [
      '1. Learn computer networking and OS fundamentals',
      '2. Understand common cyber attack methods',
      '3. Learn log analysis with SIEM tools like Splunk',
      '4. Practice incident response steps'
    ],
    realWorldExample: 'Watching security camera monitors in a shopping mall to spot any suspicious activity and alerting guards before trouble happens!',
    careerGrowth: ['SOC Analyst L1', 'Security Analyst L2', 'Incident Response Lead', 'Security Operations Center Manager'],
    relatedAlgoriseTopics: [
      { label: 'Computer Networks', tab: 'interview' },
      { label: 'Cybersecurity & Web Security', tab: 'interview' }
    ]
  },
  {
    id: 'security-architect',
    title: 'Security Architect',
    shortTagline: 'The Master Fortress Planner',
    category: 'Cybersecurity',
    iconName: 'Shield',
    whatIsThisJob: 'A Security Architect plans and designs the overall impenetrable defense blueprints for an entire organization\'s computer infrastructure!',
    everydayActivities: [
      'Designs complete enterprise security architectures',
      ' Establishes zero-trust security standards',
      'Evaluates cloud and software security designs',
      'Leads security strategy across the entire company\'s systems'
    ],
    skillsNeeded: ['Deep Security Architecture', 'Risk Assessment', 'Executive Leadership', 'Vision'],
    technologiesUsed: ['Zero Trust Frameworks', 'Firewalls', 'IAM', 'Cloud Security Tools', 'Encryption Standards'],
    whatToLearn: [
      '1. Master network and cloud security engineering',
      '2. Study enterprise risk frameworks (NIST, ISO 27001)',
      '3. Design zero-trust security architectures',
      '4. Lead security policy across organizations'
    ],
    realWorldExample: 'Designing the blueprint for an impenetrable royal castle with moats, drawbridges, thick stone walls, and secret escape tunnels!',
    careerGrowth: ['Senior Security Engineer', 'Security Architect', 'Principal Security Architect', 'Chief Information Security Officer (CISO)'],
    relatedAlgoriseTopics: [
      { label: 'Cybersecurity & Web Security', tab: 'interview' },
      { label: 'System Design', tab: 'interview' }
    ]
  },

  // ==========================================
  // 4. CLOUD, DEVOPS & INFRASTRUCTURE (24-30)
  // ==========================================
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    shortTagline: 'The Sky Locker Manager',
    category: 'Cloud & Infrastructure',
    iconName: 'Cloud',
    whatIsThisJob: 'A Cloud Engineer builds huge digital storage lockers up on the internet (the Cloud) so computers anywhere in the world can share data instantly!',
    everydayActivities: [
      'Sets up supercomputers on the internet (like AWS or Azure)',
      'Connects networks so people can reach apps from anywhere',
      'Makes sure storage lockers never run out of space',
      'Keeps cloud systems cheap, fast, and safe'
    ],
    skillsNeeded: ['Systems Organization', 'Efficiency Mindset', 'Reliability Focus'],
    technologiesUsed: ['AWS (Amazon Web Services)', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Terraform'],
    whatToLearn: [
      '1. Learn computer networking basics',
      '2. Study cloud platforms like AWS or Azure',
      '3. Learn Docker containers to pack applications',
      '4. Write scripts to set up servers automatically'
    ],
    realWorldExample: 'Instead of saving your video games on a single game console card at home, saving them online so you can play your saved game on any TV at a friend’s house!',
    careerGrowth: ['Cloud Associate', 'Cloud Engineer', 'Cloud Solutions Architect', 'Head of Cloud Infrastructure'],
    relatedAlgoriseTopics: [
      { label: 'Graphs & Networks', tab: 'learn' },
      { label: 'Cloud Computing & DevOps', tab: 'interview' }
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    shortTagline: 'The High-Speed Factory Mechanic',
    category: 'Cloud & Infrastructure',
    iconName: 'Wrench',
    whatIsThisJob: 'A DevOps Engineer builds automated conveyor belts that quickly deliver new computer code from developers straight to real users safely!',
    everydayActivities: [
      'Builds automatic robots that test new code for mistakes',
      'Sets up conveyor belts (pipelines) to ship software instantly',
      'Monitors servers 24/7 to make sure apps never freeze',
      'Helps developers and server guards work happily together'
    ],
    skillsNeeded: ['Automation Love', 'Problem Solver', 'Great Communication', 'Cool Under Pressure'],
    technologiesUsed: ['Linux', 'Git', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions'],
    whatToLearn: [
      '1. Learn Linux command line controls',
      '2. Learn Git version control to manage code updates',
      '3. Learn CI/CD conveyor belt automation',
      '4. Learn Kubernetes container orchestration'
    ],
    realWorldExample: 'Building a robot conveyor belt in a toy factory that automatically inspects every new toy, packages it in a box, and ships it to stores without stopping!',
    careerGrowth: ['DevOps Specialist', 'Site Reliability Engineer (SRE)', 'DevOps Architect', 'VP of Infrastructure Operations'],
    relatedAlgoriseTopics: [
      { label: 'Stacks & Queues', tab: 'learn' },
      { label: 'Operating Systems', tab: 'interview' }
    ]
  },
  {
    id: 'site-reliability-engineer',
    title: 'Site Reliability Engineer (SRE)',
    shortTagline: 'The 24/7 App Doctor & Doctor of Uptime',
    category: 'Cloud & Infrastructure',
    iconName: 'Activity',
    whatIsThisJob: 'An SRE uses software engineering tricks to make sure massive websites (like Google or YouTube) stay online 99.999% of the time without ever crashing!',
    everydayActivities: [
      'Writes code to fix server outages automatically',
      'Monitors system health signals (CPU, RAM, latency)',
      'Conducts post-mortem reviews when things break to prevent repeat bugs',
      'Automates operational tasks so humans do not do manual work'
    ],
    skillsNeeded: ['Engineering Rigor', 'Coolness in Crisis', 'Automation Mindset', 'Systems Thinking'],
    technologiesUsed: ['Go', 'Python', 'Kubernetes', 'Prometheus', 'Grafana', 'Linux'],
    whatToLearn: [
      '1. Learn software development and Linux administration',
      '2. Learn monitoring tools like Prometheus and Grafana',
      '3. Study error budgets and Service Level Objectives (SLOs)',
      '4. Automate incident recovery code'
    ],
    realWorldExample: 'Like an emergency room doctor for website servers who builds automated life-support systems so YouTube never stops playing videos!',
    careerGrowth: ['SRE Engineer', 'Senior SRE Lead', 'Principal Reliability Architect', 'VP of Reliability Engineering'],
    relatedAlgoriseTopics: [
      { label: 'Operating Systems', tab: 'interview' },
      { label: 'Cloud Computing & DevOps', tab: 'interview' }
    ]
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architect',
    shortTagline: 'The Master Sky Blueprint Creator',
    category: 'Cloud & Infrastructure',
    iconName: 'Cloud',
    whatIsThisJob: 'A Cloud Architect plans and designs the master digital blueprints for how a company\'s entire cloud computer network will be built across the sky!',
    everydayActivities: [
      'Draws master cloud infrastructure blueprints',
      'Selects optimal cloud services (AWS, Azure, GCP)',
      'Designs high-availability and disaster recovery plans',
      'Ensures cloud infrastructure is secure and cost-efficient'
    ],
    skillsNeeded: ['Cloud Master Vision', 'Cost & Performance Balance', 'Architectural Leadership'],
    technologiesUsed: ['AWS Architecture', 'Azure', 'Terraform', 'CloudFormation', 'Kubernetes'],
    whatToLearn: [
      '1. Master multi-cloud platforms and networking',
      '2. Study cloud security and compliance',
      '3. Learn Infrastructure as Code (Terraform)',
      '4. Design high-availability enterprise systems'
    ],
    realWorldExample: 'Designing the architectural plans for a giant global airport, determining where runway lanes, terminal buildings, and luggage belts go!',
    careerGrowth: ['Cloud Engineer', 'Senior Cloud Architect', 'Principal Cloud Solutions Architect', 'Chief Cloud Officer'],
    relatedAlgoriseTopics: [
      { label: 'Graphs & Networks', tab: 'learn' },
      { label: 'Cloud Computing & DevOps', tab: 'interview' }
    ]
  },
  {
    id: 'solutions-architect',
    title: 'Solutions Architect',
    shortTagline: 'The Master Problem Solver & Tech Matchmaker',
    category: 'Cloud & Infrastructure',
    iconName: 'Compass',
    whatIsThisJob: 'A Solutions Architect listens to big business problems and designs the exact technological solution combination of apps, cloud, and databases to solve them!',
    everydayActivities: [
      'Meets with business leaders to understand their goals',
      'Designs complete end-to-end technology solutions',
      'Combines software, cloud, and database building blocks',
      'Guides development teams to execute the architectural plan'
    ],
    skillsNeeded: ['Business & Tech Bridging', 'System Design', 'Communication', 'Technical Depth'],
    technologiesUsed: ['System Design Tools', 'Cloud Platforms', 'Microservices', 'REST/gRPC', 'SQL/NoSQL'],
    whatToLearn: [
      '1. Gain broad experience across frontend, backend, and cloud',
      '2. Master System Design principles and trade-offs',
      '3. Learn business analysis and technical presentation',
      '4. Design scalable end-to-end architectures'
    ],
    realWorldExample: 'Like a master architect who meets a family, asks how many rooms they need, and designs the perfect house blueprints to fit their budget!',
    careerGrowth: ['Senior Developer', 'Solutions Architect', 'Principal Solutions Architect', 'Chief Architect'],
    relatedAlgoriseTopics: [
      { label: 'System Design & Architecture', tab: 'interview' },
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  },
  {
    id: 'software-architect',
    title: 'Software Architect',
    shortTagline: 'The Master Code Blueprint Planner',
    category: 'Cloud & Infrastructure',
    iconName: 'Layers',
    whatIsThisJob: 'A Software Architect designs the high-level code structure and rules for complex software applications so code stays clean, organized, and scalable for years!',
    everydayActivities: [
      'Sets coding standards and architectural patterns (e.g. Microservices)',
      'Decides how different software modules communicate',
      'Evaluates new tech frameworks and libraries',
      'Mentors developers on code structure and design patterns'
    ],
    skillsNeeded: ['Deep Code Design Patterns', 'SOLID Principles', 'System Vision', 'Mentorship'],
    technologiesUsed: ['UML', 'Design Patterns', 'Microservices', 'Clean Architecture', 'Docker'],
    whatToLearn: [
      '1. Master object-oriented & functional design patterns',
      '2. Study SOLID principles and Clean Architecture',
      '3. Learn microservices and event-driven patterns',
      '4. Guide large codebases across engineering teams'
    ],
    realWorldExample: 'Designing the structural steel skeleton of a 100-story skyscraper so that electricians, plumbers, and room builders can work cleanly without tangling wires!',
    careerGrowth: ['Staff Software Engineer', 'Software Architect', 'Principal Software Architect', 'VP of Engineering'],
    relatedAlgoriseTopics: [
      { label: 'Object-Oriented Programming (OOP)', tab: 'interview' },
      { label: 'System Design & Architecture', tab: 'interview' }
    ]
  },
  {
    id: 'performance-engineer',
    title: 'Performance Engineer',
    shortTagline: 'The Digital Racecar Tuner',
    category: 'Cloud & Infrastructure',
    iconName: 'Zap',
    whatIsThisJob: 'A Performance Engineer tunes computer applications like racecars to make sure they run at lightning speed, consume minimal RAM, and handle massive user traffic!',
    everydayActivities: [
      'Profiles CPU memory usage and pinpoints code bottlenecks',
      'Runs stress tests simulating 1,000,000 users at once',
      'Optimizes database queries and memory allocation',
      'Helps developers speed up slow software functions'
    ],
    skillsNeeded: ['Memory & CPU Profiling', 'Benchmarking', 'Low-Level Optimization', 'Relentless Curiosity'],
    technologiesUsed: ['JMeter', 'Gatling', 'Perf', 'Valgrind', 'Flamegraphs', 'Go/C++'],
    whatToLearn: [
      '1. Learn operating system memory & CPU execution',
      '2. Learn performance profiling and load testing tools',
      '3. Study memory leak detection and cache optimization',
      '4. Benchmark code speed down to milliseconds'
    ],
    realWorldExample: 'Like a Formula 1 racecar mechanic who tunes the engine, reduces car weight, and swaps tires so the car drives 200 mph without overheating!',
    careerGrowth: ['Performance Analyst', 'Performance Engineer', 'Senior Performance Architect', 'Head of Performance Engineering'],
    relatedAlgoriseTopics: [
      { label: 'Searching & Sorting', tab: 'learn' },
      { label: 'Operating Systems', tab: 'interview' }
    ]
  },

  // ==========================================
  // 5. HARDWARE, IOT & ROBOTICS (31-36)
  // ==========================================
  {
    id: 'system-engineer',
    title: 'System Engineer',
    shortTagline: 'The Computer Hardware Master Builder',
    category: 'Hardware & Robotics',
    iconName: 'Cpu',
    whatIsThisJob: 'A System Engineer designs, builds, and connects physical computer machines, operating systems, and core hardware networks so everything runs like clockwork!',
    everydayActivities: [
      'Sets up server racks and physical supercomputers',
      'Configures operating system kernels (Linux/Windows)',
      'Manages hardware memory, CPU cores, and storage disks',
      'Fixes physical hardware breakdowns and connection cables'
    ],
    skillsNeeded: ['Hardware Knowledge', 'Systems Thinking', 'Troubleshooting', 'Carefulness'],
    technologiesUsed: ['Linux/Unix', 'C', 'Shell Scripting', 'Networking Hardware', 'Systems Architecture'],
    whatToLearn: [
      '1. Learn operating system internals (Linux)',
      '2. Understand computer hardware memory and CPU architectures',
      '3. Learn C programming and shell scripts',
      '4. Study physical computer network setup'
    ],
    realWorldExample: 'Building the giant supercomputer server room that controls all the traffic lights in a big city so emergency ambulances always get a green light!',
    careerGrowth: ['Systems Administrator', 'Systems Engineer', 'Senior Systems Architect', 'Chief Infrastructure Engineer'],
    relatedAlgoriseTopics: [
      { label: 'Programming Foundations', tab: 'learn' },
      { label: 'Operating Systems', tab: 'interview' },
      { label: 'Advanced DSA', tab: 'learn' }
    ]
  },
  {
    id: 'network-engineer',
    title: 'Network Engineer',
    shortTagline: 'The Internet Cable & Highway Builder',
    category: 'Hardware & Robotics',
    iconName: 'Wifi',
    whatIsThisJob: 'A Network Engineer connects physical routers, switches, and fiber-optic cables so data packets can zoom between computers across the world at light speed!',
    everydayActivities: [
      'Configures network routers, switches, and Wi-Fi access points',
      'Sets up IP addresses, subnets, and routing tables',
      'Fixes internet slowdowns and connection drops',
      'Protects network highways with firewalls and VPNs'
    ],
    skillsNeeded: ['Network Protocols', 'Hardware Wiring', 'Troubleshooting', 'Precision'],
    technologiesUsed: ['Cisco Routers', 'Wireshark', 'BGP/OSPF', 'Firewalls', 'Linux'],
    whatToLearn: [
      '1. Study OSI 7-layer model and TCP/IP protocols',
      '2. Learn IP address subnetting and routing algorithms',
      '3. Configure Cisco/Juniper networking hardware',
      '4. Earn certifications like CCNA or CCNP'
    ],
    realWorldExample: 'Building and maintaining the physical highway roads, bridges, and traffic signals that allow cars (data packets) to drive between cities without traffic jams!',
    careerGrowth: ['Network Specialist', 'Network Engineer', 'Senior Network Architect', 'VP of Network Infrastructure'],
    relatedAlgoriseTopics: [
      { label: 'Computer Networks', tab: 'interview' }
    ]
  },
  {
    id: 'embedded-systems-engineer',
    title: 'Embedded Systems Engineer',
    shortTagline: 'The Tiny Chip Programmer',
    category: 'Hardware & Robotics',
    iconName: 'Cpu',
    whatIsThisJob: 'An Embedded Systems Engineer writes tiny, lightning-fast C code instructions directly into microchip hardware inside cars, smart watches, and medical devices!',
    everydayActivities: [
      'Writes low-level C code for tiny microcontrollers',
      'Reads electrical circuit schematics',
      'Controls physical hardware sensors, motors, and LEDs',
      'Optimizes code to run on tiny battery power'
    ],
    skillsNeeded: ['Low-Level C Coding', 'Electrical Schematics', 'Hardware Precision', 'Debugging'],
    technologiesUsed: ['C', 'C++', 'ARM Microcontrollers', 'Arduino', 'RTOS', 'Oscilloscopes'],
    whatToLearn: [
      '1. Master C programming and memory pointers',
      '2. Learn microcontroller hardware (Arduino or STM32)',
      '3. Understand electronics circuits (voltage, current, sensors)',
      '4. Study Real-Time Operating Systems (RTOS)'
    ],
    realWorldExample: 'Writing the tiny computer code inside an electronic pacemaker that senses a person’s heartbeat and sends a gentle shock if their heart misses a beat!',
    careerGrowth: ['Embedded Coder', 'Embedded Engineer', 'Principal Embedded Architect', 'VP of Hardware Engineering'],
    relatedAlgoriseTopics: [
      { label: 'Programming Foundations', tab: 'learn' },
      { label: 'Operating Systems', tab: 'interview' }
    ]
  },
  {
    id: 'iot-engineer',
    title: 'IoT Engineer (Internet of Things)',
    shortTagline: 'The Smart Appliance Connecter',
    category: 'Hardware & Robotics',
    iconName: 'Wifi',
    whatIsThisJob: 'An IoT Engineer connects everyday physical objects — like smart lightbulbs, refrigerators, and door locks — to the internet so you can control them from your phone!',
    everydayActivities: [
      'Connects physical hardware sensors to cloud networks',
      'Writes lightweight messaging code (MQTT protocol)',
      'Builds smart home and smart factory automation',
      'Secures IoT gadgets from digital hackers'
    ],
    skillsNeeded: ['Wireless Networks', 'Embedded Coding', 'Cloud APIs', 'Hardware Integration'],
    technologiesUsed: ['Raspberry Pi', 'ESP32', 'MQTT', 'Python', 'C++', 'AWS IoT'],
    whatToLearn: [
      '1. Learn microcontroller programming (ESP32 / Raspberry Pi)',
      '2. Learn IoT protocols like MQTT and HTTP',
      '3. Connect hardware sensors to cloud services',
      '4. Build smart automation projects'
    ],
    realWorldExample: 'Connecting your home thermostat to the internet so you can turn on the air conditioner from your phone while driving home from school!',
    careerGrowth: ['IoT Specialist', 'IoT Solutions Engineer', 'Senior IoT Architect', 'Director of Smart Systems'],
    relatedAlgoriseTopics: [
      { label: 'Computer Networks', tab: 'interview' },
      { label: 'Cloud Computing & DevOps', tab: 'interview' }
    ]
  },
  {
    id: 'robotics-engineer',
    title: 'Robotics Engineer',
    shortTagline: 'The Robot Builder & Animator',
    category: 'Hardware & Robotics',
    iconName: 'Bot',
    whatIsThisJob: 'A Robotics Engineer designs, builds, and programs physical robot bodies and arms so they can move around, pick up objects, and perform tasks autonomously!',
    everydayActivities: [
      'Programs motor controllers to move robotic joints smoothly',
      'Combines sensor cameras, LiDAR, and motors into robot bodies',
      'Codes robot navigation and pathfinding algorithms',
      'Tests physical robots in real-world environments'
    ],
    skillsNeeded: ['3D Mechanical Math', 'Control Theory', 'C++/Python Coding', 'Robotics ROS'],
    technologiesUsed: ['ROS (Robot Operating System)', 'C++', 'Python', 'Gazebo Simulator', 'LiDAR'],
    whatToLearn: [
      '1. Master C++ and Python programming',
      '2. Learn Robot Operating System (ROS)',
      '3. Study robot kinematics (joint math) and pathfinding',
      '4. Build and simulate physical robots'
    ],
    realWorldExample: 'Programming a helpful warehouse robot arm at Amazon to spot a toy box on a shelf, pick it up gently with suction cups, and place it in a shipping bin!',
    careerGrowth: ['Robotics Programmer', 'Robotics Engineer', 'Lead Robotics Architect', 'VP of Autonomous Robotics'],
    relatedAlgoriseTopics: [
      { label: 'Searching & Sorting', tab: 'learn' },
      { label: 'Graphs & Networks', tab: 'learn' }
    ]
  },
  {
    id: 'database-administrator',
    title: 'Database Administrator (DBA)',
    shortTagline: 'The Digital Library Keeper',
    category: 'Hardware & Robotics',
    iconName: 'Database',
    whatIsThisJob: 'A Database Administrator is like a master librarian who organizes millions of digital filing cabinets so information is safe, organized, and retrieved in a split second!',
    everydayActivities: [
      'Keans up messy database tables and lists',
      'Makes search lookups lightning fast',
      'Creates emergency backup copies in case of accidents',
      'Locks key cabinet drawers so only authorized people enter'
    ],
    skillsNeeded: ['Extreme Organization', 'Precision', 'Disaster Prevention Focus'],
    technologiesUsed: ['SQL', 'MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Redis'],
    whatToLearn: [
      '1. Master SQL database query commands',
      '2. Learn database indexing to speed up searches',
      '3. Study backup and disaster recovery methods',
      '4. Practice database performance tuning'
    ],
    realWorldExample: 'Managing the school library computer catalog so when you type a book title, it tells you the exact shelf number in less than 1 second out of 500,000 books!',
    careerGrowth: ['Junior DBA', 'Database Administrator', 'Lead Data Engineer', 'Principal Database Architect'],
    relatedAlgoriseTopics: [
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'Searching & Sorting', tab: 'learn' },
      { label: 'DBMS & SQL', tab: 'interview' }
    ]
  },
  {
    id: 'database-engineer',
    title: 'Database Engineer',
    shortTagline: 'The Storage Engine Creator',
    category: 'Hardware & Robotics',
    iconName: 'Database',
    whatIsThisJob: 'A Database Engineer writes the core software code that powers database management systems, optimizing how bytes are written onto physical hard drives!',
    everydayActivities: [
      'Writes low-level storage engine code (B-Trees, WAL logs)',
      'Optimizes database query execution plans',
      'Ensures multi-thread transaction safety (ACID guarantees)',
      'Builds high-throughput distributed database engines'
    ],
    skillsNeeded: ['Storage Mechanics', 'Low-Level C++/Go', 'Data Structure Depth', 'Memory Tuning'],
    technologiesUsed: ['C++', 'Go', 'Rust', 'B-Trees', 'RocksDB', 'SQL Engine Architecture'],
    whatToLearn: [
      '1. Master C++ or Rust programming',
      '2. Study database internals (B+ Trees, Write-Ahead Logging)',
      '3. Understand transaction concurrency (ACID isolation)',
      '4. Build a mini custom SQL database engine'
    ],
    realWorldExample: 'Writing the core engine code for PostgreSQL so it can write 100,000 bank transactions per second onto disk without losing a single cent during a power outage!',
    careerGrowth: ['Database Systems Engineer', 'Senior Database Kernel Engineer', 'Principal Database Engine Architect', 'Distinguished Systems Engineer'],
    relatedAlgoriseTopics: [
      { label: 'Trees & BST', tab: 'learn' },
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'DBMS & SQL', tab: 'interview' }
    ]
  },

  // ==========================================
  // 6. BLOCKCHAIN & EMERGING TECH (37-40)
  // ==========================================
  {
    id: 'blockchain-developer',
    title: 'Blockchain Developer',
    shortTagline: 'The Cryptographic Ledger Builder',
    category: 'Blockchain & Emerging',
    iconName: 'Link',
    whatIsThisJob: 'A Blockchain Developer writes decentralized smart contract programs that run on shared cryptographic block chains without relying on any central bank or middleman!',
    everydayActivities: [
      'Writes immutable smart contract code (Solidity/Rust)',
      'Verifies cryptographic hashing security to prevent hacks',
      'Builds decentralized tokens and digital assets',
      'Audits smart contracts before releasing on mainnet'
    ],
    skillsNeeded: ['Cryptographic Security', 'Smart Contract Coding', 'Attention to Flaws', 'Logic'],
    technologiesUsed: ['Solidity', 'Ethereum', 'Rust', 'Web3.js', 'Hardhat'],
    whatToLearn: [
      '1. Learn cryptography basics (hashes, public/private keys)',
      '2. Learn Solidity programming for Ethereum',
      '3. Study smart contract security vulnerabilities',
      '4. Build decentralized applications (dApps)'
    ],
    realWorldExample: 'Writing a digital smart contract for a vending machine that automatically releases a digital game code to a buyer as soon as payment is confirmed on the blockchain!',
    careerGrowth: ['Smart Contract Developer', 'Senior Blockchain Engineer', 'Blockchain Security Auditor', 'Chief Web3 Architect'],
    relatedAlgoriseTopics: [
      { label: 'Hashing & Hash Maps', tab: 'learn' },
      { label: 'Cybersecurity', tab: 'interview' }
    ]
  },
  {
    id: 'web3-developer',
    title: 'Web3 Developer',
    shortTagline: 'The Decentralized Web App Builder',
    category: 'Blockchain & Emerging',
    iconName: 'Layers',
    whatIsThisJob: 'A Web3 Developer builds modern web app screens that connect directly to crypto wallets (like MetaMask) and blockchain smart contracts!',
    everydayActivities: [
      'Connects web frontends to blockchain nodes',
      'Enables crypto wallet sign-in (e.g. MetaMask, WalletConnect)',
      'Reads smart contract data and displays it on web pages',
      'Creates user-friendly crypto trading interfaces'
    ],
    skillsNeeded: ['Frontend Mastery', 'Web3 Wallet Integration', 'Asynchronous JS', 'User UX'],
    technologiesUsed: ['React', 'TypeScript', 'Ethers.js', 'Wagmi', 'Solidity'],
    whatToLearn: [
      '1. Learn React and TypeScript frontend development',
      '2. Learn Ethers.js or Viem libraries to interact with blockchains',
      '3. Understand crypto wallet connection flows',
      '4. Build decentralized web applications'
    ],
    realWorldExample: 'Building a web app where users can log in with their crypto wallet to trade digital art items without needing a password or email!',
    careerGrowth: ['Web3 Frontend Engineer', 'Full Stack Web3 Dev', 'Lead Web3 Architect', 'Founder / CTO'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Web Development', tab: 'interview' }
    ]
  },
  {
    id: 'ar-vr-developer',
    title: 'AR/VR Developer (Augmented & Virtual Reality)',
    shortTagline: 'The Virtual Reality World Builder',
    category: 'Blockchain & Emerging',
    iconName: 'Eye',
    whatIsThisJob: 'An AR/VR Developer builds 3D interactive virtual worlds and holographic overlays for headsets like Meta Quest or Apple Vision Pro!',
    everydayActivities: [
      'Codes 3D hand tracking and spatial movement gestures',
      'Builds virtual 3D room environments and digital objects',
      'Optimizes 3D graphics to run at 90+ frames per second to prevent motion sickness',
      'Tests apps inside VR headsets'
    ],
    skillsNeeded: ['3D Geometry Math', 'Spatial UI Design', 'Performance Tuning', 'Unity/Unreal'],
    technologiesUsed: ['Unity', 'Unreal Engine', 'C#', 'OpenXR', 'ARKit/ARCore'],
    whatToLearn: [
      '1. Master C# programming and 3D math',
      '2. Learn Unity 3D engine development',
      '3. Study spatial computing (OpenXR, hand tracking)',
      '4. Build VR games or AR phone apps'
    ],
    realWorldExample: 'Building a 3D AR phone app that lets you see how a new sofa would look inside your real living room before buying it!',
    careerGrowth: ['XR Developer', 'Senior AR/VR Architect', 'Spatial Computing Lead', 'Director of XR Technology'],
    relatedAlgoriseTopics: [
      { label: 'Recursion', tab: 'learn' },
      { label: 'Trees & BST', tab: 'learn' }
    ]
  },
  {
    id: 'research-scientist',
    title: 'Research Scientist',
    shortTagline: 'The Scientific Computer Inventor',
    category: 'Blockchain & Emerging',
    iconName: 'Sparkles',
    whatIsThisJob: 'A Research Scientist invents brand new computing techniques, algorithms, and theories that push what is scientifically possible in technology!',
    everydayActivities: [
      'Conducts groundbreaking experiments with advanced code',
      'Writes and publishes academic papers in scientific journals',
      'Patents novel computer inventions',
      'Collaborates with global university and industrial labs'
    ],
    skillsNeeded: ['Deep Academic Knowledge', 'Mathematical Proofs', 'Scientific Method', 'Innovation'],
    technologiesUsed: ['Python', 'C++', 'Matlab', 'LaTeX', 'Scientific Libraries'],
    whatToLearn: [
      '1. Earn a deep foundation in computer science and math',
      '2. Learn scientific research methodology and paper writing',
      '3. Code complex prototype algorithms',
      '4. Publish peer-reviewed scientific discoveries'
    ],
    realWorldExample: 'Inventing a revolutionary data compression algorithm that shrinks 4K video files by 90% without losing any picture quality!',
    careerGrowth: ['Research Scientist', 'Senior Research Scientist', 'Principal Scientist', 'Director of Research'],
    relatedAlgoriseTopics: [
      { label: 'Trees & BST', tab: 'learn' },
      { label: 'Advanced DSA', tab: 'learn' }
    ]
  },

  // ==========================================
  // 7. PRODUCT, DESIGN & SUPPORT (41-55)
  // ==========================================
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    shortTagline: 'The Happy Experience Architect',
    category: 'Product, Design & Support',
    iconName: 'Palette',
    whatIsThisJob: 'A UI/UX Designer figures out how software should look and feel so that people find it super easy, fun, and friendly to use without getting confused!',
    everydayActivities: [
      'Draws sketch blueprints (wireframes) of new app ideas',
      'Picks happy colors, clear fonts, and pretty icons',
      'Asks real people to try out apps and watches where they get stuck',
      'Makes prototype screens that developers can turn into code'
    ],
    skillsNeeded: ['Empathy', 'Artistic Creativity', 'Human Behavior Insight', 'Communication'],
    technologiesUsed: ['Figma', 'Adobe XD', 'Sketch', 'Canva'],
    whatToLearn: [
      '1. Learn basic design principles (colors, spacing, typography)',
      '2. Learn how to draw app wireframes in Figma',
      '3. Study user testing methods to see how people use apps',
      '4. Build a portfolio of interactive app designs'
    ],
    realWorldExample: 'Designing a door handle on a heavy glass door so everyone instinctively knows whether to PUSH or PULL without getting confused!',
    careerGrowth: ['Junior UI/UX Designer', 'Product Designer', 'Design Lead', 'VP of User Experience'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Web Development', tab: 'interview' }
    ]
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    shortTagline: 'The Whole Experience Craftsman',
    category: 'Product, Design & Support',
    iconName: 'Palette',
    whatIsThisJob: 'A Product Designer designs both how a digital product works, how it looks, AND how it solves business goals for users from start to finish!',
    everydayActivities: [
      'Researches customer problems and product features',
      'Creates user journeys, screen flows, and visual designs',
      'Works alongside developers and product managers',
      'Tests live products to continuously improve the experience'
    ],
    skillsNeeded: ['Business Mindset', 'UI/UX Mastery', 'Product Vision', 'Empathy'],
    technologiesUsed: ['Figma', 'Framer', 'UserTesting', 'Mixpanel', 'Storybook'],
    whatToLearn: [
      '1. Master UX research and visual design in Figma',
      '2. Understand business goals and product metrics',
      '3. Learn component design systems',
      '4. Design complete digital products'
    ],
    realWorldExample: 'Designing the entire Spotify music listening experience — from how you discover new songs to how your playlist plays when you go for a run!',
    careerGrowth: ['Product Designer', 'Senior Product Designer', 'Principal Designer', 'Head of Design'],
    relatedAlgoriseTopics: [
      { label: 'Arrays & Strings', tab: 'learn' },
      { label: 'Web Development', tab: 'interview' }
    ]
  },
  {
    id: 'product-manager',
    title: 'Product Manager (PM)',
    shortTagline: 'The Captain of the Product Ship',
    category: 'Product, Design & Support',
    iconName: 'Target',
    whatIsThisJob: 'A Product Manager is like the captain of a ship who guides developers, designers, and business teams to build the right product features at the right time!',
    everydayActivities: [
      'Decides what new features to build next (Roadmap planning)',
      'Listens to customer feedback and business goals',
      'Leads daily team meetings with developers and designers',
      'Measures if newly launched features make users happy'
    ],
    skillsNeeded: ['Leadership', 'Prioritization', 'Great Communication', 'Empathy'],
    technologiesUsed: ['Jira', 'Notion', 'Mixpanel', 'Figma', 'Slack'],
    whatToLearn: [
      '1. Learn agile software product management',
      '2. Understand basic coding and UX design concepts',
      '3. Learn how to prioritize features and write specs',
      '4. Master product analytics tools'
    ],
    realWorldExample: 'Deciding that YouTube should add a "Download for Offline Viewing" button so kids can watch cartoons in the car without internet!',
    careerGrowth: ['Associate PM', 'Product Manager', 'Senior PM', 'VP of Product'],
    relatedAlgoriseTopics: [
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  },
  {
    id: 'technical-product-manager',
    title: 'Technical Product Manager (TPM)',
    shortTagline: 'The Tech-Savvy Product Leader',
    category: 'Product, Design & Support',
    iconName: 'Target',
    whatIsThisJob: 'A Technical Product Manager is a Product Manager with deep coding experience who specializes in leading complex engineering platforms, APIs, and cloud products!',
    everydayActivities: [
      'Translates technical architectural choices into product plans',
      'Writes detailed technical specifications for APIs',
      'Works closely with backend and cloud engineers',
      'Balances technical debt refactoring with new feature delivery'
    ],
    skillsNeeded: ['Technical Depth', 'Product Strategy', 'Architectural Communication', 'Prioritization'],
    technologiesUsed: ['Jira', 'Postman', 'SQL', 'Git', 'Confluence'],
    whatToLearn: [
      '1. Gain strong background in software development',
      '2. Master product management methodologies',
      '3. Study API architecture and database design',
      '4. Lead technical product roadmap planning'
    ],
    realWorldExample: 'Leading the creation of Google Maps API so millions of food delivery apps around the world can plug maps into their apps effortlessly!',
    careerGrowth: ['Technical PM', 'Senior Technical PM', 'Director of Technical Product', 'Chief Product Officer'],
    relatedAlgoriseTopics: [
      { label: 'System Design & Architecture', tab: 'interview' },
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst (BA)',
    shortTagline: 'The Translator Between Business & Tech',
    category: 'Product, Design & Support',
    iconName: 'BarChart',
    whatIsThisJob: 'A Business Analyst listens to company bosses explain business goals and translates them into clear step-by-step requirements for developers to code!',
    everydayActivities: [
      'Interviews stakeholders to understand business requirements',
      'Writes detailed functional specification documents',
      'Draws workflow diagrams of company operations',
      'Verifies completed software meets original business goals'
    ],
    skillsNeeded: ['Active Listening', 'Clear Writing', 'Process Mapping', 'Problem Analysis'],
    technologiesUsed: ['Visio', 'Jira', 'Excel', 'SQL', 'Confluence'],
    whatToLearn: [
      '1. Learn business process modeling and diagramming',
      '2. Master writing software requirement specifications',
      '3. Learn basic SQL to inspect data tables',
      '4. Study Agile SDLC frameworks'
    ],
    realWorldExample: 'Asking a bank manager how loan applications work step-by-step, then writing down exact rules so software developers can build an online loan application site!',
    careerGrowth: ['Junior Business Analyst', 'Business Analyst', 'Senior Lead BA', 'Director of Business Transformation'],
    relatedAlgoriseTopics: [
      { label: 'DBMS & SQL', tab: 'interview' },
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  },
  {
    id: 'system-analyst',
    title: 'System Analyst',
    shortTagline: 'The Computer System Inspector & Integrator',
    category: 'Product, Design & Support',
    iconName: 'Cpu',
    whatIsThisJob: 'A System Analyst inspects existing company computer systems and plans hardware and software upgrades so all systems work together smoothly without hiccups!',
    everydayActivities: [
      'Studies current IT systems to spot bottlenecks and inefficiencies',
      'Recommends hardware and software upgrade solutions',
      'Ensures new software integrates cleanly with legacy systems',
      'Writes technical system requirement specifications'
    ],
    skillsNeeded: ['Systems Analysis', 'Technical Documentation', 'Integration Sense', 'Troubleshooting'],
    technologiesUsed: ['UML Diagrams', 'SQL', 'System Monitoring Tools', 'Flowchart Software'],
    whatToLearn: [
      '1. Study computer system architectures and databases',
      '2. Learn system integration methods and APIs',
      '3. Learn technical specification writing',
      '4. Conduct system audit investigations'
    ],
    realWorldExample: 'Inspecting a hospital’s old patient computer files and designing a modern upgrade so doctors can pull up medical records instantly on tablets!',
    careerGrowth: ['System Analyst', 'Senior System Analyst', 'Principal IT Systems Consultant', 'Chief Information Officer'],
    relatedAlgoriseTopics: [
      { label: 'Operating Systems', tab: 'interview' },
      { label: 'System Design', tab: 'interview' }
    ]
  },
  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    shortTagline: 'The Bug Hunter & Inspector',
    category: 'Product, Design & Support',
    iconName: 'CheckCircle',
    whatIsThisJob: 'A QA (Quality Assurance) Engineer is a master detective whose job is to try to break software on purpose to find hidden glitches before real users experience them!',
    everydayActivities: [
      'Tests app screens by clicking random button combinations',
      'Writes automated test scripts that check code automatically',
      'Reports bugs and glitches to developers to fix',
      'Gives a "Thumbs Up" approval before apps go live'
    ],
    skillsNeeded: ['Curiosity', 'Relentless Eye for Detail', 'Destructive Testing Mindset', 'Patience'],
    technologiesUsed: ['Selenium', 'Cypress', 'Postman', 'Python', 'Jest'],
    whatToLearn: [
      '1. Learn software testing principles and test plans',
      '2. Practice manual testing on websites and apps',
      '3. Learn automated testing with Python or JavaScript',
      '4. Master bug tracking tools'
    ],
    realWorldExample: 'Playing with a brand new toy car over rocks, mud, and carpet to make sure the wheels do not fall off before selling it in toy stores!',
    careerGrowth: ['QA Tester', 'Automation Test Engineer', 'QA Lead', 'Head of Software Quality'],
    relatedAlgoriseTopics: [
      { label: 'Searching & Sorting', tab: 'learn' },
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  },
  {
    id: 'automation-test-engineer',
    title: 'Automation Test Engineer',
    shortTagline: 'The Robot Test Script Writer',
    category: 'Product, Design & Support',
    iconName: 'CheckCircle',
    whatIsThisJob: 'An Automation Test Engineer writes automated computer code scripts that test software 100x faster than a human can click buttons!',
    everydayActivities: [
      'Writes automated test scripts in Python or JavaScript',
      'Runs automated test suites every night on code updates',
      'Maintains test frameworks like Selenium or Playwright',
      'Ensures new code updates break zero existing features'
    ],
    skillsNeeded: ['Test Scripting', 'Coding Mastery', 'Automation Focus', 'Systematic Thinking'],
    technologiesUsed: ['Selenium', 'Playwright', 'Cypress', 'Python', 'Java', 'Jenkins'],
    whatToLearn: [
      '1. Learn a programming language (Python or Java)',
      '2. Master web automation tools (Playwright or Selenium)',
      '3. Learn API testing tools like Postman',
      '4. Integrate automated test suites into CI/CD pipelines'
    ],
    realWorldExample: 'Writing a computer script that automatically fills out 1,000 online order forms in 10 seconds to make sure the checkout screen never crashes!',
    careerGrowth: ['Automation Tester', 'Senior Test Automation Engineer', 'Test Framework Architect', 'VP of Quality Engineering'],
    relatedAlgoriseTopics: [
      { label: 'Searching & Sorting', tab: 'learn' },
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  },
  {
    id: 'technical-support-engineer',
    title: 'Technical Support Engineer',
    shortTagline: 'The Tech Rescue Helper',
    category: 'Product, Design & Support',
    iconName: 'HelpCircle',
    whatIsThisJob: 'A Technical Support Engineer helps customers solve tricky technical problems, error messages, and software issues whenever they get stuck!',
    everydayActivities: [
      'Answers support tickets and emails from customers',
      'Troubleshoots software bugs and computer errors',
      'Replicates customer bugs on test computers',
      'Escalates deep code bugs to software developers'
    ],
    skillsNeeded: ['Empathy', 'Patience', 'Systematic Troubleshooting', 'Clear Communication'],
    technologiesUsed: ['Zendesk', 'Jira', 'SQL', 'Command Line', 'Log Inspection Tools'],
    whatToLearn: [
      '1. Learn operating system and web browser troubleshooting',
      '2. Learn basic SQL to inspect customer data',
      '3. Master support ticket management tools',
      '4. Practice clear technical writing'
    ],
    realWorldExample: 'Helping a school teacher figure out why her online gradebook app won’t open, finding that a browser extension was blocking it, and fixing it in 2 minutes!',
    careerGrowth: ['Support Specialist L1', 'Tech Support Engineer L2', 'Support Team Lead', 'Director of Customer Technical Support'],
    relatedAlgoriseTopics: [
      { label: 'Programming Foundations', tab: 'learn' }
    ]
  },
  {
    id: 'it-support-engineer',
    title: 'IT Support Engineer',
    shortTagline: 'The Office Computer Fixer',
    category: 'Product, Design & Support',
    iconName: 'HelpCircle',
    whatIsThisJob: 'An IT Support Engineer sets up computers, laptops, printers, and Wi-Fi networks for company workers so everyone can do their work smoothly!',
    everydayActivities: [
      'Sets up new laptops and installs software for employees',
      'Fixes office Wi-Fi, printer jams, and password resets',
      'Manages company email accounts and security access',
      'Replaces broken hardware parts like keyboards or screens'
    ],
    skillsNeeded: ['Hardware Repair', 'Patience', 'Friendliness', 'Hands-On Problem Solving'],
    technologiesUsed: ['Windows 11', 'macOS', 'Active Directory', 'Wi-Fi Routers', 'Remote Desktop'],
    whatToLearn: [
      '1. Learn computer hardware assembly and repair',
      '2. Master Windows and macOS operating system settings',
      '3. Study basic office network setup',
      '4. Earn certifications like CompTIA A+'
    ],
    realWorldExample: 'Setting up a brand new laptop with all the right software and security keys for a new teacher on their very first day at school!',
    careerGrowth: ['IT Support Technician', 'IT Administrator', 'Senior IT Infrastructure Manager', 'Director of IT Operations'],
    relatedAlgoriseTopics: [
      { label: 'Operating Systems', tab: 'interview' }
    ]
  },
  {
    id: 'it-consultant',
    title: 'IT Consultant',
    shortTagline: 'The Expert Tech Advisor',
    category: 'Product, Design & Support',
    iconName: 'Briefcase',
    whatIsThisJob: 'An IT Consultant is an expert advisor hired by companies to guide them on how to buy, upgrade, and use the best technology to make their business run faster and better!',
    everydayActivities: [
      'Analyzes company technology systems and costs',
      'Recommends modern software and cloud upgrades',
      'Presents strategic tech transformation plans to executives',
      'Guides software vendor selection and execution'
    ],
    skillsNeeded: ['Strategic Advice', 'Tech & Business Depth', 'Public Speaking', 'Problem Analysis'],
    technologiesUsed: ['Presentation Software', 'Cloud Architecture Tools', 'Business Intelligence', 'ERP Systems'],
    whatToLearn: [
      '1. Gain broad technical knowledge across software and cloud',
      '2. Understand business strategy and cost analysis',
      '3. Practice client presentation and consulting skills',
      '4. Lead digital transformation projects'
    ],
    realWorldExample: 'Advising a 50-year-old bookstore chain on how to set up an online website and cloud inventory system so they can sell books on the internet!',
    careerGrowth: ['Junior IT Consultant', 'Senior Technology Consultant', 'Managing Consultant', 'Partner / Managing Director'],
    relatedAlgoriseTopics: [
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  },
  {
    id: 'game-designer',
    title: 'Game Designer',
    shortTagline: 'The Master Mind of Rules & Fun',
    category: 'Product, Design & Support',
    iconName: 'Gamepad',
    whatIsThisJob: 'A Game Designer invents the fun rules, story quests, character points, and level balance for video games before programmers code them!',
    everydayActivities: [
      'Designs game rules, player abilities, and reward systems',
      'Writes story scripts, character dialog, and world lore',
      'Balances game difficulty curves so games are fun, not frustrating',
      'Tests game levels with players to gather feedback'
    ],
    skillsNeeded: ['Fun Intuition', 'Creative Storytelling', 'Game Math & Balance', 'Empathy'],
    technologiesUsed: ['Twine', 'Unreal Editor', 'Unity', 'Machinations', 'Excel'],
    whatToLearn: [
      '1. Study game design mechanics and balance math',
      '2. Learn level editing in Unity or Unreal Engine',
      '3. Write game design documents (GDD)',
      '4. Prototype and playtest mini game ideas'
    ],
    realWorldExample: 'Inventing the rule in Pokemon that Fire attacks are super effective against Grass Pokemon, making battle choices exciting and strategic!',
    careerGrowth: ['Junior Game Designer', 'Game Designer', 'Lead Game Systems Designer', 'Creative Director'],
    relatedAlgoriseTopics: [
      { label: 'Recursion', tab: 'learn' },
      { label: 'Trees & BST', tab: 'learn' }
    ]
  },
  {
    id: 'technical-game-artist',
    title: 'Technical Game Artist',
    shortTagline: 'The Bridge Between Art & Code',
    category: 'Product, Design & Support',
    iconName: 'Palette',
    whatIsThisJob: 'A Technical Game Artist bridges 3D art and game programming, writing custom visual shader codes to make water ripple, fire glow, and character cloth blow in the wind!',
    everydayActivities: [
      'Writes 3D visual shaders for lighting and visual effects (VFX)',
      'Sets up 3D character skeletons (rigging) for smooth animation',
      'Optimizes 3D art assets so games run at 60 fps without lag',
      'Builds art pipeline tools for 3D game artists'
    ],
    skillsNeeded: ['3D Art eye', 'Shader Math', 'C#/C++ Scripting', 'Optimization'],
    technologiesUsed: ['HLSL/GLSL Shaders', 'Unity', 'Unreal Engine', 'Blender', 'Maya', 'Substance Painter'],
    whatToLearn: [
      '1. Master 3D modeling and animation software (Blender/Maya)',
      '2. Learn HLSL shader math for lighting and materials',
      '3. Learn Unity or Unreal Engine graphics pipelines',
      '4. Optimize 3D graphics rendering performance'
    ],
    realWorldExample: 'Writing the visual shader code in a ocean game that makes sunlight reflect off ocean waves realistically when your character swims!',
    careerGrowth: ['Tech Artist', 'Senior Technical Artist', 'Lead Tech Art Director', 'VP of Interactive Graphics'],
    relatedAlgoriseTopics: [
      { label: 'Visualizer Engine', tab: 'visualizer' }
    ]
  },
  {
    id: 'devrel-engineer',
    title: 'DevRel Engineer (Developer Relations)',
    shortTagline: 'The Developer Community Ambassador',
    category: 'Product, Design & Support',
    iconName: 'Heart',
    whatIsThisJob: 'A DevRel Engineer (or Developer Advocate) builds fun sample projects, writes tutorials, and speaks at conferences to help other programmers love using their tech tools!',
    everydayActivities: [
      'Writes code tutorials and open-source starter code',
      'Gives energetic talks at developer technology conferences',
      'Listens to developer feedback and tells internal product teams',
      'Creates helpful YouTube videos and blog posts'
    ],
    skillsNeeded: ['Public Speaking', 'Clear Coding', 'Community Enthusiasm', 'Empathy'],
    technologiesUsed: ['GitHub', 'Markdown', 'TypeScript/Python', 'YouTube', 'Social Media'],
    whatToLearn: [
      '1. Become a skilled software developer',
      '2. Practice technical writing and public speaking',
      '3. Build open-source sample applications',
      '4. Engage with global developer communities online'
    ],
    realWorldExample: 'Building a fun demo app showing how easy it is to use a new AI tool, then speaking on stage at a tech conference to teach 1,000 developers how to build it!',
    careerGrowth: ['Developer Advocate', 'Senior DevRel Engineer', 'Head of Developer Relations', 'VP of Developer Ecosystem'],
    relatedAlgoriseTopics: [
      { label: 'Programming Foundations', tab: 'learn' },
      { label: 'Web Development', tab: 'interview' }
    ]
  },
  {
    id: 'solutions-engineer',
    title: 'Solutions Engineer',
    shortTagline: 'The Technical Product Demonstrator',
    category: 'Product, Design & Support',
    iconName: 'Briefcase',
    whatIsThisJob: 'A Solutions Engineer builds custom technical demos and writes proof-of-concept code to show big corporate buyers exactly how a software product solves their needs!',
    everydayActivities: [
      'Builds custom technical demo applications for clients',
      'Answers deep technical questions during sales calls',
      'Connects product APIs into client test environments',
      'Helps corporate buyers see the value of tech products'
    ],
    skillsNeeded: ['Technical Coding', 'Customer Presentation', 'Problem Solving', 'Persuasion'],
    technologiesUsed: ['Postman', 'Python/JS', 'SQL', 'Cloud Services', 'Presentation Tools'],
    whatToLearn: [
      '1. Master software engineering and API integration',
      '2. Learn customer-facing presentation skills',
      '3. Build rapid custom proof-of-concept apps',
      '4. Master technical sales engineering'
    ],
    realWorldExample: 'Building a 1-day custom prototype showing a bank executive exactly how their mobile app will connect to a new secure payment system!',
    careerGrowth: ['Sales Engineer', 'Solutions Engineer', 'Senior Solutions Specialist', 'VP of Global Solutions Engineering'],
    relatedAlgoriseTopics: [
      { label: 'Software Engineering & SDLC', tab: 'interview' }
    ]
  }
];
