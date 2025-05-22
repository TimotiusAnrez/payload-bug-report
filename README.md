# Issue

So i am trying to update user verification status from false to true but it is not updating and no error is shown the same with updating user susspend status from false to true

## Steps to Reproduce

1. PNPM Install
2. Add clerk credential to .env file (I Can't provide mine)
3. Start docker if you have it, or change to any postgres database
4. Setup NGROK tunnel
5. Setup Webhooks in clerk dashboard to accomodate user events (use NGROK tunel url: <tunnel url>/api/webhooks)
6. update .env with webhook secret provided in your clerk dashboard
7. PNPM Dev
8. Login to admin panel
9. Create Sign Up Account in clerk (You can use any email)
10. Finish onboarding
11. Manually create the Admin Account, since this functionality is not supported for SUPER_ADMIN
12. Update your first Admin Account manually in database for role, since this functionality is not supported for SUPER_ADMIN
13. Use different browser to sign up for new account
14. finish onboarding 
15. Go to admin panel using first account
16. Go to users collection
17. select any user other than super_admin
18. Update verification using user settings (custom ui beside the save button)
19. Observe that verification status is not updated in console log, or toast component will show fail to update or successfuly update but status undefined

## Expected Behavior

Verification status should be updated and toast will show successfully updated message with status true

## Environment

- Payload Version: 3.38.0
- Node Version: 22.10.0
- Database: Postgres
- Operating System: Windows
- Dependencies: ShadCN, Tailwind v4, Next 15, React 19, Clerk, Svix


