module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Hello, thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })

  app.on('issues.assigned', async context => {
    console.log(context.payload)
    const issueComment = context.issue({ body: 'Hello, thanks for assigning someone to this issue.' })
    return context.github.issues.createComment(issueComment)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
