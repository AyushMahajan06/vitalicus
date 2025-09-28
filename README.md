# Vitalicus Software Platform

This repository contains the **software side** of our healthcare hardware-software solution developed for HackGT 12, inspired by Impiricus’s challenge for next-generation healthcare provider (HCP) engagement.

---

## Overview

The project centers around the our hardware solution, a small portable device with sensors for capturing **four key things**:

- Heart Rate  
- SpO₂  
- Skin Temperature
- Transcribed notes from the patient

These readings are automatically synced to this web platform, where providers and care teams can view live patient data, historical trends, and AI-powered insights.

---

## Software Role

This software stack is the companion to the physical device:

- **Realtime Vitals Dashboard**  
  Displays incoming heart rate, SpO₂, and skin temperature values. Providers can see current measurements and receive timely alerts.

- **Pre-Visit Questionnaires**  
  The buddy prompts patients with simple voice-driven yes/no/maybe questions. Responses are securely synced and shown in provider dashboards.

- **Prescription Generation**  
  Providers can quickly draft prescriptions by entering drug names, timings, and notes. The backend generates a standardized PDF prescription document.

- **Graphs & Insights**  
  The platform includes space for trend graphs and AI insights, helping providers make decisions at a glance.

- **EMR Integration**  
  Designed to integrate with EMR systems through secure APIs, ensuring provider workflows stay seamless.

---

## Key Features

- **Live Vitals from Hardware**  
  Connected via Firebase Realtime Database, new sensor values appear every few seconds. Manual refresh is also supported.

- **Secure Data Handling**  
  Privacy-compliant data design with Firebase rules and (planned) role-based access controls.

- **AI-Powered Support**  
  Hooks for dynamic questionnaires and insights, so the platform grows smarter as it scales.

- **Emergency Workflow**  
  The physical buddy includes a button to instantly connect patients to their care team or representative. This software is designed to receive and route those alerts.

---


## Vision

The **Patient Desk Buddy + Vitalicus platform** work together to reduce friction in healthcare:

- Patients get simple, approachable pre-visit tools.  
- Providers walk into appointments already informed.  
- Care teams can triage urgency faster.  
- Reps and partners gain more actionable engagement data.

This repo is where the **software side comes alive**, turning raw device data into insights that matter.
