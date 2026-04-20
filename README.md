<p align="center">
  <img src="https://socialify.git.ci/chinmayi200402/ayushayur/image?description=1&font=Raleway&name=1&pattern=Charlie%20Brown&theme=Auto" alt="project-image">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="shields">
  &nbsp;
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="shields">
  &nbsp;
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="shields">
  &nbsp;
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="shields">
  &nbsp;
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="shields">
</p>

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repository and install frontend dependencies</p>

```bash
npm install
```

<p>2. Run frontend</p>

```bash
npm run dev
```

<p>3. Install backend dependencies</p>

```bash
cd ayushayur-backend-master
npm install
```

<p>4. Run backend</p>

```bash
node server.js
```
<br>

<h2>📷 Project Screenshots:</h2>

<img src="./imgs/login_screen.png" alt="login-screenshot" width="700" height="400">
 &nbsp;

<h2>⚙️ Architecture:</h2>

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#61DAFB,stroke:#20232a,stroke-width:2px,color:#000
    classDef backend fill:#6DA55F,stroke:#2b3e30,stroke-width:2px,color:#fff
    classDef db fill:#4ea94b,stroke:#2e6b2c,stroke-width:2px,color:#fff
    classDef ai fill:#BB86FC,stroke:#3b0086,stroke-width:2px,color:#000
    classDef hw fill:#FFB300,stroke:#8c6200,stroke-width:2px,color:#000

    %% Components
    subgraph Client Side["Client Interface (React / Vite)"]
        UI["React UI Components<br/>(Tailwind, Shadcn)"]
        NFC["NFC Scanner Interface"]
    end

    subgraph Server Side["Backend API (Node.js / Express)"]
        Router["Express Router"]
        CTRL["Controllers<br/>(AI, Dashboard, Patients, Prakriti)"]
        Router --> CTRL
    end

    subgraph Database Layer["Database"]
        MongoDB[("MongoDB<br/>(Patient Records, Vitals)")]
    end

    subgraph External Services["External Services"]
        Gemini["Gemini API<br/>(AI Transcription & Analysis)"]
    end

    %% Connections
    UI -- "REST API (HTTP/JSON)" --> Router
    NFC -- "Scans Tags" --> UI
    CTRL -- "Reads/Writes" --> MongoDB
    CTRL -- "Analyzes Data / Clinical Scribbles" --> Gemini

    %% Apply Classes
    class UI frontend;
    class Router,CTRL backend;
    class MongoDB db;
    class Gemini ai;
    class NFC hw;
```

 &nbsp;

<h2>🚀 Future Enhancements:</h2>
<ul>
  <li>Implement advanced AI integration for deeper predictive healthcare analytics.</li>
  <li>Add comprehensive role-based access control and biometric authentication for secure access.</li>
  <li>Expand the mobile application views for remote tele-consultation support.</li>
</ul>
