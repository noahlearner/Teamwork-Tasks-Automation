const fetch = require('node-fetch'),
      btoa = require('btoa'),
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
          indexSEO = data.roles.findIndex((item, i) => {
            if (item.name != null) {
              return item.name === seoVal && item.users.length
            } else {
              return 0
            }
          })

     let seo =' ',dev = ' ', ppc =' ', pm = ' ', catId = ' '

NEW CODE

let outreachVal = "OUTREACH",
          indexOutreach = data.roles.findIndex((item, i) => {
            if (item.name != null) {
              return item.name === outreachVal && item.users.length
            } else {
              return 0
            }
          })

     let outreach =' ',dev = ' ', ppc =' ', pm = ' ', catId = ' '

*Adding new Roles*

For each role below you'll see a code block like:

let seoVal = "SEO",
          indexSEO = data.roles.findIndex((item, i) => {
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
    .then(data => {

      let seoVal = "SEO",
          indexSEO = data.roles.findIndex((item, i) => {
            if (item.name != null) {
              return item.name === seoVal && item.users.length
            } else {
              return 0
            }
          })

      let devVal = "DEV",
          indexDev = data.roles.findIndex((item, i) =>{
            if (item.name != null) {
              return item.name === devVal && item.users.length
            } else { return 0 }
          })

     let ppcVal = "PPC",
         indexPPC = data.roles.findIndex((item, i) =>{
           if (item.name != null) {
             return item.name === ppcVal && item.users.length
           } else { return 0 }
          })

     let pmVal = "PM",
         indexPM = data.roles.findIndex((item, i) =>{
           if (item.name != null) {
             return item.name === pmVal && item.users.length
           } else { return 0 }
         })

     let seo ='',dev = '', ppc ='', pm = '', catId = ''
/*
You need to update line 122 so that the variable names match what you've set above.
You'll also need to add any new roles above to match the roles inside your company.
*/
     if(indexSEO == -1){ seo = '' } else { seo = "\"SEO\": "+data.roles[indexSEO].users[0].id+"," }
	  // We are assigning the SEO user that is in place to all SEO tasks.
     if(indexDev == -1){ dev ='' } else { dev = "\"DEV\" :"+data.roles[indexDev].users[0].id+"," }
	  // We are assigning the DEV user that is in place to all DEV tasks.

     if(indexPPC == -1){ ppc ="\"PPC\": 1112" } else { ppc = "\"PPC\": "+data.roles[indexPPC].users[0].id+"" }
	  // We are assigning the PPC user that is in place to all PPC tasks.
	  // Note for this role we have a fallback USER Id in place in case there is not a PPC assigned to the task.
     if(indexPM == -1){ pm ="\"PM\": 1111," } else { pm = "\"PM\": "+data.roles[indexPM].users[0].id+"," }
	  // We are assigning the PM user that is in place to all PPC tasks.
	  // Note for this role we have a fallback USER Id in place in case there is not a PM assigned to the task.

/*
An example where we change the role from SEO to OUTREACH, alter your code as follows:

Old Code
if(indexSEO == -1){ seo = ' ' } else { seo = "\"SEO\": "+data.roles[indexSEO].users[0].id+"," }

New Code where we've changed the role from SEO to OUTREACH
if(indexOutreach == -1){ outreach = ' ' } else { outreach = "\"OUTREACH\": "+data.roles[indexOutreach].users[0].id+"," }
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

     let jsonToDoList = `
       {
         "todo-list":
           {
             "name":"' + month + ' SEO Tasks",
             "todo-list-template-id": "'+catId+'",
             "todo-list-template-assignments":{'+seo+dev+pm+ppc+'}
         }
       }`

     setTimeout(() => { postTasksToTeamwork(jsonToDoList, item) }, 3000)
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
	    const timestamp = moment().format('MM-DD-YYYY hh:mm A')
	    console.log(`${timestamp} pushed ID ${item}: `, res )
	    })
    .catch(e => console.error(e))
  }, 1000)
}

handleProjectData()
