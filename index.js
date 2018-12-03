const octokit = require('@octokit/rest')()

async function GetLocation (login) {
  // https://api.github.com/repos/marmaladebacon/mb-ai-movement/commits?author=marmaladebacon
  const result = await octokit.users.getByUsername({username: login})
  return result.location
}

module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Hello, thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })

  app.on('issues.assigned', async context => {
    console.log(context.payload.issue.assignees)
    const possibleAssignees = context.payload.issue.assignees
    let store = {}
    let allAssignees = []
    possibleAssignees.forEach(async (assignee) => {
      const loc = await GetLocation(assignee.login)
      store[assignee.login] = {
        location: loc
      }
      allAssignees.push(assignee.login)
    })
    let textAdd = ''
    allAssignees.forEach(login => {
      textAdd += `\n${login}: ${store[login].location}`
    })
    const issueComment = context.issue({ body: `Hello, thanks for assigning someone to this issue.${textAdd}` })
    return context.github.issues.createComment(issueComment)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
