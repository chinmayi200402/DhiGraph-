// API Configuration
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

// Helper to parse CSV
function parseCSV(csvText: string) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const results: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Match columns handling quotes
    const matches: string[] = [];
    let current = '';
    let insideQuotes = false;
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        matches.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    matches.push(current.trim().replace(/^"|"$/g, ''));

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = matches[index] || '';
    });
    results.push(row);
  }
  return results;
}

// Global fetch interceptor setup
export function setupApiMockInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    // Check if this is an API call pointing to our API URL
    if (urlString.includes('/api/')) {
      try {
        // Try the actual network request first
        const response = await originalFetch(input, init);
        // If it succeeded (2xx or 3xx), return it
        if (response.ok) {
          return response;
        }
        // If it's a server error (e.g. 502 Bad Gateway / 504), drop through to fallback
        if (response.status >= 500) {
          console.warn(`API server returned status ${response.status}. Falling back to mock data...`);
          return handleMockRequest(urlString, init);
        }
        return response;
      } catch (error) {
        // Network error (server down / CORS issue / offline)
        console.warn('API server is unreachable. Falling back to mock data...', error);
        return handleMockRequest(urlString, init);
      }
    }

    // Fall back to original fetch for normal URLs (like assets, public files, etc.)
    return originalFetch(input, init);
  };

  async function handleMockRequest(url: string, init?: RequestInit): Promise<Response> {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;
    const method = init?.method?.toUpperCase() || 'GET';

    // Helper to return JSON response
    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // 1. Initialize data in localStorage if empty
    if (!localStorage.getItem('mock_patients')) {
      try {
        // Fetch patients_database.csv from public folder
        const csvRes = await originalFetch('/patients_database.csv');
        if (csvRes.ok) {
          const csvText = await csvRes.text();
          const parsed = parseCSV(csvText);
          const mappedPatients = parsed.map((p, idx) => ({
            _id: `patient_${idx + 1}`,
            id: `patient_${idx + 1}`,
            name: p['Name'] || 'Unknown Patient',
            age: parseInt(p['Age']) || 35,
            gender: p['Gender'] || 'Male',
            contact: p['Contact'] || '9999999999',
            blood_group: p['Blood Group'] || 'O+',
            chief_complaint: p['Chief Complaint'] || 'General Checkup',
            prakriti: ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha'][idx % 6],
            status: ['In Treatment', 'Scheduled', 'Completed', 'New'][idx % 4],
            createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString()
          }));
          localStorage.setItem('mock_patients', JSON.stringify(mappedPatients));
        }
      } catch (e) {
        console.error('Failed to load mock CSV data', e);
      }
    }

    // Default fallbacks if CSV fetch failed or was empty
    let patients = JSON.parse(localStorage.getItem('mock_patients') || '[]');
    if (patients.length === 0) {
      patients = [
        { _id: 'patient_1', id: 'patient_1', name: 'Aarav Sharma', age: 45, gender: 'Male', contact: '9876543210', blood_group: 'O+', chief_complaint: 'Back Pain', status: 'In Treatment', prakriti: 'Vata-Pitta' }
      ];
      localStorage.setItem('mock_patients', JSON.stringify(patients));
    }

    // 2. Mock routes handling
    // GET /api/patients
    if (path.endsWith('/api/patients') && method === 'GET') {
      return jsonResponse(patients);
    }

    // POST /api/patients
    if (path.endsWith('/api/patients') && method === 'POST') {
      const body = JSON.parse(init?.body as string || '{}');
      const newPatient = {
        _id: `patient_${Date.now()}`,
        id: `patient_${Date.now()}`,
        name: body.name || 'New Patient',
        age: body.age || 30,
        gender: body.gender || 'Male',
        contact: body.contact || '',
        blood_group: body.blood_group || 'O+',
        chief_complaint: body.chief_complaint || '',
        prakriti: null,
        status: 'New',
        createdAt: new Date().toISOString()
      };
      patients.unshift(newPatient);
      localStorage.setItem('mock_patients', JSON.stringify(patients));
      return jsonResponse(newPatient, 201);
    }

    // GET /api/dashboard/stats
    if (path.endsWith('/api/dashboard/stats') && method === 'GET') {
      return jsonResponse({
        totalPatients: patients.length,
        todayAppointments: 10,
        completedToday: 4,
        inventoryItems: 7,
        lowStockAlerts: 2
      });
    }

    // GET /api/inventory
    if (path.endsWith('/api/inventory') && method === 'GET') {
      if (!localStorage.getItem('mock_inventory')) {
        const inventoryData = [
          { _id: 'inv_1', item_name: "Ashwagandha Churna", category: "Churna", quantity: 18, min_stock_level: 20, unit: "kg" },
          { _id: 'inv_2', item_name: "Dhanwantaram Tailam", category: "Tailam", quantity: 8, min_stock_level: 15, unit: "liters" },
          { _id: 'inv_3', item_name: "Triphala Guggulu", category: "Gulika", quantity: 15, min_stock_level: 10, unit: "bottles" },
          { _id: 'inv_4', item_name: "Brahmi Vati", category: "Gulika", quantity: 2, min_stock_level: 5, unit: "boxes" },
          { _id: 'inv_5', item_name: "Massage Towels", category: "Consumables", quantity: 120, min_stock_level: 50, unit: "pcs" },
          { _id: 'inv_6', item_name: "Ksheerabala Oil", category: "Tailam", quantity: 45, min_stock_level: 15, unit: "liters" },
          { _id: 'inv_7', item_name: "Chyawanprash", category: "Churna", quantity: 30, min_stock_level: 15, unit: "jars" }
        ];
        localStorage.setItem('mock_inventory', JSON.stringify(inventoryData));
      }
      const inventory = JSON.parse(localStorage.getItem('mock_inventory') || '[]');
      const lowStockOnly = parsedUrl.searchParams.get('low_stock') === 'true';
      if (lowStockOnly) {
        return jsonResponse(inventory.filter((item: any) => item.quantity < item.min_stock_level));
      }
      return jsonResponse(inventory);
    }

    // PUT /api/inventory/:id
    if (path.includes('/api/inventory/') && method === 'PUT') {
      const invId = path.split('/').pop();
      const body = JSON.parse(init?.body as string || '{}');
      const inventory = JSON.parse(localStorage.getItem('mock_inventory') || '[]');
      const item = inventory.find((i: any) => i._id === invId);
      if (item) {
        item.quantity = body.quantity;
        localStorage.setItem('mock_inventory', JSON.stringify(inventory));
        return jsonResponse(item);
      }
      return jsonResponse({ error: 'Item not found' }, 404);
    }

    // GET /api/appointments
    if (path.endsWith('/api/appointments') && method === 'GET') {
      // Generate appointments using patients list
      const appointments = patients.slice(0, 10).map((p: any, idx: number) => ({
        _id: `appt_${idx}`,
        id: `appt_${idx}`,
        patient_id: p,
        therapy_id: { name: ['Abhyanga', 'Shirodhara', 'Basti', 'Nasya'][idx % 4], duration_minutes: [60, 45, 30, 30][idx % 4] },
        room_id: { room_number: ['101', '205', '302'][idx % 3] },
        therapist_id: { name: ['Dr. Arjun Nair', 'Dr. Meera Menon', 'Dr. Ramesh Kumar'][idx % 3] },
        date: new Date().toISOString(),
        start_time: `${9 + idx}:00 AM`,
        end_time: `${10 + idx}:00 AM`,
        status: idx < 4 ? 'Completed' : 'Scheduled'
      }));
      return jsonResponse(appointments);
    }

    // POST /api/prakriti
    if (path.endsWith('/api/prakriti') && method === 'POST') {
      const body = JSON.parse(init?.body as string || '{}');
      // Update patient's prakriti in localStorage list
      const pIndex = patients.findIndex((p: any) => p._id === body.patient_id);
      if (pIndex !== -1) {
        patients[pIndex].prakriti = 'Assessed';
        localStorage.setItem('mock_patients', JSON.stringify(patients));
      }
      return jsonResponse({ message: 'Success' });
    }

    // GET /api/treatment-journey
    if (path.endsWith('/api/treatment-journey') && method === 'GET') {
      const mockJourney = [
        { _id: 'j_1', day_number: 1, therapy_id: { name: 'Abhyanga' }, diet_plan: 'Warm water, no cold foods', session_completed: true, vitals: { pulse: '76', bp: '120/80', appetite: 'Good' } },
        { _id: 'j_2', day_number: 2, therapy_id: { name: 'Shirodhara' }, diet_plan: 'Warm light soup', session_completed: false, vitals: { pulse: '72', bp: '118/76', appetite: 'Moderate' } },
        { _id: 'j_3', day_number: 3, therapy_id: { name: 'Nasya' }, diet_plan: 'Ayurvedic herbal tea', session_completed: false, vitals: { pulse: '74', bp: '122/80', appetite: 'Good' } }
      ];
      return jsonResponse(mockJourney);
    }

    // PUT /api/treatment-journey/:id
    if (path.includes('/api/treatment-journey/') && method === 'PUT') {
      return jsonResponse({ message: 'Success' });
    }

    // POST /api/ai/query (Chatbot)
    if (path.endsWith('/api/ai/query') && method === 'POST') {
      const body = JSON.parse(init?.body as string || '{}');
      const responseText = `As Clinical Assistant, I analyzed the records for this patient. Their chief complaint is "${body.query || 'general wellness'}". I recommend continuing the Ayurvedic therapies such as Abhyanga and administering warm liquids. Let me know if you need specific dosage details!`;
      return jsonResponse({ response: responseText });
    }

    // POST /api/ai/transcribe-scribble
    if (path.endsWith('/api/ai/transcribe-scribble') && method === 'POST') {
      return jsonResponse({ transcription: 'Patient reports moderate relief from lower back pain. Advised to continue Abhyanga massage once daily.' });
    }

    // Default 404
    return new Response(JSON.stringify({ error: 'Mock route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
