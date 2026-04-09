const Seed = {
  helplines: [
    { id:'h1', name:'911 Emergency',             phone:'911',            description:'Life-threatening emergencies' },
    { id:'h2', name:'Poison Control',            phone:'1-800-222-1222', description:'Accidental ingestion or exposure' },
    { id:'h3', name:'Crisis / Mental Health',    phone:'988',            description:'Suicide & Crisis Lifeline — call or text' },
    { id:'h4', name:'SAMHSA Helpline',           phone:'1-800-662-4357', description:'Substance use and mental health' },
    { id:'h5', name:"Alzheimer's Association",   phone:'1-800-272-3900', description:"Alzheimer's and dementia support" },
    { id:'h6', name:'VNA / Home Health',         phone:'',               description:'Your local home health agency (add number)' },
    { id:'h7', name:'Primary Care Nurse Line',   phone:'',               description:"Your doctor's nurse line (add number)" },
  ],
  recipes: [
    { id:'r1',  name:'Blueberry Oatmeal',         category:'Breakfast', prepTime:'10 min',
      ingredients:['1 cup rolled oats','1 cup milk or water','½ cup fresh blueberries','1 tbsp honey','Pinch of cinnamon'],
      steps:['Cook oats with milk per package directions.','Top with blueberries, honey, and cinnamon.'],
      benefit:'Blueberries are rich in antioxidants that support brain cell health.', isCustom:false },
    { id:'r2',  name:'Salmon with Greens',        category:'Dinner', prepTime:'20 min',
      ingredients:['1 salmon fillet','2 cups spinach or kale','1 tbsp olive oil','Lemon juice','Salt and pepper'],
      steps:['Season salmon. Cook in skillet 4 min per side.','Wilt greens in same pan with olive oil.','Serve together with lemon.'],
      benefit:'Omega-3 fatty acids in salmon support brain and nerve health.', isCustom:false },
    { id:'r3',  name:'Avocado Toast',             category:'Breakfast', prepTime:'5 min',
      ingredients:['2 slices whole-grain bread','1 ripe avocado','Lemon juice','Salt, pepper, red pepper flakes'],
      steps:['Toast bread.','Mash avocado with lemon juice, salt, and pepper.','Spread on toast. Add red pepper flakes if desired.'],
      benefit:'Avocados provide healthy fats that support brain function.', isCustom:false },
    { id:'r4',  name:'Walnut Trail Mix',          category:'Snack', prepTime:'2 min',
      ingredients:['¼ cup walnuts','¼ cup almonds','2 tbsp dark chocolate chips','2 tbsp dried cranberries'],
      steps:['Combine all ingredients in a small bowl or bag.'],
      benefit:'Walnuts are among the best nuts for brain health, high in DHA.', isCustom:false },
    { id:'r5',  name:'Turmeric Golden Milk',      category:'Drink', prepTime:'5 min',
      ingredients:['1 cup warm milk (any type)','½ tsp turmeric','¼ tsp cinnamon','1 tsp honey','Pinch of black pepper'],
      steps:['Warm milk gently — do not boil.','Whisk in turmeric, cinnamon, honey, and pepper.','Serve warm.'],
      benefit:'Curcumin in turmeric has anti-inflammatory properties linked to brain health.', isCustom:false },
    { id:'r6',  name:'Egg & Veggie Scramble',    category:'Breakfast', prepTime:'10 min',
      ingredients:['2 eggs','¼ cup diced bell pepper','¼ cup spinach','1 tbsp olive oil','Salt and pepper'],
      steps:['Sauté pepper in olive oil 2 min.','Add spinach, cook 1 min.','Add beaten eggs, scramble until set.'],
      benefit:'Eggs contain choline, important for memory and brain function.', isCustom:false },
    { id:'r7',  name:'Lentil Soup',              category:'Lunch', prepTime:'30 min',
      ingredients:['1 cup red lentils','1 carrot diced','1 celery stalk diced','1 tsp cumin','4 cups vegetable broth','Salt'],
      steps:['Combine all in pot.','Bring to boil, simmer 20 min until lentils are soft.','Season with salt.'],
      benefit:'Lentils provide folate and iron, supporting healthy blood flow to the brain.', isCustom:false },
    { id:'r8',  name:'Greek Yogurt Parfait',     category:'Snack', prepTime:'3 min',
      ingredients:['½ cup plain Greek yogurt','2 tbsp granola','¼ cup strawberries sliced','1 tsp honey'],
      steps:['Layer yogurt, granola, and strawberries in a bowl.','Drizzle with honey.'],
      benefit:'Probiotics in yogurt support the gut-brain connection.', isCustom:false },
    { id:'r9',  name:'Baked Sweet Potato',       category:'Lunch', prepTime:'45 min',
      ingredients:['1 medium sweet potato','1 tbsp olive oil','Salt and pepper','Optional: cinnamon and honey'],
      steps:['Preheat oven to 400°F.','Pierce potato, rub with olive oil and salt.','Bake 40 min until tender.'],
      benefit:'Sweet potatoes are high in beta-carotene, which reduces oxidative stress in the brain.', isCustom:false },
    { id:'r10', name:'Spinach & Berry Smoothie', category:'Drink', prepTime:'5 min',
      ingredients:['1 cup spinach','½ cup frozen mixed berries','1 banana','1 cup almond milk','1 tbsp flaxseed'],
      steps:['Add all ingredients to blender.','Blend until smooth. Add more milk if too thick.'],
      benefit:'Flaxseed provides ALA omega-3s; berries offer anthocyanins linked to memory support.', isCustom:false },
  ],
  pantry: [
    { id:'p1', item:'Bread',      have:true  },
    { id:'p2', item:'Milk',       have:true  },
    { id:'p3', item:'Eggs',       have:true  },
    { id:'p4', item:'Butter',     have:true  },
    { id:'p5', item:'Bananas',    have:false },
    { id:'p6', item:'Yogurt',     have:false },
    { id:'p7', item:'Juice',      have:true  },
    { id:'p8', item:'Coffee/Tea', have:true  },
  ],
  foodLinks: [
    { id:'fl1', label:'DoorDash',        url:'https://www.doordash.com' },
    { id:'fl2', label:'Instacart',       url:'https://www.instacart.com' },
    { id:'fl3', label:'Grubhub',         url:'https://www.grubhub.com' },
    { id:'fl4', label:'Meals on Wheels', url:'https://www.mealsonwheelsamerica.org' },
  ],
  wellnessLinks: [
    { id:'wl1', label:'Insight Timer',    url:'https://insighttimer.com' },
    { id:'wl2', label:'Calm',             url:'https://www.calm.com' },
    { id:'wl3', label:'Libby / OverDrive',url:'https://libbyapp.com' },
    { id:'wl4', label:'Audible',          url:'https://www.audible.com' },
  ],
  apply() {
    if (!Storage.get('ng_helplines'))      Storage.set('ng_helplines',      this.helplines);
    if (!Storage.get('ng_recipes')) {
      // Normalize: convert array ingredients/steps to newline-separated strings
      const normalized = this.recipes.map(r => ({
        ...r,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients.join('\n') : (r.ingredients || ''),
        steps:       Array.isArray(r.steps)       ? r.steps.join('\n')       : (r.steps || '')
      }));
      Storage.set('ng_recipes', normalized);
    }
    if (!Storage.get('ng_pantry'))         Storage.set('ng_pantry',         this.pantry);
    if (!Storage.get('ng_food_links'))     Storage.set('ng_food_links',     this.foodLinks);
    if (!Storage.get('ng_wellness_links')) Storage.set('ng_wellness_links', this.wellnessLinks);
  },

  // Rich demo data for Richard — call once on first launch
  demoData() {
    // ── Medications ───────────────────────────────────────────
    if (!Storage.get('ng_medications')) {
      const meds = [
        {
          id: 'med-cl', brandName: 'Sinemet',
          genericName: 'Carbidopa-Levodopa', dosage: '25-100 mg', form: 'Tablet',
          instructions: 'Take on an empty stomach, 30 minutes before meals.',
          pillDescription: 'Small yellow oval tablet',
          schedule: [
            { slot: 'morning',   time: '08:00' },
            { slot: 'afternoon', time: '14:00' },
            { slot: 'evening',   time: '19:00' },
          ]
        },
        {
          id: 'med-rp', brandName: 'Requip',
          genericName: 'Ropinirole', dosage: '2 mg', form: 'Tablet',
          instructions: 'Take with or without food.',
          pillDescription: 'Small white round tablet',
          schedule: [
            { slot: 'morning',  time: '09:00' },
            { slot: 'bedtime',  time: '21:00' },
          ]
        },
        {
          id: 'med-mel', brandName: 'Melatonin',
          genericName: 'Melatonin', dosage: '3 mg', form: 'Tablet',
          instructions: 'Take 30 minutes before bed.',
          pillDescription: 'Small purple tablet',
          schedule: [
            { slot: 'bedtime', time: '21:30' },
          ]
        },
      ];
      Storage.set('ng_medications', meds);
    }

    // ── Medication log — mark morning doses as taken today ────
    if (!Storage.get('ng_med_log')) {
      const today = new Date().toISOString().slice(0, 10);
      Storage.set('ng_med_log', [
        { id: 'ml1', date: today, medicationId: 'med-cl',  slot: 'morning',   taken: true, timestamp: Date.now() - 3600000 },
        { id: 'ml2', date: today, medicationId: 'med-rp',  slot: 'morning',   taken: true, timestamp: Date.now() - 3500000 },
      ]);
    }

    // ── Emergency contacts ────────────────────────────────────
    if (!Storage.get('ng_contacts')) {
      Storage.set('ng_contacts', [
        { id: 'c1', name: 'Sarah Johnson',  relationship: 'Daughter',      phone: '617-555-0142', email: 'sarah.johnson@email.com', notes: 'Call first. She lives 10 minutes away.',    isPrimary: true,  isMedMonitor: true  },
        { id: 'c2', name: 'Michael Johnson',relationship: 'Son',           phone: '617-555-0198', email: 'michael.j@email.com',     notes: 'Works until 5 pm. Can help evenings.',      isPrimary: false, isMedMonitor: false },
        { id: 'c3', name: 'Dr. Linda Chen', relationship: 'Neurologist',   phone: '617-555-8400', email: '',                        notes: 'Massachusetts General Hospital. Mon–Fri 9–5.', isPrimary: false, isMedMonitor: false },
        { id: 'c4', name: 'Maria Santos',   relationship: 'Home Care Aide',phone: '617-555-2271', email: '',                        notes: 'Visits Mon, Wed, Fri mornings.',            isPrimary: false, isMedMonitor: false },
      ]);
    }

    // ── Calendar events ───────────────────────────────────────
    if (!Storage.get('ng_events')) {
      const d = new Date();
      const fmt = offset => {
        const x = new Date(d); x.setDate(d.getDate() + offset);
        return x.toISOString().slice(0, 10);
      };
      Storage.set('ng_events', [
        { id: 'ev1', title: 'Maria — Home Care Visit', date: fmt(1),  time: '09:00', notes: 'Morning routine help', category: 'health',   recurring: 'none' },
        { id: 'ev2', title: 'Grandchildren Visit — Emma & Noah', date: fmt(2), time: '14:00', notes: 'Sarah bringing the kids. Wear the blue sweater!', category: 'family', recurring: 'none' },
        { id: 'ev3', title: 'Dr. Chen — Neurology Check-up', date: fmt(7),  time: '10:30', notes: 'MGH Neurology Clinic. Sarah will drive.', category: 'health', recurring: 'none' },
        { id: 'ev4', title: 'Pharmacy Pickup — Sinemet refill', date: fmt(5), time: '11:00', notes: 'CVS on Main St.', category: 'health', recurring: 'none' },
      ]);
    }

    // ── Doctor's notes ────────────────────────────────────────
    if (!Storage.get('ng_doctors_notes')) {
      Storage.set('ng_doctors_notes', [
        {
          id: 'dn1', date: '2026-03-12', doctor: 'Dr. Linda Chen',
          specialty: 'Neurology', clinic: 'MGH Neurology',
          notes: 'Parkinson\'s stable. Motor symptoms well-controlled on current Sinemet dose. Continue Requip. Discussed importance of regular exercise — aim for 30 min walk daily. Sleep improving with Melatonin. Next visit in 4 weeks.',
          followUp: '2026-04-16', followUpNote: 'Check tremor response to new dosing schedule.',
        },
        {
          id: 'dn2', date: '2026-01-28', doctor: 'Dr. Priya Mehta',
          specialty: 'Primary Care', clinic: 'Brookside Family Medicine',
          notes: 'Annual physical. Blood pressure 122/78 — excellent. Cholesterol in normal range. Recommended Mediterranean diet, which Richard is already following. Flu shot given. All vaccinations up to date.',
          followUp: '',  followUpNote: '',
        },
      ]);
    }

    // ── Bills ─────────────────────────────────────────────────
    if (!Storage.get('ng_bills')) {
      const d2 = new Date();
      const due = offset => {
        const x = new Date(d2); x.setDate(d2.getDate() + offset);
        return x.toISOString().slice(0, 10);
      };
      Storage.set('ng_bills', [
        { id: 'b1', name: 'Electric Bill',            amount: 94.00,  dueDate: due(6),  isPaid: false, isAutomatic: true,  notes: 'Eversource — auto-pay on the 15th' },
        { id: 'b2', name: 'Medicare Supplement',      amount: 187.50, dueDate: due(1),  isPaid: false, isAutomatic: true,  notes: 'AARP — auto-pay' },
        { id: 'b3', name: 'Phone Bill',               amount: 45.00,  dueDate: due(12), isPaid: false, isAutomatic: false, notes: 'Verizon — pay online or call Sarah' },
        { id: 'b4', name: 'Water & Sewer',            amount: 68.00,  dueDate: due(18), isPaid: false, isAutomatic: false, notes: 'City of Boston — quarterly' },
      ]);
    }

    // ── Birthdays ─────────────────────────────────────────────
    if (!Storage.get('ng_birthdays')) {
      const yr = new Date().getFullYear();
      Storage.set('ng_birthdays', [
        { id: 'bd1', name: 'Sarah Johnson (daughter)', date: `${yr}-04-18`, notes: 'Loves yellow tulips and lemon cake.' },
        { id: 'bd2', name: 'Emma Johnson (granddaughter)', date: `${yr}-06-03`, notes: 'She will be turning 7!' },
        { id: 'bd3', name: 'Michael Johnson (son)', date: `${yr}-09-22`, notes: 'Likes the Boston Red Sox.' },
      ]);
    }

    // ── Passwords placeholder ─────────────────────────────────
    if (!Storage.get('ng_passwords')) {
      Storage.set('ng_passwords', [
        { id: 'pw1', site: 'Medicare.gov',       username: 'richard.johnson54', password: '', notes: 'Account for benefits & claims' },
        { id: 'pw2', site: 'Gmail',              username: 'richard.johnson1954@gmail.com', password: '', notes: '' },
        { id: 'pw3', site: 'CVS Pharmacy',       username: 'rjohnson@email.com', password: '', notes: 'Prescription refills online' },
      ]);
    }
  }
};
