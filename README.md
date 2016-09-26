# Account Management App
Track and manage clients, passwords and projects for freelancers and business.  

## Full Stack
Install | View Engine | CSS Preprocessor | Database | Build tool
---|---|---|---|---
MVC | Handlebars | Node-Sass | MongoDB |

## Tools of the App
Clients | Password | Project
---|---|---
Info | Info | Info
Invoices Generator | Copy & paste | Personal or Client
Estimates Generator | Screen View Protected | Time Tracker
Expenses Generator | Account Activity  | Timeline Calender
Proposals Generator | |

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

## Project Phases
#### I
[ ] Make the pages for Clients, Password and Project.
[ ] Make the database Schema for Clients, Password and Project.
#### II
[ ] Make a Rapid prototype design in Adobe Illustrator
[ ] Design to HTML5/CSS3 responsive.
[ ] Animation
#### III
[ ] Add a `Custom Fields` for extra information of a client form
[ ] Add Sign up.
#### IV
[ ] Deploy it to Heroku
[ ] Usability Testing
