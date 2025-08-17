Please research and determine a suitable transactional email service for this project. The purpose will be sending account related emails (confirmation, password reset, etc), as well as tracking emails for notifying the user about their keyword subscriptions. The service should be cheap, and easy to integrate into a typescript project

You may not be able to run the code locally, please don't spend too much time trying to get postgres to work if you can't figure it out. The result of this task should be:

Choice of email provider, with instructions for how to set up an account and provide credentials.
Low level helper function in packages/shared-backend for sending an email to an address or list of addresses, with arguments for header, body, addresses.
Convenient way to send HTML emails with fallback text, either via MJML templates or another convenient method.
