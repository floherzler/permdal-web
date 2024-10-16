import env from "@/app/env"

import { Client, Users, Databases, Avatars, Storage } from "node-appwrite"

const client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.project_id)
    .setKey(env.appwrite.api_key)

const users = new Users(client)
const databases = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)

export { client, users, databases, avatars, storage }
