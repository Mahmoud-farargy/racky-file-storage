"use server"
import { parseStringify, handleError, getFileType, constructFileUrl } from "@/lib/utils"
import type { DeleteFileProps, FileType, GetFilesProps, Owner, RenameFileProps, UpdateFileUsersProps, UploadFileProps } from "@/types";
import { createAdminClient, createSessionClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { ID, Query } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserCached } from "../getCurrentUserCached";

export const uploadFile = async ({file, ownerId, accountId, path}: UploadFileProps) => {
    try{
        const { storage, databases} = await createAdminClient();
        const inputFile = InputFile.fromBuffer(file, file.name);

        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile
        );
        const fileType = getFileType(bucketFile.name);
        const fileDocument = {
            type: fileType?.type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: fileType?.extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id
        }

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument
        ).catch(async (error: unknown) => {
            await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
            handleError(error, "Failed to create file document");
        })
        revalidatePath(path);
        return parseStringify(newFile);
    }catch (error) {
        handleError(error, "Failed to upload file");
    }
}
const createQueries = (currentUser: Owner, types: string[], searchText: string, sort: string, limit?: number) =>{
    // owner id or user email
    const queries = [
        Query.or(
            [
                Query.equal("owner", [currentUser.$id]),
                Query.contains("users", [currentUser.email])
            ]
        )
    ]
    // type 
    if(types.length > 0) queries.push(Query.equal("type", types))
    // search text
    if(searchText) queries.push(Query.contains("name", searchText.toLowerCase()))
    // limit
    if(limit) queries.push(Query.limit(limit))
    //sort
    if(sort){
        const [sortBy, orderBy] = sort.split('-');
        queries.push(orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy));
    }

    return queries;
}

export const getFiles = async ({types = [], searchText = '', sort = '$createdAt-desc', limit }: GetFilesProps) => {
    try {
        const { databases } = await createAdminClient();
        const currentUser = await getCurrentUserCached();

        if(!currentUser){
            redirect("/sign-in");
        }

        const queries = createQueries(currentUser, types, searchText, sort, limit);

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        )

        return parseStringify(files);
    }catch (error) {
        console.error("error", error);
        handleError(error, "Failed to get files");
    }
    
}

export const renameFile = async ({fileId, name, extension, path} : RenameFileProps) => {
    try{
        const { databases } = await createAdminClient();
        const rawName = name?.replaceAll(`.${extension}`, () => "");
        const fullFileName = `${rawName}.${extension}`;

        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: fullFileName
            }
        );

        revalidatePath(path);
        return parseStringify(updatedFile);
    }catch (error) {
        console.error("error", error);
        handleError(error, "Failed to get files");
    }
    
}

export const updatefileSharedUsers = async ({fileId, emails, path} : UpdateFileUsersProps) => {
    try{
        const { databases } = await createAdminClient();


        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: emails
            }
        );

        revalidatePath(path);
        return parseStringify(updatedFile);
    }catch (error) {
        console.error("error", error);
        handleError(error, "Failed to get files");
    }
}

export const deleteFile = async ({fileId, bucketFileId, path} : DeleteFileProps) => {
    try{
        const { databases, storage } = await createAdminClient();


        const deleteFileSuccess = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId
        );

        if(deleteFileSuccess){
            await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
        }

        revalidatePath(path);
        return parseStringify({status: 'success'});
    }catch (error) {
        console.error("error", error);
        handleError(error, "Failed to get files");
    }
}

export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUserCached();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:, ");
  }
}