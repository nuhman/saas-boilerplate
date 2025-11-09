1. When creating a new schema:  
`npx prisma db push`  - This will create/update the database  
then run `npx prisma generate` - This will generate TS type bindings for your schema  
  
2. When dropping tables:  
Remove the schema.  
Then run `npx prisma migrate dev --name remove_message_table` - This will create migration file, applies to DB, run prisma generate
