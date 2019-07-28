# How to Automate Monthly Tasklist Creation inside Teamwork Projects

## The Agency Automators Monthly Recurring Tasklist Solution

Build your monthly recurring tasklists with this simple tool

After diving into [Teamwork's api documentation](https://developer.teamwork.com/) around [projects](https://developer.teamwork.com/projects/projects/retrieve-all-projects), [roles](https://developer.teamwork.com/projects/project-roles/list-roles-on-a-project), and [tasklists](https://developer.teamwork.com/projects/task-lists/create-task-list) we saw a path.

Here's how our automated solution works:

1.  At midnight of the first day of each month, or tool, polls Teamwork's Projects API to pull in all projects inside specific categories.
2.  Our tool then grabs the roles and User Ids of each role on each project from our first query using Teamwork's roles API.
3.  Our tool then creates a new tasklist called "July SEO Tasks" where July is the new Month's name and assigns each task in the new tasklist to the person who has been assigned a role inside the project. All the dev tasks are siigned to the project dev. All the SEO tasks are assigned to the project SEO.

## Prerequisites

For this automation to run, you need to set up several things for each project in advance inside Teamwork and on your Server.

### Teamwork Requirements

#### Create Tasklist Templates for each Package Level

You need to create a tasklist template for each Project Category **that you want to include in your monthly automation**.

**Pro tip:** make your life easy by naming each tasklist template to match the name of the Project Category.

**Pro tip #2:** assign each task to choose later and put the name of the role in the popup like this:

<video src="https://decwap8ztgrry.cloudfront.net/items/0Z320Y462F1w3L471C1w/%5Bf7aa375e93156b765bd4ded61baadd4a%5D_Screen+Recording+2019-07-27+at+11.34+AM.mov" controls="" style="display: block;height: auto;width: 100%;">Screen Recording 2019-07-27 at 11.34 AM.mov</video>

This will allow our automation to assign the task to the user with that role inside the project when the automation runs each month.

#### Categorize every project carefully

> ##### Set up the Project Category to match the tasklist template that you want your team to execute for the client every month.

Log into each project's settings by navigating to Project > settings along the top navigation over the project's tasks.

Once on the settings screen edit the Project category and set it to the appropriate category.

#### Assign Roles in each project

When you build out a project in Teamwork, assign different roles to each Project.

In our agency, each SEO project had a simple set of roles: PM for Project Manager, SEO for the responsible SEO, PPC for Paid Search Practitioner, and DEV for the team member who would be building out content for each project on a client's website.

### The Script

1.  [Download the zip file](https://agencyautomators.com/files/auto.zip)

    The zip contains the [index.js file](https://github.com/noahlearner/Teamwork-Tasks-Automation/blob/master/index.js) (that you'll see commented below) and also the node dependencies you'll need.

2.  Edit your copy of index.js to match your agency's needs.
3.  Upload the auto folder (and all files inside) to your server.
4.  Set up the cron to run each month.

### The Commented Script

Here's the [index.js file](https://github.com/noahlearner/Teamwork-Tasks-Automation/blob/master/index.js) that you'll be customizing

```
const express = require('express'),
      fetch = require('node-fetch'),
      btoa = require('btoa'),
      app = express(),
      moment = require('moment'),
      company = "xxx", //change to your Teamwork Company Name
      key = "xxx" 
// change to your api key. Click on your Initials > edit my details > api key and mobile found in top Corner of your teamwork log in. 


let d = new Date(),
    n = d.getMonth(),
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    month = months[n]

const handleProjectData = () => {
  const url = `https://${company}.teamwork.com/projects.json?catId=111,112,1234,123,12345` 
  // these catIds are the project Category ids that we want to run our automation for.  
  // This allows you to limit the scope for the automation to run for specific project categories.
  // You'll need to replace these with the category Ids that Correspond to *Your* Teamwork installation
  fetch(url, {
    headers: { 'Authorization': `BASIC ${btoa(`${key}:xxx`)}` }
  }).then(r => r.json())
    .then(data => {
      const projects = data.projects
      let json = 0
      projects.forEach((project, i) => {
        let item = project.id,
            categoryId = project.category.id

       
        setTimeout(() =>  { fetchProjectRoles(item, categoryId) }, i * 800)
    })
  }).catch(e => console.error(e))
}
/* 
In this section of the script you'll see that we have four roles calles SEO, DEV, PPC, and PM.  
Change these to match the names of the roles that you've assigned inside your projects.

For Example, Let’s change the role from SEO to OUTREACH:

OLD CODE

let seoVal = "SEO",
          indexSEO = data1.roles.findIndex((item, i) => {
            if (item.name != null) {
              return item.name === seoVal && item.users.length
            } else {
              return 0
            }
          })

     let seo =' ',dev = ' ', ppc =' ', pm = ' ', catId = ' ';

NEW CODE

let outreachVal = "OUTREACH",
          indexOutreach = data1.roles.findIndex((item, i) => {
            if (item.name != null) {
              return item.name === outreachVal && item.users.length
            } else {
              return 0
            }
          })

     let outreach =' ',dev = ' ', ppc =' ', pm = ' ', catId = ' ';

*Adding new Roles*

For each role below you'll see a code block like: 

let seoVal = "SEO",
          indexSEO = data1.roles.findIndex((item, i) => {
            if (item.name != null) {
              return item.name === seoVal && item.users.length
            } else {
              return 0
            }
          })
          
To add a new Role, prepend the above codeblock above line 92, and update the variable name, 
and the indexSEO and "SEO" role name to match your new role. 	
*/

const fetchProjectRoles = (item, categoryId) => {
  const url = `https://${company}.teamwork.com/projects/${item}/roles.json`
  fetch(url, {
    headers: { 'Authorization': `BASIC ${btoa(`${key}:xxx`)}` }
  }).then(r => r.json())
    .then(data1 => {
      
      let seoVal = "SEO",
          indexSEO = data1.roles.findIndex((item, i) => {
            if (item.name != null) {
              return item.name === seoVal && item.users.length
            } else {
              return 0
            }
          })

      let devVal = "DEV",
          indexDev = data1.roles.findIndex((item, i) =>{
            if (item.name != null) {
              return item.name === devVal && item.users.length
            } else { return 0 }
          })

     let ppcVal = "PPC",
         indexPPC = data1.roles.findIndex((item, i) =>{
           if (item.name != null) {
             return item.name === ppcVal && item.users.length
           } else { return 0 }
          })

     let pmVal = "PM",
         indexPM = data1.roles.findIndex((item, i) =>{
           if (item.name != null) {
             return item.name === pmVal && item.users.length
           } else { return 0 }
         })

     let seo ='',dev = '', ppc ='', pm = '', catId = '';
/* 
You need to update line 122 so that the variable names match what you've set above.  
You'll also need to add any new roles above to match the roles inside your company.	
*/
     if(indexSEO == -1){ seo = '' } else { seo = "\"SEO\": "+data1.roles[indexSEO].users[0].id+"," } 
	  // We are assigning the SEO user that is in place to all SEO tasks.  
     if(indexDev == -1){ dev ='' } else { dev = "\"DEV\" :"+data1.roles[indexDev].users[0].id+"," } 
	  // We are assigning the DEV user that is in place to all DEV tasks.  

     if(indexPPC == -1){ ppc ="\"PPC\": 1112" } else { ppc = "\"PPC\": "+data1.roles[indexPPC].users[0].id+"" }  
	  // We are assigning the PPC user that is in place to all PPC tasks. 
	  // Note for this role we have a fallback USER Id in place in case there is not a PPC assigned to the task. 
     if(indexPM == -1){ pm ="\"PM\": 1111," } else { pm = "\"PM\": "+data1.roles[indexPM].users[0].id+"," }   
	  // We are assigning the PM user that is in place to all PPC tasks. 
	  // Note for this role we have a fallback USER Id in place in case there is not a PM assigned to the task. 
 
/*
An example where we change the role from SEO to OUTREACH, alter your code as follows:

Old Code
if(indexSEO == -1){ seo = ' ' } else { seo = "\"SEO\": "+data1.roles[indexSEO].users[0].id+"," }

New Code where we've changed the role from SEO to OUTREACH
if(indexOutreach == -1){ outreach = ' ' } else { outreach = "\"OUTREACH\": "+data1.roles[indexOutreach].users[0].id+"," }
*/
     if(categoryId == 13634) catId = "713735" 
	  // This marries the project inside project category 13634 (SEO XS RETAINER ) with the tasklist template #713735 called SEO - XS.  
	  // Update the CategoryId and Tasklist template ID to match the category # inside your Teamwork installation.
     if(categoryId == 13630) catId = "713732" 
	  // This marries the project inside project category 13630 (SEO S RETAINER ) with the tasklist template #713732 called SEO - S.  
	  // Update the CategoryId and Tasklist template ID to match the category # inside your Teamwork installation.
     if(categoryId == 13631) catId = "749551" 
	  // This marries the project inside project category 13631 (SEO M RETAINER ) with the tasklist template #749551 called SEO - M.  
	  // Update the CategoryId and Tasklist template ID to match the category # inside your Teamwork installation.
     if(categoryId == 13632) catId = "1179505" 
	  // This marries the project inside project category 13632 (SEO L RETAINER ) with the tasklist template #1179505 called SEO - L.  
	  // Update the CategoryId and Tasklist template ID to match the category # inside your Teamwork installation.
     if(categoryId == 13633) catId = "1179542" 
	  //This marries the project inside project category 13633 (SEO XL RETAINER ) with the tasklist template #1179542 called SEO - L.  
	  // Update the CategoryId and Tasklist template ID to match the category # inside your Teamwork installation.

     let jason = '{"todo-list":{"name":"' + month + ' SEO Tasks","todo-list-template-id": "'+catId+'","todo-list-template-assignments":{'+seo+dev+pm+ppc+'}}}';

     
     setTimeout(() => { postTasksToTeamwork(jason, item) }, 3000)

  }).catch(e => console.error(e))
}

const postTasksToTeamwork = (data, item) => {
  const url = `https://${company}.teamwork.com/projects/${item}/tasklists.json`
  setTimeout(() => {
	  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `BASIC ${btoa(`${key}:xxx`)}`,
      'Content-Type' : 'application-json'
    },
     body: data
  }).then(r => r.json())
    .then(res => {
	    const timestamp = moment().format('mm/dd/yyyy hh:mm A')
	    console.log(`${timestamp} pushed ${item}: `, res )
	    })
    .catch(e => console.error(e))
  }, 1000)
}

handleProjectData()

```

You'll need to update the Index.js file as follows:

1.  **Update the company** to match your Teamwork company name. You can find this after logging into teamwork in the URL address bar in the following pattern: https://yourcompanyname.teamwork.com
2.  **Update your API Key: Click on your Initials > edit my details > api key and mobile found in top Corner of your teamwork log in.**
3.  **Update the catIds Query parameters list to include ALL Project Category Ids you want the monthly automation to run for.** You can get these ids, by going to the projects tab and hovering over one of the categories in the left of your window. The category ID will at the end of the URL ?catid=1234 where the 1234 is the category ID.
4.  **Update the roles to match the role names as you assigned them to every project.** Let's look an example below that is also in the commented gist: ![changing the role to match your agency](https://agencyautomators.com/assets/images/change-role.png)
5.  **Update the Variable assigments as found in lines 132 - 142** to match the roles in your agency. To take the first example found on line 132 you'd need to change as follows:  
    if(indexSEO == -1){ seo = '' } else { seo = "\"SEO\": "+data1.roles[indexSEO].users[0].id+"," }  

    to  

    if(indexOutreach == -1){ outreach = '' } else { outreach = "\"OUTREACH\": "+data1.roles[indexOutreach].users[0].id+"," }
6.  Update lines 145 - 159 to match your agency's project categories and tasklist template ids. To get the category ids see step 2 above.  

    To get the task template ids for each tasklist template go to Top right corner of Teamwork and go to Settings > and then go to Templates on next screen. Click the edit button in the Task templates section. On next screen you can hover over each tasklist template and you'll see the id at the end of the url.

### The Server

### Server Requirements

Set up a linux based server (it is really easy we promise). We love Digital Ocean. This is an inexpensive host that costs us less than $10 each month and is our home for our automated scripts that allow us to automate a number of processes that run each month.

Digital Ocean is a breeze and you can [sign up with them here](https://m.do.co/c/8b633e00c6ab) and save $50 over the first 30 days with them.

#### Build a Droplet

According to Digital Ocean's documentation, ["Digital Ocean Droplets](https://www.digitalocean.com/docs/droplets/) are flexible Linux-based virtual machines (VMs) that run on top of virtualized hardware. Each Droplet you create is a new server you can use." They are easy to set up and super easy for us to use.

Here's how Digital Ocean recommends you [build your droplet from their control panel](https://www.digitalocean.com/docs/droplets/how-to/create/).

Good news time: the least expensive plan that costs $5 / month is totally sufficient.

Choose: 1GB / 25 GB of SSD Disk Storage which will set up a Ubuntu 18.04 server for you.

Take note of your ip address that is created as you'll need this whn FTP in / SSH in to upload your script / setting up the cron.

#### Setup Root Access

For the purpose of this article we'll be using a root password to make it easier for you to set up your FTP tool / your SSH terminal or putty connection. I found that setting up a root password was much easier than using SSH Keys. If you want to set up SSH Keys you can follow Digital Ocean's documentation here.

1.  Log into your Digital Ocean Control Panel and click Access.
2.  Click Reset Root Password.
3.  Got to your email address inbox associated with your Digital Ocean Account and open the email from Digital Ocean with the Subject Line "Your droplet's password has been reset."
4.  Copy the password from the email.
5.  Log back into your Digital Ocean Control Panel and click Access > Launch Console.
6.  When the console opens a popup window click anywhere inside the window. It will show you a login prompt with a "login:"
7.  Type "root" (no quotes).
8.  At password prompt paste in the password from your password reset email.
9.  Follow the password reset instructions by:
    1.  Repasting in the current password once.
    2.  Changing the password to your new secure password. (use numbers, Special Characters and both upper and lower case letters.
    3.  Confirming the new password by typing it in again at next prompt.
10.  Write down /type out your new password, you'll need this to set up your FTP Software / ssh into your server later.

### Setup FTP / SSH Access

Open up your FTP tool of choice. I use [Transmit](https://panic.com/transmit/) for Mac which is made by Panic. There are tons of free options if you prefer including [Filezilla](https://filezilla-project.org/).

In terminal, we set up our FTP connection like so:

Port 22, SFTP, Address: is your Digital Ocean Droplet's Ip address: User: root, password, your newly created password.

After creating settings, connect to the server. You'll be set up in the root directory of your droplet. This is where you'll add your automation files in the next few steps.

#### Placing the script on your server

Now that you you've edited your index.js file, you'll want to ftp the auto folder named auto **and all the files and folders inside** to root folder in your new server.

We are so close now. Get excited.

#### Setting up the Cron

You can edit your cron via FTP or via SSH, we'll show you how to edit it via FTP, because it is super easy.

In your FTP software you'll want to go up one level, and then navigate to Var > Spool > cron > crontabs > and double click the file named root inside. We'll be adding one line to the end of the current crontab.

We set up our cron so that it runs at midnight on the first day of each month. You can modify the timing to match your needs by going to [cronguru](https://crontab.guru/) to learn the proper syntax.

If you want to use our method add the following line to the end of your crontab:

0 0 1 * * cd /root/auto && node index.js > /tmp/project.log

**This sentence tells the cron to go into your auto folder and run your index.js file with node at midnight on the first day of the month.**

#### Testing the Cron

You can test the cron by modifying and your cronjob file so that the time and date are a few minutes out from now. Again, use Cronguru to help you set that up.

After you run the script, make sure to delete the unwanted tasklists in each project and get stoked for time savings.

#### Hats off to our Team Member [James O'Brien](https://github.com/notjamesobrien) for turning my vanilla / Jquery code into node execution.
