# Account Management App
Track and manage clients, passwords and projects for freelancers and business.  

## Full Stack
Install | View Engine | CSS Preprocessor | Database | Build tool
---|---|---|---|---
MVC | Handlebars | Node-Sass | MongoDB |

#### Clients Info
- title: String,
- first name: String,
- last name: String,
- company: String,
- address: String,
- email: String,
- website: String,
- phone: Number,
- mobile: Number,
- fax: Number,
- budget: Number,
- languages: String,
- notes: [String],
- client Tax Numbers: Number

#### Password Info
- username: String,
- email: String,
- password: String,
- summary: String,
- category: String,
- company_url: String,
- company: String,
- pay_subscription: Boolean,
- pin: Number,
- year: Number,
- task_list: [String],
- created_at: { type: Date, default: Date.now},
- updated_at: { type: Date, default: Date.now}

#### Project Info
- Title: String,
- Summary: String,
- Category: String,
- Notes: [String],
- Created_at: { type: Date, default: Date.now},
- Start_at: { type: Date, default: Date.now},
- Finish_at: { type: Date, default: Date.now}


#### What I'm trying to make.
1. Task Management for freelancers and business
 Password List
 Client List
 Project List

2. Task Management for starting projects:
  Project Overview
  User Flows
  Information Architecture
  Personas
  Sketches
  Wireframes & Prototypes
  Usability Testing Results
  High Fidelity Prototype

#### Thinks to do LATER
  - brainstorming text can get generator from the images of the moodboard
