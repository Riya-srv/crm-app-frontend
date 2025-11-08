# Anvaya - Customer Relationship Management 

A full-stack customer relationship management app where you can browser, add, update and delete leads and sales agent data.
Built with React frontend, Express/Node backend and MongoDB database.

---
## Demo Link

[Live Demo](https://crm-app-frontend-cnge.vercel.app/)

---
## Quick Start

```
git clone https://github.com/Riya-srv/crm-app-frontend.git
cd <your-repo>
npm install
npm run dev
```

---

## Technologies
- React JS
- React Router
- Node JS
- Express
- MongoDB

## Demo Video
Watch a walkthrough (5-7 minutes) of all the major features of this app: [Video](https://drive.google.com/drive/folders/1pTqlkjmLS8-6kum6FaRIl1c_sr4pd-Qc?usp=sharing)

---
## Features
**Dashboard** 
- Summary cards for key leads with status, number of leads with status and Quick Filters based on Lead Status.
- Add New Lead button, to update new set of leads with data.

**Navigation**
- Sidebar or top navigation menu for seamless app navigation.
- Routing between views (dashboard, leads, agents, reports).


**Leads**
- List view of all leads with filtering by Status & Agents and sorting by Priority & Time to Close.
- Clicking on each lead re-routes to Lead Details page for that particular lead and we can see all the related information.

**Lead Details**
- We have provision to Edit Lead details and Agents can add comments as well.

**Sales Agents**
- List of sales agents with e-mail address.
- Button to Add New Agent.

**Leads By Status View**
- Status - New, Qualified, Contracted, Proposal Sent and Closed.
- This page displays list of leads and their agents based on Status Filter.
- Further, filters by Agent and Priority can be applied on status filtered leads.
- Sorting by Time to Close is applicable.

**Leads By Agent View**
- This page displays list of leads based on Agents associated to them.
- Further, filters by Lead Status and Priority can be applied on agent filtered leads.
- Sorting by Time to Close is applicable.

**Reports**
- Pie and Bar chart view of Total Leads Closed and in Pipeline, Leads Closed by Sales Agent and Lead Status Distribution are displayed
- Used recharts library to display the report.

**Settings**
- List of Agents and Leads are displayed with an option to Delete. Admin can delete any Agent or Lead from this page.

---
## API Reference

### POST /leads
Create a new lead <br>
Sample Response:<br>
```
{_id, name, source, salesAgent, status, tags, timeToClose, priority}
```

### GET /leads
Get a list of leads.<br>
Sample Response:<br>
```
[{id, name, source, salesAgent, status, tags, timeToClose, priority}]
```

### PUT /leads/:id
Updates a lead with new information.<br>
Sample Response:<br>
```
{name, source, salesAgent, status, tags, timeToClose, priority}
```

### DELETE /leads/:id
Deletes a specific lead by its ID.<br>
Sample Response:<br>
```
{"message": "Lead deleted successfully."}
```

### POST /agents
Adds a new sales agent.<br>
Sample Response:<br>
```
{name, email}
```

### GET /agents
Fetches all sales agents.<br>
Sample Response:<br>
```
{id, name, email}
```

### POST /leads/:id/comments
Adds a new comment to a specific lead.<br>
Sample Response:<br>
```
{id, comment, author, createdAt}
```

### GET /leads/:id/comments
Fetches all comments for a specific lead.<br>
Sample Response:<br>
```
[{id, comment, author, createdAt}]
```

### GET /report/last-week
Fetches all leads that were closed (status: Closed) in the last 7 days.<br>
Sample Response:<br>
```
[{id, name, salesAgent, closedAt}]
```

### GET /report/pipeline
Fetches the total number of leads currently in the pipeline (all statuses except Closed).
Sample Response:<br>
```
{totalLeadsInPipeline}
```

## Contact
For bugs or feature request, please reach out to riyasrv2211@gmail.com