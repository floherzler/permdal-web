import env from "@/app/env"

import { Client, Account, Databases, Avatars, Storage } from "appwrite"

const client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.project_id)

const databases = new Databases(client)
const account = new Account(client)
const avatars = new Avatars(client)
const storage = new Storage(client)

export { client, databases, account, avatars, storage }
