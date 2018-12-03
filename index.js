const octokit = require('@octokit/rest')()

async function GetLocation (login) {
  // https://api.github.com/repos/marmaladebacon/mb-ai-movement/commits?author=marmaladebacon
  const result = await octokit.users.getByUsername({username: login})
  return {login, location: result.data.location}
}

async function CommentWithAssigneesLocation (context, assignees) {
  console.log(assignees)
  const possibleAssignees = assignees
  let promises = []
  possibleAssignees.forEach((assignee) => {
    promises.push(GetLocation(assignee.login))
  })
  let results = await Promise.all(promises)
  let textAdd = ''
  results.forEach(data => {
    console.log(data.login)
    textAdd += `\n${data.login}: ${data.location}`
  })
  console.log('textAdd:')
  console.log(textAdd)
  const issueComment = context.issue({ body: `Hello, thanks for assigning someone.${textAdd}` })
  return context.github.issues.createComment(issueComment)
}
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Hello, thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })

  app.on('issues.assigned', async context => {
    // const textAdd = await GetString(context)
    // const issueComment = context.issue({ body: `Hello, thanks for assigning someone to this issue.${textAdd}` })
    await CommentWithAssigneesLocation(context, context.payload.issue.assignees)
  })

  app.on('pull_request.assigned', async context => {
    // const textAdd = await GetString(context)
    // const issueComment = context.issue({ body: `Hello, thanks for assigning someone to this issue.${textAdd}` })
    await CommentWithAssigneesLocation(context, context.payload.pull_request.assignees)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
