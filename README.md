# Lise BOUSQUET · Digital Portfolio

Personal portfolio built for the **AWS Student Builder Challenge: "Build your tech superpower"**.

MSc in Management student at Imperial College London, tech enthusiast with a strong interest in cybersecurity, cloud computing and the business of technology.

## The creative feature: The Cloud Handshake

Visitors don't just open the site, they **connect to my cloud**.
Clicking **INITIATE HANDSHAKE** starts a short authentication sequence (ping sent, connection established, identity verified).
A glowing fiber-optic cable lights up between the console and my avatar on her cloud, and an "ACCESS GRANTED" notification appears.
Then my avatar greets the visitor and travels with them down the page as a guide.

Other interactive parts:
- **Interactive 3D globe** of the countries I lived in and explored, with my photos (d3 + TopoJSON)
- **Cloud Jumping**, a small game: help me and my horse jump over clouds
- **Holographic skill modules** for my "superpowers"
- **Spotlight stage** on the contact page

## Sections

| # | Page | Content |
|---|------|---------|
| 1 | My Personal Data | About me, my story, education |
| 2 | Professional Experiences | Internships in cybersecurity and cloud security |
| 3 | Achievements | Certifications and projects, including this website |
| 4 | My Superpowers | Soft and technical skills, languages |
| 5 | Meet Lise | Travel globe, horse riding, Cloud Jumping game |
| 6 | Let's Connect | Email, LinkedIn, Calendly, CV |

## How it is built and hosted on AWS

- **Code:** plain HTML, CSS and JavaScript. No framework, no build step.
- **Live site:** https://main.dmaoai5lkpddo.amplifyapp.com
- **Hosting:** **AWS Amplify Hosting** (static web app `lise-bousquet-portfolio`, branch `main`).
- **Deploying:** each new version is packed as a zip from this repository and published with the AWS CLI
  (`aws amplify create-deployment` → upload → `aws amplify start-deployment`).
- **Delivery:** Amplify serves the site over HTTPS through its global content delivery network.
- **Region:** eu-north-1 (Stockholm).
- **Tools:** built with Claude Code, an AI coding agent, connected to AWS through the AWS MCP Server and the AWS CLI.

## What I learned

- Setting up AWS access (CLI profile, MCP server) and working safely with credentials
- Guiding an AI agent from an idea to a working website, step by step
- Hosting and deploying a website on AWS with Amplify and GitHub
- Optimising images and videos for the web
- Delivering a complete project under a tight deadline

## Run it locally

Open `index.html` in a browser. No installation needed.

© 2026 Lise Bousquet. Photos and personal content are not licensed for reuse.
