# Smart Procurement Shelf — An Edge-AI Based Smart Inventory and Procurement System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Symposium](https://img.shields.io/badge/Event-MakeInSilicon_'26-4F46E5)](https://www.iiitnr.ac.in/)

> **Research Prototype presented at MakeInSilicon Symposium — IIIT Naya Raipur**  
> **Authors:** Samarth Gudoorkar & KSK Sasank  
> **Registration ID:** 27325  
> **Institution:** Institute of Aeronautical Engineering  

---

## 📌 Executive Summary

Traditional inventory shelves rely on expensive multi-sensor arrays (RFID / load cells) or continuously stream high-bandwidth video to centralized cloud servers. The **Smart Procurement Shelf** introduces a decentralized Edge-AI architecture:

> **A shelf that doesn't just monitor stock — it validates inventory changes across temporal frames and turns shortages into accountable, traceable procurement actions.**

### 🔬 4 Core Research Contributions

1. **Local Edge Intelligence**: Quantized YOLOv8s INT8 neural network executes directly on local edge hardware accelerators (e.g., NVIDIA Jetson Orin Nano, Hailo-8 NPU) at 30 FPS. Zero raw video is transmitted over external networks.
2. **Confidence-Aware Multi-Frame Consensus**: Eliminates transient false alarms from worker hands, occlusions, and shadows. An invariant $N=5$ frame temporal consensus engine mandates repeated agreement before locking inventory counts.
3. **Inventory-to-Action Integration**: Autonomous bridge between visual stock perception and procurement draft order formulations with automated pack size calculations.
4. **Controlled & Traceable Procurement**: Strict human-in-the-loop managerial governance. Approval of a purchase request authorizes the supplier order but strictly does not increase inventory counts. Confirmed stock increments occur exclusively upon recorded receipt of goods.

---

## 🚀 Live Demo & Presentation Walkthrough

The platform includes a dedicated **Guided 8-Step Presentation Walkthrough** specifically built for symposium judges:

1. **Baseline State**: Shelf A1 initialized with 12 DHT22 sensor modules (Min safety threshold = 6).
2. **Simulate Removal**: 8 physical modules removed from Shelf A1.
3. **Edge Optical Detection**: Camera observes drop to 4 units ($96.4\%$ confidence).
4. **Multi-Frame Consensus**: 5 consecutive invariant frames verify count; inventory locked to 4 units.
5. **Threshold Breach Alert**: Stock ($4 < 6$) triggers a high-priority low-stock condition.
6. **Auto-Draft Procurement**: Request `PR-2024-xxx` auto-drafted for 10 units (\$45.00).
7. **Managerial Sign-Off**: Lab Manager approves order with PO authorization.
8. **End-to-End Audit**: Full cryptographic audit dossier verified on the operations dashboard.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Design System**: Slate + Indigo Industrial SaaS (`#0F172A`, `#F8FAFC`, `#4F46E5`)
- **Visual Analytics**: Recharts (Velocity area charts, category distribution, latency jitter histograms, confidence bins)
- **Edge Optical Stream**: HTML5 Canvas / SVG HUD with simulated bounding box tracking + optional browser camera preview mode
- **Persistence**: Centralized local ledger in `LocalStorage` (`smart_shelf_state_v1`)

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/samarthgudoorkar/smart-procurement-shelf.git
cd smart-procurement-shelf

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Authors & Academic Accreditation

- **Samarth Gudoorkar** — Institute of Aeronautical Engineering
- **KSK Sasank** — Institute of Aeronautical Engineering
- **Symposium**: MakeInSilicon — IIIT Naya Raipur
- **Registration ID**: 27325
