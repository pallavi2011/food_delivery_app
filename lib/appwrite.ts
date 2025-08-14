import {Client, Account, Databases, Avatars, ID,Query, Storage} from "react-native-appwrite"
import {CreateUserParams, GetMenuParams} from "@/type";

export const appWriteConfig = {
    endpoint:process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.pkj.fooddelivery",
    projectId:process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId:'68846f300024b6f10548',
    bucketId:'68919a730012afe47ef6',
    userCollectionId:'68846f64000e477859f4',
    categoriesCollectionId:'68919578002cd3173508',
    menuCollectionId:'68919621002822944e66',
    customizationsCollectionId:'689198240005a760dcb6',
    menuCustomizationCollectionId:'6891993f003c2ba292ec'

}

export const client = new Client();
client.setEndpoint(appWriteConfig.endpoint!)
    .setProject(appWriteConfig.projectId!)
    .setPlatform(appWriteConfig.platform!);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async({email, password, name}:CreateUserParams) =>{
try{
    const newAccount = await account.create(ID.unique(), email, password, name)
    if(!newAccount) throw Error

    await signIn({email, password});

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
        appWriteConfig.databaseId,
        appWriteConfig.userCollectionId,
        ID.unique(),
        {
            email, name,
            accountId: newAccount.$id,
             avatar:avatarUrl

    }
    )

}catch(error){
    throw new Error(error as string)
}
}

export const signIn = async({ email, password}) =>{
    try{
    const session = await account.createEmailPasswordSession(email, password);
    }catch(e){
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error();

        const currentUser = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error();

        return currentUser.documents[0];


    }catch(error){
        throw new Error(error as string);
    }
}

export const getMenu = async({category, query}:GetMenuParams) => {
        try {
            const queries: string[] = [];
            if(category) queries.push(Query.equal('categories', category));
            if(query) queries.push(Query.search('name', query));

            const menus = await databases.listDocuments(
                appWriteConfig.databaseId,
                appWriteConfig.menuCollectionId,
                queries
            )

            return menus.documents;
        }catch(e){
            throw new Error(e as string);
        }
}

export const getCategory = async() =>{
    try {
        const categories = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.categoriesCollectionId,

        )
    }catch (e) {
        throw new Error(e as string);
    }
}

